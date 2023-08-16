import {
    getContext,
    getEditorType,
    handlerAppByCacheChange,
    handlerByFileChange,
    initFileEditor,
    queryCacheData
} from "./../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/fileManage.html",
    type: 'get',
    async: false,
    success: function (res) {
        template = String(res);
    }
});
let defaultProjectJSON = {
    "abis": [
        "arm64-v8a",
        "armeabi-v7a"
    ],
    "assets": [],
    "build": {
        "build_id": "604CCB7A-25",
        "build_number": 25,
        "build_time": 1678719855559,
        "release": true
    },
    "encryptLevel": 0,
    "features": {
        "activityIntentTasks": false,
        "builtInOCR": "with-models",
        "nodejs": "enabled"
    },
    "icon": "images/ic_app_logo.png",
    "launchConfig": {
        "displaySplash": true,
        "hideLogs": true,
        "splashIcon": "images/ic_splash.png",
        "splashText": "欢迎关注华仔部落！",
        "stableMode": false
    },
    "main": "main.js",
    "name": "华仔AutoJs工具箱",
    "autoOpen":false,
    "optimization": {
        "obfuscateComponents": false,
        "removeAccessibilityService": false,
        "removeOpenCv": false,
        "unusedResources": false
    },
    "packageName": "com.zjh336.cn.tools",
    "permissionConfig": {
        "manifestPermissions": [
            "android.permission.ACCESS_WIFI_STATE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
            "android.permission.READ_EXTERNAL_STORAGE",
            "com.android.launcher.permission.INSTALL_SHORTCUT",
            "com.android.launcher.permission.UNINSTALL_SHORTCUT",
            "android.permission.INTERNET",
            "android.permission.ACCESS_NETWORK_STATE",
            "android.permission.SYSTEM_ALERT_WINDOW",
            "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
            "android.permission.RECEIVE_BOOT_COMPLETED",
            "android.permission.FOREGROUND_SERVICE",
            "android.permission.FORCE_STOP_PACKAGES",
            "android.permission.PACKAGE_USAGE_STATS",
            "android.permission.WRITE_SECURE_SETTINGS",
            "android.permission.WRITE_SETTINGS",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.RECORD_AUDIO",
            "com.android.alarm.permission.SET_ALARM",
            "android.permission.ACCESS_CHECKIN_PROPERTIES",
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.ACCESS_LOCATION_EXTRA_COMMANDS",
            "android.permission.ACCESS_SURFACE_FLINGER",
            "android.permission.ACCOUNT_MANAGER",
            "android.permission.AUTHENTICATE_ACCOUNTS",
            "android.permission.BATTERY_STATS",
            "android.permission.BIND_APPWIDGET",
            "android.permission.BIND_DEVICE_ADMIN",
            "android.permission.BIND_INPUT_METHOD",
            "android.permission.BIND_REMOTEVIEWS",
            "android.permission.BIND_WALLPAPER",
            "android.permission.BLUETOOTH",
            "android.permission.BLUETOOTH_ADMIN",
            "android.permission.BRICK",
            "android.permission.BROADCAST_PACKAGE_REMOVED",
            "android.permission.BROADCAST_SMS",
            "android.permission.BROADCAST_STICKY",
            "android.permission.BROADCAST_WAP_PUSH",
            "android.permission.CALL_PHONE",
            "android.permission.CALL_PRIVILEGED",
            "android.permission.CAMERA",
            "android.permission.CHANGE_COMPONENT_ENABLED_STATE",
            "android.permission.CHANGE_CONFIGURATION",
            "android.permission.CHANGE_NETWORK_STATE",
            "android.permission.CHANGE_WIFI_MULTICAST_STATE",
            "android.permission.CHANGE_WIFI_STATE",
            "android.permission.CLEAR_APP_CACHE",
            "android.permission.CLEAR_APP_USER_DATA",
            "android.permission.CONTROL_LOCATION_UPDATES",
            "android.permission.DELETE_CACHE_FILES",
            "android.permission.DELETE_PACKAGES",
            "android.permission.DEVICE_POWER",
            "android.permission.DIAGNOSTIC",
            "android.permission.DISABLE_KEYGUARD",
            "android.permission.DUMP",
            "android.permission.EXPAND_STATUS_BAR",
            "android.permission.FACTORY_TEST",
            "android.permission.FLASHLIGHT",
            "android.permission.FORCE_BACK",
            "android.permission.GET_ACCOUNTS",
            "android.permission.GET_PACKAGE_SIZE",
            "android.permission.GET_TASKS",
            "android.permission.GLOBAL_SEARCH",
            "android.permission.HARDWARE_TEST",
            "android.permission.INJECT_EVENTS",
            "android.permission.INSTALL_LOCATION_PROVIDER",
            "android.permission.INSTALL_PACKAGES",
            "android.permission.INTERNAL_SYSTEM_WINDOW",
            "android.permission.KILL_BACKGROUND_PROCESSES",
            "android.permission.MANAGE_ACCOUNTS",
            "android.permission.MANAGE_APP_TOKENS",
            "android.permission.MASTER_CLEAR",
            "android.permission.MODIFY_AUDIO_SETTINGS",
            "android.permission.MODIFY_PHONE_STATE",
            "android.permission.MOUNT_FORMAT_FILESYSTEMS",
            "android.permission.MOUNT_UNMOUNT_FILESYSTEMS",
            "android.permission.NFC",
            "android.permission.PERSISTENT_ACTIVITY",
            "android.permission.PROCESS_OUTGOING_CALLS",
            "android.permission.READ_CALENDAR",
            "android.permission.READ_CONTACTS",
            "android.permission.READ_FRAME_BUFFER",
            "android.permission.READ_INPUT_STATE",
            "android.permission.READ_LOGS",
            "android.permission.READ_PHONE_STATE",
            "android.permission.READ_SMS",
            "android.permission.RECEIVE_WAP_PUSH",
            "android.permission.REORDER_TASKS",
            "android.permission.RESTART_PACKAGES",
            "android.permission.SEND_SMS",
            "android.permission.SET_ACTIVITY_WATCHER",
            "android.permission.SET_ALWAYS_FINISH",
            "android.permission.SET_ANIMATION_SCALE",
            "android.permission.SET_DEBUG_APP",
            "android.permission.SET_ORIENTATION",
            "android.permission.SET_PREFERRED_APPLICATIONS",
            "android.permission.SET_PROCESS_LIMIT",
            "android.permission.SET_TIME",
            "android.permission.SET_TIME_ZONE",
            "android.permission.SET_WALLPAPER",
            "android.permission.SET_WALLPAPER_HINTS",
            "android.permission.SIGNAL_PERSISTENT_PROCESSES",
            "android.permission.STATUS_BAR",
            "android.permission.SUBSCRIBED_FEEDS_READ",
            "android.permission.SUBSCRIBED_FEEDS_WRITE",
            "android.permission.UPDATE_DEVICE_STATS",
            "android.permission.USE_CREDENTIALS",
            "android.permission.USE_SIP",
            "android.permission.VIBRATE",
            "android.permission.WAKE_LOCK",
            "android.permission.WRITE_APN_SETTINGS",
            "android.permission.WRITE_CALENDAR",
            "android.permission.WRITE_CONTACTS",
            "android.permission.WRITE_GSERVICES",
            "android.permission.WRITE_SMS",
            "android.permission.WRITE_SYNC_SETTINGS",
            "com.android.browser.permission.READ_HISTORY_BOOKMARKS",
            "com.android.browser.permission.WRITE_HISTORY_BOOKMARKS",
            "android.permission.REQUEST_INSTALL_PACKAGES",
            "moe.shizuku.manager.permission.API_V23",
            "android.permission.QUERY_ALL_PACKAGES",
            "android.permission.REQUEST_DELETE_PACKAGES"
        ],
        "requestListOnStartup": [
            "android.permission.READ_PHONE_STATE",
            "android.permission.WRITE_EXTERNAL_STORAGE"
        ]
    },
    "plugins": {
        "org.autojs.autojspro.plugin.mlkit.ocr": "1.1",
        "org.autojs.autojspro.ocr.v2":"1.3",
        "com.tomato.ocr":"1.0",
        "com.hraps.ocr32":"1.0",
        "com.hraps.ocr":"2.0.0",
        "cn.lzx284.p7zip":"1.2.1",
        "com.hraps.pytorch":"1.0",
        "org.autojs.plugin.ffmpeg":"1.1"
    },
    "scripts": {},
    "signingConfig": {
        "alias": "zjh336",
        "keystore": "",
        "uuid": ""
    },
    "useFeatures": [],
    "versionCode": 1000,
    "versionName": "1.0.0"
};

