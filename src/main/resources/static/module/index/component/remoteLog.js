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
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript', 'getMonacoEditorComplete','changeLogWindow'],
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
            utilsObj.timerStartPushLog =()=> {
                let timerStorage = storages.create("zjh336.cn_timer");
                timerStorage.remove('stop');
                let timerFlag = true;
                files.createWithDirs("/sdcard/${this.logDirectoryType === 'tools' ? 'autoJsToolsLog' : 'autoJsLog'}/")
                // 获取当前时间字符串
                let currenTimes = utilsObj.getCurrentTime()
                let filePath = "/sdcard/${this.logDirectoryType === 'tools' ? 'autoJsToolsLog' : 'autoJsLog'}/";
                let fileName = "log" + currenTimes + ".txt";
                let charset = "UTF-8"; // 文件编码
                let lineNum = ${this.onlineLogMaxLen}; // 需要读取的行数
                // 监听文件变化
                let watchService = java.nio.file.FileSystems.getDefault().newWatchService();
                let path = java.nio.file.Paths.get(filePath);
                path.register(watchService, java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY);
                let watchFun = () => {
                    let key = watchService.take();
                    while (timerFlag) {
                        let stop = timerStorage.get('stop');
                        if (stop !== undefined) {
                            timerFlag = false;
                        }
                        let events = key.pollEvents();
                        if (events.size() > 0) {
                            for (var i = 0; i < events.size(); i++) {
                                let event = events.get(i);
                                if (event.kind() === java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY && String(event.context().toString()) === fileName) {
                                    // 读取文件最后指定行
                                    let file = new java.io.RandomAccessFile(filePath + fileName, "r");
                                    let fileLength = file.length();
                                    let pos = fileLength - 1;
                                    let lineCount = 0;
                                    let lineArr = [];
                                    while (pos >= 0 && lineCount < lineNum) {
                                        file.seek(pos);
                                        let c = file.readByte();
                                        if (c == 10 || c == 13) {
                                            if (pos < fileLength - 1) {
                                                lineArr.unshift(new java.lang.String(new java.lang.String(file.readLine()).getBytes("iso-8859-1"),charset));
                                                lineCount++;
                                            }
                                        }
                                        pos--;
                                    }
                                    if (pos < 0) {
                                        lineArr.unshift(new java.lang.String(new java.lang.String(file.readLine()).getBytes("iso-8859-1"),charset));
                                    }
                                    file.close();
                                    try{
                                        sleep(100);
                                        sleep(${this.appSpace});
                                        let logContent = lineArr.join("\\n");
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
                            key.reset();
                        } else {
                            sleep(${this.appSpace});
                        }
                    }
                }
                watchFun();
            }
            utilsObj.timerStopPushLog=()=> {
                let timerStorage = storages.create("zjh336.cn_timer");
                timerStorage.put('stop', 'stop');
                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateLogMap', {
                            headers: {
                                "deviceUUID": commonStorage.get('deviceUUID')
                            },
                            method: 'POST',
                            contentType: 'application/json',
                            body: JSON.stringify({ 'key': commonStorage.get('deviceUUID'), 'logJson': '' })
                }, (e) => { })
            }
            // 先停止
            utilsObj.timerStopPushLog();
            // 推送日志
            utilsObj.timerStartPushLog();`;
            this.remoteExecuteScript(remoteScript);

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
            // 推送日志
            let remoteScript = `utilsObj.timerStopPushLog();`;
            this.remoteExecuteScript(remoteScript);
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