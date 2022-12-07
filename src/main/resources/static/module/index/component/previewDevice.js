import {getContext} from "./../../../utils/utils.js";
let template='<div></div>';
$.ajax({
    url: "/module/index/template/previewDevice.html",
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
            devicePreviewParam: { // 设备预览参数
                imgQuality: 10,
                imgScale: 1,
                previewHeight: 500,
                isOpenGray: false,
                isOpenThreshold: false,
                imgThreshold: 60, // 图片阈值相似度
                appSpace: 500,
                clientSpace: 500,
                valueUpdateAfterAutoPreview: false,
                operateRecord: ''
            },
            deviceMousePosition: { // 设备鼠标坐标
                x: 0,
                y: 0
            },
            remoteHandler: {
                param4: {
                    scriptText: ''
                }
            }
        }
    },
    methods: {
        // 开始预览设备
        startPreviewDevice(notice) {
            let messageStr = JSON.stringify(this.devicePreviewParam);
            this.sendMsgToClient('startPreviewDevice', messageStr, () => {
                this.deviceInfo.startPreview = true;
                if (notice) {
                    window.ZXW_VUE.$notify.success({
                        message: '开始预览',
                        duration: '500'
                    })
                }
                if (window.refreshDeviceInterval) {
                    clearInterval(window.refreshDeviceInterval)
                }
                $("#devicePreviewImg").css("height", this.devicePreviewParam.previewHeight + "px");
                window.refreshDeviceInterval = setInterval(() => {
                    window.deviceImgUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/tempImg.jpg" + "?t=" + new Date().getTime();
                    $("#devicePreviewImg").attr("src", window.deviceImgUrl);
                    window.deviceImgUrlBak = window.deviceImgUrl
                }, this.devicePreviewParam.clientSpace);


                let devicePreviewBox = document.querySelector('#devicePreviewImg');
                devicePreviewBox.removeEventListener('mousemove', this.deviceMouseMove);
                devicePreviewBox.addEventListener('mousemove', this.deviceMouseMove);

                devicePreviewBox.removeEventListener('click', this.deviceMouseClick);
                devicePreviewBox.addEventListener('click', this.deviceMouseClick);

                devicePreviewBox.removeEventListener('mousedown', this.deviceMouseDown);
                devicePreviewBox.addEventListener('mousedown', this.deviceMouseDown, true);

                devicePreviewBox.removeEventListener('mouseup', this.deviceMouseUp);
                devicePreviewBox.addEventListener('mouseup', this.deviceMouseUp, true);
            })
        },
        // 停止预览设备
        stopPreviewDevice(notice, callback) {
            this.sendMsgToClient('stopPreviewDevice', '', () => {
                this.deviceInfo.startPreview = false;
                if (notice) {
                    window.ZXW_VUE.$notify.success({
                        message: '停止预览',
                        duration: '500'
                    })
                }
                if (window.refreshDeviceInterval) {
                    clearInterval(window.refreshDeviceInterval)
                }
                if (callback) {
                    callback()
                }
            })
        },
        // 自动预览设备
        autoDevicePreview() {
            if (!this.devicePreviewParam.valueUpdateAfterAutoPreview) {
                return
            }
            this.stopPreviewDevice(false, () => {
                this.startPreviewDevice(false)
            })
        },
        // 固定操作
        fixedOperate(operateName) {
            if (!this.deviceInfo.startPreview) {
                return
            }
            let operateCode = operateName + '()';
            this.devicePreviewParam.operateRecord += operateCode + ";";
            this.remoteExecuteScript(operateCode);
        },
        // 设备鼠标点击
        deviceMouseClick() {
            if (!this.deviceInfo.startPreview) {
                return
            }
            let resetPosition = function () {
                // 重置位置
                window.deviceMouseX1 = 0;
                window.deviceMouseY1 = 0;
                window.deviceMouseStartTime = 0;
                window.deviceMouseX2 = 0;
                window.deviceMouseY2 = 0;
                window.deviceMouseEndTime = 0;
            };
            let positionVal1 = window.deviceMouseX1 + "," + window.deviceMouseY1;
            let positionVal2 = window.deviceMouseX2 + "," + window.deviceMouseY2;
            // 坐标不相同
            if (positionVal1 !== positionVal2) {
                resetPosition();
                return;
            }
            let operateCode = 'click(' + this.deviceMousePosition.x + ',' + this.deviceMousePosition.y + ')';
            this.remoteExecuteScript(operateCode);
            this.devicePreviewParam.operateRecord += operateCode + ";";
        },
        // 设备鼠标按下
        deviceMouseDown(e) {
            // 按下记录开始鼠标位置
            window.deviceMouseX1 = this.deviceMousePosition.x;
            window.deviceMouseY1 = this.deviceMousePosition.y;
            window.deviceMouseStartTime = new Date().getTime();
        },
        // 设备鼠标移动
        deviceMouseMove(e) {
            let box = document.querySelector('#devicePreviewImg');
            // 竖屏
            if (this.screenDirection === "竖屏") {
                this.deviceMousePosition.x = Number(e.offsetX * (this.deviceInfo.screenWidth / box.width)).toFixed(0);
                this.deviceMousePosition.y = Number(e.offsetY * (this.deviceInfo.screenHeight / box.height)).toFixed(0);
                // 横屏
            } else if (this.screenDirection === "横屏") {
                this.deviceMousePosition.x = Number(e.offsetX * (this.deviceInfo.screenHeight / box.width)).toFixed(0);
                this.deviceMousePosition.y = Number(e.offsetY * (this.deviceInfo.screenWidth / box.height)).toFixed(0);
            }
        },
        // 设备鼠标松开
        deviceMouseUp(e) {
            // 松开记录结束鼠标位置
            window.deviceMouseX2 = this.deviceMousePosition.x;
            window.deviceMouseY2 = this.deviceMousePosition.y;
            window.deviceMouseEndTime = new Date().getTime();

            let positionVal1 = window.deviceMouseX1 + "," + window.deviceMouseY1;
            let positionVal2 = window.deviceMouseX2 + "," + window.deviceMouseY2;
            // 坐标值不相同
            if (positionVal1 !== positionVal2) {
                if (!this.deviceInfo.startPreview) {
                    return
                }
                let operateCode = 'swipe(' + window.deviceMouseX1 + ',' + window.deviceMouseY1 + ',' + window.deviceMouseX2 + ',' + window.deviceMouseY2 + ',' + (window.deviceMouseEndTime - window.deviceMouseStartTime) + ')';
                this.devicePreviewParam.operateRecord += operateCode + ";";
                // 发送滑动指令
                this.remoteExecuteScript(operateCode);
                // 坐标相同
            } else {
                // 大于500毫秒 即为长按
                if (window.deviceMouseEndTime - window.deviceMouseStartTime > 500) {
                    if (!this.deviceInfo.startPreview) {
                        return
                    }
                    let operateCode = 'longClick(' + window.deviceMouseX1 + ',' + window.deviceMouseY1 + ')';
                    this.devicePreviewParam.operateRecord += operateCode + ";";
                    // 发送长按指令
                    this.remoteExecuteScript(operateCode);
                }
            }
        },
    }
}