export default {
    template: template,
    name: 'FileManage',
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
            default: '横屏'
        }
    },
    data() {
        return {
            isInit:false,
            oneKeyPackageFlag:false, // 一键打包标记
            fileEditVisible:false, // 文件编辑器可见
            phoneFileEditVisible:false,
            phoneImagePreviewVisible:false,// 手机端图片预览
            phoneImageBase64:'',// 图片内容
            fileEditorName:'',// 文件编辑器名称
            phoneFileEditorName:'',
            fileSavePath: '',// 文件保存路径
            phoneFileSavePath:'',// 手机端文件保存路径
            phoneFileCacheArr:[],// 手机端文件缓存列表
            phoneFileSelectIndex:-1, // 手机端文件选择下标
            /**
             * fileSavePath:文件保存路径
             * fileName: 文件名
             * fileContent: 文件内容
             */
            scriptEditor:null,
            phoneScriptEditor:null,
            fileActiveName:'web',
            webSyncPath: "/",
            phoneSyncPath: "/",
            autoSyncWebSyncPath:true,
            autoSyncPhoneSyncPath:true,
            phoneFileTableRandomKey:Math.random(),
            breadcrumbList: [{label: '根目录', value: 'undefined'}], // 面包屑
            phoneBreadcrumbList: [{label: '根目录', value: '/sdcard/'}],
            fileLoading: false,// 加载文件loading
            phoneFileLoading: false,// 手机端加载文件loading
            checkAllFile: false,// 全选文件
            phoneCheckAllFile: false,// 手机端全选文件
            previewList: [],// 单个上传
            uploadFileList: [],// 需要上传的文件列表
            accept:'.jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PNG,.PDF,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.rar,.zip,.txt,.mp4,.flv,.rmvb,.avi,.wmv,.js,.jar,.dex,.bat,.sh,.apk',
            curFileData: {},// 选中的文件数据
            copyFileList: [],// 复制文件列表
            phoneCopyFileList:[],// 手机端复制文件列表
            moveFileList: [],// 移动文件列表
            phoneMoveFileList: [],// 手机端移动文件列表
            absolutePrePath: '',// 绝对路径前缀
            fileList: [], // 文件列表
            phoneFileList:[], // 手机文件列表
            packageProjectActive:0,
            packageProjectDialog: false,
            projectJsonObj:{ // 缓存project对象

            },
            packageProjectStepLoading: false,
            keyStoreArr:[],// 自定义签名数组
            packageProject:{
                appName:'',//
                packageName:'',//
                versionName:'',
                versionCode:'',
                appIcon:'',
                openNodeJs:false,
                openImageModule:true,
                autoOpen:false,
                plugins:[],
                abis:['armeabi-v7a','arm64-v8a'],
                hideLogs:true,
                splashText:'',
                splashIcon:'',
                customSignStorePath:'',
                openObfuscator:false,
                obfuscatorIncludePaths:''
            },
            appIconLoading:false,
            splashIconLoading:false,
            packageProjectRules:{
                appName: [{ required: true, message: '请填写应用名称', trigger: 'blur' }],
                packageName: [{ required: true, message: '请填写应用包名', trigger: 'blur' }],
                versionName: [{ required: true, message: '请填写版本名称', trigger: 'blur' }],
                versionCode: [{ required: true, message: '请填写版本号', trigger: 'blur' }],
                abis:[{ required: true, message: '请选择CPU架构', trigger: 'change' }],
                appIcon:[{ required: true, trigger: 'change' , validator: (rules, value, cb) => {
                        if(!value){
                            return cb()
                        }
                        if (value.endsWith("png") || value.endsWith("jpg") || value.endsWith("jpeg")) {
                            this.appIconLoading = true;
                            this.checkIconByPath(value,(checkResult)=>{
                                this.appIconLoading = false;
                                if(!checkResult){
                                    return cb(new Error('图片未找到,请重试！'))
                                } else {
                                    return cb()
                                }
                            })
                        } else {
                            return cb(new Error('只能使用png、jpg、jpeg格式图片!'))
                        }
                    }}],
                splashIcon:[{ required: true, trigger: 'change' , validator: (rules, value, cb) => {
                        if(!value){
                            return cb()
                        }
                        if (value.endsWith("png") || value.endsWith("jpg") || value.endsWith("jpeg")) {
                            this.splashIconLoading = true;
                            this.checkIconByPath(value,(checkResult)=>{
                                this.splashIconLoading = false;
                                if(!checkResult){
                                    return cb(new Error('图片未找到,请重试！'))
                                } else {
                                    return cb()
                                }
                            })
                        } else{
                            return cb(new Error('只能使用png、jpg、jpeg格式图片!'))
                        }
                    }}],
                customSignStorePath: [{ required: true, trigger: 'change' , validator: (rules, value, cb) => {
                        if(!this.keyStoreArr || !this.keyStoreArr.length){
                            return cb(new Error('请先在公共文件模块，生成自定义签名!'))
                        }
                        let arr = this.keyStoreArr.filter(item=>item === value);
                        if (!arr || !arr.length) {
                            return cb(new Error('请选择自定义签名!'))
                        }
                        return cb()
                    }}]
            },
            alreadyInitPackageTemplate:false,// 是否已经初始化完成打包模板
            alreadyUploadProjectRes:false,// 是否已经上传项目资源
            alreadyHandlerPackageRes:false,// 是否已处理打包资源
            alreadyCompletePackageProject:false,// 是否已完成打包项目
            packageProjectMessage:'',// 打包日志信息
            phoneFileEditorLoading:false, // 手机端文件编辑器loading
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
        },
        // 手机端编辑器缓存数组文件是否修改记录数组
        phoneFileChangeArr(){
           return this.phoneFileCacheArr.map(item=> item.sourceFileContent !== item.fileContent);
        },
        // 手机端当前目录是否存在project.json文件
        phoneCurPathExitProject(){
            let projectFileArr = this.phoneFileList.filter(item=>item.fileType==='json' && item.fileName === 'project');
            return !(!projectFileArr || projectFileArr.length === 0);
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
        },
        packageProjectActive(val){
            // 一键打包模式 不进行监听
            if(this.oneKeyPackageFlag){
                return;
            }
            // 第二步  初始化打包模板
            if(val === 1){
                // 检查是否已经初始化完成打包模板
                this.alreadyInitPackageTemplate = this.checkWebPackageTemplate();
            // 第三步  上传项目资源
            } else if(val === 2){
                // 检测项目资源是否已上传完成
                this.alreadyUploadProjectRes = this.checkProjectRes()
            // 第四步  打包资源处理
            } else if(val === 3){
                // 检测打包资源是否已处理完成
                this.alreadyHandlerPackageRes = this.checkPackageResHandlerStatus();
            // 第五步  打包项目
            } else if(val === 4){
                // 检测是否已完成打包
                this.alreadyCompletePackageProject = this.checkPackageProject();
            }
        }
    },
    methods: {
        // 初始化方法
        init() {
            if(!this.isInit){
                let relativeFilePath = this.deviceInfo.deviceUuid;
                if(relativeFilePath){
                    // 加载文件列表
                    this.queryFileList(relativeFilePath);
                    this.breadcrumbList = [{label: '根目录', value: this.deviceInfo.deviceUuid}]
                }
                // 获取手机端文件目录
                this.updatePhoneDirCache(this.phoneBreadcrumbList.map(item => item.value).join('/'));
            }
            this.isInit = true;
        },
        // 取消上传
        cancelUpload(i) {
            this.uploadFileList.splice(i, 1);
            window.newxhr.abort();
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
                                remoteScript +=`utilsObj.request("/attachmentInfo/createFolder?folderName="+webPath+'${item.fileName}',"GET",null,()=>{toastLog("同步完成")});\r\n`;
                            } else {
                                remoteScript +=`utilsObj.uploadFileToServer('${item.pathName}',webPath + '${item.fileName}' + '.'+ '${item.fileType}',()=>{toastLog("同步完成")});\r\n`;
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
                this.phoneFileLoading = true;
                let relativeFilePath = this.deviceInfo.deviceUuid  + value + ((row.isDirectory || !row.fileType) ? row.fileName : row.fileName +'.' + row.fileType);
                // 文件内容变化后处理函数
                handlerByFileChange(relativeFilePath,()=>{
                    // 设置同步文件集合  暂不支持同步目录
                    let remoteScript = ``;
                    if(row.isDirectory){
                        remoteScript +=`utilsObj.request("/attachmentInfo/createFolder?folderName="${relativeFilePath},"GET",null,()=>{toastLog("同步完成")});\r\n`;
                    } else {
                        remoteScript +=`utilsObj.uploadFileToServer('${row.pathName}','${relativeFilePath}',()=>{toastLog("同步完成")});\r\n`;
                    }
                    this.remoteExecuteScript(remoteScript);
                },()=>{
                    this.phoneFileLoading = false;
                    // 刷新web目录
                    this.refreshWebDir();
                });
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
                } else if(['zip','rar','apk'].includes(row.fileType)){
                    window.ZXW_VUE.$message.warning('暂不支持编辑此类文件');
                    return false;
                } else {
                    this.phoneFileLoading = true;
                    window.removeEventListener('keydown',this.phoneEditorDialogSaveListener);
                    window.addEventListener('keydown',this.phoneEditorDialogSaveListener,false);
                    this.updatePhoneFileCache(row);
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
        // 手机端文件编辑器弹窗保存监听
        phoneEditorDialogSaveListener(e){
            if(!this.phoneFileEditVisible){
                return;
            }
            // 快捷运行程序  ctrl+i
            if(e.ctrlKey && e.keyCode === 73){
                this.phoneRemoteRunScript();
                // 保存 ctrl+s
            }else if(e.ctrlKey && e.keyCode === 83){
                // 获取当前点击的文件对象
                let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
                if(!fileObj){
                    return;
                }
                let remoteScript = `let writableTextFile = files.write('${fileObj.fileSavePath}',decodeURI($base64.decode('${btoa(encodeURI(fileObj.fileContent))}')));`;
                this.remoteExecuteScript(remoteScript);
                // 更新原始缓存值
                fileObj.sourceFileContent = fileObj.fileContent;
                e.stopPropagation();
                e.preventDefault();
                return false;
            // 最小化 ctrl+3
            }else if(e.ctrlKey && (e.keyCode === 51 || e.keyCode === 99)){
                e.stopPropagation();
                e.preventDefault();
                this.phoneMinFileEditorDialog();
            // 运行当前 ctrl+1
            }else if(e.ctrlKey && (e.keyCode === 49 || e.keyCode === 97)){
                e.stopPropagation();
                e.preventDefault();
                this.phoneRunScriptByDialog();
            // 停止全部 ctrl+2
            }else if(e.ctrlKey && (e.keyCode === 50 || e.keyCode === 98)){
                e.stopPropagation();
                e.preventDefault();
                this.phoneStopAllScript();
            // 切换tab ctrl + 0
            }else if(e.ctrlKey && (e.keyCode === 48 || e.keyCode === 96)){
                e.stopPropagation();
                e.preventDefault();
                let length = this.phoneFileCacheArr.length;
                if(this.phoneFileSelectIndex ===  length - 1){
                    this.phoneFileSelectIndex = 0
                } else {
                    this.phoneFileSelectIndex = this.phoneFileSelectIndex+1;
                }
                this.phoneFileEditorArrClick(this.phoneFileSelectIndex);
            }
        },
        // 打包项目
        phonePackageProject(){
            if(!this.phoneCurPathExitProject){
                window.ZXW_VUE.$confirm('未检测到project.json,是否需要在当前目录生成文件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    // 将json写入本地文件
                    let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
                    let jsonObj = JSON.parse(JSON.stringify(defaultProjectJSON));
                    // 默认项目名称
                    jsonObj.name = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].label || "";
                    let targetPath = toPath + "/project.json";
                    let remoteScript = `let writableTextFile = files.write('${targetPath}',decodeURI($base64.decode('${btoa(encodeURI(JSON.stringify(jsonObj,"","\t")))}')));`;
                    this.remoteExecuteScript(remoteScript);
                    // 刷新手机目录
                    this.refreshPhoneDir();
                });
                return;
            }
            // 读取当前目录project.json文件
            this.getPhoneProjectJson((projectJson)=>{
                if(!projectJson){
                    window.ZXW_VUE.$message.warning('未检测到project.json');
                } else {
                    this.projectJsonObj = JSON.parse(projectJson);
                    // 打开弹窗
                    this.packageProjectDialog = true;
                    // 关闭loading
                    this.packageProjectStepLoading = false;
                    // 重置步骤
                    this.packageProjectActive = 0;
                    // 初始化配置
                    this.initProjectJsonFun();
                    // 加载自定义签名数组
                    this.loadCustomSignDict();
                }
            })
        },
        // 下一步
        nextSteps(){
            // 第一步
            if(this.packageProjectActive === 0){
                // 校验配置表单
                this.$refs["packageProjectFirst"].validate((valid) => {
                    if (valid) {
                        // 校验通过调用保存配置方法
                        this.saveProjectJsonFun();
                        this.packageProjectActive++;
                    } else {
                        window.ZXW_VUE.$message.warning('请将信息补充完整！');
                    }
                });
            // 第二步
            } else if(this.packageProjectActive === 1){
                if(this.alreadyInitPackageTemplate){
                    this.packageProjectActive++;
                } else {
                    window.ZXW_VUE.$message.warning('请先初始化打包模板！');
                }
            // 第三步
            } else if(this.packageProjectActive === 2){
                if(this.alreadyUploadProjectRes){
                    this.packageProjectActive++;
                } else {
                    window.ZXW_VUE.$message.warning('请先上传项目资源！');
                }
            // 第四步
            } else if(this.packageProjectActive === 3){
                if(this.alreadyHandlerPackageRes){
                    this.packageProjectActive++;
                } else {
                    window.ZXW_VUE.$message.warning('请先处理打包资源！');
                }
            }
        },
        // 上一步
        preSteps(){
            this.packageProjectActive--;
        },
        // 加载自定义签名字典
        loadCustomSignDict(){
            let _that = this;
            this.keyStoreArr = [];
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                data: {
                    "relativeFilePath": 'webCommonPath' + '/' + 'apkPackage' + '/' + 'apkTool'
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                           if(data.data){
                               // 全部的证书数组
                               _that.keyStoreArr = data.data.filter(item=>item.fileType === "keystore").map(item=> item.fileName + "." + item.fileType);
                           }
                        }
                    }
                },
                error: function (msg) {
                }
            });

        },
        // 根据路径检查icon图
        checkIconByPath(iconPath,callback){
            if(!iconPath){
                if(callback){
                    callback()
                }
                return;
            }
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            let targetPath = toPath + "/" + iconPath;
            // 关键key
            let dirPathKey = this.deviceInfo.deviceUuid + '_' + targetPath;
            // 更新手机端目录缓存
            let updatePhoneDirCacheFun = () => {
                // 远程执行脚本内容
                let remoteScript = `let result = '';
                let bytes = files.readBytes('${targetPath}');
                let image = images.read('${targetPath}');
                result = images.toBase64(image, "png", 1);
                image.recycle();
                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileMap', {
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
            }, 200, 10,(cacheResultData)=>{
                if(callback){
                    callback(cacheResultData)
                }
            });
        },
        // 根据路径加载icon图
        previewIconByPath(iconPath,type){
            if(!iconPath){
                return;
            }
            if(type === 'appIcon'){
                this.appIconLoading = true;
            } else if(type === 'splashIcon'){
                this.splashIconLoading = true;
            }
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            let targetPath = toPath + "/" + iconPath;
            // 关键key
            let dirPathKey = this.deviceInfo.deviceUuid + '_' + targetPath;
            // 更新手机端目录缓存
            let updatePhoneDirCacheFun = () => {
                // 远程执行脚本内容
                let remoteScript = `let result = '';
                let bytes = files.readBytes('${targetPath}');
                let image = images.read('${targetPath}');
                result = images.toBase64(image, "png", 100);
                image.recycle();
                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileMap', {
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
            }, 200, 20,(cacheResultData)=>{
                if(type === 'appIcon'){
                    this.appIconLoading = false;
                } else if(type === 'splashIcon'){
                    this.splashIconLoading = false;
                }
                if(cacheResultData){
                    let fileContent = '';
                    this.phoneFileEditorName = '';
                    this.phoneImageBase64 = '';
                    this.phoneImagePreviewVisible = true;
                    this.phoneFileEditorName = iconPath;
                    this.phoneImageBase64 = 'data:image/png;base64,' + cacheResultData;
                    this.phoneFileLoading = false;
                } else {
                    window.ZXW_VUE.$message.error({message: "未找到图片", duration: '1000'});
                }
            });
        },
        // 打包须知
        phonePackageProjectTips(){
            let tipsHtml = `
            <div>
                1、打包功能需要购买打包插件后才能使用,请点击顶部打包插件下载查看。<br/>
                2、打包功能需要依赖打包插件,请先初始化插件,具体见公共文件模块。<br/>
                3、打包功能需要机器码授权后才能使用,请购买插件后联系管理员。<br/>
                4、打包功能需要JAVA环境支持,请在公共文件模块设置。<br/>
                5、打包功能需要依赖自定义签名,请在公共文件模块设置。<br/>
                6、打包功能暂不支持直接使用安卓资源的项目。<br/>
                7、打包过程中,若在第一步更改了项目配置或者修改了项目文件,如果需要再次打包,建议每步骤都执行一遍,保证资源更新。<br/>
                8、打包过程中,设置了自定义应用图标和启动界面图标,如果打包报错,可以重新传一个图片后再次尝试,或者修改其后缀名为jpg或者png。<br/>
                9、如有其他问题请在QQ群：806074622中反馈。</div>
            `;
            this.$msgbox({
                title: '打包须知',
                dangerouslyUseHTMLString: true,
                customClass:"messageTipsClass",
                message: tipsHtml,
                confirmButtonText: '确定'
            }).then(action => {
            });
        },
        // 保存初始化配置参数
        saveProjectJsonFun(){
            // 获取临时缓存变量
            let saveProjectJsonObj = JSON.parse(JSON.stringify(this.projectJsonObj));
            saveProjectJsonObj.name = (this.packageProject.appName||"").trim();
            saveProjectJsonObj.packageName = (this.packageProject.packageName||"").trim();
            saveProjectJsonObj.versionName = (this.packageProject.versionName||"").trim();
            saveProjectJsonObj.versionCode = String(this.packageProject.versionCode||"").trim();
            saveProjectJsonObj.icon = (this.packageProject.appIcon||"").trim();
            // NodeJs环境判断
            if(!saveProjectJsonObj.features){
                saveProjectJsonObj.features = {};
            }
            saveProjectJsonObj.features.nodejs = this.packageProject.openNodeJs ? "enabled" : "disabled";

            // 图色模块判断
            if(!saveProjectJsonObj.optimization) {
                saveProjectJsonObj.optimization = {}
            }
            saveProjectJsonObj.optimization.removeOpenCv = !this.packageProject.openImageModule;

            // 开机自启动
            saveProjectJsonObj.autoOpen = this.packageProject.autoOpen;

            let pluginsMap = {
                "org.autojs.autojspro.plugin.mlkit.ocr": "1.1",
                "org.autojs.autojspro.ocr.v2":"1.3",
                "com.tomato.ocr":"1.0",
                "com.hraps.ocr32":"1.0",
                "com.hraps.ocr":"2.0.0",
                "cn.lzx284.p7zip":"1.2.1",
                "com.hraps.pytorch":"1.0",
                "org.autojs.plugin.ffmpeg":"1.1"
            };
            let plugins = saveProjectJsonObj.plugins || {};
            Object.keys(plugins).forEach(key=>{
                if(this.packageProject.plugins.includes(key)){
                    plugins[key] = pluginsMap[key];
                } else{
                     delete plugins [key];
                }
            });
            this.packageProject.plugins.forEach(key=>{
                plugins[key] = pluginsMap[key];
            });
            saveProjectJsonObj.plugins = plugins;

            saveProjectJsonObj.abis = this.packageProject.abis || [];

            if(!saveProjectJsonObj.launchConfig){
                saveProjectJsonObj.launchConfig = {};
            }
            saveProjectJsonObj.launchConfig.hideLogs = this.packageProject.hideLogs;
            saveProjectJsonObj.launchConfig.splashText = this.packageProject.splashText;
            saveProjectJsonObj.launchConfig.splashIcon = this.packageProject.splashIcon;

            if(!saveProjectJsonObj.signingConfig){
                saveProjectJsonObj.signingConfig = {};
            }
            saveProjectJsonObj.signingConfig.keystore = this.packageProject.customSignStorePath;
            saveProjectJsonObj.openObfuscator = this.packageProject.openObfuscator;
            saveProjectJsonObj.obfuscatorIncludePaths = this.packageProject.obfuscatorIncludePaths;
            // 将json写入本地文件
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            let targetPath = toPath + "/project.json";
            let remoteScript = `let writableTextFile = files.write('${targetPath}',decodeURI($base64.decode('${btoa(encodeURI(JSON.stringify(saveProjectJsonObj,"","\t")))}')));`;
            this.remoteExecuteScript(remoteScript);
        },
        // 初始化配置参数
        initProjectJsonFun(){
            // 初始化配置参数
            this.packageProject.appName = this.projectJsonObj.name;
            this.packageProject.packageName = this.projectJsonObj.packageName;
            this.packageProject.versionName = this.projectJsonObj.versionName;
            this.packageProject.versionCode = String(this.projectJsonObj.versionCode);
            this.packageProject.appIcon = this.projectJsonObj.icon;
                // 开机自启动
            this.packageProject.autoOpen = this.projectJsonObj.autoOpen;

            // NodeJs环境判断
            let features = this.projectJsonObj.features;
            this.packageProject.openNodeJs = features && features.nodejs === "enabled";

            // 图色模块判断
            let optimization = this.projectJsonObj.optimization;
            this.packageProject.openImageModule = true;
            if(optimization){
                this.packageProject.openImageModule = !optimization.removeOpenCv;
            }

            // 插件列表读取
            let pluginsKeys = Object.keys(this.projectJsonObj.plugins || []);
            this.packageProject.plugins = pluginsKeys;

            this.packageProject.abis = this.projectJsonObj.abis || [];

            let launchConfig = this.projectJsonObj.launchConfig ? this.projectJsonObj.launchConfig : {};

            this.packageProject.hideLogs = launchConfig.hideLogs !=null ? launchConfig.hideLogs : true;
            this.packageProject.splashText = launchConfig.splashText || "";
            this.packageProject.splashIcon = launchConfig.splashIcon || "";
            this.packageProject.openObfuscator = this.projectJsonObj.openObfuscator;
            this.packageProject.obfuscatorIncludePaths = this.projectJsonObj.obfuscatorIncludePaths;
            let signingConfig = this.projectJsonObj.signingConfig;
            // 自定义签名处理
            this.packageProject.customSignStorePath = signingConfig ? signingConfig.keystore : "";
        },
        // 获取手机端项目json
        getPhoneProjectJson(callback){
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            let targetPath = toPath + "/project.json";
            // 关键key
            let dirPathKey = this.deviceInfo.deviceUuid + '_' + targetPath;
            // 更新手机端目录缓存
            let updatePhoneDirCacheFun = () => {
                // 远程执行脚本内容
                let remoteScript = `let result = '';
                let text = files.read('${targetPath}');
                result = $base64.encode(encodeURI(text));
                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileMap', {
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
                let fileContent = cacheResultData ? decodeURI(atob(cacheResultData)) : '';
                if(callback){
                    callback(fileContent);
                }
            });
        },
        oneKeyPackage(){
            // 开启一键打包标志
            this.oneKeyPackageFlag = true;

            // 第一步 先校验配置表单
            this.$refs["packageProjectFirst"].validate((valid) => {
                if (valid) {
                    // 校验通过调用保存配置方法
                    this.saveProjectJsonFun();
                    this.packageProjectActive++;
                    this.$forceUpdate();
                } else {
                    window.ZXW_VUE.$message.warning('请将信息补充完整！');
                    this.oneKeyPackageFlag = false;
                }
            });
            if(!this.oneKeyPackageFlag){
                return;
            }
            this.packageProjectStepLoading = true;
            // 第二步  执行初始化打包模板
            this.initPackageTemplate(()=>{
                // 成功进行下一步
                if(this.alreadyInitPackageTemplate){
                    this.packageProjectActive++;
                    this.$forceUpdate();
                } else {
                    // 失败撤回第一步
                    this.packageProjectActive = 0;
                    this.oneKeyPackageFlag = false;
                    this.packageProjectStepLoading = false;
                    return;
                }

                // 关闭公共方法
                let closeCommonFun = ()=>{
                    this.packageProjectStepLoading = false;
                    this.oneKeyPackageFlag = false;
                };

                // 第三步  上传项目资源
                this.uploadProjectRes(()=>{
                    // 成功进行下一步
                    if(this.alreadyUploadProjectRes){
                        this.packageProjectActive++;
                        this.$forceUpdate();
                    } else {
                        // 失败撤回第一步
                        this.packageProjectActive = 0;
                        closeCommonFun();
                        return;
                    }

                    // 第四步 处理打包资源
                    this.handlerPackageRes(()=>{
                        // 成功进行下一步
                        if(this.alreadyHandlerPackageRes){
                            this.packageProjectActive++;
                            this.$forceUpdate();
                        } else {
                            // 失败撤回第一步
                            this.packageProjectActive = 0;
                            closeCommonFun();
                            return;
                        }

                        // 第五步 执行打包操作
                        this.handlerPackageProject(()=>{
                            // 成功进行下一步
                            if(!this.alreadyCompletePackageProject){
                                // 失败撤回第一步
                                this.packageProjectActive = 0;
                                closeCommonFun();
                                return;
                            }
                            closeCommonFun();
                        });
                    });
                },()=>{
                    closeCommonFun();
                });
            });

        },
        // 检测web端打包模板
        checkWebPackageTemplate(){
            let exits = false;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "relativeFilePath": this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" + this.packageProject.appName
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data && data.data.length){
                                exits = true;
                            }
                        }
                    }
                },
                error: function (msg) {
                }
            });
            return exits;
        },
        // 初始化打包模板
        initPackageTemplate(callback){
            let _that = this;
            this.packageProjectStepLoading = true;
            $.ajax({
                url: getContext() + "/attachmentInfo/initPackageTemplateNew",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "webProjectRootPath": this.absolutePrePath + this.deviceInfo.deviceUuid + "/" + "apkPackage",
                    "webProjectName": this.packageProject.appName,
                    "resetPackage": this.oneKeyPackageFlag ? "" : "true"
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            _that.alreadyInitPackageTemplate = data.data;
                            _that.packageProjectStepLoading = false;
                            window.ZXW_VUE.$notify.success({message: '初始化完成', duration: '1000'});
                        } else {
                            _that.packageProjectStepLoading = false;
                            window.ZXW_VUE.$message.warning(data.msg);
                        }
                    } else {
                        _that.packageProjectStepLoading = false;
                    }
                    if(callback){
                        callback();
                    }
                },
                error: function (msg) {
                    _that.packageProjectStepLoading = false;
                    if(callback){
                        callback();
                    }
                }
            });
        },
        // 检测web端项目资源
        checkProjectRes(){
            let exits = false;
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "relativeFilePath": this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/"
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data){
                                let dataArr = data.data.filter(item=> item.pathName.indexOf(_that.packageProject.appName + "_projectRes.zip") !== -1);
                                exits = dataArr.length > 0;
                            }
                        }
                    }
                },
                error: function (msg) {
                }
            });
            return exits;
        },
        // 上传项目资源
        uploadProjectRes(callback,timeOutCallback){
            this.packageProjectStepLoading = true;
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            toPath = toPath.replace(/\/$/, "");
            let phoneZipPath =  toPath.substring(0,toPath.lastIndexOf("/")+1) + this.packageProject.appName + '.zip';
            let relativeFilePath = this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" +this.packageProject.appName + "_projectRes.zip";
            // 文件内容变化后处理函数
            handlerByFileChange(relativeFilePath,()=>{
                let remoteScript = `
                files.remove('${phoneZipPath}')
                $zip.zipDir('${toPath}', '${phoneZipPath}')
                utilsObj.uploadFileToServer('${phoneZipPath}','${relativeFilePath}',()=>{});
                `;
                // 删除本地压缩文件-压缩目标文件夹-上传web端
                this.remoteExecuteScript(remoteScript);
            },()=>{
                this.packageProjectStepLoading = false;
                this.alreadyUploadProjectRes = true;
                if(callback){
                    callback();
                }
            },()=>{
                if(timeOutCallback){
                    timeOutCallback();
                }
            });
        },
        // 检测打包资源处理状态
        checkPackageResHandlerStatus(){
            let exits = false;
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "relativeFilePath": this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" + this.packageProject.appName
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data){
                                let dataArr = data.data.filter(item=> item.pathName.indexOf("packageResAlreadyHandler") !== -1);
                                exits = dataArr.length > 0;
                            }
                        }
                    }
                },
                error: function (msg) {
                }
            });
            return exits;
        },
        // 处理打包资源
        handlerPackageRes(callback){
            this.packageProjectStepLoading = true;
            // 调用接口
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/handlerPackageProjectRes",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "webProjectRootPath": this.absolutePrePath + this.deviceInfo.deviceUuid + "/" + "apkPackage",
                    "webProjectName": this.packageProject.appName,
                    "appName":this.packageProject.appName,
                    "packageName":this.packageProject.packageName,
                    "versionName":this.packageProject.versionName,
                    "versionCode":this.packageProject.versionCode,
                    "appIcon":this.packageProject.appIcon,
                    "openNodeJs":this.packageProject.openNodeJs,
                    "openImageModule":this.packageProject.openImageModule,
                    "autoOpen":this.packageProject.autoOpen,
                    "plugins":this.packageProject.plugins.join(','),
                    "abis":this.packageProject.abis.join(','),
                    "hideLogs":this.packageProject.hideLogs,
                    "splashText":this.packageProject.splashText,
                    "splashIcon":this.packageProject.splashIcon,
                    "customSignAlias":"",
                    "resPathName": this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].label || "",
                    "openObfuscator": this.packageProject.openObfuscator,
                    "obfuscatorIncludePaths": this.packageProject.obfuscatorIncludePaths
                }),
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            _that.alreadyHandlerPackageRes = true;
                            let messageInfo  = "【混淆代码可能出现错误】\r\n" +
                                "【请检查js代码中ui部分代码是否未使用``,或者是否存在其他不严谨语法】\r\n" +
                                "【无需混淆的第三方代码可以设置路径进行排除】\r\n" +
                                "【具体错误】:\r\n"+data.data;
                            console.log(messageInfo);
                            if(data.data && (data.data.indexOf("命令执行有错误")!==-1 || data.data.indexOf("throw new Error")!==-1  )){
                                _that.alreadyHandlerPackageRes = false;
                                window.ZXW_VUE.$message.error({
                                    message: messageInfo,
                                    duration: '2000'
                                });
                            } else if(_that.packageProject.openObfuscator){
                                window.ZXW_VUE.$message.warning({
                                    message: "当前开启了js混淆,可下载js项目检查混淆结果,如果混淆未成功可按F12查看日志",
                                    duration: '3000'
                                });
                            }
                        } else {
                            _that.alreadyHandlerPackageRes = false;
                            console.log(data.msg);
                            window.ZXW_VUE.$message.error(data.msg);
                        }
                    }
                    _that.packageProjectStepLoading = false;
                    if(callback){
                        callback();
                    }
                },
                error: function (msg) {
                    _that.packageProjectStepLoading = false;
                    if(callback){
                        callback();
                    }
                }
            });

        },
        // 检测打包项目
        checkPackageProject(){
            let exits = false;
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "relativeFilePath": this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/"
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data){
                                let dataArr = data.data.filter(item=> item.pathName.indexOf(_that.packageProject.appName + ".apk") !== -1);
                                exits = dataArr.length > 0;
                            }
                        }
                    }
                },
                error: function (msg) {
                }
            });
            return exits;
        },
        // 获取JavaHome
        getJavaHome(){
            let JAVA_HOME = '';
            let _that = this;
            $.ajax({
                url: getContext() + '/uploadPath/autoJsTools/' + 'webCommonPath' + '/' + 'apkPackage' + '/' + 'apkTool' + '/' + 'JAVA_HOME.json',
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
        // 获取证书信息
        getKeyStoreObjBySelect(){
            let keyStoreObj = {};
            let _that = this;
            let keyStoreFilePath = this.packageProject.customSignStorePath;
            keyStoreFilePath = keyStoreFilePath.replace(".keystore","");
            $.ajax({
                url: getContext() + '/uploadPath/autoJsTools/' + 'webCommonPath' + '/' + 'apkPackage' + '/' + 'apkTool' + '/' + keyStoreFilePath + '.json',
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    let string = String(res);
                    if(string){
                        keyStoreObj = JSON.parse(string);
                    }
                },
                error: function (msg) {
                }
            });
            return keyStoreObj;
        },
        // 处理打包项目
        handlerPackageProject(callback){
            let _that = this;
            this.packageProjectStepLoading = true;
            // 获取javaHome
            let javaHome = this.getJavaHome();
            // 获取选择证书
            let keyStoreObj = this.getKeyStoreObjBySelect();
            if(!keyStoreObj || !Object.keys(keyStoreObj).length){
                window.ZXW_VUE.$message.warning('未找到签名配置,请先到公共文件生成签名');
                this.packageProjectStepLoading = false;
                if(callback){
                    callback();
                }
                return;
            }
            $.ajax({
                url: getContext() + "/attachmentInfo/packageProject",
                type: "GET",
                dataType: "json",
                data: {
                    "javaHome":javaHome,
                    "webProjectRootPath": this.absolutePrePath + this.deviceInfo.deviceUuid + "/" + "apkPackage",
                    "webProjectName": this.packageProject.appName,
                    "keyStoreFile": keyStoreObj ? keyStoreObj["keyStoreFile"] : "",
                    "keyStoreAlias":keyStoreObj ? keyStoreObj["keyStoreAlias"] : "",
                    "keyStorePwd":keyStoreObj ? keyStoreObj["keyStorePwd"] : "",
                    "keyStoreAliasPwd":keyStoreObj ? keyStoreObj["keyStoreAliasPwd"] : ""
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            let message = data.data;
                            console.log(message);
                            _that.alreadyCompletePackageProject = _that.checkPackageProject();
                            _that.packageProjectStepLoading = false;
                            if(_that.alreadyCompletePackageProject){
                                window.ZXW_VUE.$notify.success({message: '打包成功', duration: '1000'});
                            } else {
                                window.ZXW_VUE.$message.error({message: message, duration: '3000'});
                            }
                        } else {
                            _that.packageProjectStepLoading = false;
                            window.ZXW_VUE.$message.warning(data.msg);
                        }
                    } else {
                        _that.packageProjectStepLoading = false;
                    }
                    if(callback){
                        callback();
                    }
                },
                error: function (msg) {
                    _that.packageProjectStepLoading = false;
                    if(callback){
                        callback();
                    }
                }
            });
        },
        // 下载打包后的文件
        downloadPackageProject(){
            if(!this.alreadyCompletePackageProject){
                window.ZXW_VUE.$message.warning('请先打包项目！');
                return;
            }
            // 创建a标签，通过a标签实现下载
            const dom = document.createElement("a");
            dom.href = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" + this.packageProject.appName + ".apk";
            console.log(dom.href);
            dom.id = "upload-file-dom";
            dom.style.display = "none";
            document.body.appendChild(dom);
            // 触发点击事件
            dom.click();
            document.getElementById("upload-file-dom")?.remove();
        },
        // 直接下载混淆项目
        downloadObscureProject(){
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            toPath = toPath.substring(0,toPath.length - 1);
            toPath = toPath.replace("/sdcard","");
            let downloadFilUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" + this.packageProject.appName + "_projectOut.zip?t="+(new Date().getTime());
            // 创建a标签，通过a标签实现下载
            const dom = document.createElement("a");
            dom.href = downloadFilUrl;
            console.log(dom.href);
            dom.id = "upload-file-dom";
            dom.style.display = "none";
            document.body.appendChild(dom);
            // 触发点击事件
            dom.click();
            document.getElementById("upload-file-dom")?.remove();
        },
        // 下载混淆项目到手机
        downloadObscureProjectToPhone(){
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            toPath = toPath.substring(0,toPath.length - 1);
            toPath = toPath.replace("/sdcard","");
            let localFileUrl = toPath + "_projectOut.zip";
            let downloadFilUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" + this.packageProject.appName + "_projectOut.zip?t="+(new Date().getTime());
            // 创建目录代码 如果不是/ 则需要创建目录
            let script =  "utilsObj.downLoadFile('"+downloadFilUrl+"','"+localFileUrl+"',()=>{toastLog('下载完成')});";
            this.remoteExecuteScript(script);
            window.ZXW_VUE.$message.info({
                message: "请注意查看手机端下载提示！！！",
                duration: '2000'
            });
        },
        // 下载项目到手机
        downloadPackageProjectToPhone(){
            if(!this.alreadyCompletePackageProject){
                window.ZXW_VUE.$message.warning('请先打包项目！');
                return;
            }
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            toPath = toPath.substring(0,toPath.length - 1);
            let localFileUrl = this.packageProject.appName + ".apk";
            let downloadFilUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/" + "apkPackage" + "/" + this.packageProject.appName + ".apk";

            let message = "安装包下载路径为：/sdcard/"+localFileUrl+",请查看!";
            // 创建目录代码 如果不是/ 则需要创建目录
            let script =  "utilsObj.downLoadFile('"+downloadFilUrl+"','"+localFileUrl+"',()=>{app.viewFile('/sdcard/"+localFileUrl+"');});";
            this.remoteExecuteScript(script);
            window.ZXW_VUE.$message.info({
                message: message,
                duration: '2000'
            });
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
        // 手机端下载目录
        phoneDownLoadDirectory(row){
            this.phoneFileLoading = true;
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            let phoneZipPath = toPath + row.fileName + '.zip';
            let relativeFilePath = this.deviceInfo.deviceUuid  + '/tempPhoneDownLoad/' + row.fileName + '.zip';
            row.previewUrl = '/uploadPath/autoJsTools/'+relativeFilePath;
            row.fileType = 'zip';
            // 文件内容变化后处理函数
            handlerByFileChange(relativeFilePath,()=>{
                let remoteScript = `
                files.remove('${phoneZipPath}')
                $zip.zipDir('${row.pathName}', '${phoneZipPath}')
                utilsObj.uploadFileToServer('${phoneZipPath}','${relativeFilePath}',()=>{});
                `;
                // 删除本地压缩文件-压缩目标文件夹-上传web端
                this.remoteExecuteScript(remoteScript);
            },()=>{
                this.phoneFileLoading = false;
                this.downloadFile(row)
            });
        },
        // 手机端运行选中脚本 弹窗
        phoneRunScriptByDialog(){
            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
            let savePath = fileObj.fileSavePath;
            if(!savePath){
                return;
            }
            let parentSavePath = savePath.substring(0,savePath.lastIndexOf('/'));
            let remoteScript = `engines.execScriptFile("${savePath}",{path:["${parentSavePath}"]})`;
            this.remoteExecuteScript(remoteScript);
        },
        // 手机端停止全部脚本
        phoneStopAllScript(){
            this.phoneRemoteStopScript();
        },
        // 手机端运行文件
        phoneRunScriptPath(row){
            window.ZXW_VUE.$confirm('是否确认在手机端运行脚本【' + row.pathName + '】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let remoteScript = `engines.execScriptFile("${row.pathName}",{path:["${row.parentPathName}"]})`;
                this.remoteExecuteScript(remoteScript);
            });
        },
        // 手机端下载文件
        phoneDownLoadFile(row){
            this.phoneFileLoading = true;
            let toPath = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            let phonePath = toPath + row.fileName + '.' + row.fileType;
            let relativeFilePath = this.deviceInfo.deviceUuid  + '/tempPhoneDownLoad/' + row.fileName + '.' +row.fileType;
            row.previewUrl = '/uploadPath/autoJsTools/'+relativeFilePath;
            // 文件内容变化后处理函数
            handlerByFileChange(relativeFilePath,()=>{
                let remoteScript = `
                utilsObj.uploadFileToServer('${phonePath}','${relativeFilePath}',()=>{});
                `;
                // 上传web端
                this.remoteExecuteScript(remoteScript);
            },()=>{
                this.phoneFileLoading = false;
                this.downloadFile(row)
            });
        },
        // 手机端js转dex功能
        phoneJs2Dex(){
            if(!this.phoneCurPathExitProject){
                return;
            }
            let row = {};
            row.pathName = this.phoneBreadcrumbList[this.phoneBreadcrumbList.length - 1].value;
            row.pathName = row.pathName.substring(0, row.pathName.length - 1);

            let execFun = ()=>{
            let remoteScript =
            `try {
                importClass(java.io.RandomAccessFile);
                importClass(java.io.BufferedInputStream);
                importClass(java.io.BufferedOutputStream);
                importClass(java.io.File);
                importClass(java.io.FileInputStream);
                importClass(java.io.FileNotFoundException);
                importClass(java.io.FileOutputStream);
                importClass(java.io.IOException);
                importClass(java.io.InputStream);
                importClass(java.io.OutputStream);
            } catch (e) {}
            
            function getDir(filePath) {
                let arr = filePath.split("/");
                arr.splice(-1, 1);
                return arr.join("/");
            }
            
            function getFileName(filePath) {
                return files.getNameWithoutExtension(filePath);
            }
            
            function isUI(filePath) {
                let fileContent = files.read(filePath);
                if (fileContent.match(/"ui";|'ui';/)) {
                    return true;
                } else {
                    return false;
                }
            }
            
            function rewriteJsFile(jsFilePath, projectDir) {
                let template = getTemplate(jsFilePath, projectDir);
                if (isUI(jsFilePath)) {
                    template = '"ui";\\n' + template;
                }
                files.write(jsFilePath, template);
            }
            
            function getTemplate(jsFilePath, projectDir) {
                let dir = getDir(jsFilePath);
            
                let relativePath = jsFilePath.replace(projectDir, "").substr(1);
                let sourceFileName = getFileName(jsFilePath);
                let arr = relativePath.split("/");
                arr.splice(-1, 1);
                let fileName = (arr && arr.length ? arr.join("_") + "_" : "") + sourceFileName;
                if (fileName.indexOf("-") !== -1) {
                    fileName = fileName.replace(/-/g, "").replace(/@/, "")
                }
                let arr2 = relativePath.split("/");
                arr2.splice(-1, 1);
                let relativePathFileName = (arr2 && arr2.length ? arr2.join("/") + "/" : "") + fileName;
                return (
                    'let dexFilePath = "' +
                    relativePathFileName +
                    '" + ".dex";\\nruntime.unloadDex(dexFilePath);\\nruntime.loadDex(dexFilePath);\\nnew Packages["' +
                    fileName +
                    '"]()();'
                );
            }
            
            
            function js2class(jsFilePath) {
                if (!files.exists(jsFilePath)) {
                    throw new Error("文件不存在: " + jsFilePath);
                }
                if (files.getExtension(jsFilePath) !== "js") {
                    throw new Error("不是js文件: " + jsFilePath);
                }
            
                // class文件所在文件夹
                let dir = getDir(jsFilePath);
                // let fileName = getFileName(jsFilePath);
                let sourceFileName = getFileName(jsFilePath);
                let relativePath = jsFilePath.replace(projectDir, "").substr(1);
                let arr = relativePath.split("/");
                arr.splice(-1, 1);
                let fileName = (arr && arr.length ? arr.join("_") + "_" : "") + sourceFileName;
            
                if (fileName.indexOf("-") !== -1) {
                    fileName = fileName.replace(/-/g, "").replace(/@/, "")
                }
                let args = ["-version", "200", "-opt", "1", "-encoding", "UTF-8", "-nosource", "-o", fileName, "-d", dir, jsFilePath];
                org.mozilla.javascript.tools.jsc.Main.main(args);
                let classFilePath = files.join(dir, fileName + ".class");
                return classFilePath;
            }
            
            
            function zipFile(classFilePath, jarFilePath) {
                jarFilePath = new java.io.File(jarFilePath);
                jarFilePath.delete();
                var mArrayList = new java.util.ArrayList();
                mArrayList.add(new java.io.File(classFilePath));
                new net.lingala.zip4j.core.ZipFile(jarFilePath).addFiles(mArrayList, new net.lingala.zip4j.model.ZipParameters());
                return jarFilePath;
            }
            
            function class2jar(classFilePath) {
                if (!files.exists(classFilePath)) {
                    throw new Error("文件不存在: " + classFilePath);
                }
                if (files.getExtension(classFilePath) !== "class") {
                    throw new Error("不是class文件: " + classFilePath);
                }
            
                let dir = getDir(classFilePath);
                let fileName = getFileName(classFilePath);
                var jarFilePath = dir + "/" + fileName + ".jar";
                zipFile(classFilePath, jarFilePath);
            
                return jarFilePath;
            }
            
            function removeIntermediateFile(dexFilePath) {
                let dir = getDir(dexFilePath);
                let fileName = getFileName(dexFilePath);
                files.remove(files.join(dir, fileName + ".class"));
                files.remove(files.join(dir, fileName + ".jar"));
            }
            
            
            
            function jar2dex(jarFilePath) {
                if (!files.exists(jarFilePath)) {
                    throw new Error("文件不存在: " + jarFilePath);
                }
                if (files.getExtension(jarFilePath) !== "jar") {
                    throw new Error("不是jar文件: " + jarFilePath);
                }
            
                let dir = getDir(jarFilePath);
                let fileName = getFileName(jarFilePath);
                var dexFilePath = dir + "/" + fileName + ".dex";
                Main.main(["--dex", "--output=" + dexFilePath, jarFilePath]);
                removeIntermediateFile(dexFilePath);
                return dexFilePath;
            }
            
            
            function changeJsFileToDexFile(jsFilePath) {
                let classFilePath = js2class(jsFilePath);
                let jarFilePath = class2jar(classFilePath);
                let dexFilePath = jar2dex(jarFilePath);
                rewriteJsFile(jsFilePath, projectDir);
                return dexFilePath;
            }
            
            function getFilePathList(dirPath, filePathList) {
                filePathList = filePathList || [];
                var fileNameList = files.listDir(dirPath);
                var len = fileNameList.length;
                for (var i = 0; i < len; i++) {
                    let filepath = files.join(dirPath, fileNameList[i]);
                    if (files.isFile(filepath)) {
                        filePathList.push(filepath);
                    } else {
                        // 文件夹, 继续向下递
                        getFilePathList(filepath, filePathList);
                    }
                }
                // 文件遍历完成, 终止条件, 返回结果
                return filePathList;
            }
            
            
            function getJsFilePathList(dirPath, filePathList) {
                filePathList = filePathList || [];
                var fileNameList = files.listDir(dirPath);
                var len = fileNameList.length;
                for (var i = 0; i < len; i++) {
                    let filepath = files.join(dirPath, fileNameList[i]);
                    if (files.isFile(filepath) && files.getExtension(filepath) === "js") {
                        filePathList.push(filepath);
                    } else {
                        // 文件夹, 继续向下递
                        getJsFilePathList(filepath, filePathList);
                    }
                }
                // 文件遍历完成, 终止条件, 返回结果
                return filePathList;
            }
            
            function getTime(time, rule) {
                rule = rule || "yyyy-MM-dd HH:mm:ss";
                if (time) {
                    return new java.text.SimpleDateFormat(rule).format(new Date(time));
                } else {
                    return new java.text.SimpleDateFormat(rule).format(new Date());
                }
            }
            
            function backupProject(projectDir) {
                let filePathList = getFilePathList(projectDir);
                let time = getTime(time, "yyyyMMdd_HHmmss");
                let newProjectDir = projectDir + "_bak_" + time + "/";
                //let newProjectDir = projectDir + "_bak" + "/";
                files.create(newProjectDir);
                filePathList.map((fromPath) => {
                    let toPath = fromPath.replace(projectDir, newProjectDir);
                    files.copy(fromPath, toPath);
                });
                console.log("备份项目完成【"+newProjectDir+"】")
            }
            
            let projectDir = '${row.pathName}';
            
            let execFun = ()=>{
                backupProject(projectDir);
                let excludesPath = '${row.excluedPath}'.split(',') || []
                console.log("排除无需转换路径【"+excludesPath+"】");
                let jsFilePathList = getJsFilePathList(projectDir);
                jsFilePathList.map((filepath) => {
                    let arr = excludesPath.filter(item=>{
                        return item && filepath.indexOf(item)!==-1;
                    });
                    if(arr.length>0){
                        return;
                    }
                    console.log("执行js文件转换【"+filepath+"】");
                    try {
                        changeJsFileToDexFile(filepath);
                    } catch (e) {
                        console.error(e)
                    }
                });
                toastLog("转换完成");
            }
            try{
                let dexFilePath = "/sdcard/appSync/dx.dex";
                // 如果不存在
                if(!files.exists(dexFilePath)){
                    console.log("开始下载dx依赖");
                    // 执行下载
                    utilsObj.downLoadFile("${getContext()}/dx.dex","appSync/dx.dex",()=>{
                        console.log("下载dx依赖完成");
                        runtime.loadDex(dexFilePath);
                        importClass(com.android.dx.command.Main);
                        execFun();
                    });
                } else {
                    console.log("已有dx依赖");
                    runtime.loadDex(dexFilePath);
                    importClass(com.android.dx.command.Main);
                    execFun();
                }
            }catch(e){
                console.error(e);
            }
            
            `;
            this.remoteExecuteScript(remoteScript);
            };

            window.ZXW_VUE.$confirm('是否确认将【'+row.pathName+'】的js转换为dex？原项目将会自动备份【如需设置排除路径,请修改project.json的obfuscatorIncludePaths值】', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                // 读取当前目录project.json文件
                this.getPhoneProjectJson((projectJson)=>{
                    if(!projectJson){
                        window.ZXW_VUE.$message.warning('未检测到project.json');
                    } else {
                        this.projectJsonObj = JSON.parse(projectJson);
                        // 获取需要排除的路径
                        row.excluedPath = this.projectJsonObj.obfuscatorIncludePaths || "";
                        execFun();
                    }
                });
            });
        },
        // 手机端一键下载
        phoneOneKeyDownLoad(row){
            let fileNames = (row.isDirectory || !row.fileType) ? row.fileName : row.fileName +'.' + row.fileType;
            window.ZXW_VUE.$confirm('是否确认下载' + fileNames + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                if((row.isDirectory || !row.fileType)){
                    this.phoneDownLoadDirectory(row);
                } else {
                    this.phoneDownLoadFile(row);
                }
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
        // 关闭确认
        confirmClose(done){
            // 如果存在有修改 未保存的情况 提示保存
            if(this.phoneFileChangeArr.filter(item=>item).length>0){
                window.ZXW_VUE.$confirm('确认关闭编辑器,未保存文件将不会保留更改?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.phoneCloseFileEditorDialog();
                });
            } else {
                this.phoneCloseFileEditorDialog();
            }
        },
        // 关闭弹窗
        phoneCloseFileEditorDialog(){
            this.phoneFileEditVisible = false;
            this.updateFileDialogIsMin(false);
            this.phoneFileCacheArr = []; // 手机端文件缓存列表
            this.phoneFileSelectIndex = -1
        },
        // 最大化弹窗
        phoneMaxFileEditorDialog(){
            this.updateFileDialogIsMin(false);
            this.phoneFileEditVisible = true;
        },
        // 最小化弹窗
        phoneMinFileEditorDialog(){
            this.updateFileDialogIsMin(true);
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
            // 获取当前点击的文件对象
            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
            if(!fileObj){
                window.ZXW_VUE.$message.warning('未获取到文件,请重试！');
                return;
            }
            window.ZXW_VUE.$confirm('确认保存手机端文件【' + fileObj.fileSavePath + '】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let remoteScript = `let writableTextFile = files.write('${fileObj.fileSavePath}',decodeURI($base64.decode('${btoa(encodeURI(fileObj.fileContent))}')));`;
                this.remoteExecuteScript(remoteScript);
                // 更新原始缓存值
                fileObj.sourceFileContent = fileObj.fileContent;
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
                inputValue: (row.isDirectory || !row.fileType) ? row.fileName : (row.fileName + "." + row.fileType),
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
                inputValue: (row.isDirectory || !row.fileType) ? row.fileName : (row.fileName + "." + row.fileType),
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
            let remoteScript = `if(files.isFile("/sdcard/appSync")){files.remove("/sdcard/appSync")}; files.createWithDirs("/sdcard/appSync/");toastLog("初始化同步目录完成");`;
            this.remoteExecuteScript(remoteScript);
            this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
            setTimeout(()=>{
                // 刷新手机目录
                this.refreshPhoneDir();
            },500);
        },
        // 初始官方示例
        phoneInitOfficialExample(){
            this.phoneFileLoading = true;
            // 手机端下载官方示例 并且zip解压完成后 web端刷新手机目录
            handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"unzipFinishedExample",()=>{
                let downLoadGameScript = `if(files.isFile("/sdcard/appSync")){files.remove("/sdcard/appSync")}; files.createWithDirs("/sdcard/appSync/");
                utilsObj.downLoadFile("${getContext()}/AutoJsPro官方示例.zip","/appSync/AutoJsPro官方示例.zip",()=>{
                    $zip.unzip('/sdcard/appSync/AutoJsPro官方示例.zip', '/sdcard/appSync/');
                    let finishMsgObj = {
                        "deviceUUID":"${this.deviceInfo.deviceUuid}",
                        "serviceKey":"unzipFinishedExample",
                        "serviceValue":"true"
                    }
                    events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                    toastLog("初始化AutoJsPro官方示例完成");
                })`;
                this.remoteExecuteScript(downLoadGameScript);
            },()=>{
                this.phoneFileLoading = false;
                this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
                // 刷新手机目录
                this.refreshPhoneDir();
            });
        },
		// 初始化官方商店示例
		phoneInitOfficalShopExample(){
			 this.phoneFileLoading = true;
            // 手机端下载官方示例 并且zip解压完成后 web端刷新手机目录
            handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"unzipFinishedShopExample",()=>{
                let downLoadGameScript = `if(files.isFile("/sdcard/appSync")){files.remove("/sdcard/appSync")}; files.createWithDirs("/sdcard/appSync/");
                utilsObj.downLoadFile("${getContext()}/AutoJsPro商店示例脚本.zip","/appSync/AutoJsPro商店示例脚本.zip",()=>{
                    $zip.unzip('/sdcard/appSync/AutoJsPro商店示例脚本.zip', '/sdcard/appSync/');
                    let finishMsgObj = {
                        "deviceUUID":"${this.deviceInfo.deviceUuid}",
                        "serviceKey":"unzipFinishedShopExample",
                        "serviceValue":"true"
                    }
                    events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                    toastLog("初始化AutoJsPro商店示例脚本完成");
                })`;
                this.remoteExecuteScript(downLoadGameScript);
            },()=>{
                this.phoneFileLoading = false;
                this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
                // 刷新手机目录
                this.refreshPhoneDir();
            });
		},
        // 手机端下载脚手架项目
        phoneDownLoadGameScript(){
            this.phoneFileLoading = true;
            // 手机端下载脚手架项目 并且zip解压完成后 web端刷新手机目录
            handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"unzipFinished",()=>{
                let downLoadGameScript = `if(files.isFile("/sdcard/appSync")){files.remove("/sdcard/appSync")}; files.createWithDirs("/sdcard/appSync/");
                utilsObj.downLoadFile("${getContext()}/hz_autojs_game_script.zip","/appSync/hz_autojs_game_script.zip",()=>{
                    $zip.unzip('/sdcard/appSync/hz_autojs_game_script.zip', '/sdcard/appSync/');
                    let finishMsgObj = {
                        "deviceUUID":"${this.deviceInfo.deviceUuid}",
                        "serviceKey":"unzipFinished",
                        "serviceValue":"true"
                    }
                    events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                    toastLog("初始化脚手架项目完成");
                })`;
                this.remoteExecuteScript(downLoadGameScript);
            },()=>{
                this.phoneFileLoading = false;
                this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
                // 刷新手机目录
                this.refreshPhoneDir();
            });
        },
        // 初始化图色示例项目
        phoneDownLoadImageExampleScript(){
            this.phoneFileLoading = true;
            // 手机端下载图色示例项目 并且zip解压完成后 web端刷新手机目录
            handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"unzipFinished_example",()=>{
                let downLoadGameScript = `if(files.isFile("/sdcard/appSync")){files.remove("/sdcard/appSync")}; files.createWithDirs("/sdcard/appSync/");
                utilsObj.downLoadFile("${getContext()}/hz_autojs_example_project.zip","/appSync/hz_autojs_example_project.zip",()=>{
                    $zip.unzip('/sdcard/appSync/hz_autojs_example_project.zip', '/sdcard/appSync/');
                    let finishMsgObj = {
                        "deviceUUID":"${this.deviceInfo.deviceUuid}",
                        "serviceKey":"unzipFinished_example",
                        "serviceValue":"true"
                    }
                    events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                    toastLog("初始化图色示例项目完成");
                })`;
                this.remoteExecuteScript(downLoadGameScript);
            },()=>{
                this.phoneFileLoading = false;
                this.phoneBreadcrumbList = [{label: '根目录', value: '/sdcard/'},{label: 'appSync', value: '/sdcard/appSync/'}];
                // 刷新手机目录
                this.refreshPhoneDir();
            });
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
        // 手机端远程停止程序
        phoneRemoteStopScript(){
            let remoteScript = `let notCloseSourceArr = ['/data/user/0/com.zjh336.cn.tools/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools/files/project/main.js','/data/user/0/com.zjh336.cn.tools8822/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools8822/files/project/main.js','main.js']
                                const all = engines.all()
                                all.forEach(item => {
                                    if (notCloseSourceArr.indexOf(String(item.source))===-1) {
                                        item.forceStop()
                                    }
                                });`;
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
                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileDirectoryMap', {
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
        // 手机文件编辑器数组点击
        phoneFileEditorArrClick(index){
            // 切换记录索引
            this.phoneFileSelectIndex = index;
            // 获取当前点击的文件对象
            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
            // 设置默认值
            if(!fileObj.scroll){
                fileObj.scroll = {
                    scrollLeft:0,
                    scrollTop:0
                }
            }
            // 缓存的记录
            let cacheScroll = JSON.parse(JSON.stringify(fileObj.scroll));
            // 重置文本编辑器内容
            this.phoneScriptEditor.setValue(fileObj.fileContent || '');
            // 滚动到记录位置
            if(getEditorType() === 'ace'){
                this.phoneScriptEditor.clearSelection();
                this.phoneScriptEditor.session.setScrollTop(cacheScroll.scrollTop);
            } else {
                // 滚动到记录位置
                this.phoneScriptEditor.setScrollPosition(cacheScroll,1);
            }

        },
        // 重新加载
        refreshPhoneEditorArrClick(){
            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
            if(!fileObj){
                return;
            }
            if(!fileObj.sourceRow){
                return;
            }
            // 如果当前内容有变化 则进行提示
            if(fileObj.sourceFileContent!==fileObj.fileContent){
                window.ZXW_VUE.$confirm('当前文件未保存，是否确认重新加载最新文件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.updatePhoneFileCache(fileObj.sourceRow,true);
                });
            } else {
                this.updatePhoneFileCache(fileObj.sourceRow);
            }
        },
        // 手机文件编辑器关闭文件缓存
        closePhoneEditorArrClick(index){
            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
            // 关闭之前记录当前文件路径
            let curFileSavePath = fileObj ? fileObj.fileSavePath : '';

            // 公共方法
            let commonFun = ()=>{
                // 清除当前项缓存
                this.phoneFileCacheArr.splice(index, 1);
                // 最后一个关闭，直接关闭弹窗
                if(this.phoneFileCacheArr.length === 0){
                    this.phoneCloseFileEditorDialog();
                    return;
                }
                // 获取文件路径数组
                let fileSavePathArr = this.phoneFileCacheArr.map(item=>item.fileSavePath);
                // 当前文件索引
                let curExitIndex = fileSavePathArr.indexOf(curFileSavePath);

                // 未找到索引 说明当前关闭的就是选中文件
                if(curExitIndex === -1){
                    // 索引位置不变，如果索引位置超出长度则取最后一个
                    // 当前索引项大于等于长度
                    if(this.phoneFileSelectIndex >= this.phoneFileCacheArr.length){
                        // 重置为最后一项
                        this.phoneFileSelectIndex = this.phoneFileCacheArr.length - 1;
                    }
                    // 找到索引，替换选中值
                } else {
                    this.phoneFileSelectIndex = curExitIndex;
                }
                // 最后重新赋值编辑器内容
                fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
                if(fileObj){
                    // 设置默认值
                    if(!fileObj.scroll){
                        fileObj.scroll = {
                            scrollLeft:0,
                            scrollTop:0
                        }
                    }
                    // 缓存的记录
                    let cacheScroll = JSON.parse(JSON.stringify(fileObj.scroll));
                    // 重置文本编辑器内容
                    this.phoneScriptEditor.setValue(fileObj.fileContent || '');
                    if(getEditorType() === 'ace'){
                        this.phoneScriptEditor.clearSelection();
                        this.phoneScriptEditor.session.setScrollTop(cacheScroll.scrollTop);
                    } else {
                        // 滚动到记录位置
                        this.phoneScriptEditor.setScrollPosition(cacheScroll, 1);
                    }
                }
            };

            // 获取当前关闭的项是否存未保存的情况
            let isNotSave = this.phoneFileChangeArr[index];
            // 未保存的要提示，已保存的直接关闭
            if(isNotSave){
                window.ZXW_VUE.$confirm('当前文件未保存，是否确认关闭?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    commonFun()
                });
            } else {
                commonFun();
            }
        },
        // 更新手机端文件缓存
        updatePhoneFileCache(row,forceRefreshFileContent = false) {
            let targetPath = row.pathName;
            let fileType = row.fileType || '';
            let isImage = ['png','jpg','jpeg'].includes(fileType);
            let isText = ['js','json','css','txt','log','md','vue','html','ts','sh','mjs'].includes(fileType);
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
                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileMap', {
                    headers: {
                        "deviceUUID": commonStorage.get('deviceUUID')
                    },
                    method: 'POST',
                    contentType: 'application/json',
                    body: JSON.stringify({ 'dirPathKey': commonStorage.get('deviceUUID') + '_' + '${targetPath}', 'fileJson': result })
                }, (e) => { });`;
                this.remoteExecuteScript(remoteScript);
            };
            this.phoneFileEditorLoading = true;
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
                    this.phoneFileEditorName = '文本编辑';
                    this.phoneFileSavePath = row.pathName;

                    // 获取保存路径的数组
                    let fileSavePathArr = this.phoneFileCacheArr.map(item=>item.fileSavePath);

                    // 当前文件在已有文件列表中的下标
                    let curExitsIndex = fileSavePathArr.indexOf(row.pathName);
                    // 当前文件已打开
                    if(curExitsIndex!==-1){
                        // 显示编辑器 切换索引位置即可
                        this.phoneFileSelectIndex = curExitsIndex;
                        let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
                        if(fileObj){
                            // 强制刷新内容或者 内容一致
                            if(forceRefreshFileContent || fileObj.sourceFileContent===fileObj.fileContent){
                                // 更新文件信息
                                fileObj.fileContent = fileContent;
                                // 更新缓存内容
                                fileObj.sourceFileContent = fileContent;
                            } else {
                                setTimeout(()=>{
                                    // 则仅提示内容未保存
                                    window.ZXW_VUE.$message.warning({message: '当前文件内容已进行修改,如需加载最新文件,请点击重新加载！', duration: 1500});
                                },200);
                            }
                            this.phoneScriptEditor.setValue(fileObj.fileContent || '');
                            if(!fileObj.scroll){
                                fileObj.scroll = {
                                    scrollLeft: 0,
                                    scrollTop: 0
                                }
                            }
                            if(this.phoneScriptEditor){
                                // 滚动到记录位置
                                if(getEditorType() === 'ace'){
                                    this.phoneScriptEditor.clearSelection();
                                    this.phoneScriptEditor.session.setScrollTop(fileObj.scroll.scrollTop);
                                } else {
                                    this.phoneScriptEditor.setScrollPosition(fileObj.scroll,1);
                                }
                            }
                        }
                    } else {
                        let fileObj = {
                            fileSavePath:row.pathName,
                            fileName: row.fileName + (row.fileType ? ('.' + row.fileType) : ''),
                            sourceFileContent: fileContent,
                            fileContent: fileContent,
                            sourceRow: row
                        };
                        this.phoneFileCacheArr.push(fileObj);
                        // 记录索引
                        this.phoneFileSelectIndex = this.phoneFileCacheArr.length - 1;
                        // 初始化文件编辑器
                        initFileEditor(this,'phoneScriptEditor','phoneFileEditor',this.getMonacoEditorComplete,fileContent,'javascript','vs-dark',(e,value)=>{
                            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
                            if(fileObj && fileObj.fileContent!==undefined){
                                this.phoneFileCacheArr[this.phoneFileSelectIndex].fileContent = value;
                            }
                        },(e)=>{
                            let fileObj = this.phoneFileCacheArr[this.phoneFileSelectIndex];
                            if(fileObj){
                                this.phoneFileCacheArr[this.phoneFileSelectIndex].scroll = {
                                    scrollLeft: e.scrollLeft,
                                    scrollTop: e.scrollTop
                                };
                            }
                        });
                        if(this.phoneScriptEditor){
                            if(getEditorType() === 'ace'){
                                this.phoneScriptEditor.session.setScrollTop(0);
                            }else {
                                // 滚动到记录位置
                                this.phoneScriptEditor.setScrollPosition({scrollLeft: 0,scrollTop: 0},1);
                            }
                        }
                    }
                }
                if(isImage){
                    this.phoneImagePreviewVisible = true;
                    this.phoneFileEditorName = row.fileName + (row.fileType ? ('.' + row.fileType) : '');
                    this.phoneImageBase64 = 'data:image/png;base64,' + cacheResultData;
                }
                this.phoneFileLoading = false;
                this.phoneFileEditorLoading = false;
            });
        },
        // 手机端华仔autoJs工具箱热更新
        phoneAutoJsToolHotUpdate(){
            window.ZXW_VUE.$confirm('是否确认远程更新华仔AutoJs工具箱APP端?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let remoteScript = `
                // 获取项目路径
                let projectPath = files.cwd();
                // 设置本地临时更新路径
                let tempUpdatePath = "/sdcard/appSync/tempUpdateTools/";
                // 创建临时更新js目录
                files.createWithDirs(tempUpdatePath)
                // 获取热更新版本
                let getResult = http.get("https://gitee.com/zjh336/hz_autojs_toolbox/raw/master/hotUpdateVerson.txt");
                // 可自定义 主要为了app端区分版本
                let hotUpdateVersion = getResult && getResult.statusCode == 200 ? getResult.body.string() : "热更新";
                // 下载工具箱js代码 也可以选择将修改后的js代码 替换到web端上传路径下
                let url = "http://121.4.241.250:9998/uploadPath/autoJsTools/hz_autojs_tools.zip"
                // 请求压缩包
                let r = http.get(url);
                if (r.statusCode == 200) {
                    // 下载压缩包到本地临时更新路径
                    var content = r.body.bytes();
                    files.writeBytes(tempUpdatePath + "hz_autojs_tools.zip", content);
                    // 解压下载文件到 项目路径
                    $zip.unzip(tempUpdatePath + "hz_autojs_tools.zip", projectPath);
                    commonStorage.put("hotUpdateVersion", hotUpdateVersion)
                    toastLog("热更新成功,请重启APP后生效！");
                } else {
                    toastLog(url + "下载失败！！！");
                }`;
                // 执行热更新逻辑
                this.remoteExecuteScript(remoteScript);
            });
        },
        // 扩展功能脚本
        extendFunScript(){
            let extendFunScript = `// 检查目标应用是否安装  
// 检查目标应用是否安装  
utilsObj.checkIsInstallApp =()=> {
    try {
        context.getPackageManager().getPackageInfo("com.termux", 0);
        return true;
    } catch (e) {
        toastLog("检测未安装termux,自动下载等待安装");
        sleep(1000);
        utilsObj.downLoadFile("${getContext()+'/uploadPath/autoJsTools/webCommonPath/Termux0.119.apk'}","/Termux0.119.apk",()=>{app.viewFile("/sdcard/Termux0.119.apk");});
        return false;
    }
}

// 检查本应用是否授权
utilsObj.checkPermission =(permission)=> {
    let pm = context.getPackageManager();
    return android.content.pm.PackageManager.PERMISSION_GRANTED == pm.checkPermission(permission, context.getPackageName());
}

// 打开本应用权限设置
utilsObj.openPermissionSetting = ()=> {
    let permissionIntent = new android.content.Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    permissionIntent.setData(android.net.Uri.parse("package:" + context.getPackageName()));
    permissionIntent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(permissionIntent);
}

// 手动执行命令
utilsObj.manualExecCommand = (command)=> {
    let isInstall = utilsObj.checkIsInstallApp("com.termux");
    if (!isInstall) {
        return false;
    }
    // 启动应用
    launchPackage("com.termux");

    // 等待应用启动完毕
    packageName("com.termux").waitFor();

    // 存入剪切板
    setClip(command);
    // 长按
    press(device.width / 2, (device.height / 3) , 1000);

    // 在所有窗口找控件
    auto.setWindowFilter(function(window) {
        //不管是如何窗口，都返回true，表示在该窗口中搜索
        return true;
    });

    // 匹配粘贴按钮
    let paste1 = text("Paste").className("android.widget.LinearLayout").findOne(1000);
    let paste2 = desc("Paste").className("android.widget.LinearLayout").findOne(1000);
    // 如果均为空 提示手动操作
    if (!paste1 && !paste2) {
        toastLog("请手动粘贴命令并执行");
        return;
    }
    // 点击粘贴按钮
    if (paste1) {
        paste1.click();
    }
    if (paste2) {
        paste2.click();
    }

    // 检查权限
    let options = {};
    if ($shell.checkAccess("root")) {
        options.root = true;
    } else if ($shell.checkAccess("adb")) {
        options.adb = true;
    } else {
        toastLog("请手动回车执行命令");
        return;
    }
    // 自动执行回车
    shell("input keyevent 66", options);
}



// 意图执行命令
utilsObj.intentExecCommand =(command, dir, isBackGround)=> {
    let shellStr = command;
    let workDir = dir || '/data/data/com.termux/files/';

    let strArry = shellStr.split(" ");
    let strArryLength = strArry.length - 1;
    let commandArr = strArry[0];

    let per = util.java.array('string', strArryLength);
    for (let i = 0; i < strArryLength; i++) {
        per[i] = strArry[i + 1];
    }

    let backGroundFlag = true;
    if (isBackGround != null && isBackGround != undefined) {
        backGroundFlag = isBackGround;
    }

    let intent = new android.content.Intent();
    intent.setClassName("com.termux", "com.termux.app.RunCommandService");
    intent.setAction("com.termux.RUN_COMMAND");
    intent.putExtra("com.termux.RUN_COMMAND_PATH", "/data/data/com.termux/files/usr/bin/" + commandArr);
    intent.putExtra("com.termux.RUN_COMMAND_ARGUMENTS", per);
    intent.putExtra("com.termux.RUN_COMMAND_WORKDIR", workDir); //工作目录
    intent.putExtra("com.termux.RUN_COMMAND_BACKGROUND", backGroundFlag); //是否后台运行
    intent.putExtra("com.termux.RUN_COMMAND_SESSION_ACTION", "0");
    context.startService(intent);
}


// 意图执行命令2  以com.termux.app.TermuxService服务执行,安装改包后的termux应用可用,使用之前必须授予外部储存权限
utilsObj.intentExecCommandServiceExecute =(command, dir, isBackGround)=> {
    files.write("/sdcard/serviceExecTemp.sh", command);
    let backGroundFlag = true;
    if (isBackGround != null && isBackGround != undefined) {
        backGroundFlag = isBackGround;
    }
    let scriptUri = new android.net.Uri.Builder().scheme("com.termux.file").path("/sdcard/serviceExecTemp.sh").build();
    let executeIntent = new android.content.Intent("com.termux.service_execute", scriptUri);
    executeIntent.setClassName("com.termux", "com.termux.app.TermuxService");
    executeIntent.putExtra("com.termux.execute.background", backGroundFlag);
    context.startService(executeIntent);
}


// 意图执行命令 通过sh文件  (未改包应用必须要有com.termux.permission.RUN_COMMAND 权限才能执行 改包应用则无需)
utilsObj.intentExecCommandSh = (command, isBackGround, timeoutTimes, callback)=> {
    // 写入临时文件
    files.write("/sdcard/temp.sh", command);

    // 编写调用命令语句
    let comman2 = \`tempResult=$(bash /sdcard/temp.sh)
            echo $tempResult  > /sdcard/temp.txt\`;

    files.write("/sdcard/temp2.sh", comman2);

    // 获取文件更新时间
    let file = new java.io.File("/sdcard/temp.txt");
    let lastModified = 0;
    if (file.exists()) {
        lastModified = file.lastModified();
    }


    let checkNodeComman = "bash /sdcard/temp2.sh";
    // 调用意图执行命令
    utilsObj.intentExecCommand(checkNodeComman, "/sdcard/", isBackGround)

    let lastModifiedNew = lastModified;
    let times = 0;
    let toastTimes = 0;
    let interval = setInterval(() => {
        if (file.exists()) {
            lastModifiedNew = file.lastModified();
        }
        times++;
        toastTimes++;
        // 两个时间不相同时 表示运行完成
        if (lastModifiedNew !== lastModified) {
            // 完成
            if (callback) {
                let fileContent = files.read("/sdcard/temp.txt");
                // 执行回调
                callback(fileContent);
            }
            clearInterval(interval);
        }
        if (times * 100 >= timeoutTimes) {
            // 强行结束
            if (callback) {
                callback("等待超时");
            }
            clearInterval(interval);
        }

        if (toastTimes * 100 >= 3000) {
            toastLog(command + "正在执行,请稍候！！！");
            toastTimes = 0;
        }

    }, 100)
}`;
           return extendFunScript;
        },
        // 下载和安装termux
        downLoadAndInstallTermux(){
            let fun = ()=>{
                let downloadFilUrl = getContext() + '/uploadPath/autoJsTools/webCommonPath/Termux0.119.apk';
                let remoteScript = `
                    utilsObj.downLoadFile('${downloadFilUrl}',"/Termux0.119.apk",()=>{app.viewFile('/sdcard/Termux0.119.apk');});
                `;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认下载和安装termux(下载之前,请先在806074622群文件常用工具中下载Termux0.119.apk,并上传至公共文件根目录)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        },
        // APP调用Termux权限设置
        termuxPermSetting(){
            let fun = ()=>{
                let remoteScript = this.extendFunScript();
                remoteScript += `// 1、检验当前应用申请权限  2、检验termux是安装  3、允许外部调用
// 设置允许外部app意图调用权限
function setAllowExternalApps() {
    // 设置参数并重启
    let str = \`if [ ! -d ~/.termux ]; 
        then
            mkdir ~/.termux/
        fi
        echo -e "\\nallow-external-apps=true\\n\\n" >> ~/.termux/termux.properties\\r
        termux-reload-settings\`;
    // 手动执行命令
    utilsObj.manualExecCommand(str);
    
    let options = {};
    if ($shell.checkAccess("root")) {
         options.root = true;
         shell("am force-stop " + "com.termux", options);
    } else if ($shell.checkAccess("adb")) {
         options.adb = true;
         shell("am force-stop " + "com.termux", options);
    } else {
         toastLog("请手动重启应用,保证后续命令可以执行");
    }
    // 启动应用
    launchPackage("com.termux");
}
// 需要申请的权限
let runCommondPermission = "com.termux.permission.RUN_COMMAND";
// 检查权限 如果没有不继续执行  改包后无需判断权限
if (!utilsObj.checkPermission(runCommondPermission)) {
    let options = {}
    if ($shell.checkAccess("root")) {
        options.root = true;
        shell("pm grant " + context.getPackageName() + " " + runCommondPermission, options);
    } else if ($shell.checkAccess("adb")) {
        options.adb = true;
        shell("pm grant " + context.getPackageName() + " " + runCommondPermission, options);
    }
     // 自动打开权限设置界面
     // utilsObj.openPermissionSetting();
} 
  setAllowExternalApps();
`;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认给termux应用授权allow-external-apps=true(允许工具箱调用termux应用的设置,工具箱必须要授予剪切板权限,可能需要手动确认命令)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        },
        // Termux外部存储权限设置
        termuxStorageSetting(){
            let fun = ()=>{
                let remoteScript = this.extendFunScript();
                remoteScript += `
                  let isInstall = utilsObj.checkIsInstallApp("com.termux");
                  if (isInstall) {
                      // 启动应用
                      launchPackage("com.termux");
                     // 意图执行命令  设置外部储存权限
                     utilsObj.intentExecCommand('termux-setup-storage', '/data/data/com.termux/files/', false);
                  }
                `;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认给termux应用授予外部储存读取权限(允许termux应用访问本机外部储存的设置)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        },
        // Termux切换源
        termuxChangeRep(){
            let fun = ()=>{
                let remoteScript = this.extendFunScript();
                remoteScript += `
                let isInstall = utilsObj.checkIsInstallApp("com.termux");
                if (isInstall) {
                      // 启动应用
                      launchPackage("com.termux");
                      // 意图执行命令
                      utilsObj.intentExecCommand('termux-change-repo', '/data/data/com.termux/files/', false);
                }
                `;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认给termux应用切换软件源(提高termux安装应用的速度,需要手动选择TsingHua清华源)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        },
        // Termux初始化Node环境
        termuxInitNode(){
            let fun = ()=>{
                let remoteScript = this.extendFunScript();
                remoteScript += `
                // 初始化node环境
                function initNode() {
                    let tempBashContent = \`result=$(node -v)
                    if [[ $result == *v* ]]
                    then
                            echo "已安装nodejs："$result
                    else
                            yes | pkg install nodejs
                    fi\`;
                    // 意图执行命令 耗时长的 无法看到执行过程 不友好
                    //utilsObj.intentExecCommandSh(tempBashContent, true, 60 * 1000, (result) => {
                    //    toastLog(result);
                    //});
                    // 手动执行命令 可以看到执行过程 但是可能需要人工确认
                    utilsObj.manualExecCommand(tempBashContent);
                }
                let isInstall = utilsObj.checkIsInstallApp("com.termux");
                if (isInstall) {
                      // 启动应用
                      launchPackage("com.termux");
                      initNode();
                }
                `;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认在termux应用中初始化nodejs环境(工具箱必须要授予剪切板权限,可能需要手动确认命令)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        },
        // termux安装npm依赖
        termuxRunNpmInstall(row){
            let fun = ()=>{
                let remoteScript = this.extendFunScript();
                remoteScript += `
                let isInstall = utilsObj.checkIsInstallApp("com.termux");
                if (isInstall) {
                    // 启动应用
                    launchPackage("com.termux");
                 
                    // node项目安装依赖
                    let installProjectCommand = \`cd ${row.parentPathName}\\nnpm install --no-bin-links\`;
                    // 意图执行命令 耗时长的 无法看到执行过程 不友好
                    // 执行安装依赖命令
                    // utilsObj.intentExecCommandSh(installProjectCommand, false, 5 * 60 * 1000, (result) => {
                    //    toastLog(result);
                    // })
                    // 手动执行命令 可以看到执行过程 但是可能需要人工确认
                    utilsObj.manualExecCommand(installProjectCommand);
                }
                `;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认在termux应用中安装npm依赖(工具箱必须要授予剪切板权限,可能需要手动确认命令)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        },
        // termux运行sh脚本
        termuxRunBashByPath(row){
            let fun =()=>{
                let remoteScript = this.extendFunScript();
                remoteScript += `
                 let isInstall = utilsObj.checkIsInstallApp("com.termux");
                if (isInstall) {
                    // 启动应用
                    launchPackage("com.termux");
                    // 执行sh脚本
                    let installProjectCommand2 = \`cd ${row.parentPathName}
                                bash ${row.fileName}${row.fileType ? '.'+row.fileType: ''}\`;
                    // 意图执行命令 耗时长的 无法看到执行过程 不友好
                    // 执行构建命令2
                    // utilsObj.intentExecCommandSh(installProjectCommand2, false, 5 * 60 * 1000, (result) => {
                    //    toastLog(result);
                    // })
                    // 手动执行命令 可以看到执行过程 但是可能需要人工确认
                    utilsObj.manualExecCommand(installProjectCommand2);
                }`;
                this.remoteExecuteScript(remoteScript);
            };
            window.ZXW_VUE.$confirm('是否确认在termux应用中执行sh脚本(工具箱必须要授予剪切板权限,可能需要手动确认命令)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                fun();
            });
        }
    }
}