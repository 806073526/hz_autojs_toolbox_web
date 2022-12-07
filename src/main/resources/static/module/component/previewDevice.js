import {getContext} from "./../../utils/utils.js";
let template='' +
    '<div>' +
    '<p class="basicInfo">预览设备</p>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="预览质量:" prop="imgQuality" class="width25">' +
    '            <el-input type="number"' +
    '                      v-model="devicePreviewParam.imgQuality" placeholder=""' +
    '                      oninput="if(value.length>10)value=value.slice(0,10)"' +
    '                      min="0"' +
    '                      max="100"' +
    '                      @change="autoDevicePreview"' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="缩放倍数:" prop="scale" class="width25">' +
    '            <el-input type="number"' +
    '                      v-model="devicePreviewParam.imgScale" placeholder=""' +
    '                      oninput="if(value.length>10)value=value.slice(0,10)"' +
    '                      min="0"' +
    '                      step="0.1"' +
    '                      max="1"' +
    '                      @change="autoDevicePreview"' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="预览高度:" prop="scale" class="width25">' +
    '            <el-input type="number"' +
    '                      v-model="devicePreviewParam.previewHeight" placeholder=""' +
    '                      min="0"' +
    '                      max="5000"' +
    '                      @change="autoDevicePreview"' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="预览阈值:" prop="scale" class="width25">' +
    '            <el-input type="number"' +
    '                      v-model="devicePreviewParam.imgThreshold" placeholder=""' +
    '                      oninput="if(value.length>10)value=value.slice(0,10)"' +
    '                      min="0"' +
    '                      max="255"' +
    '                      @change="autoDevicePreview"' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '    </div>' +
    '</el-row>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="APP刷新:" prop="appSpace" class="width25">' +
    '            <el-input type="number"' +
    '                      v-model="devicePreviewParam.appSpace" placeholder=""' +
    '                      oninput="if(value.length>10)value=value.slice(0,10)"' +
    '                      min="10"' +
    '                      step="10"' +
    '                      max="5000"' +
    '                      @change="autoDevicePreview"' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="浏览器刷新:" prop="clientSpace" class="width25">' +
    '            <el-input type="number"' +
    '                      v-model="devicePreviewParam.clientSpace" placeholder=""' +
    '                      oninput="if(value.length>10)value=value.slice(0,10)"' +
    '                      min="10"' +
    '                      step="10"' +
    '                      max="5000"' +
    '                      @change="autoDevicePreview"' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="操作记录:" prop="clientSpace" class="width50">' +
    '            <el-input type="textarea"' +
    '                      v-model="devicePreviewParam.operateRecord" placeholder=""' +
    '                      class="width100"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '    </div>' +
    '</el-row>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="设备预览:" prop="previewImg" class="width100">' +
    '            <div>x:{{deviceMousePosition.x }} y:{{deviceMousePosition.y}}</div>' +
    '            <div style="display: flex;justify-content: flex-end;align-items: center;text-align: center;width: 100%">' +
    '                <el-button type="warning" size="mini" style="margin-left:10px" @click.stop.prevent="fixedOperate(\'home\')">主页</el-button>' +
    '                <el-button type="warning" size="mini" style="margin-left:10px" @click.stop.prevent="fixedOperate(\'back\')">返回</el-button>' +
    '                <el-button type="warning" size="mini" style="margin-left:10px" @click.stop.prevent="fixedOperate(\'recents\')">任务</el-button>' +
    '                <el-button type="warning" size="mini" style="margin-left:10px" @click.stop.prevent="fixedOperate(\'quickSettings\')">通知</el-button>' +
    '                <el-button type="warning" size="mini" style="margin-left:10px" @click.stop.prevent="fixedOperate(\'powerDialog\')">电源</el-button>' +
    '                <el-button type="info" size="mini" style="margin-left:10px" @click.stop.prevent="devicePreviewParam.operateRecord = \'\'">清空操作记录</el-button>' +
    '            </div>' +
    '            <div style="display: flex;justify-content: flex-end;align-items: center;text-align: center;width: 100%">' +
    '                <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px;">' +
    '                    <span>开启灰度化：</span>' +
    '                    <el-switch v-model="devicePreviewParam.isOpenGray" @change="autoDevicePreview"/>' +
    '                </div>' +
    '                <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px;">' +
    '                    <span>开启阈值化：</span>' +
    '                    <el-switch v-model="devicePreviewParam.isOpenThreshold" @change="autoDevicePreview"/>' +
    '                </div>' +
    '                <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px;">' +
    '                    <span>参数变化后自动预览：</span>' +
    '                    <el-switch v-model="devicePreviewParam.valueUpdateAfterAutoPreview" />' +
    '                </div>' +
    '                <el-button type="primary" size="mini" style="margin-left:10px" id="loadPreviewImg"' +
    '                       @click.stop.prevent="startPreviewDevice(true)">开始预览' +
    '                </el-button>' +
    '                <el-button type="info" size="mini" style="margin-left:10px"' +
    '                       @click.stop.prevent="stopPreviewDevice(true)">停止预览' +
    '                </el-button>' +
    '            </div>' +
    '            <div style="min-height: 40vh;width: 100%;display: flex;justify-content: center;align-items: center;text-align: center;">' +
    '                <div style="font-size: 20px;color: rgba(29,140,128,0.29)">' +
    '                    <img id="devicePreviewImg"  draggable="false"' +
    '                      style="width: auto;margin: 0; padding: 0;height: 500px;max-width: 100%;"/>' +
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