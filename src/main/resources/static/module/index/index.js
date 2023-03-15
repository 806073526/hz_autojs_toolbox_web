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
import FileManage from "./component/fileManage.js";
import PageMatching from "./component/pageMatching.js";

window.ZXW_VUE = new Vue({
    el: "#app",
    components: {
        DeviceInfo: DeviceInfo,
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
        monacoEditorComplete: false,
        activeTab:'imgHandler',
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
        fileDialogIsMin: false,
        showFileDialogTab:'',
        showTabScrollTop:0,
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
        },
        activeTab(val){
            // 执行页面组件初始化方法
            if(this.$refs[val] && this.$refs[val].init){
                this.$refs[val].init()
            }
        }
    },
    mounted() {
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
        }

        require.config({ paths: { 'vs': '/plugins/monaco-editor/min/vs' }});
        require(['vs/editor/editor.main'],()=>{ this.monacoEditorComplete = true });
        this.timeSyncOtherProperty();
        // 每3秒同步一次其他属性
        setInterval(() => {
            this.timeSyncOtherProperty()
        }, 3 * 1000)
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
            }
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
                    this.$refs.imgHandler.setParam1(false);
                });
                // 选择表格行时 立即同步一次属性 并且赋值调试模式 调试时长
                this.timeSyncOtherProperty(()=>{
                    this.deviceInfo.debugModel = this.otherProperty.debugModel;
                    this.deviceInfo.debugSleep = this.otherProperty.debugSleep;
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