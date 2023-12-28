import {getContext,urlParam, getEditorType, initFileEditor, queryCacheData, handlerByFileChange, handlerAppByCacheChange} from "./../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/commonFile.html",
    type: 'get',
    async: false,
    success: function (res) {
        template = String(res);
    }
});

export default {
    template: template,
    name: 'CommonFile',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript', 'getMonacoEditorComplete', 'updateFileDialogIsMin'],
    props: {
        deviceInfo: { // 设备信息
            type: Object,
            default() {
                return {
                    startPreview: false,
                    deviceUuid: '',
                    standardWidth: null,
                    standardHeight: null,
                    standardConvert: false,
                    offsetX: 0,
                    offsetY: 0
                }
            }
        },
        screenDirection: {
            type: String,
            default: '竖屏'
        }
    },
    data() {
        return {
            isInit:false,
            customSignDialog:false,
            webCommonPath:'webCommonPath',
            fileEditVisible:false, // 文件编辑器可见
            fileEditorName:'',// 文件编辑器名称
            fileSavePath: '',// 文件保存路径
            /**
             * fileSavePath:文件保存路径
             * fileName: 文件名
             * fileContent: 文件内容
             */
            scriptEditor:null,
            webSyncPath: "/",
            breadcrumbList: [{label: '根目录', value: ''}], // 面包屑
            fileLoading: false,// 加载文件loading
            checkAllFile: false,// 全选文件
            previewList: [],// 单个上传
            uploadFileList: [],// 需要上传的文件列表
            accept:'.jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PNG,.PDF,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.rar,.zip,.txt,.mp4,.flv,.rmvb,.avi,.wmv,.js,.apk',
            curFileData: {},// 选中的文件数据
            copyFileList: [],// 复制文件列表
            moveFileList: [],// 移动文件列表
            absolutePrePath: '',// 绝对路径前缀
            fileList: [], // 文件列表
            generateSignLoading:false, // 生成签名loading
            keyStore:{
                keyStoreAlias:'test',
                keyStoreValidity:'36500',
                keyStoreDName:'',
                keyStoreDNameCN:'',
                keyStoreDNameOU:'',
                keyStoreDNameO:'',
                keyStoreDNameL:'',
                keyStoreDNameS:'',
                keyStoreDNameC:'',
                keyStoreAliasPwd:'test123',
                keyStorePwd:'test123',
                keyStoreFile:'test.keystore'
            },
            customSignRules: {
                // 校验规则
                keyStoreAlias: [{ required: true, message: '请填写密钥对别名', trigger: 'blur' }],
                keyStoreValidity: [{ required: true, message: '请填写密钥对有效期', trigger: 'blur' }],
                keyStoreAliasPwd: [{ required: true, trigger: 'blur' , validator: (rules, value, cb) => {
                        if (!value) {
                            return cb(new Error('请填写密钥对密码!'))
                        }
                        if (value.length < 6) {
                            return cb(new Error('请填写至少6位数!'))
                        }
                        return cb()
                    }}],
                keyStorePwd: [{ required: true, trigger: 'blur' , validator: (rules, value, cb) => {
                        if (!value) {
                            return cb(new Error('请填写密钥库密码!'))
                        }
                        if (value.length < 6) {
                            return cb(new Error('请填写至少6位数!'))
                        }
                        return cb()
                    }}],
                keyStoreFile: [{ required: true, message: '请填写证书文件路径', trigger: 'blur' }]
            },
            noPermissionPath:['uploadPath/autoJsTools/webCommonPath/发行版本',
                'uploadPath/autoJsTools/webCommonPath/公共脚本',
                'uploadPath/autoJsTools/webCommonPath/hz_autojs_toolbox.zip',
                'uploadPath/autoJsTools/webCommonPath/apkPackage',
                'uploadPath/autoJsTools/webCommonPath/apkPackage/apkFrameWork',
                'uploadPath/autoJsTools/webCommonPath/apkPackage/apkTemplate',
                'uploadPath/autoJsTools/webCommonPath/apkPackage/apkTool',
                'uploadPath/autoJsTools/webCommonPath/newVersion'
                ]
        }
    },
    mounted() {
        let _that = this;
        $.ajax({
            url: getContext() + "/attachmentInfo/getAbsolutePrePath",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data) {
                    if (data.isSuccess) {
                        _that.absolutePrePath = data.data;
                        _that.init();
                    }
                }
            },
            error: function (msg) {
            }
        });
    },
    computed: {
        uploadPrePathName() {
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            return toPath.replace(/\//g, "\\");
        },
        navigatePath(){
            let toPath = this.breadcrumbList.map(item=>item.label).join('/');
            return toPath
        },
        checkFileCount() { // 已选文件数量
            return this.fileList.filter(item => item.check).length;
        },
        allowMoveFileList() { // 允许移动的文件列表
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            let replacePath = toPath.replace(/\//g, "\\");
            // 当前完整目录
            let curToPath = this.absolutePrePath + replacePath;
            // 当前目录是已选文件子目录的 需要过滤掉  当前目录是已选文件所在的目录是需要过滤掉
            return this.moveFileList.filter(item => {
                return !curToPath.startsWith(item.pathName) && curToPath !== item.parentPathName
            });
        },
        copyFileNames() {
            return this.copyFileList.map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        allowMoveFileNames() {
            return this.allowMoveFileList.map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        checkFileNames() {
            return this.fileList.filter(item => item.check).map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        // 上传进度数组
        uploadPercentageArr(){
            return this.uploadFileList.map(item=>item.percentage);
        },
        // 允许批量操作文件
        allowBatchOperateFile(){
            let flag = true;
            let allowOperateFile = urlParam("allowOperateFile") || window.allowOperateFile;
            if(allowOperateFile){
                return true;
            }
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            let comparePath = 'uploadPath/autoJsTools/'+toPath;
            this.noPermissionPath.forEach(path=>{
                if(comparePath.startsWith(path)){
                    flag = false;
                }
            });
            return flag;
        },
        // 允许保存文件
        allowSaveFile(){
            let flag = true;
            let allowOperateFile = urlParam("allowOperateFile") || window.allowOperateFile;
            if(allowOperateFile){
                return true;
            }
            let comparePath = 'uploadPath/autoJsTools' + this.fileSavePath + this.fileEditorName;
            this.noPermissionPath.forEach(path=>{
                if(comparePath.startsWith(path)){
                    flag = false;
                }
            });
            return flag;
        }
    },
    watch:{
        uploadPercentageArr(arr){
            if(arr && arr.length>0){
                let completeArr = arr.filter(item=>Number(item)===Number(100));
                // 全部上传完成
                if(arr.length === completeArr.length){
                    this.uploadFileList = [];// 清空上传列表
                    let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;

                    setTimeout(()=>{
                        // 重新加载文件列表
                        this.queryFileList(toPath);
                    },200);
                }
            }
        }
    },
    methods: {
        // 打开资源管理器
        openExplorer(){
            let _that = this;
            _that.fileLoading = true;
            $.ajax({
                url: getContext() + "/device/openExplorer",
                type: "get",
                dataType: "json",
                data: {
                    "openPath": "webCommonPath",
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data){
                                window.ZXW_VUE.$message.error({message: data.data, duration: '1000'});
                            } else {
                                window.ZXW_VUE.$notify.success({message: '请稍候', duration: '1000'});
                            }
                        }
                    }
                    _that.fileLoading = false;
                },
                error: function (msg) {
                    _that.fileLoading = false;
                }
            });
        },
        // 初始化打包插件
        initPackPlugins(){
            this.breadcrumbList = [
                {label: '根目录', value: this.webCommonPath}
            ];
            // 加载文件列表
            this.queryFileList(this.breadcrumbList[this.breadcrumbList.length - 1].value,()=>{
                let packageDirectoryArr = this.fileList.filter(item=>item.fileName === 'apkPackage' && item.isDirectory);
                let packageFileArr = this.fileList.filter(item=>item.fileName === 'apkPackage' && !item.isDirectory);

                // 授权打包插件
                let authorizePackagePathFun = ()=>{
                    $.ajax({
                        url: getContext() + "/attachmentInfo/authorizePackagePath",
                        type: "get",
                        dataType: "json",
                        success: function (data) {
                            if (data) {
                                if (data.isSuccess) {
                                    console.log(data.data);
                                }
                            }
                        },
                        error: function (msg) {
                        }
                    });
                };


                // 不存在打包插件zip 且 打包插件已解压  直接提示已完成
                if((!packageFileArr || ! packageFileArr.length) && (packageDirectoryArr && packageDirectoryArr.length)){
                    authorizePackagePathFun();
                    window.ZXW_VUE.$notify.success({message: '打包插件已初始化完成！', duration: '1000'});
                    return;
                }
                // 已存在打包插件zip 且 打包插件未解压 则进行解压
                if((packageFileArr && packageFileArr.length) && (!packageDirectoryArr || !packageDirectoryArr.length)){
                    let pathName = this.absolutePrePath + this.webCommonPath + "/apkPackage.zip";
                    let _that = this;
                    _that.fileLoading = true;
                    $.ajax({
                        url: getContext() + "/attachmentInfo/unServerFileZip",
                        type: "get",
                        dataType: "json",
                        data: {
                            "sourcePathName": pathName,
                            "targetPathName": this.absolutePrePath + this.webCommonPath + "/apkPackage"
                        },
                        success: function (data) {
                            if (data) {
                                if (data.isSuccess) {
                                    window.ZXW_VUE.$notify.success({message: '打包插件已初始化完成', duration: '1000'});
                                    // 重新加载文件列表
                                    _that.queryFileList(_that.breadcrumbList[_that.breadcrumbList.length - 1].value);
                                    authorizePackagePathFun();
                                }
                            }
                        },
                        error: function (msg) {
                        }
                    });
                    return;
                }

                // 已存在打包插件zip 且 打包插件已解压 则提示是否需要重新初始化打包插件
                if((packageFileArr && packageFileArr.length) && (packageDirectoryArr && packageDirectoryArr.length)){
                    let pathName = this.absolutePrePath + this.webCommonPath + "/apkPackage.zip";
                    let _that = this;
                    _that.fileLoading = true;
                    let unServerFileZipFun = ()=>{
                        // 再重新解压
                        $.ajax({
                            url: getContext() + "/attachmentInfo/unServerFileZip",
                            type: "get",
                            dataType: "json",
                            data: {
                                "sourcePathName": pathName,
                                "targetPathName": _that.absolutePrePath + _that.webCommonPath + "/apkPackage"
                            },
                            success: function (data) {
                                if (data) {
                                    if (data.isSuccess) {
                                        window.ZXW_VUE.$notify.success({message: '打包插件已初始化完成', duration: '1000'});
                                        // 重新加载文件列表
                                        _that.queryFileList(_that.breadcrumbList[_that.breadcrumbList.length - 1].value);
                                        authorizePackagePathFun();
                                    }
                                }
                            },
                            error: function (msg) {
                            }
                        });
                    };
                    // 先删除
                    $.ajax({
                        url: getContext() + "/attachmentInfo/deleteFile",
                        type: "GET",
                        dataType: "json",
                        data: {
                            "filePath":this.absolutePrePath + this.webCommonPath + "/apkPackage"
                        },
                        success: function (data) {
                            if (data) {
                                if (data.isSuccess) {
                                    unServerFileZipFun();
                                }
                            }
                        },
                        error: function (msg) {
                        }
                    });
                    return;
                }
                window.ZXW_VUE.$message.warning('未检测到打包插件,请先上传打包插件！');
                setTimeout(()=>{
                    window.open("https://sp2.zjh336.cn?code=YT0yJmI9NQ%3D%3D","_blank");
                },1000);
            });
        },
        // 获取JavaHome
        getJavaHome(){
            let JAVA_HOME = '';
            let _that = this;
            $.ajax({
                url: getContext() + '/uploadPath/autoJsTools/' + this.webCommonPath + '/' + 'apkPackage' + '/' + 'apkTool' + '/' + 'JAVA_HOME.json?t=' + (new Date().getTime()),
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    JAVA_HOME = String(res)
                },
                error: function (msg) {
                }
            });
            return JAVA_HOME;
        },
        // 设置JAVA_HOME
        settingJre(){
            // 设置JavaHome
            let setJavaHome = (JAVA_HOME,callback)=>{
                let scriptFile = new File([JAVA_HOME], "JAVA_HOME.json", {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.webCommonPath + '/' + 'apkPackage' + '/' + 'apkTool' + '/');
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/uploadFileSingle",
                    type: 'post',
                    data: param,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '设置完成', duration: '1000'});
                            }
                        }
                        if(callback){
                            callback();
                        }
                    },
                    error: function (msg) {
                    }
                });
            };
            // 检验打包插件
            this.checkWebPackPlugins(()=>{
                // 获取值
                let JAVA_HOME = this.getJavaHome();
                window.ZXW_VUE.$prompt('请设置JAVA环境变量,为空则默认读取JAVA_HOME(例如:E:\\华仔AutoJs工具箱Web端V2.4.0免费版\\jre)', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: JAVA_HOME
                }).then(({value}) => {
                    setJavaHome(value,()=>{
                        // 加载文件列表
                        this.queryFileList(this.breadcrumbList[this.breadcrumbList.length - 1].value);
                    });
                }).catch(() => {
                });
            });

        },
        // 校验打包插件
        checkWebPackPlugins(callback){
            this.breadcrumbList = [
                {label: '根目录', value: this.webCommonPath},
                {label: 'apkPackage', value: this.webCommonPath + '/' + 'apkPackage'},
                {label: 'apkTool', value: this.webCommonPath + '/' + 'apkPackage' + '/' + 'apkTool'},
            ];
            // 加载文件列表
            this.queryFileList(this.breadcrumbList[this.breadcrumbList.length - 1].value,()=>{
                // 没有文件 则提示
                if(!this.fileList || !this.fileList.length){
                    window.ZXW_VUE.$message.warning('未找到打包插件,请先进行初始化！');
                    return;
                }
                if(callback){
                    callback();
                }
            });
        },
        // 自定义签名弹窗
        openCustomSignDialog(){
            this.checkWebPackPlugins(()=>{
                this.customSignDialog = true;
            });
        },
        // 保存自定义签名
        saveCustomSign(){
            // 生成json参数
            let saveParamFun = (callback)=>{
                // 转换参数
                this.keyStore.keyStoreDName = `CN=${this.keyStore.keyStoreDNameCN}OU=${this.keyStore.keyStoreDNameOU}O=${this.keyStore.keyStoreDNameO}L=${this.keyStore.keyStoreDNameL}S=${this.keyStore.keyStoreDNameS}C=${this.keyStore.keyStoreDNameC}`;
                let signJson =  JSON.stringify(this.keyStore,"", "\t");

                let keyStoreFilePath = this.keyStore.keyStoreFile;
                keyStoreFilePath = keyStoreFilePath.replace(".keystore","");
                let scriptFile = new File([signJson], keyStoreFilePath + ".json", {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.webCommonPath + '/' + 'apkPackage' + '/' + 'apkTool' + '/');
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/uploadFileSingle",
                    type: 'post',
                    data: param,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if(callback){
                                callback();
                            }
                        }
                    },
                    error: function (msg) {
                        _that.generateSignLoading = false;
                    }
                });
            };
            // 生成签名
            let generateSignKey = ()=>{
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/generateSign",
                    type: 'get',
                    data: {
                        "javaHome":this.getJavaHome(),
                        "keyStoreAlias":this.keyStore.keyStoreAlias,
                        "keyStoreValidity":this.keyStore.keyStoreValidity,
                        "keyStoreDName":this.keyStore.keyStoreDName,
                        "keyStoreALog":"RSA",
                        "keyStorePwd":this.keyStore.keyStorePwd,
                        "keyStoreAliasPwd":this.keyStore.keyStoreAliasPwd,
                        "keyStoreFile":this.keyStore.keyStoreFile
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '生成完成！', duration: '1000'});
                                _that.customSignDialog = false;
                                // 加载文件列表
                                _that.queryFileList(_that.breadcrumbList[_that.breadcrumbList.length - 1].value);
                            } else {
                                window.ZXW_VUE.$message.warning(data.msg);
                            }
                        }
                        _that.generateSignLoading = false;
                    },
                    error: function (msg) {
                        _that.generateSignLoading = false;
                    }
                });
            };
            // 校验数据
            this.$refs['keyStore'].validate((valid) => {
                if (valid) {
                    this.$confirm('是否确认生成自定义签名(证书文件路径相同的会覆盖)?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.generateSignLoading = true;
                        // 先保存参数 再生成签名
                        saveParamFun(generateSignKey());
                    })
                }
            });
        },
        // 允许复选框勾选文件
        allowCheckFile(item){
            let flag = true;
            let allowOperateFile = urlParam("allowOperateFile") || window.allowOperateFile;
            if(allowOperateFile){
                return true;
            }
            let fileName = (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
            this.noPermissionPath.forEach(path=>{
                let comparePath = path.substring(path.lastIndexOf('/')+1,path.length);
                if(comparePath === fileName){
                    flag = false;
                }
            });
            return flag;
        },
        // 允许操作文件 操作按钮显示
        allowOperateFile(item){

            let flag = true;
            let allowOperateFile = urlParam("allowOperateFile")  || window.allowOperateFile;
            if(allowOperateFile){
                return true;
            }
            this.noPermissionPath.forEach(path=>{
                if(item.previewUrl && item.previewUrl.startsWith(path)){
                    flag = false;
                }
            });
            return flag;
        },
        // 初始化方法
        init() {
            // if(!this.isInit){
                let relativeFilePath = this.webCommonPath;
                if(relativeFilePath){
                    // 加载文件列表
                    this.queryFileList(relativeFilePath);
                    this.breadcrumbList = [{label: '根目录', value: this.webCommonPath}]
                }
            // }
            // this.isInit = true;
        },
        // 取消上传
        cancelUpload(i) {
            this.uploadFileList.splice(i, 1);
            window.newxhr.abort();
        },
        // 文件上传按钮点击
        uploadFileClick(){
            this.$refs.commonInput.value = null;
            this.$refs.commonInput.click();
        },
        // 文件修改事件触发
        handleChange(ev) {
            const files = ev.target.files;
            if (!files) return;
            this.uploadFiles(files);
        },
        // 上传文件
        uploadFiles(files) {
            const postFiles = Array.prototype.slice.call(files);
            if (postFiles.length === 0) { return }
            let tempIndex = 0;
            postFiles.forEach(rawFile => {
                // 检查文件是否合法
                if (this.beforeUpload(rawFile)) {
                    this.handleStart(rawFile, tempIndex++);
                    // 提交上传
                    this.submitUpload(rawFile)
                }
            })
        },
        handleStart(rawFile, tempIndex) {
            rawFile.uid = Date.now() + tempIndex;
            const file = {
                status: 'ready',
                fileName: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                uid: rawFile.uid,
                raw: rawFile,
                fileType: rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1),
                uploadFlag: true,
                check: false,
                isCancel: false
            };
            this.uploadFileList.push(file);
        },
        // 检查文件是否合法
        beforeUpload(file) { // 上传之前的钩子函数，验证大小，验证支持上传的文件
            if (file.size > 500 * 1024 * 1024) {
                this.$message({
                    message: `${file.name}暂不支持上传大小超过500M的文件!`,
                    type: 'warning'
                });
                return false
            }
            const testmsg = file.name.substring(file.name.lastIndexOf('.'));
            const test = this.accept.split(',').includes(testmsg);
            if (!test) {
                this.$message({
                    /* 上传文件只能是${this.accept}格式!*/
                    message: `${file.name}文件不支持上传噢`,
                    type: 'warning'
                });
                return false
            }
            return test
        },
        uploadProgress(percent, uid) { // 上传进度条
            this.uploadFileList.forEach(file => {
                if (file.uid === uid) {
                    file.percentage = percent
                }
            })
        },
        // 提交上传
        submitUpload(item) {
            const uid = item.uid;
            const param = new FormData();
            this.uploadFileList.forEach(file => {
                if (file.uid === uid) {
                    file.status = 'uploading';
                    param.append('file', file.raw);
                    param.append('pathName', this.uploadPrePathName)
                }
            });
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/uploadFileSingle",
                type: 'post',
                data: param,
                processData: false,
                contentType: false,
                dataType: "json",
                xhr: function() {
                    let newxhr = new XMLHttpRequest();
                    // 添加文件上传的监听
                    // onprogress:进度监听事件，只要上传文件的进度发生了变化，就会自动的触发这个事件
                    newxhr.upload.onprogress = function(e) {
                        const percent = (e.loaded / e.total) * 100 | 0;
                        _that.uploadProgress(percent, uid)
                    };
                    window.newxhr = newxhr;
                    return newxhr
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                        }
                    }
                },
                error: function (msg) {
                }
            });
        },
        // 查询文件列表
        queryFileList(relativeFilePath,callback) {
            this.fileLoading = true;
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                // contentType: "application/json",
                data: {
                    "relativeFilePath": relativeFilePath
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            let pathNameArr = _that.copyFileList.map(item => item.pathName);
                            let pathNameArr2 = _that.moveFileList.map(item => item.pathName);
                            data.data.forEach(item => {
                                item.check = pathNameArr.includes(item.pathName) || pathNameArr2.includes(item.pathName) || false
                            });
                            _that.fileList = data.data;
                        }
                    }
                    if(callback){
                        callback();
                    }
                    setTimeout(() => {
                        _that.fileLoading = false
                    }, 200)
                },
                error: function (msg) {
                    setTimeout(() => {
                        _that.fileLoading = false
                    }, 200)
                }
            });
        },
        // 监听拖拽
        onDrop(e) {
            this.uploadFiles(e.dataTransfer.files)
        },
        onDragover(){

        },
        // 操作
        operateFun(code) {
            switch (code) {
                case 'copy': {
                    if (this.moveFileList && this.moveFileList.length > 0) {
                        this.moveFileList = [];
                    }
                    // 设置复制文件集合
                    this.copyFileList = this.fileList.filter(item => item.check);
                    break;
                }
                case 'paste': {
                    let fileNames = this.copyFileList.map(item => {
                        return (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');
                    let toName = this.breadcrumbList[this.breadcrumbList.length - 1].label;
                    let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
                    let replacePath = toPath.replace(/\//g, "\\");
                    window.ZXW_VUE.$confirm('是否确认将' + fileNames + '复制到' + toName + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let sourcePathList = this.copyFileList.map(item => item.pathName);
                        let _that = this;
                        $.ajax({
                            url: getContext() + "/attachmentInfo/copyFileBatch",
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify({
                                "sourcePathList": sourcePathList,
                                "targetFolderPath": _that.absolutePrePath + replacePath
                            }),
                            success: function (data) {
                                if (data) {
                                    if (data.isSuccess) {
                                        window.ZXW_VUE.$notify.success({message: '复制成功', duration: '1000'});
                                        // 清空文件列表
                                        _that.copyFileList = [];
                                        // 重新加载文件列表
                                        _that.queryFileList(toPath);
                                    }
                                }
                            },
                            error: function (msg) {
                            }
                        });
                    });
                    break;
                }
                case 'cancel': {
                    this.copyFileList = [];
                    this.moveFileList = [];
                    break;
                }
                case 'move': {
                    if (this.copyFileList && this.copyFileList.length > 0) {
                        this.copyFileList = [];
                    }
                    // 设置移动文件集合
                    this.moveFileList = this.fileList.filter(item => item.check);
                    break;
                }
                case 'moveTo': {
                    let toName = this.breadcrumbList[this.breadcrumbList.length - 1].label;
                    let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
                    // 当前完整目录
                    let curToPath = this.absolutePrePath + toPath;

                    // 当前目录是已选文件子目录的
                    let fileNames = this.allowMoveFileList.map(item => {
                        return (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');

                    window.ZXW_VUE.$confirm('是否确认将' + fileNames + '移动到' + toName + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let sourcePathList = this.allowMoveFileList.map(item => item.pathName);
                        let _that = this;
                        $.ajax({
                            url: getContext() + "/attachmentInfo/moveFileBatch",
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify({
                                "sourcePathList": sourcePathList,
                                "targetFolderPath": curToPath
                            }),
                            success: function (data) {
                                if (data) {
                                    if (data.isSuccess) {
                                        window.ZXW_VUE.$notify.success({message: '移动成功', duration: '1000'});
                                        // 清空文件列表
                                        _that.moveFileList = [];
                                        // 重新加载文件列表
                                        _that.queryFileList(toPath);
                                    }
                                }
                            },
                            error: function (msg) {
                            }
                        });
                    });
                    break;
                }
                case 'remove': {
                    // 当前目录是已选文件子目录的
                    let checkFileList = this.fileList.filter(item => item.check);
                    let fileNames = checkFileList.map(item => {
                        return (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');
                    let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
                    window.ZXW_VUE.$confirm('是否确认删除' + fileNames + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let filePathList = checkFileList.map(item => item.pathName);
                        let _that = this;
                        $.ajax({
                            url: getContext() + "/attachmentInfo/deleteFileBatch",
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(filePathList),
                            success: function (data) {
                                if (data) {
                                    if (data.isSuccess) {
                                        window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
                                        // 重新加载文件列表
                                        _that.queryFileList(toPath);
                                    }
                                }
                            },
                            error: function (msg) {
                            }
                        });
                    });
                    break;
                }
            }
        },
        // 全选
        checkAllFileChange() {
            this.fileList.forEach(item => {
                this.$set(item, 'check', this.checkAllFile);
            });
        },
        // 文件名点击
        fileClick(row) {
            // this.$set(row,'check',!row.check);
        },
        // 文件名双击
        fileNameDbClick(row) {
            // 如果是目录
            if (row.isDirectory) {
                // 记录到面包屑导航栏
                let pathName = row.pathName;
                let index = pathName.indexOf(this.webCommonPath);
                pathName = pathName.substring(index, pathName.length);

                let array = pathName.indexOf("\\") !==-1 ? pathName.split("\\") : pathName.split("/");

                // 面包屑数组
                let breadcrumbArr = [];
                let pathArr = [];
                for (let i = 0; i < array.length; i++) {
                    pathArr.push(array[i]);
                    breadcrumbArr.push({
                        label: i === 0 ? "根目录" : array[i],
                        value: pathArr.join("/")
                    });
                }
                this.breadcrumbList = breadcrumbArr;
                // 默认加载最后一个
                this.breadcrumbChange(this.breadcrumbList[this.breadcrumbList.length - 1], (this.breadcrumbList.length - 1))
                // 文件 空白窗口打开
            } else {
                if(['png','jpg','jpeg'].includes(row.fileType)){
                    window.open(getContext() + "/" + row.previewUrl)
                } else if(['zip','rar','apk'].includes(row.fileType)){
                    window.ZXW_VUE.$message.warning('暂不支持编辑此类文件');
                    return false;
                } else {
                    this.fileEditVisible = true;
                    window.removeEventListener('keydown',this.editorDialogSaveListener);
                    window.addEventListener('keydown',this.editorDialogSaveListener,false);
                    this.fileEditorName = row.fileName + '.' + row.fileType;
                    this.fileSavePath = row.previewUrl.replace('uploadPath/autoJsTools','').replace(this.fileEditorName,'');
                    let _that = this;
                    $.ajax({
                        url: getContext() + "/" +row.previewUrl +"?t="+(new Date().getTime()),
                        type: 'get',
                        async: false,
                        dataType:"TEXT", //返回值的类型
                        success: function (res) {
                            // 初始化文件编辑器
                            initFileEditor(_that,'scriptEditor','fileEditor',_that.getMonacoEditorComplete,res,'javascript','vs-dark',(e,value)=>{
                            })
                        },
                        error: function (msg) {
                            console.log(msg);
                        }
                    });
                }
            }
        },
        // web端文件编辑器弹窗保存监听
        editorDialogSaveListener(e){
            if(e.ctrlKey && e.keyCode === 83 && this.fileEditVisible){
                e.stopPropagation();
                e.preventDefault();
                if(!this.fileEditorName){
                    return;
                }
                let scriptFile = new File([this.scriptEditor.getValue()], this.fileEditorName, {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.fileSavePath);
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/uploadFileSingle",
                    type: 'post',
                    data: param,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '保存成功', duration: '1000'});
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
                return false;
            }
        },
        // 压缩文件
        zipFile(row){
            let path = this.navigatePath.replace('根目录','');
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            window.ZXW_VUE.$prompt('请输入要压缩到的目录及文件名(第一个/表示根目录)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: path + '/' +row.fileName + '.zip',
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let _that = this;
                let pathName = this.absolutePrePath + this.webCommonPath + value;
                $.ajax({
                    url: getContext() + "/attachmentInfo/zipServerFileZip",
                    type: "get",
                    dataType: "json",
                    data: {
                        "sourceFolderPathName": row.absolutePathName,
                        "targetFilePathName": pathName,
                        "zipPathName":""
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '压缩成功', duration: '1000'});
                                // 重新加载文件列表
                                _that.queryFileList(toPath);
                            }
                        }
                    },
                    error: function (msg) {
                        console.log(msg)
                    }
                });
            }).catch(() => {
            });
        },
        // 解压文件
        unZipFile(row){
            let path = this.navigatePath.replace('根目录','');
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            window.ZXW_VUE.$prompt('请输入要解压到的目录(第一个/表示根目录)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: path + '/' +row.fileName,
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let _that = this;
                let pathName = this.absolutePrePath + this.webCommonPath + value;
                _that.fileLoading = true;
               $.ajax({
                    url: getContext() + "/attachmentInfo/unServerFileZip",
                    type: "get",
                    dataType: "json",
                    data: {
                        "sourcePathName": row.absolutePathName,
                        "targetPathName": pathName
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '解压成功', duration: '1000'});
                                // 重新加载文件列表
                                _that.queryFileList(toPath);
                            }
                        }
                    },
                    error: function (msg) {
                        console.log(msg)
                    }
                });
            }).catch(() => {
            });
        },
        // 关闭编辑器
        closeFileEditorDialog(){
            this.fileEditVisible = false;
        },
        // 保存文件编辑器内容
        saveFileEditorContent(){
            window.ZXW_VUE.$confirm('确认保存文件【' + this.navigatePath + '/' + this.fileEditorName + '】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let scriptFile = new File([this.scriptEditor.getValue()], this.fileEditorName, {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.fileSavePath);
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/uploadFileSingle",
                    type: 'post',
                    data: param,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '保存成功', duration: '1000'});
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
            });
        },
        // 面包屑change
        breadcrumbChange(item, index) {
            // 加载文件列表W
            this.queryFileList(item.value);
            // 重新加载面包屑
            this.breadcrumbList = this.breadcrumbList.slice(0, index + 1);

            this.$set(this.breadcrumbList, 0, {label: '根目录', value: this.webCommonPath});

        },
        // 刷新web端目录
        refreshWebDir(){
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            this.queryFileList(toPath);
        },
        // 计算文件大小
        calculateSize(fileSize) {
            let gb = 1024 * 1024 * 1024;
            let mb = 1024 * 1024;
            let kb = 1024;
            let val = parseFloat(fileSize / gb).toFixed(2);
            if (val > 1) {
                return val + "GB";
            }
            val = parseFloat(fileSize / mb).toFixed(2);
            if (val > 1) {
                return val + "MB";
            }
            val = parseFloat(fileSize / kb).toFixed(2);
            if (val > 1) {
                return val + "KB";
            }
            return fileSize + "B";
        },
        // 重命名
        reName(row){
            window.ZXW_VUE.$prompt('请输入新的名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let _that = this;
                let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
                let replacePath = toPath.replace(/\//g, "\\");
                $.ajax({
                    url: getContext() + "/attachmentInfo/reNameFile",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "oldFilePathName":row.pathName,
                        "newFilePathName": _that.absolutePrePath + replacePath + "\\" + value
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '重命名成功', duration: '1000'});
                                // 重新加载文件列表
                                _that.queryFileList(toPath);
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
            }).catch(() => {
            });
        },
        // 删除单个文件
        removeFile(row){
            let fileNames =  (row.isDirectory || !row.fileType) ? row.fileName : (row.fileName + "." + row.fileType);
            let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
            window.ZXW_VUE.$confirm('是否确认删除' + fileNames + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/deleteFile",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "filePath":row.pathName
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
                                // 重新加载文件列表
                                _that.queryFileList(toPath);
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
            });
        },
        // 创建文件夹
        createFolder() {
            window.ZXW_VUE.$prompt('请输入文件夹名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let _that = this;
                let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
                let replacePath = toPath.replace(/\//g, "\\");
                $.ajax({
                    url: getContext() + "/attachmentInfo/createFolder",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "folderName": replacePath + "\\" + value
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '新建成功', duration: '1000'});
                                // 重新加载文件列表
                                _that.queryFileList(toPath);
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
            }).catch(() => {
            });
        },
        // 预览文件
        previewFile(previewUrl) {
            window.open(getContext() + "/" + previewUrl)
        },
        // 下载文件
        downloadFile(row){
            // 创建a标签，通过a标签实现下载
            const dom = document.createElement("a");
            dom.download = row.fileName + '.' + row.fileType;
            dom.href = getContext() +  "/" + row.previewUrl;
            dom.id = "upload-file-dom";
            dom.style.display = "none";
            document.body.appendChild(dom);
            // 触发点击事件
            dom.click();
            document.getElementById("upload-file-dom")?.remove();
        },testScriptContext(){

            //this.saveFileEditorContent()
            try {
                JSON.parse(this.scriptEditor.getValue())
            }catch (e) {
                console.info(e)
                window.ZXW_VUE.$notify.success({message: '检验失败，控制台查看问题', duration: '1000'});
            }
            window.ZXW_VUE.$notify.success({message: '校验通过', duration: '1000'});
        }
    }
}