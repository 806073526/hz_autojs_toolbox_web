import {getContext} from "./../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/previewDevice.html",
    type: 'get',
    async: false,
    success: function (res) {
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
            textContent: '',// 文本信息传输
            textIndex: null, // 文本传输序号
            textType: 'text',// 文本传输类型
            previewActiveName: 'previewParam',
            openNoticeMessageListenerFlag: false,
            noticeListenerRules: [],// 通知监听规则
            historyNoticeMessageList:[],// 历史通知消息列表
            tableDefaultRowMap: {// 默认行数据
                noticeListenerRules: {
                    matchingPackageName: "",
                    matchingText: "",
                    autoClick: false,
                    receiveEmail: "",
                    executeScript: ""
                }
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
        // 表格添加行
        tableAddRow(tableName, index) {
            let defaultObj = this.tableDefaultRowMap[tableName];
            let tableArr = this[tableName];
            if (index === -1) {
                tableArr.push(JSON.parse(JSON.stringify(defaultObj)));
            } else {
                tableArr.splice(index + 1, 0, JSON.parse(JSON.stringify(defaultObj)));
            }
        },
        // 表格删除行
        tableDeleteRow(tableName,index){
            let tableArr = this[tableName];
            window.ZXW_VUE.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                tableArr.splice(index, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
            });
        },
        // 建设中
        building(){
            window.ZXW_VUE.$notify.success({message: '建设中', duration: '1000'});
        },
        // 发送文本
        sendTextContent() {
            if (!this.validSelectDevice()) {
                return;
            }
            let remoteScript = "";
            let param = this.textIndex !== null ? (this.textIndex + ',"' + this.textContent + '"') : '"' + this.textContent + '"';
            // 覆盖
            if (this.textType === 'text') {
                remoteScript = 'setText(' + param + ')';
                // 输入
            } else {
                remoteScript = 'input(' + param + ')';
            }
            this.remoteExecuteScript(remoteScript);
        },
        // 远程脚本查询
        queryRemoteScript() {

        },
        // 关闭远程脚本
        closeRemoteScript() {

        },
        // 定时任务查询
        queryTimerTask() {

        },
        // 关闭定时任务
        closeTimerTask() {

        },
        // 消息通知查询
        queryNoticeMessage() {

        },
        // 开启通知消息监听
        openNoticeMessageListener() {
            let remoteExecuteScript = `
            let deviceUUID = '${this.deviceInfo.deviceUuid}'
            let matchingRules = [];
            events.removeAllListeners('notification');
            events.observeNotification();
            events.onNotification(function(notification) {
                let messageObj = {
                    "应用包名": notification.getPackageName(),
                    "通知文本": notification.getText(),
                    "通知优先级": notification.priority,
                    "通知目录": notification.category,
                    "通知时间": new Date(notification.when),
                    "通知数": notification.number,
                    "通知摘要": notification.tickerText
                }
                matchingRules.forEach(item=>{
                    if ((!item.matchingPackageName || messageObj["应用包名"].indexOf(item.matchingPackageName) !== -1) && (!item.matchingText || messageObj["通知文本"].indexOf(item.matchingText) !== -1)) {
                        if (item.autoClick) {
                            notification.click();
                        }
                        sleep(1000);
                        // 发送邮件消息
                        if (item.receiveEmail) {
                            utilsObj.request("/attachmentInfo/sendEmailMessage?receiveEmail=" + item.receiveEmail + "&title=" + item.title + "&message=" + item.message, "GET", null, () => {
                                toastLog("发送成功")
                            });
                        }
                        // 记录通知
                        utilsObj.request("/attachmentInfo/writeNoticeMessage?deviceUUID=" + deviceUUID + "&message=" + item.message, "GET", null, () => {
                            // 如果有代码则执行
                            if (item.executeScript) {
                                //执行代码
                                eval(item.executeScript);
                            }
                        });
                    }
                })
            });
        `;
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