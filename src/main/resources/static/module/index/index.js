let template ='<div></div>';
$.ajax({
    url: "/module/index/template/main.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});
import {getContext} from "./../../utils/utils.js";
import DeviceInfo from "./component/deviceInfo.js";
import ImgHandler from "./component/imgHandler.js";
import LayoutAnalysis from "./component/layoutAnalysis.js"
import RemoteScript from "./component/remoteScript.js"
import PreviewDevice from "./component/previewDevice.js"
import RemoteLog from "./component/remoteLog.js";
import FileManage from "./component/fileManage.js"

window.ZXW_VUE = new Vue({
    el: "#app",
    components: {
        DeviceInfo: DeviceInfo,
        ImgHandler: ImgHandler,
        LayoutAnalysis: LayoutAnalysis,
        RemoteScript: RemoteScript,
        PreviewDevice: PreviewDevice,
        RemoteLog:RemoteLog,
        FileManage:FileManage
    },
    template: template,
    data: {
        otherProperty: {// 其他属性对象 同步app端
            orientation: 1  // 屏幕方向
        },
        deviceInfo: {// 当前设备信息
            startPreview: false,
            deviceUuid: '',
            standardWidth: null,
            standardHeight: null,
            standardConvert: false,
            offsetX: 0,
            offsetY: 0
        },
        screenDirection: '横屏'
    },
    computed: {
    },
    watch: {
        otherProperty(val) {
            if (!val) {
                return;
            }
            this.screenDirection = val.orientation === 1 ? "竖屏" : "横屏";
        }
    },
    mounted() {
        // 每3秒同步一次其他属性
        setInterval(() => {
            this.timeSyncOtherProperty()
        }, 3 * 1000)
    },
    provide() {
        return {
            validSelectDevice: this.validSelectDevice, // 检验设备选择情况
            sendMsgToClient: this.sendMsgToClient, // 发送websocket消息到app
            remoteExecuteScript: this.remoteExecuteScript // app端远程执行代码
        }
    },
    methods: {
        // 设备表格选择行回调
        deviceSelectRowCallback({deviceInfo,screenDirection}){
            // 更新设备信息
            this.deviceInfo = deviceInfo;
            // 更新屏幕方向
            this.screenDirection = screenDirection;
            // 同步坐标
            setTimeout(() => {
                this.$nextTick(() => {
                    // 坐标全屏
                    this.$refs.imgHandler.setParam1(true);
                });
            }, 3000);

            this.$nextTick(()=>{
                // 初始化文件管理
                this.$refs.fileManage.init();
            })
        },
        // 验证是否已选设备
        validSelectDevice() {
            if (!this.deviceInfo.deviceUuid) {
                window.ZXW_VUE.$message.warning('请先选择设备');
                return false;
            }
            return true;
        },
        // 定时同步其他属性
        timeSyncOtherProperty() {
            if (!this.deviceInfo.deviceUuid) {
                return
            }
            let _that = this;
            $.ajax({
                url: getContext() + "/device/getOtherPropertyJson",
                type: "GET",
                dataType: "json",
                data: {
                    "deviceUUID": this.deviceInfo.deviceUuid
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            // json字符串
                            let json = data.data;
                            if (json) {
                                // 解析对象
                                _that.otherProperty = JSON.parse(json);
                            }
                        }
                    }
                },
                error: function (msg) {
                }
            });
        },
        // 发送消息到客户端
        sendMsgToClient(action, messageStr, callback) {
            if (!this.validSelectDevice()) {
                return
            }
            let dataParam = {
                action: action, // 指令 websocketHandler.js中内置的指令  forcedExit 强制退出 remoteHandler 远程处理方法  startPreviewDevice 预览设备  stopPreviewDevice 停止预览设备
                deviceUuid: this.deviceInfo.deviceUuid, // 设备uuid
                message: btoa(messageStr)  // 消息内容  指令为remoteHandler时的参数
                // functionName为utils.js中的方法 functionParam为对应方法的参数
                // '{"functionName":"remoteExecScript","functionParam":["' + encodeURIComponent(scriptContent) + '"]}';
            };
            $.ajax({
                url: getContext() + "/device/sendMessageToClient",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dataParam),
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            window.ZXW_VUE.$notify.success({
                                message: '发送成功',
                                duration: '1000'
                            });
                            if (callback) {
                                callback()
                            }
                        } else {
                            window.ZXW_VUE.$notify.error({
                                message: data.msg,
                                duration: '1000'
                            })
                        }
                    }
                },
                error: function (msg) {
                }
            });
        },
        // 远程执行脚本
        remoteExecuteScript(scriptContent) {
            // 指令为remoteHandler
            // functionName为utils.js中的方法 remoteExecScript  解析传入脚本代码并通过eval执行
            let messageStr = '{"functionName":"remoteExecScript","functionParam":["' + encodeURIComponent(scriptContent) + '"]}';
            this.sendMsgToClient('remoteHandler', messageStr, () => {
            })
        }
    }
});