import {getContext, zeroFill,getEditorType, initFileEditor} from "./../../../utils/utils.js";
let template='<div></div>';
$.ajax({
    url: "/module/index/template/remoteLog.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});

export default {
    template: template,
    name: 'RemoteScript',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript', 'getMonacoEditorComplete','changeLogWindow','forwardFileManage'],
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
            logType:'online',
            logDirectoryType:'tools',
            logTimer:null,
            logEditor:null,
            autoScroll:true,
            appSpace:500,
            clientSpace:500,
            onlineLogMaxLen: 500,// 最大日志行
            onlineLogContent:"",
            remoteHandler: {
                param2: {
                    logName: 'log2022072121.txt',
                    previewLog: ''
                },
            },
        }
    },
    mounted(){
        // 默认当前时间日志
        this.remoteHandler.param2.logName = "log" + this.getLastHeartTimeStr() + ".txt";
    },
    computed:{
        convertLog(){
            let log = this.onlineLogContent.replace(/\n/g,"<br/>");
            return log;
        }
    },
    methods: {
        init(){
            // 初始化文件编辑器
            initFileEditor(this,'logEditor','logTextEditor',this.getMonacoEditorComplete,'','html','vs-dark',(e,value)=>{
            });

            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryLog",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "key": _that.deviceInfo.deviceUuid
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            _that.refreshOnLineRemoteLogFun(decodeURI(atob(data.data)))
                        }
                    }
                },
                error: function (msg) {
                    console.log(msg)
                }
            });
        },
        refreshOnLineRemoteLogFun(longContent){
            let _that = this;
            _that.onlineLogContent = longContent;
            let completeTimer = setInterval(()=>{
                if(!this.getMonacoEditorComplete()){
                    return;
                }
                _that.logEditor.setValue(_that.onlineLogContent);
                if(getEditorType() === 'ace'){
                    _that.logEditor.clearSelection();
                }
                if(_that.autoScroll){
                    _that.$nextTick(() =>{
                        if(getEditorType() === 'ace'){
                            const numRows = _that.logEditor.session.getLength();
                            _that.logEditor.scrollToRow(numRows - 1);
                        } else {
                            _that.logEditor.revealLine(_that.logEditor.getModel().getLineCount());
                        }
                    });
                }
                clearInterval(completeTimer);
            },200);
        },
        // 开启实时日志
        startOnLineLog(){
            if (!this.validSelectDevice()) {
                return
            }
            let _that = this;
            $.ajax({
                url: getContext() + "/device/startOnlineLog",
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    "deviceUUID": _that.deviceInfo.deviceUuid
                },
                data: {
                    "deviceUUID": _that.deviceInfo.deviceUuid,
                    "maxLineCount":_that.onlineLogMaxLen
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            window.ZXW_VUE.$notify.success({message: '开启成功', duration: '1000'});
                        }
                    }
                },
                error: function (msg) {
                    console.log(msg)
                }
            });
            this.changeLogWindow(true);

            window.ZXW_VUE.$EventBus.$off('refreshOnLineRemoteLog',this.refreshOnLineRemoteLogFun);
            window.ZXW_VUE.$EventBus.$on('refreshOnLineRemoteLog', this.refreshOnLineRemoteLogFun);

            /*if(this.logTimer){
                clearInterval(this.logTimer);
                this.logTimer = null;
            }
            this.logTimer = setInterval(()=>{
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/queryLog",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    data: {
                        "key": _that.deviceInfo.deviceUuid
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {

                            }
                        }
                    },
                    error: function (msg) {
                        console.log(msg)
                    }
                });
            },100 + Number(this.clientSpace));*/
        },
        // 停止实时日志
        stopOnLineLog(){
            let _that = this;
            $.ajax({
                url: getContext() + "/device/stopOnlineLog",
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    "deviceUUID": _that.deviceInfo.deviceUuid
                },
                data: {
                    "deviceUUID": _that.deviceInfo.deviceUuid
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            window.ZXW_VUE.$notify.success({message: '开启成功', duration: '1000'});
                        }
                    }
                },
                error: function (msg) {
                    console.log(msg)
                }
            });
            if(this.logTimer){
                clearInterval(this.logTimer);
            }
            this.logTimer = null;
            this.changeLogWindow(false);
            window.ZXW_VUE.$EventBus.$off('refreshOnLineRemoteLog',this.refreshOnLineRemoteLogFun);
        },
        getText(){
          console.log(this.onlineLogContent)
        },
        // 跳转文件管理模块
        forwardFileManageFun(){
            this.forwardFileManage("/system/remoteLog/");
        },
        // 获取最后一次心跳时间字符串
        getLastHeartTimeStr() {
            let date = new Date();//当前时间
            let month = zeroFill(date.getMonth() + 1);//月
            let day = zeroFill(date.getDate());//日
            let hour = zeroFill(date.getHours());//时
            //当前时间
            return date.getFullYear() + month + day
                + hour;
        },
        // 远程上传日志
        remoteLogUpload() {
            let remoteScript = `
            /**
             * 远程上传日志到服务器
             * @param {*} logName 日志名称
             */
            utilsObj.remoteUploadLogToServer = (logName) => {
                let localPathName = "/sdcard/autoJsToolsLog/" + logName
                // 调用远程上传文件方法
                utilsObj.uploadFileToServer(localPathName, deviceUUID + "/system/remoteLog/" + logName, (remoteImageURL) => {
                    if (commonStorage.get("debugModel")) {
                        console.log("远程日志地址：" + remoteImageURL)
                    }
                })
            }
            utilsObj.remoteUploadLogToServer('${this.remoteHandler.param2.logName}');
            `;
            this.remoteExecuteScript(remoteScript);
        },
        // 加载日志
        loadPreviewLog() {
            if (!this.validSelectDevice()) {
                return
            }
            this.remoteHandler.param2.previewLog = "";
            let logUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/system/remoteLog/" + this.remoteHandler.param2.logName;
            setTimeout(() => {
                this.remoteHandler.param2.previewLog = logUrl;
                this.$nextTick(() => {
                    $("#previewLog").attr("src", logUrl + "?t=" + new Date().getTime());
                    setTimeout(() =>{
                        var iframe = document.getElementById('previewLog');
                        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        iframeDocument.body.style.color = '#ffffff';
                    },1500)
                });
            }, 200);
        },
    }
}