let template ='<div></div>';
$.ajax({
    url: "/module/index/template/main.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});
import {getContext,urlParam} from "./../../utils/utils.js";

import DeviceInfo from "./component/deviceInfo.js";
import CommonFile from "./component/commonFile.js";
import ImgHandler from "./component/imgHandler.js";
import LayoutAnalysis from "./component/layoutAnalysis.js"
import RemoteScript from "./component/remoteScript.js"
import PreviewDevice from "./component/previewDevice.js"
import RemoteLog from "./component/remoteLog.js";
import FileManage from "./component/fileManage.js";
import PageMatching from "./component/pageMatching.js";

window.ZXW_VUE = new Vue({
    el: "#app",
    components: {
        DeviceInfo: DeviceInfo,
        CommonFile: CommonFile,
        ImgHandler: ImgHandler,
        LayoutAnalysis: LayoutAnalysis,
        RemoteScript: RemoteScript,
        PreviewDevice: PreviewDevice,
        RemoteLog:RemoteLog,
        FileManage:FileManage,
        PageMatching:PageMatching
    },
    template: template,
    data: {
        inputPageAccessPassword:'',
        pageAccessLimit: false,
        pageLoadSuccess:false,
        monacoEditorComplete: false,
        webSocket: null,
        activeTab:'commonFile',
        otherProperty: {// 其他属性对象 同步app端
            orientation: 1,  // 屏幕方向
            debugModel: true,// 调试模式
            debugSleep: 1000,// 调试延时
        },
        deviceInfo: {// 当前设备信息
            startPreview: false,
            deviceUuid: '',
            standardWidth: null,
            standardHeight: null,
            standardConvert: false,
            offsetX: 0,
            offsetY: 0,
            debugModel:true,
            debugSleep:1000
        },
        webDeviceUuid:'',
        webSocketConfig:{
            isHeartData:true,
            isReconnect: true,
            heartTime: 10000,
            reConnectTime: 20000
        },
        heartTimer: null,
        reConnectTimer: null,
        connectOK:false,
        webSocketLog:false,
        fileDialogIsMin: false,
        showFileDialogTab:'',
        showTabScrollTop:0,
        screenDirection: '竖屏'
    },
    computed: {
    },
    watch: {
        otherProperty:{
            handler(val){
                if (!val) {
                    return;
                }
                this.screenDirection = val.orientation === 1 ? "竖屏" : "横屏";
                this.deviceInfo.debugModel = val.debugModel;
                this.deviceInfo.debugSleep = val.debugSleep;
            },
            immediate: true, // 立即触发一次
            deep: true // 可以深度检测到  对象的属性值的变化
        },
        activeTab(val){
            // 执行页面组件初始化方法
            if(this.$refs[val] && this.$refs[val].init){
                this.$refs[val].init()
            }
            if(val === 'previewDevice'){
                this.timeSyncOtherProperty(()=>{
                    this.screenDirection = this.otherProperty.orientation === 1 ? "竖屏" : "横屏";
                });
            }
        },
        pageLoadSuccess(val){
            // 页面加载成功后 建立websocket连接
            if(val){
                this.initWebDeviceWebSocket();
            }
        }
    },
    created(){
    },
    mounted() {
        // 从缓存中读取web设备uuid
        let webDeviceUuidCache = localStorage.getItem("webDeviceUuid");
        // 从参数中获取web设备uuid
        let webDeviceUuidParam =  urlParam("webDeviceUuid");
        // 传入有值 就按传入的设置
        if(webDeviceUuidParam){
            localStorage.setItem("webDeviceUuid",webDeviceUuidParam);
            this.webDeviceUuid = webDeviceUuidParam;
        // 缓存的有值  就按照缓存的取值
        } else if(webDeviceUuidCache){
            this.webDeviceUuid = webDeviceUuidCache;
        // 都没有就随机生成
        } else {
            this.webDeviceUuid = this.generateGuid();
            localStorage.setItem("webDeviceUuid",this.webDeviceUuid);
        }
        this.pageAccessLimit = true;
        // 加载是否需要访问密码
        let _that = this;
        $.ajax({
            url: getContext() + "/device/checkPageAccessLimit",
            type: "get",
            dataType: "json",
            async:false,
            data: {},
            success: function (data) {
                if (data) {
                    if (data.isSuccess) {
                        _that.pageAccessLimit = data.data;
                    }
                }
            },
            error: function (msg) {
            }
        });

        // 需要访问密码
        if(this.pageAccessLimit){
            // 弹出密码输入界面 密码正确后修改标记
            this.$prompt('请输入页面访问密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                $.ajax({
                    url: getContext() + "/device/validatePageAccessPassword",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "inputVal": value
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                // 密码正确
                                if (data.data) {
                                    _that.pageAccessLimit = false;
                                    _that.pageLoadSuccess = true;
                                } else {
                                    window.ZXW_VUE.$notify.error({
                                        message: "访问密码不正确",
                                        duration: '1000'
                                    });
                                    setTimeout(()=>{
                                        window.location.reload();
                                    },500);
                                }
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
            }).catch(() => {
                window.location.reload();
            });
        } else {
            this.pageLoadSuccess = true;
        }
        // 初始化monacoEditor编辑器
        require.config({ paths: { 'vs': '/plugins/monaco-editor/min/vs' }});
        require(['vs/editor/editor.main'],()=>{ this.monacoEditorComplete = true });

        // 初始化ace编辑器
        window.aceRange = ace.require('ace/range').Range;
        // 初始化同步属性
        this.timeSyncOtherProperty();

        window.addEventListener('keydown',(e)=>{
            if(!this.fileDialogIsMin){
                return false;
            }
            if(e.ctrlKey && (e.keyCode === 52 || e.keyCode === 100)){
                e.stopPropagation();
                e.preventDefault();
                this.phoneMaxFileEditorDialog();
                return false;
            }
        },false);
    },
    provide() {
        return {
            validSelectDevice: this.validSelectDevice, // 检验设备选择情况
            sendMsgToClient: this.sendMsgToClient, // 发送websocket消息到app
            remoteExecuteScript: this.remoteExecuteScript, // app端远程执行代码
            getMonacoEditorComplete: ()=>{ return this.monacoEditorComplete },
            updateFileDialogIsMin: (value)=>{
                this.fileDialogIsMin = value;
                // 当前是最小化操作 且记录了历史tab
                if(value && this.showFileDialogTab){
                    // 跳转历史tab
                    this.activeTab = this.showFileDialogTab;
                    this.$nextTick(()=>{
                        // 滚动高度
                        scrollTo(0,this.showTabScrollTop)
                    })
                }
            },
            timeSyncOtherPropertyFun: this.timeSyncOtherProperty // 同步其他属性
        }
    },
    methods: {
        isNumberStr(str) {
            return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
        },
        isJSON(str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    if (typeof obj == 'object' && obj) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }
        },
        // 开始心跳
        startHeart(){
            this.heartTimer = setInterval(() => {
                if(this.webSocketLog){
                  console.log("发送心跳");
                }
                // 发送心跳
                this.webSocket.send("0");
            }, this.webSocketConfig.heartTime)
        },
        // 清除心跳
        clearHeart(){
            if (this.heartTimer) {
                clearInterval(this.heartTimer)
            }
            this.heartTimer = null
        },
        // 重连webSocket
        reConnectSocket(){
            this.reConnectTimer = setInterval(() => {
                console.log("websocket重连！");
                if (!this.connectOK) {
                    this.initWebDeviceWebSocket();
                } else {
                    if (this.reConnectTimer) {
                        clearInterval(this.reConnectTimer)
                    }
                }
            }, this.webSocketConfig.reConnectTime);
        },
        fixedMessageHandler(message){
            switch (message) {
                case "1":
                    if(this.webSocketLog){
                        console.log("回复心跳");
                    }
                    break;
                default:
                    break;
            }
        },
        objectMessageHandler(text){
            if (!this.isJSON(text)) {
                return
            }
            let messageData = JSON.parse(text);
            // 同步其他属性
            if (messageData.action === "syncOtherPropertyJson") {
                let propertyJson = atob(messageData.message);
                this.otherProperty = JSON.parse(propertyJson);
            // 接收app推送消息
            } else if(messageData.action === "appPushNoticeMessage"){
               let sourceMessage = messageData.message;
               let messageString =  sourceMessage.split("&")[0];
               let messagePushChannel = sourceMessage.split("&")[1] || "";
               let messageJson = decodeURI(atob(messageString));
               let messageObj = JSON.parse(messageJson);

               // 包含web
               if(messagePushChannel.indexOf("web")!==-1){
                   let formatMessage = "";
                   formatMessage += "<b>消息标识：</b>" + messageObj["固定内容"]+"<br/>";
                   formatMessage += "<b>来源设备：</b>" + messageObj["来源设备"]+"<br/>";
                   formatMessage += "<b>消息摘要：</b>" + messageObj["通知摘要"]+"<br/>";
                   formatMessage += "<b>消息内容：</b>" + messageObj["通知文本"]+"<br/>";
                   formatMessage += "<b>消息时间：</b>" + messageObj["通知时间"]+"<br/>";
                   formatMessage += "<b>来自应用：</b>" + messageObj["应用包名"]+"<br/>";
                   window.ZXW_VUE.$notify({
                       title: 'APP消息通知',
                       dangerouslyUseHTMLString: true,
                       message: formatMessage,
                       position: 'bottom-right'
                   });
               }
                // 包含app 发送app通知
               if(messagePushChannel.indexOf("app")!==-1){
                   if(window.Android){
                       window.Android.invoke("sendNotification", messageObj, (data) => {
                       })
                   }
               }
            // 接收刷新预览设备图片指令
            } else if(messageData.action === "refreshPreviewImg"){
                // 接收设备 uuid与 当前选中设备uuid一致
                if(messageData.message === this.deviceInfo.deviceUuid){
                    // 调用刷新图片方法
                    window.ZXW_VUE.$EventBus.$emit('refreshPreviewImg');
                }
            }
        },
        // 发送消息到web设备websocket
        sendMessageToWebDeviceWebSocket(action, messageStr){
            if(!window.WebSocket){
                console.log("该环境不支持websocket");
            }
            let dataParam = {
                action: action,
                deviceUuid: this.webDeviceUuid, // 设备uuid
                message: messageStr
            };
            // 发送消息到服务端
            this.webSocket.send(JSON.stringify(dataParam));
        },
        // 初始化web设备websocket连接
        initWebDeviceWebSocket(){
            if(!window.WebSocket){
                console.log("该环境不支持websocket");
            }
            let baseUrl = getContext();
            baseUrl = baseUrl.replace(self.location.protocol,"ws:");
            let webWsUrl = baseUrl + "/autoJsWebWs/" + this.webDeviceUuid;
            this.webSocket = new WebSocket(webWsUrl);

            //客户端收到服务器的方法，这个方法就会被回调
            this.webSocket.onmessage = function (ev) {
                if(_that.webSocketLog){
                    console.log("接收服务端消息",ev);
                }
                let text = ev.data;
                if (_that.isNumberStr(text)) {
                    // 是数字
                    // 固定格式消息处理
                    _that.fixedMessageHandler(text);
                    // 业务处理
                } else if (text) {
                    // 写具体的业务操作
                    _that.objectMessageHandler(text);
                } else {
                    console.log('非法数据，无法解析')
                }
            };
            let _that = this;
            this.webSocket.onopen = function (ev) {
                _that.connectOK = true;
                console.log("与服务器端的websocket连接建立",ev);
                if (_that.webSocketConfig.isHeartData) {
                    _that.clearHeart();
                    _that.startHeart()
                }
                if (_that.reConnectTimer) {
                    clearInterval(_that.reConnectTimer)
                }
                _that.reConnectTimer = null;

                // 设置清空 当前选中App设备
                _that.sendMessageToWebDeviceWebSocket("syncSelectAppDeviceUuid", "");
            };
            this.webSocket.onclose = function (ev) {
                console.log("与服务器端的websocket连接断开",ev);
                // websocket连接异常
                _that.connectOK = false;
                if (_that.webSocketConfig.isHeartData && _that.heartTimer != null) {
                    _that.clearHeart()
                }
                if (_that.reConnectTimer == null && _that.webSocketConfig.isReconnect) {
                    // 执行重连操作
                    _that.reConnectSocket()
                }
            };
        },
        generateGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // 设备表格选择行回调
        deviceSelectRowCallback({deviceInfo,screenDirection}){
            // 更新设备信息
            this.deviceInfo = deviceInfo;
            // 更新屏幕方向
            this.screenDirection = screenDirection;

            // 设置当前选中App设备
            this.sendMessageToWebDeviceWebSocket("syncSelectAppDeviceUuid",this.deviceInfo.deviceUuid);

            // 同步坐标
            setTimeout(() => {
                this.$nextTick(() => {
                    // 坐标全屏
                    this.$refs.imgHandler.setParam1(false);
                });
            }, 2000);

            this.$nextTick(()=>{
                // 初始化文件管理
                this.$refs.fileManage.init();
                // 初始化远程脚本自定义模块
                this.$refs.remoteScript.initCustomScript();
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
        timeSyncOtherProperty(callback) {
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
                                if(callback){
                                    callback();
                                }
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
            // 存在中文的进行encodeURIComponent编码
            let message = messageStr && escape(messageStr).indexOf("%u") > 0 ? btoa(encodeURIComponent(messageStr)) : btoa(messageStr);
            let dataParam = {
                action: action, // 指令 websocketHandler.js中内置的指令  forcedExit 强制退出 remoteHandler 远程处理方法  startPreviewDevice 预览设备  stopPreviewDevice 停止预览设备
                deviceUuid: this.deviceInfo.deviceUuid, // 设备uuid
                message: message   // 消息内容  指令为remoteHandler时的参数
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
                            if(!window.hideRemoteScriptNotify){
                                window.ZXW_VUE.$notify.success({
                                    message: '发送成功',
                                    duration: '1000'
                                });
                            }
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
        remoteExecuteScript(scriptContent,callback) {
            // 指令为remoteHandler
            // functionName为utils.js中的方法 remoteExecScript  解析传入脚本代码并通过eval执行
            let messageStr = '{"functionName":"remoteExecScript","functionParam":["' + encodeURIComponent(scriptContent) + '"]}';
            this.sendMsgToClient('remoteHandler', messageStr, () => {
                if (callback) {
                    callback()
                }
            })
        },
        // 编辑器最大化
        phoneMaxFileEditorDialog(){
            this.$nextTick(()=>{
                // 记录当前tab
                this.showFileDialogTab = this.activeTab;

                // 获取当前body高度
                this.showTabScrollTop =  document.documentElement.scrollTop;

                // 然后切换到文件管理
                this.activeTab = 'fileManage';
                this.$refs.fileManage.phoneMaxFileEditorDialog();
            });
        },
        bodyScrollTop(){
            window.scrollTo(0, 0);
        },
        bodyScrollBottom(){
            window.scrollTo(0, document.documentElement.scrollHeight);
        }
    }
});
window.ZXW_VUE.$EventBus = new Vue();