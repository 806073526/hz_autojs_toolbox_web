import {getContext, initFileEditor, queryCacheData} from "./../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/fileManage.html",
    type: 'get',
    async: false,
    success: function (res) {
        template = String(res);
    }
});

export default {
    template: template,
    name: 'FileManage',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript', 'getMonacoEditorComplete'],
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
            default: '横屏'
        }
    },
    data() {
        return {
            fileEditVisible:false, // 文件编辑器可见
            phoneFileEditVisible:false,
            phoneImagePreviewVisible:false,// 手机端图片预览
            phoneImageBase64:'',// 图片内容
            fileEditorName:'',// 文件编辑器名称
            phoneFileEditorName:'',//
            fileSavePath: '',// 文件保存路径
            phoneFileSavePath:'',// 手机端文件保存路径
            scriptEditor:null,
            phoneScriptEditor:null,
            fileActiveName:'web',
            webSyncPath: "/",
            phoneSyncPath: "/",
            autoSyncWebSyncPath:true,
            autoSyncPhoneSyncPath:true,
            phoneFileTableRandomKey:Math.random(),
            breadcrumbList: [{label: '根目录', value: ''}], // 面包屑
            phoneBreadcrumbList: [{label: '根目录', value: '/sdcard/'}],
            fileLoading: false,// 加载文件loading
            phoneFileLoading: false,// 手机端加载文件loading
            checkAllFile: false,// 全选文件
            phoneCheckAllFile: false,// 手机端全选文件
            previewList: [],// 单个上传
            uploadFileList: [],// 需要上传的文件列表
            accept:'.jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PNG,.PDF,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.rar,.zip,.txt,.mp4,.flv,.rmvb,.avi,.wmv,.js',
            curFileData: {},// 选中的文件数据
            copyFileList: [],// 复制文件列表
            phoneCopyFileList:[],// 手机端复制文件列表
            moveFileList: [],// 移动文件列表
            phoneMoveFileList: [],// 手机端移动文件列表
            absolutePrePath: '',// 绝对路径前缀
            fileList: [], // 文件列表
            phoneFileList:[] // 手机文件列表
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
        phoneCheckFileCount(){ // 手机端已选文件数量
            return this.phoneFileList.filter(item => item.check).length;
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
        phoneAllowMoveFileList() { // 手机端允许移动的文件列表
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            // 当前目录是已选文件子目录的 需要过滤掉  当前目录是已选文件所在的目录是需要过滤掉
            return this.phoneMoveFileList.filter(item => {
                return !toPath.startsWith(item.pathName) && toPath !== item.parentPathName
            });
        },
        copyFileNames() {
            return this.copyFileList.map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        phoneCopyFileNames() {
            return this.phoneCopyFileList.map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        allowMoveFileNames() {
            return this.allowMoveFileList.map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        phoneAllowMoveFileNames() {
            return this.phoneAllowMoveFileList.map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        checkFileNames() {
            return this.fileList.filter(item => item.check).map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        phoneCheckFileNames() {
            return this.phoneFileList.filter(item => item.check).map(item => (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)).join(',');
        },
        // 上传进度数组
        uploadPercentageArr(){
            return this.uploadFileList.map(item=>item.percentage);
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
        // 初始化方法
        init() {
            let relativeFilePath = this.deviceInfo.deviceUuid;
            if(relativeFilePath){
                // 加载文件列表
                this.queryFileList(relativeFilePath);
                this.breadcrumbList = [{label: '根目录', value: this.deviceInfo.deviceUuid}]
            }
            // 获取手机端文件目录
            this.updatePhoneDirCache(this.phoneBreadcrumbList.map(item => item.value).join('/'));
        },
        // 取消上传
        cancelUpload(i) {
            this.uploadFileList.splice(i, 1)
        },
        // 文件上传按钮点击
        uploadFileClick(){
            this.$refs.input.value = null;
            this.$refs.input.click();
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
        queryFileList(relativeFilePath) {
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
                case 'syncToPhone':{
                    let checkFileList = this.fileList.filter(item => item.check);
                    let fileNames = checkFileList.map(item => {
                        return (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
                    });
                    window.ZXW_VUE.$prompt('是否确认同步'+fileNames.length+'个文件到手机端,文件夹内部不会递归同步,请输入手机端路径(以/sdcard为根目录的相对路径)!', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValue: this.phoneSyncPath,
                        inputValidator: function(val) {
                            if(val){
                                if(val.startsWith("/sdcard")){
                                    return "无需以/sdcard开头"
                                }
                                if(!val.startsWith("/")){
                                    return "必须以/开头"
                                }
                                if(!val.endsWith("/")){
                                    return "必须以/结尾"
                                }
                            } else {
                                return "不能为空";
                            }
                            return true;
                        }
                    }).then(({value}) => {
                        // 设置同步文件集合  暂不支持同步目录
                        let webSyncToPhoneArr = this.fileList.filter(item => item.check);
                        this.webSyncToPhoneFun(webSyncToPhoneArr,value);
                    }).catch(() => {
                    });
                    break;
                }
            }
        },
        // 手机端文件操作
        phoneOperateFun(code){
            switch (code) {
                case 'copy': {
                    if (this.phoneMoveFileList && this.phoneMoveFileList.length > 0) {
                        this.phoneMoveFileList = [];
                    }
                    // 设置复制文件集合
                    this.phoneCopyFileList = this.phoneFileList.filter(item => item.check);
                    break;
                }
                case 'paste': {
                    // TODO 手机端复制不支持文件夹
                    let fileNames = this.phoneCopyFileList.map(item => {
                        return (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');
                    let toName = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].label;
                    let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
                    window.ZXW_VUE.$confirm('是否确认将' + fileNames + '复制到' + toName + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let sourcePathList = this.phoneCopyFileList.map(item => item);
                        let remoteScript = '';
                        sourcePathList.forEach(item=>{
                            remoteScript += `files.copy('${item.pathName}', '${toPath}'+'${(item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType)}');`;
                        });
                        this.remoteExecuteScript(remoteScript);
                        setTimeout(()=>{
                            // 清空文件列表
                            this.phoneCopyFileList = [];
                            // 刷新手机目录
                            this.refreshPhoneDir();
                        },500);
                    });
                    break;
                }
                case 'cancel': {
                    this.phoneCopyFileList = [];
                    this.phoneMoveFileList = [];
                    break;
                }
                case 'move': {
                    if (this.phoneCopyFileList && this.phoneCopyFileList.length > 0) {
                        this.phoneCopyFileList = [];
                    }
                    // 设置移动文件集合
                    this.phoneMoveFileList = this.phoneFileList.filter(item => item.check);
                    break;
                }
                case 'moveTo': {
                    let toName = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].label;
                    let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;

                    // 当前目录是已选文件子目录的
                    let fileNames = this.phoneAllowMoveFileList.map(item => {
                        return (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');

                    window.ZXW_VUE.$confirm('是否确认将' + fileNames + '移动到' + toName + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let sourcePathList = this.phoneAllowMoveFileList;
                        let remoteScript = '';
                        sourcePathList.forEach(item=>{
                            remoteScript += `files.move('${item.pathName}', '${toPath}'+'${(item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType)}');`;
                        });
                        this.remoteExecuteScript(remoteScript);
                        setTimeout(()=>{
                            this.phoneMoveFileList = [];
                            // 刷新手机目录
                            this.refreshPhoneDir();
                        },500);
                    });
                    break;
                }
                case 'remove': {
                    // 当前目录是已选文件子目录的
                    let checkFileList = this.phoneFileList.filter(item => item.check);
                    let fileNames = checkFileList.map(item => {
                        return (item.isDirectory || !item.fileType)? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');
                    window.ZXW_VUE.$confirm('是否确认删除' + fileNames + '?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let filePathList = checkFileList.map(item => item.pathName);
                        let remoteScript = '';
                        filePathList.forEach(item=>{
                            remoteScript += `files.removeDir('${item}');`;
                        });
                        this.remoteExecuteScript(remoteScript);
                        setTimeout(()=>{
                            // 刷新手机目录
                            this.refreshPhoneDir();
                        },500);
                    });
                    break;
                }
                case 'syncToWeb':{
                    let checkFileList = this.phoneFileList.filter(item => item.check);
                    let fileNames = checkFileList.map(item => {
                        return (item.isDirectory || !item.fileType) ? item.fileName : (item.fileName + "." + item.fileType);
                    });
                    window.ZXW_VUE.$prompt('是否确认同步'+fileNames.length+'个文件到web端,文件夹内部不会递归同步,请输入web端路径', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValue: this.webSyncPath,
                        inputValidator: function(val) {
                            if(val){
                                if(!val.startsWith("/")){
                                    return "必须以/开头"
                                }
                                if(!val.endsWith("/")){
                                    return "必须以/结尾"
                                }
                            } else {
                                return "不能为空";
                            }
                            return true;
                        }
                    }).then(({value}) => {
                        // 设置同步文件集合  暂不支持同步目录
                        let remoteScript = `let webPath = utilsObj.getDeviceUUID()+ '${value}';\r\n`;
                        checkFileList.forEach(item=>{
                            if(item.isDirectory){
                                remoteScript +=`utilsObj.request("/attachmentInfo/createFolder?folderName="+webPath+'${item.fileName}',"GET",null,()=>{});\r\n`;
                            } else {
                                remoteScript +=`utilsObj.uploadFileToServer('${item.pathName}',webPath + '${item.fileName}' + '.'+ '${item.fileType}',()=>{});\r\n`;
                            }
                        });
                        this.remoteExecuteScript(remoteScript);
                        setTimeout(()=>{
                            // 刷新web目录
                            this.refreshWebDir();
                        },500);
                    }).catch(() => {
                    });
                    break;
                }
            }
        },
        syncToWebSingle(row){
            window.ZXW_VUE.$prompt('是否确认同步'+row.pathName+'到web端,文件夹内部不会递归同步,请输入web端路径', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.webSyncPath,
                inputValidator: function(val) {
                    if(val){
                        if(!val.startsWith("/")){
                            return "必须以/开头"
                        }
                        if(!val.endsWith("/")){
                            return "必须以/结尾"
                        }
                    } else {
                        return "不能为空";
                    }
                    return true;
                }
            }).then(({value}) => {
                // 设置同步文件集合  暂不支持同步目录
                let remoteScript = `let webPath = utilsObj.getDeviceUUID()+ '${value}';\r\n`;
                if(row.isDirectory){
                    remoteScript +=`utilsObj.request("/attachmentInfo/createFolder?folderName="+webPath+'${row.fileName}',"GET",null,()=>{});\r\n`;
                } else {
                    remoteScript +=`utilsObj.uploadFileToServer('${row.pathName}',webPath + '${row.fileName}' + '.'+ '${row.fileType}',()=>{});\r\n`;
                }
                this.remoteExecuteScript(remoteScript);
                setTimeout(()=>{
                    // 刷新web目录
                    this.refreshWebDir();
                },500);
            }).catch(() => {
            });
        },
        // web端同步到手机公共方法
        webSyncToPhoneFun(webSyncToPhoneArr,value){
            let remoteExecuteScriptContent = "";
            webSyncToPhoneArr.forEach(row=>{
                let downloadFilUrl = getContext() +"/"+ row.previewUrl;
                // 如果是目录 则只需要远程创建目录
                if(row.isDirectory){
                    // 创建目录代码 如果不是/ 则需要创建目录
                    let createWithDirsCode = value !=='/' ? "files.createWithDirs('/sdcard"+value + row.fileName+"/');" : "";
                    // 拼接代码
                    remoteExecuteScriptContent += createWithDirsCode;
                } else {
                    // 如果有值且  是以/开头
                    let localFileUrl = value  + ((row.isDirectory || !row.fileType) ? row.fileName : (row.fileName + "." + row.fileType));
                    // 创建目录代码 如果不是/ 则需要创建目录
                    let createWithDirsCode = value !=='/' ? "files.createWithDirs('/sdcard"+value+"');" : "";
                    let script = createWithDirsCode + "utilsObj.downLoadFile('"+downloadFilUrl+"','"+localFileUrl+"',()=>{});";
                    // 拼接代码
                    remoteExecuteScriptContent += script;
                }
            });
            this.remoteExecuteScript(remoteExecuteScriptContent);
        },
        // 全选
        checkAllFileChange() {
            this.fileList.forEach(item => {
                this.$set(item, 'check', this.checkAllFile);
            });
        },
        // 手机端全选
        phoneCheckAllFileChange(){
            this.phoneFileList.forEach(item => {
                this.$set(item, 'check', this.phoneCheckAllFile);
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
                let index = pathName.indexOf(this.deviceInfo.deviceUuid);
                pathName = pathName.substring(index, pathName.length);
                let array = pathName.split("\\");

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
                } else if(['zip','rar'].includes(row.fileType)){
                    window.ZXW_VUE.$message.warning('暂不支持编辑压缩文件,请解压后查看');
                    return false;
                } else {
                    this.fileEditVisible = true;
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
        // 手机端文件双击
        phoneFileNameDbClick(row){
            // 如果是目录
            if (row.isDirectory) {
                // 记录到面包屑导航栏
                let pathName = row.pathName;
                pathName = row.pathName.replace('/','');
                let array = pathName.split("/");
                  // 面包屑数组
                 let breadcrumbArr = [];
                 let pathArr = [];
                 for (let i = 0; i < array.length; i++) {
                     pathArr.push(array[i]);
                     breadcrumbArr.push({
                         label: i === 0 ? "根目录" : array[i],
                         value: '/'+pathArr.join("/")+'/'
                     });
                 }
                this.phoneBreadcrumbList = breadcrumbArr;
                 // 默认加载最后一个
                this.refreshPhoneDir();
                // 文件 空白窗口打开
            } else {
                if(['png','jpg','jpeg'].includes(row.fileType)){
                    this.phoneFileLoading = true;
                    this.updatePhoneFileCache(row);
                } else if(['zip','rar'].includes(row.fileType)){
                    window.ZXW_VUE.$message.warning('暂不支持编辑压缩文件,请解压后查看');
                    return false;
                } else {
                    this.phoneFileLoading = true;
                    this.updatePhoneFileCache(row);
                }
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
                let pathName = this.absolutePrePath + this.deviceInfo.deviceUuid + value;
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
        // 手机端压缩文件
        phoneZipFile(row){
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            window.ZXW_VUE.$prompt('请输入要压缩到的目录及文件名(根目录是/sdcard/)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: toPath + row.fileName + '.zip',
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let remoteScript = `$zip.zipDir('${row.pathName}', '${value}')`;
                this.remoteExecuteScript(remoteScript);
                setTimeout(()=>{
                    // 刷新手机目录
                    this.refreshPhoneDir();
                },500);
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
                let pathName = this.absolutePrePath + this.deviceInfo.deviceUuid + value;
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
        // 手机端解压文件
        phoneUnZipFile(row){
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            window.ZXW_VUE.$prompt('请输入要解压到的目录(根目录是/sdcard/)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: toPath +row.fileName,
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let remoteScript = `$zip.unzip('${row.pathName}', '${value}')`;
                this.remoteExecuteScript(remoteScript);
                setTimeout(()=>{
                    // 刷新手机目录
                    this.refreshPhoneDir();
                },500);
            }).catch(() => {
            });
        },
        // 关闭编辑器
        closeFileEditorDialog(){
            this.fileEditVisible = false;
        },
        phoneCloseFileEditorDialog(){
            this.phoneFileEditVisible = false;
        },
        phoneCloseImagePreviewDialog(){
            this.phoneImagePreviewVisible = false;
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
        // 手机端保存文件编辑器内容
        phoneSaveFileEditorContent(){
            window.ZXW_VUE.$confirm('确认保存手机端文件【' + this.phoneFileSavePath + '】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let remoteScript = `let writableTextFile = files.write('${this.phoneFileSavePath}',decodeURI($base64.decode('${btoa(encodeURI(this.phoneScriptEditor.getValue()))}')));`;
                this.remoteExecuteScript(remoteScript);
            });
        },
        // 面包屑change
        breadcrumbChange(item, index) {
            if (!this.validSelectDevice()) {
                return;
            }
            // 加载文件列表
            this.queryFileList(item.value);
            // 重新加载面包屑
            this.breadcrumbList = this.breadcrumbList.slice(0, index + 1);
            this.$set(this.breadcrumbList, 0, {label: '根目录', value: this.deviceInfo.deviceUuid});

            if(this.autoSyncWebSyncPath){
                let toPath = this.breadcrumbList[this.breadcrumbList.length - 1].value;
                let replacePath = toPath.replace(this.deviceInfo.deviceUuid,"");
                this.webSyncPath =  replacePath + "/";
            }
        },
        // 面包屑导航
        phoneBreadcrumbChange(item, index){
            if (!this.validSelectDevice()) {
                return;
            }
            this.updatePhoneDirCache(item.value);
            // 重新加载面包屑
            this.phoneBreadcrumbList = this.phoneBreadcrumbList.slice(0, index + 1);
            if(this.autoSyncPhoneSyncPath){
                let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
                this.phoneSyncPath =  toPath.replace("/sdcard", "");
            }
        },
        // 刷新手机端路径
        refreshPhoneDir(){
            // 默认加载最后一个
            this.phoneBreadcrumbChange(this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1], (this.phoneBreadcrumbList.length - 1))
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
        // 校验同步参数
        validateSyncParam(){
            if (!this.validSelectDevice()) {
                return false;
            }
            if (!this.webSyncPath) {
                window.ZXW_VUE.$message.warning('请设置web端同步路径');
                return false;
            }
            if(!this.webSyncPath.startsWith("/")){
                window.ZXW_VUE.$message.warning("web端同步路径必须以/开头");
                return false;
            }
            if(!this.webSyncPath.endsWith("/")){
                window.ZXW_VUE.$message.warning("web端同步路径必须以/结尾");
                return false;
            }
            if (!this.phoneSyncPath) {
                window.ZXW_VUE.$message.warning('请设置手机端同步路径');
                return false;
            }
            if (this.phoneSyncPath.startsWith("/sdcard")) {
                window.ZXW_VUE.$message.warning('手机端同步路径无需以/sdcard开头');
                return false;
            }
            if (!this.phoneSyncPath.startsWith("/")) {
                window.ZXW_VUE.$message.warning("手机端同步路径必须以/开头");
                return false;
            }
            if (!this.phoneSyncPath.endsWith("/")) {
                window.ZXW_VUE.$message.warning("手机端同步路径必须以/开头");
                return false;
            }
            return true;
        },
        // 同步文件到手机端
        syncFileToPhone() {
            if (!this.validateSyncParam()) {
                return;
            }
            window.ZXW_VUE.$confirm('是否确认将web端【根目录'+this.webSyncPath+'】目录文件(文件夹不会递归同步),同步到手机端【' + this.phoneSyncPath + '】下?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let _that = this;
                let relativeFilePath = this.deviceInfo.deviceUuid + this.webSyncPath;
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
                                let webSyncToPhoneArr = data.data;
                                _that.webSyncToPhoneFun(webSyncToPhoneArr,_that.phoneSyncPath);
                            }
                        }
                        setTimeout(() => {
                        }, 200)
                    },
                    error: function (msg) {
                    }
                });
            });
        },
        // 同步文件到Web端
        syncFileToWeb() {
            if (!this.validateSyncParam()) {
                return;
            }
            window.ZXW_VUE.$confirm('是否确认将手机端【' + this.phoneSyncPath + '】目录文件(文件夹不会递归同步),同步到web端【根目录'+this.webSyncPath+'】下?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                // 定义根目录
                let remoteExecScriptContent = 'let dir = "/sdcard'+ this.phoneSyncPath+'";\r\n';
                // 定义web端路径
                remoteExecScriptContent += 'let webPath = utilsObj.getDeviceUUID()+ "'+ this.webSyncPath+'";\r\n';
                // 读取全部的文件
                remoteExecScriptContent += 'let allList = files.listDir(dir);\r\n';
                // 遍历调用上传方法
                remoteExecScriptContent += 'allList.forEach(name=>{ \r\n';
                remoteExecScriptContent +=  '  let fileName = webPath+name;\r\n';
                remoteExecScriptContent +=  '  let localFilePath = dir+name;\r\n';
                remoteExecScriptContent +=  '  if(files.isDir(localFilePath)){\r\n';
                remoteExecScriptContent +=  '     utilsObj.request("/attachmentInfo/createFolder?folderName="+fileName,"GET",null,()=>{});\r\n';
                remoteExecScriptContent +=  '  }else{\r\n';
                remoteExecScriptContent +=  '     utilsObj.uploadFileToServer(localFilePath,fileName,()=>{console.log(localFilePath+"上传完成")});\r\n';
                remoteExecScriptContent +=  '  }\r\n';
                remoteExecScriptContent += '})\r\n';
                remoteExecScriptContent += 'toastLog("上传完成,一共"+allList.length+"个文件")\r\n';
                this.remoteExecuteScript(remoteExecScriptContent);
                setTimeout(()=>{
                    window.ZXW_VUE.$notify.success({message: '请手动刷新目录', duration: '1000'});
                },1000)
            });
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
        // 手机端重命名
        phoneReName(row){
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
                let remoteScript = `files.rename('${row.pathName}', '${value}')`;
                this.remoteExecuteScript(remoteScript);
                // 刷新手机目录
                this.refreshPhoneDir();
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
        // 手机删除单个文件
        phoneRemoveFile(row){
            let fileNames =  (row.isDirectory || !row.fileType) ? row.fileName : (row.fileName + "." + row.fileType);
            window.ZXW_VUE.$confirm('是否确认删除' + fileNames + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let remoteScript = row.isDirectory ? `files.removeDir('${row.pathName}')` : `files.remove('${row.pathName}')`;
                this.remoteExecuteScript(remoteScript);
                // 刷新手机目录
                this.refreshPhoneDir();
            });
        },
        // 单个文件同步到手机
        syncToPhoneSingle(row){
            window.ZXW_VUE.$prompt('请输入手机端路径(以/sdcard为根目录的相对路径)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.phoneSyncPath,
                inputValidator: function(val) {
                    if(val){
                        if(val.startsWith("/sdcard")){
                            return "无需以/sdcard开头"
                        }
                        if(!val.startsWith("/")){
                            return "必须以/开头"
                        }
                        if(!val.endsWith("/")){
                            return "必须以/结尾"
                        }
                    } else {
                        return "不能为空";
                    }
                    return true;
                }
            }).then(({value}) => {
                let webSyncToPhoneArr = [row];
                this.webSyncToPhoneFun(webSyncToPhoneArr,value);
            }).catch(() => {
            });
        },
        // 创建文件夹
        createFolder() {
            if (!this.validSelectDevice()) {
                return;
            }
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
        // 新建文件(夹)
        phoneCreateFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            window.ZXW_VUE.$prompt('请输入文件(夹)名称(文件夹请以/结尾)', '提示', {
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
                let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
                let remoteScript = '';
                    remoteScript += `files.createWithDirs('${toPath}'+'${value}')`;
                this.remoteExecuteScript(remoteScript);
                setTimeout(()=>{
                    // 刷新手机目录
                    this.refreshPhoneDir();
                },500);
            }).catch(() => {
            });
        },
        // 手机端初始化同步目录
        phoneInitSyncDir(){
            let remoteScript = `files.createWithDirs("/sdcard/appSync/");toastLog("初始化同步目录完成");`;
            this.remoteExecuteScript(remoteScript);
            this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
            setTimeout(()=>{
                // 刷新手机目录
                this.refreshPhoneDir();
            },500);
        },
        // 手机端下载脚手架项目
        phoneDownLoadGameScript(){
            let downLoadGameScript = `files.createWithDirs("/sdcard/appSync/")
            utilsObj.downLoadFile("https://www.zjh336.cn/hz_autojs_game_script.zip","/appSync/hz_autojs_game_script.zip",()=>{$zip.unzip('/sdcard/appSync/hz_autojs_game_script.zip', '/sdcard/appSync/');toastLog("初始化脚手架项目完成");});`
            this.remoteExecuteScript(downLoadGameScript);
            this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
            setTimeout(()=>{
                // 刷新手机目录
                this.refreshPhoneDir();
            },500);
        },
        // 手机端初始化运行文件
        phoneInitFile(){
            let initRemoteScript = 'engines.execScriptFile("/sdcard/appSync/hz_autojs_game_script/main.js",{path:["/sdcard/appSync/hz_autojs_game_script"]})';
            window.ZXW_VUE.$prompt('是否确认初始化【/sdcard/appSync/main.js】文件内容如下：', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: initRemoteScript,
                inputValidator: function(val) {
                    if (!val) {
                        return '不能为空！'
                    } else {
                        return true;
                    }
                }
            }).then(({value}) => {
                let remoteScript = `files.createWithDirs('/sdcard/appSync/main.js');`;
                    remoteScript += `files.write('/sdcard/appSync/main.js', '${value}');toastLog("初始化运行程序完成");`;
                    this.remoteExecuteScript(remoteScript);
                    this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
                    setTimeout(()=>{
                        // 刷新手机目录
                        this.refreshPhoneDir();
                    },500);
            }).catch(() => {
            });
        },
        // 手机端远程运行程序
        phoneRemoteRunScript(){
            let remoteScript = `engines.execScriptFile("/sdcard/appSync/main.js");`;
            this.remoteExecuteScript(remoteScript);
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
        },
        // 更新手机端目录缓存
        updatePhoneDirCache(targetPath) {
            this.phoneFileLoading = false;
            // 关键key
            let dirPathKey = this.deviceInfo.deviceUuid + '_' + targetPath;
            // 更新手机端目录缓存
            let updatePhoneDirCacheFun = () => {
                // 远程执行脚本内容
                let remoteScript = `let targetPath = '${targetPath}'
                function convertFile(item, baseUrl) {
                    let fileObj = {};
                    fileObj.pathName = baseUrl + item
                    fileObj.parentPathName = baseUrl
                    fileObj.isDirectory = files.isDir(fileObj.pathName)
                    fileObj.fileName = item
                    if(!fileObj.isDirectory){
                        if(item.lastIndexOf('.')!==-1){
                            fileObj.fileName = item.substring(0,item.lastIndexOf('.'))
                            fileObj.fileType = item.substring(item.lastIndexOf('.')+1,item.length)
                        }
                    }
                    return fileObj;
                }
                function getFileByPath(filePath) {
                    let fileArr = files.listDir(filePath);
                    let fileList = [];
                    fileArr.forEach(item => {
                        let fileObj = convertFile(item, filePath);
                        if (fileObj.isDirectory) {
                            //let childrenFileList = getFileByPath(fileObj.filePath);
                            //fileObj.children = childrenFileList;
                        }
                        fileList.push(fileObj);
                    })
                    return fileList;
                }
                let appSyncFileList = getFileByPath(targetPath);
                // url编码base64加密
                let result = $base64.encode(encodeURI(JSON.stringify(appSyncFileList)));
                http.request(commonStorage.get("服务端IP") + ':9998/attachmentInfo/updateFileDirectoryMap', {
                    headers: {
                        "deviceUUID": commonStorage.get('deviceUUID')
                    },
                    method: 'POST',
                    contentType: 'application/json',
                    body: JSON.stringify({ 'dirPathKey': commonStorage.get('deviceUUID') + '_' + targetPath, 'fileDirectoryJson': result })
                }, (e) => { });`;
                this.remoteExecuteScript(remoteScript);
            };
            this.phoneFileLoading = true;
            // 查询缓存数据方法
            queryCacheData(() => {
                $.ajax({
                    url: getContext() + "/attachmentInfo/clearFileDirectoryMap",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    data: {
                        "dirPathKey": dirPathKey
                    },
                    success: function (data) {
                    },
                    error: function (msg) {
                    }
                });
                // 清除完成后执行
                updatePhoneDirCacheFun();
            }, () => {
                let cacheData = null;
                $.ajax({
                    url: getContext() + "/attachmentInfo/queryFileDirectory",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    data: {
                        "dirPathKey": dirPathKey
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                cacheData = data.data;
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
                return cacheData;
            }, 200, 30,(cacheResultData)=>{
                let fileAllArr = cacheResultData ? JSON.parse(decodeURI(atob(cacheResultData))) : [];
                let allArr = [];
                // 目录
                let dirArr = fileAllArr.filter(item=>item.isDirectory).sort((item1, item2) => {
                    let a=item1.fileName||'';
                    let b=item2.fileName||'';
                    for(let i=0; i<a.length;i++){
                        if(a.charCodeAt(i)===b.charCodeAt(i)) continue;
                        return a.charCodeAt(i) - b.charCodeAt(i);
                    }
                });
                // 文件
                let fileArr = fileAllArr.filter(item=>!item.isDirectory).sort((item1, item2) => {
                    let a=item1.fileName||'';
                    let b=item2.fileName||'';
                    for(let i=0; i<a.length;i++){
                        if(a.charCodeAt(i)===b.charCodeAt(i)) continue;
                        return a.charCodeAt(i) - b.charCodeAt(i);
                    }
                });
                allArr = allArr.concat(dirArr);
                allArr = allArr.concat(fileArr);

                let pathNameArr = this.phoneCopyFileList.map(item => item.pathName);
                let pathNameArr2 = this.phoneMoveFileList.map(item => item.pathName);
                allArr.forEach(item => {
                    item.check = pathNameArr.includes(item.pathName) || pathNameArr2.includes(item.pathName) || false
                });
                this.phoneFileList = allArr;
                this.phoneFileTableRandomKey = Math.random();
                this.phoneFileLoading = false;
            });
        },
        // 更新手机端文件缓存
        updatePhoneFileCache(row) {
            let targetPath = row.pathName;
            let fileType = row.fileType || '';
            let isImage = ['png','jpg','jpeg'].includes(fileType);
            let isText = ['js','json','css','txt','log','md',''].includes(fileType);
            // 关键key
            let dirPathKey = this.deviceInfo.deviceUuid + '_' + targetPath;
            // 更新手机端目录缓存
            let updatePhoneDirCacheFun = () => {
                // 远程执行脚本内容
                let remoteScript = `let result = '';
                if(${isImage}){
                   let bytes = files.readBytes('${targetPath}');
                   let image = images.read('${targetPath}');
                   result = images.toBase64(image, "png", 100);
                   image.recycle();
                }
                if(${isText}){
                   let text = files.read('${targetPath}');
                   result = $base64.encode(encodeURI(text));
                }
                http.request(commonStorage.get("服务端IP") + ':9998/attachmentInfo/updateFileMap', {
                    headers: {
                        "deviceUUID": commonStorage.get('deviceUUID')
                    },
                    method: 'POST',
                    contentType: 'application/json',
                    body: JSON.stringify({ 'dirPathKey': commonStorage.get('deviceUUID') + '_' + '${targetPath}', 'fileJson': result })
                }, (e) => { });`;
                this.remoteExecuteScript(remoteScript);
            };
            // 查询缓存数据方法
            queryCacheData(() => {
                $.ajax({
                    url: getContext() + "/attachmentInfo/clearFileMap",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    data: {
                        "dirPathKey": dirPathKey
                    },
                    success: function (data) {
                    },
                    error: function (msg) {
                    }
                });
                // 清除完成后执行
                updatePhoneDirCacheFun();
            }, () => {
                let cacheData = null;
                $.ajax({
                    url: getContext() + "/attachmentInfo/queryFileMap",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    data: {
                        "dirPathKey": dirPathKey
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                cacheData = data.data;
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
                return cacheData;
            }, 200, 30,(cacheResultData)=>{
                let fileContent = '';
                this.phoneFileEditorName = '';
                this.phoneImageBase64 = '';
                if(isText){
                    this.phoneFileEditVisible = true;
                    fileContent = cacheResultData ? decodeURI(atob(cacheResultData)) : '';
                    this.phoneFileEditorName = row.fileName + (row.fileType ? ('.' + row.fileType) : '');
                    this.phoneFileSavePath = row.pathName;
                    // 初始化文件编辑器
                    initFileEditor(this,'phoneScriptEditor','phoneFileEditor',this.getMonacoEditorComplete,fileContent,'javascript','vs-dark',(e,value)=>{
                    })
                }
                if(isImage){
                    this.phoneImagePreviewVisible = true;
                    this.phoneFileEditorName = row.fileName + (row.fileType ? ('.' + row.fileType) : '');
                    this.phoneImageBase64 = 'data:image/png;base64,' + cacheResultData;
                }
                this.phoneFileLoading = false;
            });
        }
    }
}