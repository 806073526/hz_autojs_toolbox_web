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
    methods: {
        init(){
            // 初始化文件编辑器
            initFileEditor(this,'logEditor','logTextEditor',this.getMonacoEditorComplete,'','html','vs-dark',(e,value)=>{
            });
        },
        // 开启实时日志
        startOnLineLog(){
            if (!this.validSelectDevice()) {
                return
            }
            let remoteScript = `utilsObj.getCurrentTime =()=> {
                let date = new Date();//当前时间
                let month = utilsObj.zeroFill(date.getMonth() + 1);//月
                let day = utilsObj.zeroFill(date.getDate());//日
                let hour = utilsObj.zeroFill(date.getHours());//时
                //当前时间
                let curTime = date.getFullYear() + month + day
                    + hour;
                return curTime;
            }
            utilsObj.zeroFill =(i)=> {
                if (i >= 0 && i <= 9) {
                    return "0" + i;
                } else {
                    return String(i);
                }
            }
            utilsObj.getOnlineLog =()=> {
                files.createWithDirs("/sdcard/${this.logDirectoryType === 'tools' ? 'autoJsToolsLog' : 'autoJsLog'}/")
                // 获取当前时间字符串
                let currenTimes = utilsObj.getCurrentTime()
                let fileName = "/sdcard/${this.logDirectoryType === 'tools' ? 'autoJsToolsLog' : 'autoJsLog'}/log" + currenTimes + ".txt";
                let fileObj = files.open(fileName, "r");
                let allLines = fileObj.readlines();
                fileObj.close();
                let targetLines = allLines.slice(-${this.onlineLogMaxLen})
                return targetLines.join("\\r\\n");
            }
            utilsObj.timerStartPushLog=()=> {
                let timerStorage = storages.create("zjh336.cn_timer");
                timerStorage.remove('stop');
                let timerFlag = true;
                while (timerFlag) {
                    let stop = timerStorage.get('stop');
                    if (stop !== undefined) {
                        timerFlag = false;
                    }
                    try{
                        sleep(100);
                        sleep(${this.appSpace});
                        let logContent = utilsObj.getOnlineLog();
                        // url编码base64加密
                        let result = $base64.encode(encodeURI(logContent));
                        http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateLogMap', {
                            headers: {
                                "deviceUUID": commonStorage.get('deviceUUID')
                            },
                            method: 'POST',
                            contentType: 'application/json',
                            body: JSON.stringify({ 'key': commonStorage.get('deviceUUID'), 'logJson': result })
                        }, (e) => { });
                    }catch(e){
                        console.error("同步日志失败！",e);
                    }
                }
            }
            utilsObj.timerStopPushLog=()=> {
                let timerStorage = storages.create("zjh336.cn_timer");
                timerStorage.put('stop', 'stop');
            }
            // 先停止
            utilsObj.timerStopPushLog();
            // 推送日志
            utilsObj.timerStartPushLog();`;
            this.remoteExecuteScript(remoteScript);

            if(this.logTimer){
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
                                _that.onlineLogContent = decodeURI(atob(data.data));
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
                            }
                        }
                    },
                    error: function (msg) {
                        console.log(msg)
                    }
                });
            },100 + Number(this.clientSpace));
        },
        // 停止实时日志
        stopOnLineLog(){
            // 推送日志
            let remoteScript = `utilsObj.timerStopPushLog();`;
            this.remoteExecuteScript(remoteScript);
            if(this.logTimer){
                clearInterval(this.logTimer);
            }
            this.logTimer = null;
        },
        getText(){
          console.log(this.onlineLogContent)
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
            let messageStr = '{"functionName":"remoteUploadLogToServer","functionParam":["' + this.remoteHandler.param2.logName + '"]}';
            this.sendMsgToClient('remoteHandler', messageStr, () => {
                this.loadPreviewLog()
            })
        },
        // 加载日志
        loadPreviewLog() {
            if (!this.validSelectDevice()) {
                return
            }
            this.remoteHandler.param2.previewLog = "";
            let logUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/" + this.remoteHandler.param2.logName;
            setTimeout(() => {
                this.remoteHandler.param2.previewLog = logUrl;
                this.$nextTick(() => {
                    $("#previewLog").attr("src", logUrl + "?t=" + new Date().getTime());
                });
            }, 200);
        },
        // 下载日志
        downLoadLog() {
            if (!this.validSelectDevice()) {
                return
            }
            if (this.remoteHandler.param2.previewLog) {
                window.open(this.remoteHandler.param2.previewLog)
            }
        },
    }
}