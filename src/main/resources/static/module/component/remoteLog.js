import {getContext, zeroFill} from "./../../utils/utils.js";
let template='<div></div>';
$.ajax({
    url: "/module/template/remoteLog.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});

export default {
    template: template,
    name: 'RemoteScript',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript'],
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