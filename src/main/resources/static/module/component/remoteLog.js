import {getContext, zeroFill} from "./../../utils/utils.js";
let template='' +
    '<div>' +
    '<p class="basicInfo">远程日志上传</p>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-start">' +
    '        <el-form-item label="日志名称:" prop="logName" class="width100">' +
    '            <el-input v-model="remoteHandler.param2.logName" placeholder="请输入远程日志名称" class="width100"/>' +
    '        </el-form-item>' +
    '    </div>' +
    '</el-row>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="日志预览:" prop="previewLog" class="width100">' +
    '            <div style="display: inline-flex;width: 100%;">' +
    '                <div style="display: inline-flex;justify-content: flex-end;align-items: center;text-align: center;flex:1">' +
    '                    <el-button type="primary" style="margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="remoteLogUpload">' +
    '                      远程日志上传' +
    '                    </el-button>' +
    '                    <a href="remoteHandler.param2.previewLog"/>' +
    '                      <el-button type="primary" style="margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="downLoadLog">' +
    '                       日志下载' +
    '                       </el-button>' +
    '                       <el-button type="info" size="mini" style="margin-left:10px" id="loadRemoteLog"' +
    '                       @click.stop.prevent="loadPreviewLog">加载日志' +
    '                       </el-button>' +
    '                </div>' +
    '            </div>' +
    '            <div style="min-height: 40vh;display: flex;justify-content: flex-end;align-items: center;text-align: center;width: 100%">' +
    '                <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" height="100%"' +
    '                      width="100%" style="height: 70vh;"' +
    '                      allowtransparency="yes" v-if="remoteHandler.param2.previewLog" id="previewLog"' +
    '                      src="">' +
    '                </iframe>' +
    '                <div v-else style="font-size: 20px;color: rgba(29,140,128,0.29)">' +
    '                    暂无日志,请先发送指令,再加载日志' +
    '                </div>' +
    '            </div>' +
    '        </el-form-item>' +
    '    </div>' +
    '</el-row>' +
    '</div>';


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