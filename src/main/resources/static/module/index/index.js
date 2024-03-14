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
        defaultWindowHeight: '800px',
        defaultWindowWidth: '400px',
        deviceMousePosition:{
            x:0,
            y:0
        },
        inputPageAccessPassword:'',
        pageAccessLimit: false,
        pageLoadSuccess:false,
        monacoEditorComplete: false,
        webSocket: null,
        activeTab:'fileManage',
        randomKey: Math.random(),
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
        screenDirection: '竖屏',
        openLogWindow:false, // 日志悬浮窗显示
        openScreenWindow:false, // 预览屏幕悬浮窗显示
        showWindowLog:true, // 最小化日志悬浮窗
        windowLogContent:'', // 日志内容
        cacheLogWindowHeight: 300,
        fixedLogPosition:false,
        darkTheme: true
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
        screenDirection(val){
            // 如果当前悬浮窗是开启的
            if(this.openScreenWindow){
                // 刷新悬浮窗状态
                this.refreshFloatScreenWindowFun();
            }
        },
        activeTab(val){
            // 执行页面组件初始化方法
            if(this.$refs[val] && this.$refs[val].init){
                this.$refs[val].init()
            }
            window.activeTab = val;
            if(val === 'previewDevice' || val === 'imgHandler' || val === 'layoutAnalysis'){
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

        this.darkTheme = (window.localStorage.getItem('darkTheme') || 'true') === 'true';
        this.fixedLogPosition = (window.localStorage.getItem('fixedLogPosition') || 'false') === 'true';

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

        let interval = setInterval(()=>{
            if(window.ZXW_VUE.$EventBus){
                window.ZXW_VUE.$EventBus.$off('initModule',this.initModule);
                window.ZXW_VUE.$EventBus.$on('initModule', this.initModule);

                window.ZXW_VUE.$EventBus.$off('refreshScrollHeight',this.refreshScrollHeight);
                window.ZXW_VUE.$EventBus.$on('refreshScrollHeight', this.refreshScrollHeight);
                clearInterval(interval);
            }
        },1000);
        setTimeout(()=>{
             clearInterval(interval);
        },10000)
    },
    provide() {
        return {
            validSelectDevice: this.validSelectDevice, // 检验设备选择情况
            sendMsgToClient: this.sendMsgToClient, // 发送websocket消息到app
            forwardFileManage: this.forwardFileManage, // 跳转文件管理模块
            changeActiveTab: this.changeActiveTab,// 切换tab
            remoteExecuteScript: this.remoteExecuteScript, // app端远程执行代码
            remoteExecuteScriptByServer: this.remoteExecuteScriptByServer, // 服务端远程执行代码
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
            changeLogWindow:(value)=>{
                this.openLogWindow = value;
                // 开启后
                if(this.openLogWindow){
                    this.dragBoxFun()
                }
            },
            // 提供给子模块调用
            changeScreenWindow:(value)=>{
                // 注册事件  用于处理 先开启悬浮窗 再预览的情况
                window.ZXW_VUE.$EventBus.$off('refreshFloatScreenWindow',this.refreshFloatScreenWindowFun);
                window.ZXW_VUE.$EventBus.$on('refreshFloatScreenWindow',this.refreshFloatScreenWindowFun);
                // 处理悬浮窗内容
                this.changeScreenWindowFun(value);
            },
            copyToClipboard:(value)=>{
                this.copyToClipboardFun(value);
            },
            readTextFromClipboard:()=>{
                let result = this.readTextFromClipboardFun();
                console.log(result);
                return result;
            },
            timeSyncOtherPropertyFun: this.timeSyncOtherProperty // 同步其他属性
        }
    },
    methods: {
        // 切换黑暗主题
        changeDarkTheme(){
          this.darkTheme = !this.darkTheme;
          window.localStorage.setItem('darkTheme',this.darkTheme);
        },
        // 切换固定标识
        changeFixedLogPosition(){
            this.fixedLogPosition = !this.fixedLogPosition;
            window.localStorage.setItem('fixedLogPosition',this.fixedLogPosition);
        },
        // 刷新悬浮窗状态(重新开启)
        refreshFloatScreenWindowFun(){
            // 先关闭
            this.changeScreenWindowFun(false);
            this.$nextTick(()=>{
                // 再打开
                this.changeScreenWindowFun(true);
            });
        },
        // 处理悬浮窗内容
        changeScreenWindowFun(value){
            // 控制悬浮窗显示 隐藏
            this.openScreenWindow = value;
            if(!this.openScreenWindow){
                // 移除事件注册
                window.ZXW_VUE.$EventBus.$off('syncScreenContent',this.syncScreenContentFun);
                // 关闭开关
                if(this.$refs['previewDevice']){
                    this.$refs['previewDevice'].openFloatWindow = false;
                }
                return;
            }


            // 开启后
            if(this.openScreenWindow){
                // 预览屏幕悬浮窗 拖拽事件注册
                this.dragBoxScreenFun();

                // 打开开关
                if(this.$refs['previewDevice']){
                    this.$refs['previewDevice'].openFloatWindow = true;
                }
            }

            // 注册同步屏幕方法
            window.ZXW_VUE.$EventBus.$off('syncScreenContent',this.syncScreenContentFun);
            window.ZXW_VUE.$EventBus.$on('syncScreenContent', this.syncScreenContentFun);

            // 预览屏幕悬浮窗  操作屏幕 相关事件转发
            this.$nextTick(()=>{
                // 获取要转发事件的元素
                let sourceElement = document.getElementById('windowScreenDiv');

                let targetElement = document.getElementById("devicePreviewImg");
                window.targetCacheTop = targetElement.getBoundingClientRect().top;
                window.targetCacheLeft = targetElement.getBoundingClientRect().left;


                window.targetCacheClientWidth = targetElement.clientWidth;
                window.targetCacheClientHeight = targetElement.clientHeight;

                sourceElement.addEventListener("mousemove",this.forwardEventHandler);
                sourceElement.addEventListener("click",this.forwardEventHandler);
                sourceElement.addEventListener("mousedown",this.forwardEventHandler);
                sourceElement.addEventListener("mouseup",this.forwardEventHandler);

                // 预览屏幕悬浮窗 面板默认大小设置
                let proportion = this.deviceInfo.standardWidth/this.deviceInfo.standardHeight;
                if(this.screenDirection === '竖屏'){
                    this.defaultWindowWidth = '400px';
                    // 动态计算比例
                    this.defaultWindowHeight = proportion ? ((400/proportion)+25) + 'px' : '800px';
                } else {
                    this.defaultWindowWidth = '800px';
                    // 动态计算比例
                    this.defaultWindowHeight = proportion ? 800 * proportion + 'px' : '400px';
                }

                this.$nextTick(()=>{
                    let drag = document.getElementById('windowScreenBox');
                    // 预览屏幕悬浮窗 面板大小 读取缓存宽高
                    let screenWindowSizeCache = window.localStorage.getItem(this.screenDirection+'screenWindowSizeCache');
                    let screenWindowSizeJson = screenWindowSizeCache || "";
                    let screenWindowSizeObj = screenWindowSizeJson ? JSON.parse(screenWindowSizeJson) : {"width":"","height":""};
                    // 如果缓存有宽高 则设置宽高
                    if(screenWindowSizeObj.width){
                        drag.style.width =  screenWindowSizeObj.width;
                    }
                    if(screenWindowSizeObj.height){
                        drag.style.height =  screenWindowSizeObj.height;
                    }

                    // 预览屏幕悬浮窗 缩放面板事件注册
                    const resizeObserver = new ResizeObserver((entries)=> {
                        this.windowScreenResizeFun();
                    });
                    resizeObserver.disconnect();
                    resizeObserver.observe(drag);

                    // 预览屏幕 悬浮窗 操作按钮 位置定位计算
                    let dragToolBox = document.getElementById('floatWindowToolBar');

                    let screenToolWindowPositionCache = window.localStorage.getItem('screenToolWindowPositionCache');
                    let screenToolWindowPositionJson = screenToolWindowPositionCache || "";
                    let screenToolWindowPositionObj = screenToolWindowPositionCache ? JSON.parse(screenToolWindowPositionJson) : {"top":"","left":""};
                    if(screenToolWindowPositionObj.top){
                        dragToolBox.style.right = null;
                        dragToolBox.style.top = screenToolWindowPositionObj.top;
                    }
                    if(screenToolWindowPositionObj.left){
                        dragToolBox.style.left = screenToolWindowPositionObj.left;
                    }

                    let dragWidth = Number((drag.style.width).replace('px',''));
                    let dragTop = Number((drag.style.top).replace('px',''));
                    if(!screenToolWindowPositionObj.left){
                        dragToolBox.style.right = (dragWidth + 10) + 'px';
                    }
                    dragToolBox.style.top = dragTop + 'px';
                });
            });
        },
        // 定义事件处理函数
        forwardEventHandler(event) {
            let sourceElement = document.getElementById('windowScreenDiv');
            let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
            if(previewDevice){
                let eventObj = {
                    offsetX:event.offsetX*(window.targetCacheClientWidth /sourceElement.clientWidth),
                    offsetY:event.offsetY*(window.targetCacheClientHeight /sourceElement.clientHeight)
                };
                let eventTypeMap = {
                    'mousemove':'deviceMouseMove',
                    'click':'deviceMouseClick',
                    'mousedown':'deviceMouseDown',
                    'mouseup':'deviceMouseUp'
                };
                let funName = eventTypeMap[event.type];
                if(previewDevice[funName] && typeof previewDevice[funName] === 'function'){
                    previewDevice[funName](eventObj);
                }
            }
            if(event.type === 'mousemove'){
                let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
                if(previewDevice && previewDevice.deviceMousePosition){
                    this.deviceMousePosition.x = previewDevice.deviceMousePosition.x  || 0;
                    this.deviceMousePosition.y = previewDevice.deviceMousePosition.y  || 0;
                }
            }
        },
        // 同步屏幕内容方法
        syncScreenContentFun(){
            // 将预览屏幕内容 添加到悬浮窗中
            let devicePreviewImgParent = document.getElementById('devicePreviewImgParent');
            let clonedContent = devicePreviewImgParent.cloneNode(true);

            let childrenNodes = clonedContent.childNodes;
            if(childrenNodes && childrenNodes.length){
                for (let i = childrenNodes.length -1; i >= 0 ; i--) {
                    let item = childrenNodes[i];
                    let curId = item.id || "";
                    if(curId === 'devicePreviewImg'){
                        childrenNodes[i].id = curId + "_copy"
                    } else {
                        clonedContent.removeChild(item);
                    }
                }
            }
            clonedContent.id = clonedContent.id + "_copy";
            // 获取悬浮窗dom
            let windowScreenDivDom = document.getElementById('windowScreenDiv');
            let childNodes = windowScreenDivDom.childNodes;
            // 替换子元素
            windowScreenDivDom.replaceChild(clonedContent,childNodes[0]);
        },
        // 日志悬浮窗变化方法
        windowLogResizeFun(){
            let drag = document.getElementById('windowLogBox');
            if(!drag){
                return;
            }
            let logWindowSizeCache = window.localStorage.getItem('logWindowSizeCache');
            let logWindowSizeJson = logWindowSizeCache || "";
            let logWindowSizeObj = logWindowSizeJson ? JSON.parse(logWindowSizeJson) : {"width":"","height":""};
            logWindowSizeObj.width = drag.clientWidth;
            logWindowSizeObj.height = drag.clientHeight;
            if(logWindowSizeObj.height > 35){
                this.cacheLogWindowHeight = logWindowSizeObj.height;
            }
            window.localStorage.setItem('logWindowSizeCache',JSON.stringify(logWindowSizeObj));
        },
        // 预览屏幕悬浮窗变化方法
        windowScreenResizeFun(){
            let drag = document.getElementById('windowScreenBox');
            if(!drag){
                return;
            }

            let screenWindowSizeCache = window.localStorage.getItem(this.screenDirection+'screenWindowSizeCache');
            let screenWindowSizeJson = screenWindowSizeCache || "";
            let screenWindowSizeObj = screenWindowSizeJson ? JSON.parse(screenWindowSizeJson) : {"width":"","height":""};
            screenWindowSizeObj.width = drag.style.width;
            screenWindowSizeObj.height = drag.style.height;
            window.localStorage.setItem(this.screenDirection+'screenWindowSizeCache',JSON.stringify(screenWindowSizeObj));
        },
        dragBoxFun(){
            this.$nextTick(()=>{
                let drag = document.getElementById('windowLogBox');
                let dragTool = document.getElementById('windowLogBoxTool');
                if(!drag || !dragTool){
                    return;
                }
                // 获取缓存位置
                let logWindowPositionCache = window.localStorage.getItem('logWindowPositionCache');
                let logWindowPositionJson = logWindowPositionCache || "";
                let logWindowPositionObj = logWindowPositionJson ? JSON.parse(logWindowPositionJson) : {"top":"","left":""};
                // 如果缓存位置有值 则更新初始位置
                if(logWindowPositionObj.top){
                    drag.style.top = logWindowPositionObj.top;
                }
                if(logWindowPositionObj.left){
                    drag.style.left = logWindowPositionObj.left;
                }

                // 读取缓存宽高
                let logWindowSizeCache = window.localStorage.getItem('logWindowSizeCache');
                let logWindowSizeJson = logWindowSizeCache || "";
                let logWindowSizeObj = logWindowSizeJson ? JSON.parse(logWindowSizeJson) : {"width":"","height":""};
                // 如果缓存有宽高 则设置宽高
                if(logWindowSizeObj.width){
                    drag.style.width =  logWindowSizeObj.width + 'px';
                }
                if(logWindowSizeObj.height){
                    drag.style.height =  logWindowSizeObj.height + 'px';
                    if(Number(logWindowSizeObj.height)<=35){
                        this.showWindowLog = false;
                    }
                }

                this.$nextTick(()=>{
                    // 注册监听
                    const resizeObserver = new ResizeObserver((entries)=> {
                        this.windowLogResizeFun();
                    });
                    resizeObserver.disconnect();
                    resizeObserver.observe(drag);
                });

                dragTool.onmousedown = (e) => {
                    let dragX = e.clientX - drag.offsetLeft;
                    let dragY = e.clientY - drag.offsetTop;
                    document.onmousemove = function (e) {
                        let left = e.clientX - dragX;
                        let top = e.clientY - dragY;
                        if (left < 0) {
                            left = 0;
                        } else if (left > window.innerWidth - dragTool.offsetWidth) {
                            left = window.innerWidth - dragTool.offsetWidth;
                        }
                        if (top < 0) {
                            top = 0
                        } else if (top > window.innerHeight - dragTool.offsetHeight) {
                            top = window.innerHeight - dragTool.offsetHeight;
                        }
                        drag.style.top = top + 'px';
                        drag.style.left = left + 'px';

                        // 拖动之后缓存位置
                        let logWindowPositionCache = window.localStorage.getItem('logWindowPositionCache');
                        let logWindowPositionJson = logWindowPositionCache || "";
                        let logWindowPositionObj = logWindowPositionJson ? JSON.parse(logWindowPositionJson) : {"top":"","left":""};
                        logWindowPositionObj.top = drag.style.top;
                        logWindowPositionObj.left = drag.style.left;
                        window.localStorage.setItem('logWindowPositionCache',JSON.stringify(logWindowPositionObj));
                    };
                    document.onmouseup = function (e) {
                        this.onmouseup = null;
                        this.onmousemove = null;
                    }
                }
            });
        },
        // 预览屏幕悬浮窗 拖拽事件注册
        dragBoxScreenFun(){
            this.$nextTick(()=>{
                let drag = document.getElementById('windowScreenBox');
                let dragTool = document.getElementById('windowScreenBoxTool');
                if(!drag || !dragTool){
                    return;
                }

                // 获取缓存位置
                let screenWindowPositionCache = window.localStorage.getItem('screenWindowPositionCache');
                let screenWindowPositionJson = screenWindowPositionCache || "";
                let screenWindowPositionObj = screenWindowPositionJson ? JSON.parse(screenWindowPositionJson) : {"top":"","left":""};
                // 如果缓存位置有值 则更新初始位置
                if(screenWindowPositionObj.top){
                    drag.style.top = screenWindowPositionObj.top;
                }
                if(screenWindowPositionObj.left){
                    drag.style.left = screenWindowPositionObj.left;
                }

                dragTool.onmousedown = (e) => {
                    let dragX = e.clientX - drag.offsetLeft;
                    let dragY = e.clientY - drag.offsetTop;
                    document.onmousemove = function (e) {
                        let left = e.clientX - dragX;
                        let top = e.clientY - dragY;
                        if (left < 0) {
                            left = 0;
                        } else if (left > window.innerWidth - dragTool.offsetWidth) {
                            left = window.innerWidth - dragTool.offsetWidth;
                        }
                        if (top < 0) {
                            top = 0
                        } else if (top > window.innerHeight - dragTool.offsetHeight) {
                            top = window.innerHeight - dragTool.offsetHeight;
                        }
                        drag.style.top = top + 'px';
                        drag.style.left = left + 'px';

                        // 拖动之后缓存位置
                        let screenWindowPositionCache = window.localStorage.getItem('screenWindowPositionCache');
                        let screenWindowPositionJson = screenWindowPositionCache || "";
                        let screenWindowPositionObj = screenWindowPositionJson ? JSON.parse(screenWindowPositionJson) :  {"top":"","left":""};
                        screenWindowPositionObj.top = drag.style.top;
                        screenWindowPositionObj.left = drag.style.left;
                        window.localStorage.setItem('screenWindowPositionCache',JSON.stringify(screenWindowPositionObj));


                        let dragToolBox = document.getElementById('floatWindowToolBar');
                        dragToolBox.style.top = top + 'px';
                        dragToolBox.style.left = (Number(left) - Number(dragToolBox.clientWidth) - 5) + 'px';
                        dragToolBox.style.right = null;

                        // 拖动之后缓存位置
                        let screenToolWindowPositionCache = window.localStorage.getItem('screenToolWindowPositionCache');
                        let screenToolWindowPositionJson = screenToolWindowPositionCache || "";
                        let screenToolWindowPositionObj = screenToolWindowPositionCache ? JSON.parse(screenToolWindowPositionJson) : {"top":"","left":""};
                        screenToolWindowPositionObj.top = dragToolBox.style.top;
                        screenToolWindowPositionObj.left = dragToolBox.style.left;
                        window.localStorage.setItem('screenToolWindowPositionCache',JSON.stringify(screenToolWindowPositionObj));
                    };
                    document.onmouseup = function (e) {
                        this.onmouseup = null;
                        this.onmousemove = null;
                    }
                }
            });
        },
        unLock(){
            let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
            if(previewDevice){
                if(previewDevice.unLock && typeof previewDevice.unLock === 'function'){
                    previewDevice.unLock();
                }
            }
        },
        lockScreen(){
            let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
            if(previewDevice){
                if(previewDevice.lockScreen && typeof previewDevice.lockScreen === 'function'){
                    previewDevice.lockScreen();
                }
            }
        },
        quick(){
            let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
            if(previewDevice){
                if(previewDevice.quick && typeof previewDevice.quick === 'function'){
                    previewDevice.quick();
                }
            }
        },
        // 重连设备
        reConnect(){
            let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
            if(previewDevice){
                if(previewDevice.reConnect && typeof previewDevice.reConnect === 'function'){
                    previewDevice.reConnect();
                }
                setTimeout(()=>{
                    previewDevice.openFloatWindow = true;
                },200);
            }
        },
        // 执行固定操作代码
        fixedOperate(operateCode){
            let previewDevice = window.ZXW_VUE.$refs['previewDevice'];
            if(previewDevice){
                if(previewDevice.fixedOperate && typeof previewDevice.fixedOperate === 'function'){
                    previewDevice.fixedOperate(operateCode);
                }
            }
        },
        // 复制内容到剪切板
        copyToClipboardFun(value){
            $.ajax({
                url: getContext() + "/addController/copyTextToClipboard",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "text": value
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data){
                                window.ZXW_VUE.$notify.success({message: '已复制到剪切板(本地部署模式有效)', duration: '1000'})
                            }
                        }
                    }
                },
                error: function (msg) {
                    console.log(msg)
                }
            });
        },
        // 从剪切板读取内容
        readTextFromClipboardFun(){
            let result = "";
            $.ajax({
                url: getContext() + "/addController/readTextFromClipboard",
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(data.data){
                                result = data.data;
                            }
                        }
                    }
                },
                error: function (msg) {
                    console.log(msg);
                    result =  "";
                }
            });
            return result;
        },
        initModule(moduleName){
            this.$nextTick(()=>{
                // 执行页面组件初始化方法
                if(this.$refs[moduleName] && this.$refs[moduleName].init){
                    this.$refs[moduleName].init()
                }
            })
        },
        refreshScrollHeight(){
            this.$nextTick(()=>{
                // 执行页面组件初始化方法
                if(this.$refs['layoutAnalysis'] && this.$refs['layoutAnalysis'].refreshScrollHeight){
                    this.$refs['layoutAnalysis'].refreshScrollHeight()
                }
                if(this.$refs['imgHandler'] && this.$refs['imgHandler'].refreshScrollHeight){
                    this.$refs['imgHandler'].refreshScrollHeight()
                }
                if(this.$refs['previewDevice'] && this.$refs['previewDevice'].refreshScrollHeight){
                    this.$refs['previewDevice'].refreshScrollHeight()
                }
                if(this.$refs['fileManage'] && this.$refs['fileManage'].refreshScrollHeight){
                    this.$refs['fileManage'].refreshScrollHeight()
                }
                if(this.$refs['remoteScript'] && this.$refs['remoteScript'].refreshScrollHeight){
                    this.$refs['remoteScript'].refreshScrollHeight()
                }
            })
        },
        // 最小化/还原 日志悬浮窗
        changeShowWindowLog(){
          this.showWindowLog=!this.showWindowLog;
        },
        // 清空日志悬浮窗内容
        clearShowWindowLog(){
          // 读取最后一行日志
          let logArr = this.windowLogContent.split("<br/>");
          // 缓存最后一行日志
          this.lastLogContent = logArr && logArr.length ? logArr[logArr.length-1] : "";
          this.windowLogContent = "";
        },
        // 刷新日志悬浮窗
        refreshShowWindowLog(){
            // 关闭实时日志悬浮窗
            if(this.$refs['remoteLog'] && this.$refs['remoteLog'].stopOnLineLog){
                this.$refs['remoteLog'].stopOnLineLog()
            }
            this.lastLogContent = "";
            this.windowLogContent = "";
            setTimeout(()=>{
                // 再打开实时日志悬浮窗
                if(this.$refs['remoteLog'] && this.$refs['remoteLog'].startOnLineLog){
                    this.$refs['remoteLog'].startOnLineLog()
                }
            },500)
        },
        // 关闭日志悬浮窗
        closeShowWindowLog(){
            this.lastLogContent = "";
            this.$nextTick(()=>{
                // 关闭实时日志悬浮窗
                if(this.$refs['remoteLog'] && this.$refs['remoteLog'].stopOnLineLog){
                    this.$refs['remoteLog'].stopOnLineLog()
                }
            })
        },
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
                if(this.deviceInfo.deviceUuid){
                    // 设置当前选中App设备
                    this.sendMessageToWebDeviceWebSocket("syncSelectAppDeviceUuid",this.deviceInfo.deviceUuid);
                }
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
            if(messageData.action === "appWebSocketCloseSuccess" || messageData.action === "appWebSocketConnectSuccess"){
                if(messageData.message === "下线"){
                    this.$refs["deviceInfo"].downLine(messageData.deviceUuid);
                } else if(messageData.message === "上线"){
                    this.$refs["deviceInfo"].online(messageData.deviceUuid);
                }
            }
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
            // 接收刷新 远程实时日志指令
            } else if(messageData.action === 'refreshOnLineRemoteLog'){
                if(messageData.message !== this.deviceInfo.deviceUuid){
                    return;
                }
                // 查询日志
                this.queryLogFun();
            }
        },
        // 查询日志内容
        queryLogFun(){
            // 调用接口查询日志
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
                            let content = decodeURI(atob(data.data));
                            // 更新悬浮窗日志
                            let windowLogContentVal= content.replace(/\n/g,"<br/>");

                            // 最后一行有值
                            if(_that.lastLogContent){
                                // 目标日志数组
                                let targetLogArr = [];
                                // 根据换行符分割
                                let logArr = windowLogContentVal.split("<br/>") || [];
                                // 倒序
                                logArr = logArr.reverse();
                                // 遍历内容
                                for(let i=0;i<logArr.length;i++){
                                    let logLine = logArr[i];
                                    // 是最后一行时
                                    if(_that.lastLogContent === logLine){
                                        break;
                                    }
                                    // 添加数据
                                    targetLogArr.push(logLine);
                                }
                                // 倒序
                                targetLogArr = targetLogArr.reverse();
                                // 再次倒序 拼接还原
                                windowLogContentVal = targetLogArr.join('<br/>')
                            }
                            // 处理日志颜色
                            if(windowLogContentVal){
                                let targetLogArr = windowLogContentVal.split("<br/>") || [];
                                // 上一行日志级别
                                let preLineLogLevel = "default";
                                // 遍历数据
                                for(let i=0;i<targetLogArr.length;i++){
                                    let logLine = targetLogArr[i];
                                    // 正则匹配 "2023-11-25 15:55:43.846/INFO: something else";
                                    let pattern = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3})\/(.*?):/;
                                    let match = logLine.match(pattern);
                                    if (match) {
                                        preLineLogLevel = match[2];
                                    }
                                    switch (preLineLogLevel) {
                                        case "TRACE":
                                            logLine = '<span style="color:#bdbdbd">'+logLine+'</span>';
                                            break;
                                        case "INFO":
                                            logLine = '<span style="color:#1de9b6">'+logLine+'</span>';
                                            break;
                                        case "WARN":
                                            logLine = '<span style="color:#673ab7">'+logLine+'</span>';
                                            break;
                                        case "ERROR":
                                            logLine = '<span style="color:#b71c1c">'+logLine+'</span>';
                                            break;
                                        case "DEBUG":
                                            logLine = '<span style="color:#86a305">'+logLine+'</span>';
                                            break;
                                        case "default":
                                        default:
                                            logLine = '<span style="color:#f796ff">'+logLine+'</span>';
                                            break;
                                    }
                                    targetLogArr[i] = logLine;
                                }
                                windowLogContentVal = targetLogArr.join('<br/>')
                            }
                            // 赋值数据
                            _that.windowLogContent = windowLogContentVal;
                            _that.$nextTick(()=>{
                                // 滚动到底部
                                let windowLogDiv = document.getElementById("windowLogDiv");
                                if(!_that.fixedLogPosition){
                                    windowLogDiv.scrollTop = windowLogDiv.scrollHeight;
                                }
                                if(_that.activeTab === "remoteLog"){
                                    // 更新实时日志
                                    window.ZXW_VUE.$EventBus.$emit('refreshOnLineRemoteLog',content);
                                }
                            });
                        }
                    }
                },
                error: function (msg) {
                    console.log(msg)
                }
            });
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
                // _that.sendMessageToWebDeviceWebSocket("syncSelectAppDeviceUuid", "");
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

            if(this.deviceInfo.deviceUuid){
                // 记录最后选择设备
                window.localStorage.setItem("lastSelectDeviceUuid",this.deviceInfo.deviceUuid);

                // 设置当前选中App设备
                this.sendMessageToWebDeviceWebSocket("syncSelectAppDeviceUuid",this.deviceInfo.deviceUuid);
            }


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
                // 初始化预览设备数据
                this.$refs.previewDevice.init();

                // 自动开启在线日志
                let autoStartOnlineLog = false;
                let systemConfigCache = window.localStorage.getItem("systemConfig");
                if(systemConfigCache){
                    let systemConfigObj = JSON.parse(systemConfigCache);
                    if(systemConfigObj){
                        autoStartOnlineLog = systemConfigObj.autoStartOnlineLog;
                    }
                }

                // 如果开启了参数
                if(autoStartOnlineLog){
                    // 自动开启实时日志悬浮窗
                    if(this.$refs['remoteLog'] && this.$refs['remoteLog'].startOnLineLog){
                        this.$refs['remoteLog'].startOnLineLog()
                    }
                }
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
                                if(typeof(callback)=="function"){
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
                headers:{
                  "deviceUuid": this.deviceInfo.deviceUuid,
                  "devicePassword": this.deviceInfo.devicePassword
                },
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
                            if (typeof(callback)=="function") {
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
        // 切换tab
        changeActiveTab(activeTab){
            this.activeTab = activeTab;
        },
        // 跳转文件管理
        forwardFileManage(webFilePath){
            this.activeTab = 'fileManage';
            if(webFilePath){
                this.$nextTick(()=>{
                    // 执行页面组件初始化方法
                    if(this.$refs['fileManage'] && this.$refs['fileManage'].enterWebPath){
                        this.$refs['fileManage'].webSyncPath = webFilePath;
                        this.$refs['fileManage'].enterWebPath();
                    }
                });
            }
        },
        // 远程执行脚本
        remoteExecuteScript(scriptContent,callback) {
            // 指令为remoteHandler
            // functionName为utils.js中的方法 remoteExecScript  解析传入脚本代码并通过eval执行
            let messageStr = '{"functionName":"remoteExecScript","functionParam":["' + encodeURIComponent(scriptContent) + '"]}';
            this.sendMsgToClient('remoteHandler', messageStr, () => {
                if (typeof(callback)=="function") {
                    callback()
                }
            })
        },
        // 服务端远程执行代码
        remoteExecuteScriptByServer(extendParams = {manualComplete:false,openIndependentEngine:true},scriptContent,preCallBack,completeCallBack,finishCallBack){
            // 组装脚本参数对象
            let params = {
                serverUrl:getContext(), // 服务端地址
                scriptContent: btoa(encodeURI(scriptContent)),
                manualComplete: extendParams ? extendParams.manualComplete : false,
                openIndependentEngine:extendParams ? extendParams.openIndependentEngine: true // 是否开启独立引擎执行
            };
            let _that = this;
            if(preCallBack){
                preCallBack();
            }
            $.ajax({
                url: getContext() + "/device/phoneExecScript",
                type: 'POST',
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json",
                headers:{
                    "deviceUuid": this.deviceInfo.deviceUuid,
                    "devicePassword": this.deviceInfo.devicePassword
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            if(completeCallBack){
                                completeCallBack();
                            }
                        }
                    }
                    if(finishCallBack){
                        finishCallBack();
                    }
                },
                error: function (msg) {
                    if(finishCallBack){
                        finishCallBack();
                    }
                }
            });
        },
        // 编辑器最大化
        phoneMaxFileEditorDialog(){
            this.$nextTick(()=>{
                // 记录当前tab
                this.showFileDialogTab = this.activeTab;

                // 获取当前body高度
                this.showTabScrollTop =  document.documentElement.scrollTop + 10;

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