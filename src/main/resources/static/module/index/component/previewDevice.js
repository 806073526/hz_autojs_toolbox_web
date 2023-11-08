import {getContext, handlerAppByCacheChange, sortByKey} from "./../../../utils/utils.js";

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
            default: '竖屏'
        }
    },
    data() {
        return {
            autoRefreshScreenCapture: false, // 刷新截图权限
            devicePreviewParam: { // 设备预览参数
                imgQuality: 10,
                imgScale: 1,
                previewHeight: 500,
                isOpenFastModel: false,
                isOpenGray: false,
                isOpenThreshold: false,
                imgThreshold: 60, // 图片阈值相似度
                appSpace: 500,
                clientSpace: 500,
                valueUpdateAfterAutoPreview: false,
                operateRecord: ''
            },
            previewImageWidth: 50,
            noPreviewImg: true,
            isActive:false,
            arrowArr:{
                commonParam:true,
                otherParam:true,
                scriptPreview:true,
                jsonParam:true,
                otherOperate:true
            },
            previewBlobUrl: null,
            // 当前选择的预览方式
            selectPreviewType:"imgInterface",
            controlPanelOpen:true,//控制面板是否展开
            textContent: '',// 文本信息传输
            textIndex: null, // 文本传输序号
            textType: 'text',// 文本传输类型
            previewActiveName: 'noticeMessage',
            openNoticeMessageListenerFlag: false,
            messagePushChannel:[],// 消息推送渠道
            noticeListenerRules: [],// 通知监听规则
            noticeListenerName:'noticeListenerRules.json',// 通知监听名称
            defaultNoticeListenerName:'defaultNoticeListenerRules', // 默认监听规则名称
            historyNoticeMessageList:[],// 历史通知消息列表
            historyNoticeLoading:false,
            refreshType: "websocket",// 刷新类型 interval websocket
            scriptArr:[],// 脚本数组
            scriptLoading:false,
            historyNoticeMessageLoading:false,
            timerTaskArr:[],
            timerTaskLoading:false,
            tableDefaultRowMap: {// 默认行数据
                noticeListenerRules: {
                    matchingPackageName: "",
                    matchingText: "",
                    autoClick: false,
                    receiveEmail: "",
                    executeScript: "",
                    fixedMessage:"",
                    pushRange:"all"
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
    computed:{
      allowOpenNoticeListener(){ // 允许开启通知监听
          let notCompleted =this.noticeListenerRules.find(item=> JSON.stringify(item) === JSON.stringify(this.tableDefaultRowMap["noticeListenerRules"]));
          return !notCompleted;
      }
    },
    watch:{
        previewImageWidth(val){
            if(this.deviceInfo.deviceUuid){
                window.localStorage.setItem("preview_"+this.deviceInfo.deviceUuid+"_previewImageWidth",val || 50);
            }
        },
        messagePushChannel:{
            handler(val){
                if(this.deviceInfo.deviceUuid){
                    window.localStorage.setItem("preview_"+this.deviceInfo.deviceUuid+"_messagePushChannel",val ? val.join(',') : '');
                }
            },
            immediate: true, // 立即触发一次
            deep: true // 可以深度检测到  对象的属性值的变化
        },
        noticeListenerRules:{
            handler(val){
                this.saveToDraft();
            },
            immediate: true, // 立即触发一次
            deep: true // 可以深度检测到  对象的属性值的变化
        },
        devicePreviewParam:{
            handler(val){
                if(this.deviceInfo.deviceUuid) {
                    window.localStorage.setItem("preview_"+this.deviceInfo.deviceUuid+"_devicePreviewParam", JSON.stringify(val));
                }
            },
            immediate: true, // 立即触发一次
            deep: true // 可以深度检测到  对象的属性值的变化
        }
    },
    mounted(){
        window.removeEventListener('resize',this.allScreenPreviewChange);
        window.addEventListener('resize',this.allScreenPreviewChange);
    },
    beforeDestroy(){
        window.removeEventListener('resize',this.allScreenPreviewChange);
    },
    methods: {
        refreshScrollHeight(){
            let zoomSize = 100;
            let systemConfigCache = window.localStorage.getItem("systemConfig");
            if(systemConfigCache){
                let systemConfigObj = JSON.parse(systemConfigCache);
                if(systemConfigObj){
                    zoomSize = systemConfigObj.zoomSize;
                    this.autoRefreshScreenCapture = systemConfigObj.autoRefreshScreenCapture;
                }
                if(zoomSize<30){
                    zoomSize = 30
                }
            }
            let containers = $(".previewDivContainer");
            if(containers && containers.length){
                for(let i=0;i<containers.length;i++){
                    $(containers[i]).css("height",1500 * zoomSize / 100);
                }
            }
        },
        init(){
            this.refreshScrollHeight();
            if (this.deviceInfo.deviceUuid) {
                // 处理宽度缓存
                this.previewImageWidth = window.localStorage.getItem("preview_"+this.deviceInfo.deviceUuid+"_previewImageWidth") || 50;
                // 处理消息推送渠道
                this.messagePushChannel = (window.localStorage.getItem("preview_"+this.deviceInfo.deviceUuid+"_messagePushChannel") || "").split(",");
                // 处理预览参数缓存
                let devicePreviewParam = window.localStorage.getItem("preview_"+this.deviceInfo.deviceUuid+"_devicePreviewParam");
                if(devicePreviewParam){
                    let devicePreviewParamObj =  JSON.parse(devicePreviewParam);
                    if(devicePreviewParamObj){
                        this.devicePreviewParam = devicePreviewParamObj;
                    }
                }
                // 从缓存读取通知监听规则
                this.readForDraft();
                // 查询脚本
                this.queryScript();
                // 查询定时任务
                this.queryTimerTask();
            }
        },
        allScreenPreviewChange() {
            if (!!document.fullscreenElement) {
                $("#allScreenDiv").show();
                $("#devicePreviewImg").css("width","auto");
            } else {
                $("#allScreenDiv").hide();
                $("#devicePreviewImg").css("width","100%");
            }
        },
        controlPanelOpenChange(){
          this.controlPanelOpen = !this.controlPanelOpen;
        },
        // 刷新预览设备图片方法
        refreshPreviewImgFun(){
            /*fetch(window.deviceImgUrl).then(msg=>{
               if(msg.status === 200){
                   $("#devicePreviewImg").attr("src", window.deviceImgUrl);
                   // 读取为blob
                   msg.blob().then(blob=> {
                       if(this.previewBlobUrl){
                           URL.revokeObjectURL(this.previewBlobUrl);
                           this.previewBlobUrl = "";
                       }
                       this.previewBlobUrl = URL.createObjectURL(blob);
                       $("#devicePreviewImg").attr("src", window.deviceImgUrl);
                   })
               }
           });*/
            // 以图片文件的方式  读取图片路径
            if(this.selectPreviewType === 'imgFile'){
                window.deviceImgUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/tempImg.jpg" + "?t=" + new Date().getTime();
                // 以图片接口的方式  读取图片数据
            } else if(this.selectPreviewType === 'imgInterface'){
                let cacheData = null;
                let dirPathKey = this.deviceInfo.deviceUuid+"_/sdcard/screenImg/tempImg.jpg";
                $.ajax({
                    url: getContext() + "/attachmentInfo/queryFileMap",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    data: {
                        "dirPathKey": dirPathKey
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                cacheData = data.data;
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
                window.deviceImgUrl = 'data:image/png;base64,' + cacheData;
            }
            $("#devicePreviewImg").attr("src", window.deviceImgUrl);
            this.noPreviewImg = false;
            window.deviceImgUrlBak = window.deviceImgUrl;
        },
        // 开始预览设备web监听方法
        startPreviewDeviceWebListenerFun(notice){
            this.deviceInfo.startPreview = true;
            if (notice) {
                window.ZXW_VUE.$notify.success({
                    message: '开始预览',
                    duration: '500'
                })
            }
            if("websocket" === this.refreshType){
                window.ZXW_VUE.$EventBus.$off('refreshPreviewImg',this.refreshPreviewImgFun);
                window.ZXW_VUE.$EventBus.$on('refreshPreviewImg', this.refreshPreviewImgFun);
            } else {
                if (window.refreshDeviceInterval) {
                    clearInterval(window.refreshDeviceInterval)
                }
                window.refreshDeviceInterval = setInterval(() => {
                    this.refreshPreviewImgFun();
                }, this.devicePreviewParam.clientSpace);
            }

            let devicePreviewBox = document.querySelector('#devicePreviewImg');
            devicePreviewBox.removeEventListener('mousemove', this.deviceMouseMove);
            devicePreviewBox.addEventListener('mousemove', this.deviceMouseMove);

            devicePreviewBox.removeEventListener('click', this.deviceMouseClick);
            devicePreviewBox.addEventListener('click', this.deviceMouseClick);

            devicePreviewBox.removeEventListener('mousedown', this.deviceMouseDown);
            devicePreviewBox.addEventListener('mousedown', this.deviceMouseDown, true);

            devicePreviewBox.removeEventListener('mouseup', this.deviceMouseUp);
            devicePreviewBox.addEventListener('mouseup', this.deviceMouseUp, true);


            devicePreviewBox.removeEventListener('touchstart', this.deviceTouchStart);
            devicePreviewBox.addEventListener('touchstart', this.deviceTouchStart, true);

            devicePreviewBox.removeEventListener('touchmove', this.deviceTouchMove);
            devicePreviewBox.addEventListener('touchmove', this.deviceTouchMove);


            devicePreviewBox.removeEventListener('touchend', this.deviceTouchEnd);
            devicePreviewBox.addEventListener('touchend', this.deviceTouchEnd, true);

            // 全屏监听
            this.allScreenPreviewChange();
        },
        // 以图片文件方式运行的 APP开始预览处理方法
        startPreviewDeviceByImgFileAppHandler(messageStr,notice){
            // 给app发送开始预览指令
            this.sendMsgToClient('startPreviewDevice', messageStr, () => {
                // 发送成功后执行 web端的监听方法
                this.startPreviewDeviceWebListenerFun(notice);
            })
        },
        // 以图片接口方式运行的 APP开始预览处理方法
        startPreviewDeviceByImgInterfaceAppHandler(messageStr,notice){
            let remoteScript = ``;
            remoteScript += `
            let fun=()=>{
                let deviceParam = {
                    imgQuality: 100,
                    imgScale: 1,
                    isOpenGray: 0,
                    isOpenThreshold: 0,
                    imgThreshold: 60,
                    appSpace:500
                }
                // 唤醒设备
                device.wakeUpIfNeeded();
                // json字符串转换js对象
                let operateObj = JSON.parse('${messageStr}')
            
                deviceParam.imgQuality = operateObj.imgQuality || 100
                deviceParam.imgScale = operateObj.imgScale || 1
            
                deviceParam.isOpenGray = operateObj.isOpenGray ? 1 : 0
                deviceParam.isOpenThreshold = operateObj.isOpenThreshold ? 1 : 0
                deviceParam.imgThreshold = operateObj.imgThreshold || 60
                deviceParam.appSpace = operateObj.appSpace || 500
                if(utilsObj.clickThread){
                    console.log("关闭自动点击线程")
                    utilsObj.clickThread.interrupt()
                }
                
                if(utilsObj.deviceThread){
                    console.log("关闭预览线程")
                    utilsObj.deviceThread.interrupt()
                }
                console.log("开启自动点击线程")
                utilsObj.clickThread = threads.start(function () {
                    while (true) {
                        let click1 = text("立即开始").findOne(100);
                        if(click1){
                            click1.click()
                        }
                        let otherClickText = commonStorage.get("otherClickText")
                        if(otherClickText){
                          let click2 = text(otherClickText).findOne(100);
                           if(click2){
                             click2.click()
                         }
                        }
                    }
                });
                utilsObj.deviceThread = threads.start(() => {
                    try {
                        console.log("重开权限")
                        images.stopScreenCapture()
                        images.requestScreenCapture({orientation:utilsObj.getOrientation()})
                    } catch (error) {
                        console.error("重开截图权限错误",error)
                    }
                    files.createWithDirs("/sdcard/screenImg/")
                    sleep(500)
                    toastLog("开始预览")
                    let lastImageBase = "";
                    while (true) {
                        try {
                            let img = images.captureScreen()
                            let afterImg = images.scale(img, deviceParam.imgScale, deviceParam.imgScale)
                             if (deviceParam.isOpenGray === 1) {
                                let afterImg1 = images.grayscale(afterImg)
                                afterImg.recycle()
                                afterImg = afterImg1
                            }
                            if (deviceParam.isOpenThreshold === 1) {
                                let afterImg2 = images.threshold(afterImg, deviceParam.imgThreshold, 255, 'BINARY');
                                afterImg.recycle()
                                afterImg = afterImg2
                            } 
                            let tempImgPath = '/sdcard/screenImg/tempImg.jpg'
                            
                            let curImageBase = images.toBase64(afterImg, "jpg", deviceParam.imgQuality);
                            sleep(10)
                            if(curImageBase !== lastImageBase){
                                http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileMap', {
                                    headers: {
                                        "deviceUUID": commonStorage.get('deviceUUID')
                                    },
                                    method: 'POST',
                                    contentType: 'application/json',
                                    body: JSON.stringify({ 'dirPathKey': commonStorage.get('deviceUUID') + '_' + tempImgPath, 'fileJson': curImageBase })
                                }, (e) => { 
                                    lastImageBase = curImageBase;
                                });
                            }
                            afterImg.recycle()
                            img.recycle()
                            sleep(deviceParam.appSpace) 
                        } catch (error) {
                            console.error("预览错误",error)
                            try {
                                console.log("重开权限")
                                images.stopScreenCapture()
                                images.requestScreenCapture({orientation:utilsObj.getOrientation()})
                            } catch (error1) {
                                console.error("重开截图权限错误",error1)
                            }
                        }
                    }
                })
            }
            if(utilsObj.requestScreenCaptureCommonFun){
                events.broadcast.emit("startPreviewDevice", '${btoa(messageStr)}');
            } else {
                fun();
            }
            `;
            // 直接执行 以图片接口上传缓存的方式 上传图片数据
            this.remoteExecuteScript(remoteScript,()=>{
                // 发送成功后执行 web端的监听方法
                this.startPreviewDeviceWebListenerFun(notice);
            });
        },
        // 开始预览设备
        startPreviewDevice(notice) {
            if(this.autoRefreshScreenCapture){
                let remoteExecuteScriptContent = 'images.stopScreenCapture();';
                this.remoteExecuteScript(remoteExecuteScriptContent);
            }
            // 获取预览参数
            let messageStr = JSON.stringify(this.devicePreviewParam);
            // 判断预览方式
            if(this.selectPreviewType === 'imgFile'){
                this.startPreviewDeviceByImgFileAppHandler(messageStr,notice)
            } else if(this.selectPreviewType === 'imgInterface') {
                this.startPreviewDeviceByImgInterfaceAppHandler(messageStr,notice)
            }
        },
        allScreenPreviewImg(){
            // 获取需要全屏展示的div
            let fullarea = document.getElementById('devicePreviewImgParent');
            let alreadyComplete = false;
            if (!document.fullscreenElement) {
                // 全屏
                if(fullarea.requestFullscreen){
                    fullarea.requestFullscreen().then(data=>{
                        alreadyComplete = true;
                        // 全屏监听
                        this.allScreenPreviewChange();
                    }).catch(e=>{
                    });
                } else if (fullarea.mozRequestFullScreen) {
                    fullarea.mozRequestFullScreen();
                } else if (fullarea.webkitRequestFullscreen) {
                    fullarea.webkitRequestFullscreen();
                } else if (fullarea.msRequestFullscreen) {
                    fullarea.msRequestFullscreen();
                }
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }

            if(!alreadyComplete){
                let intervalTimes = 0;
                // 设置定时器
                let interval = setInterval(()=>{
                    // 全屏监听
                    this.allScreenPreviewChange();
                    intervalTimes++;
                    if(intervalTimes>=100){
                        clearInterval(interval);
                    }
                },10)
            }
        },
        // 停止预览设备的web端处理
        stopPreviewWebHandler(notice,callback){
            this.deviceInfo.startPreview = false;
            if (notice) {
                window.ZXW_VUE.$notify.success({
                    message: '停止预览',
                    duration: '500'
                })
            }
            if("websocket" === this.refreshType){
                window.ZXW_VUE.$EventBus.$off('refreshPreviewImg',this.refreshPreviewImgFun);
            } else {
                if (window.refreshDeviceInterval) {
                    clearInterval(window.refreshDeviceInterval)
                }
            }
            if (callback) {
                callback()
            }
        },
        // 以图片文件方式运行的 APP开始停止预览处理方法
        stopPreviewDeviceByImgFileAppHandler(notice,callback){
            this.sendMsgToClient('stopPreviewDevice', '', () => {
                this.stopPreviewWebHandler(notice,callback);
            })
        },
        // 以图片接口方式运行的 APP停止预览处理方法
        stopPreviewDeviceByImgInterfaceAppHandler(notice,callback){
            let remoteScript = `
             if(utilsObj.requestScreenCaptureCommonFun){
                events.broadcast.emit("stopPreviewDevice", '');
             } else {
                // 唤醒设备
                device.wakeUpIfNeeded();
                if(utilsObj.raObj){
                    try{
                      utilsObj.raObj.flush();
                      utilsObj.raObj.exit(true);
                      utilsObj.raObj = null;
                    }catch(e){
                       utilsObj.raObj = null;
                    }
                }
                if(utilsObj.deviceThread){
                    toastLog("停止预览");
                    utilsObj.deviceThread.interrupt();
                }
            }
            `;
            this.remoteExecuteScript(remoteScript,()=>{
                this.stopPreviewWebHandler(notice,callback);
            })
        },
        // 停止预览设备
        stopPreviewDevice(notice, callback) {
            // 判断预览方式
            if(this.selectPreviewType === 'imgFile'){
                this.stopPreviewDeviceByImgFileAppHandler(notice,callback)
            } else if(this.selectPreviewType === 'imgInterface') {
                this.stopPreviewDeviceByImgInterfaceAppHandler(notice,callback)
            }
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
            // 空行
            if(tableArr[index] && JSON.stringify(tableArr[index]) === JSON.stringify(this.tableDefaultRowMap["noticeListenerRules"])){
                tableArr.splice(index, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
                return false;
            }
            window.ZXW_VUE.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                tableArr.splice(index, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
            });
        },
        // 查询定时任务
        queryTimerTask(){
            if (!this.validSelectDevice()) {
                return;
            }
            this.timerTaskLoading = true;
            handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"queryTimerTask",()=>{
                // 获取手机端脚本
                let remoteScript = `
                // 定时任务数组
                let tasksArr = [];
                let intentTasks = $work_manager.queryIntentTasks();
                if (intentTasks) {
                    intentTasks.forEach((item) => {
                        let task = {
                            id: item.id,
                            taskType: '广播',
                            scriptPath: item.scriptPath,
                            timerParamJson: JSON.stringify({
                                action: item.action,
                                category: item.category,
                                dataType: item.dataType,
                                local: item.local,
                                flags: item.flags
                            })
                        }
                        tasksArr.push(task);
                    })
                }
                let timedTasks = $work_manager.queryTimedTasks();
                if (timedTasks) {
                    timedTasks.forEach((item) => {
                        let task = {
                            id: item.id,
                            taskType: '时间',
                            scriptPath: item.scriptPath,
                            timerParamJson: JSON.stringify({
                                millis: item.millis,
                                date: new Date(item.millis),
                                scheduled: item.scheduled,
                                delay: item.delay,
                                interval: item.interval,
                                loopTimes: item.loopTimes,
                                timeFlag: item.timeFlag
                            })
                        }
                        tasksArr.push(task);
                    })
                }
                 let timerTaskJSON = JSON.stringify(tasksArr);
                 // 编码参数
                 timerTaskJSON = $base64.encode(encodeURI(timerTaskJSON));
                 let requestBody = {
                    "deviceUUID":"${this.deviceInfo.deviceUuid}",
                    "timerTaskJSON":timerTaskJSON
                 };
                 // 记录通知
                 utilsObj.request("/attachmentInfo/writeTimerTask", "POST", JSON.stringify(requestBody), () => {
                    let finishMsgObj = {
                        "deviceUUID":"${this.deviceInfo.deviceUuid}",
                        "serviceKey":"queryTimerTask",
                        "serviceValue":"true"
                     }
                     events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                 });
                `;
                this.remoteExecuteScript(remoteScript);
            },()=>{
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/queryTimerTaskByKey",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "deviceUUID": this.deviceInfo.deviceUuid
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                // 原始数据
                                let timerTaskJSON = data.data;
                                if(timerTaskJSON){
                                    // 解码数据
                                    let json = decodeURIComponent(atob(timerTaskJSON));
                                    // 解析对象
                                    let arr = json ? JSON.parse(json) : [];                                   // 解析对象
                                    _that.timerTaskArr = sortByKey(arr,'id',true);
                                } else{
                                    _that.timerTaskArr = [];
                                }
                            }
                        }
                        setTimeout(() => {
                            _that.timerTaskLoading = false;
                        }, 200)
                    },
                    error: function (msg) {
                        _that.timerTaskLoading = true;
                    }
                });
            });
        },
        // 停止定时任务
        stopTimerTask(row){
            window.ZXW_VUE.$confirm('是否确认远程停止定时任务【'+row.id+'】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                // 执行停止定时任务操作
                handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"stopTimerTask",()=>{
                    let remoteScript = `
                    let taskType = '${row.taskType}';
                    let id = ${row.id};
                    if(taskType === '广播'){
                        $work_manager.removeIntentTask(id);
                    } else {
                        $work_manager.removeTimedTask(id);
                    }
                    sleep(500);
                    utilsObj.request("/attachmentInfo/clearTimerTaskByKey?deviceUUID=" + '${this.deviceInfo.deviceUuid}', "GET", null, () => {
                        let finishMsgObj = {
                            "deviceUUID":"${this.deviceInfo.deviceUuid}",
                            "serviceKey":"stopTimerTask",
                            "serviceValue":"true"
                         }
                         events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                    });
                    `;
                    this.remoteExecuteScript(remoteScript);
                },()=>{
                    // 执行重新加载操作
                    this.queryTimerTask();
                });
            });
        },
        // 查询脚本
        queryScript(){
            if (!this.validSelectDevice()) {
                return;
            }
            this.scriptLoading = true;
            handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"queryScript",()=>{
                // 获取手机端脚本
                let remoteScript = `let allEngines = engines.all();
                 let enginesArr = [];
                 // 排除本身数组
                 let noContainsArr = ['/data/user/0/com.zjh336.cn.tools/files/project/main.js','/data/user/0/com.zjh336.cn.tools/files/project/runScript.js']
                 allEngines.forEach(item=>{
                    let source = String(item.getSource());
                    if(!noContainsArr.includes(source)){
                        enginesArr.push({
                            "source":String(item.getSource()),
                            "cwd":item.cwd(),
                            "id":item.id
                        });
                    }
                 })
                 let scriptJSON = JSON.stringify(enginesArr);
                 // 编码参数
                 scriptJSON = $base64.encode(encodeURI(scriptJSON));
                 let requestBody = {
                    "deviceUUID":"${this.deviceInfo.deviceUuid}",
                    "scriptJSON":scriptJSON
                 };
                 // 记录通知
                 utilsObj.request("/attachmentInfo/writeScript", "POST", JSON.stringify(requestBody), () => {
                    let finishMsgObj = {
                        "deviceUUID":"${this.deviceInfo.deviceUuid}",
                        "serviceKey":"queryScript",
                        "serviceValue":"true"
                     }
                     events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                 });
                `;
                this.remoteExecuteScript(remoteScript);
            },()=>{
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/queryScriptByKey",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "deviceUUID": this.deviceInfo.deviceUuid
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                               // 原始数据
                               let scriptJSON = data.data;
                               if(scriptJSON){
                                   // 解码数据
                                   let json = decodeURIComponent(atob(scriptJSON));
                                   let arr = json ? JSON.parse(json) : [];                                   // 解析对象
                                   _that.scriptArr = sortByKey(arr,'id',true);
                               } else{
                                   _that.scriptArr = [];
                               }
                            }
                        }
                        setTimeout(() => {
                            _that.scriptLoading = false;
                        }, 200)
                    },
                    error: function (msg) {
                        _that.scriptLoading = true;
                    }
                });
            });
        },
        // 停止脚本
        stopScript(row){
            window.ZXW_VUE.$confirm('是否确认远程停止脚本【'+row.source+'】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                // 执行停止脚本操作
                handlerAppByCacheChange(this.deviceInfo.deviceUuid+"_"+"stopScript",()=>{
                   let remoteScript = `let allEngines = engines.all();
                    allEngines.forEach(item=>{
                        if(String(item.getSource()) === "${row.source}"){
                            item.forceStop();
                        }
                    })
                    sleep(500);
                    utilsObj.request("/attachmentInfo/clearScriptByKey?deviceUUID=" + '${this.deviceInfo.deviceUuid}', "GET", null, () => {
                        let finishMsgObj = {
                            "deviceUUID":"${this.deviceInfo.deviceUuid}",
                            "serviceKey":"stopScript",
                            "serviceValue":"true"
                         }
                         events.broadcast.emit("sendMsgToWebUpdateServiceKey", JSON.stringify(finishMsgObj));
                    });
                    `;
                    this.remoteExecuteScript(remoteScript);
                },()=>{
                    // 执行重新加载操作
                    this.queryScript();
                });
            });
        },
        // 保存到草稿
        saveToDraft(){
            if(this.deviceInfo.deviceUuid){
                let notCompleted =this.noticeListenerRules.find(item=> JSON.stringify(item) === JSON.stringify(this.tableDefaultRowMap["noticeListenerRules"]));
                if(notCompleted){
                    return false;
                }
                window.localStorage.setItem("noticeListenerRules_"+ this.deviceInfo.deviceUuid + "_" + this.defaultNoticeListenerName,JSON.stringify(this.noticeListenerRules));
            }
        },
        // 从草稿读取
        readForDraft(){
            if(this.deviceInfo.deviceUuid){
                let noticeListenerRulesJson = window.localStorage.getItem("noticeListenerRules_"+this.deviceInfo.deviceUuid + "_" +this.defaultNoticeListenerName);
                this.noticeListenerRules = noticeListenerRulesJson ? JSON.parse(noticeListenerRulesJson) : [];
            }
        },
        // 存为文件
        saveToFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.noticeListenerName){
                window.ZXW_VUE.$message.warning('请设置规则名称');
                return;
            }
            let notCompleted =this.noticeListenerRules.find(item=> JSON.stringify(item) === JSON.stringify(this.tableDefaultRowMap["noticeListenerRules"]));
            if(notCompleted){
                window.ZXW_VUE.$message.warning('请将规则填写完整');
                return false;
            }
            window.ZXW_VUE.$confirm('是否确认将当通知监听规则存为' + this.noticeListenerName + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let noticeListenerRulesJson = JSON.stringify(this.noticeListenerRules);
                let scriptFile = new File([noticeListenerRulesJson], this.noticeListenerName, {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.deviceInfo.deviceUuid+"/system/previewDevice/");
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/uploadFileSingle",
                    type: 'post',
                    data: param,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                window.ZXW_VUE.$notify.success({message: '保存成功', duration: '1000'});
                            }
                        }
                    },
                    error: function (msg) {
                    }
                });
            });
        },
        // 从文件读取
        readForFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.noticeListenerName){
                window.ZXW_VUE.$message.warning('请设置规则名称');
                return;
            }
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/system/previewDevice/"+this.noticeListenerName + "?t="+(new Date().getTime()),
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    let noticeListenerRulesJson = String(res);
                    _that.noticeListenerRules = noticeListenerRulesJson ? JSON.parse(noticeListenerRulesJson) : [];
                    window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'});
                },
                error: function (msg) {
                    console.log(msg);
                    window.ZXW_VUE.$notify.error({message: _that.noticeListenerName+'文件不存在', duration: '1000'});
                }
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
            // 发送完成后置空输入
            this.textContent = "";
        },
        // 远程脚本查询
        queryRemoteScript() {

        },
        // 关闭远程脚本
        closeRemoteScript() {

        },
        // 关闭定时任务
        closeTimerTask() {

        },
        // 消息通知查询
        queryNoticeMessage() {
            let _that = this;
            this.historyNoticeMessageLoading = true;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryNoticeMessageByKey",
                type: "GET",
                dataType: "json",
                // contentType: "application/json",
                data: {
                    "deviceUUID": this.deviceInfo.deviceUuid
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            _that.historyNoticeMessageList = [];
                            let arr = data.data || [];
                            arr.forEach(item=>{
                                // 获取json
                                let json = decodeURIComponent(atob(item));
                                // 解析对象
                                let obj = json ? JSON.parse(json) : {};
                                // 添加到数组
                                _that.historyNoticeMessageList.push(obj);
                            })
                        }
                    }
                    setTimeout(() => {
                        _that.historyNoticeMessageLoading = false;
                    }, 200)
                },
                error: function (msg) {
                    _that.historyNoticeMessageLoading = false;
                }
            });
        },
        clearNoticeMessage(){
            window.ZXW_VUE.$confirm('是否确认清理全部历史通知?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let _that = this;
                $.ajax({
                    url: getContext() + "/attachmentInfo/clearNoticeMessageByKey",
                    type: "GET",
                    dataType: "json",
                    // contentType: "application/json",
                    data: {
                        "deviceUUID": this.deviceInfo.deviceUuid
                    },
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                _that.queryNoticeMessage();
                                window.ZXW_VUE.$notify.success({message: '清理成功', duration: '1000'});
                            }
                        }
                        setTimeout(() => {
                        }, 200)
                    },
                    error: function (msg) {
                    }
                });
            });
        },
        // 通知消息监听开关
        openNoticeMessageListenerChange(){
            let remoteExecuteScript = '';
            if(this.openNoticeMessageListenerFlag){
                remoteExecuteScript = `
                    let deviceUUID = '${this.deviceInfo.deviceUuid}'
                    let messagePushChannel = '${this.messagePushChannel.join(",")}';
                    let rules = decodeURI($base64.decode('${btoa(encodeURI(JSON.stringify(this.noticeListenerRules)))}'));
                    let matchingRules = rules ? JSON.parse(rules) : [];
                    events.removeAllListeners('notification');
                    events.observeNotification();
                    events.onNotification(function(notification) {
                        let messageObj = {
                            "固定内容": "",
                            "通知文本": notification.getText() || "",
                            "通知摘要": notification.tickerText || "",
                            "来源设备": deviceUUID,
                            "应用包名": notification.getPackageName() || "",
                            "通知优先级": notification.priority || 0,
                            "通知目录": notification.category || "",
                            "通知时间": new Date(notification.when),
                            "通知数": notification.number || 0
                        }
                        try{
                            matchingRules.forEach(item=>{
                                item.matchingPackageName = item.matchingPackageName ? item.matchingPackageName : "";
                                item.matchingText = item.matchingText ? item.matchingText : "";
                                if ((!item.matchingPackageName || messageObj["应用包名"].indexOf(item.matchingPackageName) !== -1) && (!item.matchingText || (messageObj["通知文本"].indexOf(item.matchingText) !== -1 || messageObj["通知摘要"].indexOf(item.matchingText) !== -1))) {
                                    if (item.autoClick) {
                                        notification.click();
                                    }
                                    // 设置固定消息内容 用于做标志
                                    if(item.fixedMessage){
                                        messageObj["固定内容"] = item.fixedMessage;
                                    } else {
                                        delete messageObj["固定内容"];
                                    }
                                    
                                    let message =  JSON.stringify(messageObj)
                                    item.message = $base64.encode(encodeURI(message))
                                    item.title = "手机端通知消息";
                                    sleep(1000);
                                    // 发送邮件消息
                                    if (item.receiveEmail) {
                                        utilsObj.request("/attachmentInfo/sendEmailMessage?receiveEmail=" + item.receiveEmail + "&title=" + item.title + "&message=" + item.message, "GET", null, () => {
                                            // console.log("邮件推送成功")
                                        });
                                    }
                                    // 记录通知
                                    utilsObj.request("/attachmentInfo/writeNoticeMessage?deviceUUID=" + deviceUUID + "&message=" + item.message + "&pushRange=" + item.pushRange+"&messagePushChannel="+messagePushChannel, "GET", null, () => {
                                        // 如果有代码则执行
                                        if (item.executeScript) {
                                            //执行代码
                                            eval(item.executeScript);
                                        }
                                    });
                                }
                            });
                        }catch(e){
                            console.error(e)
                        }
                    });
                `;
            } else {
                remoteExecuteScript =  `events.removeAllListeners('notification');`;
            }
            this.remoteExecuteScript(remoteExecuteScript);
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
            // this.devicePreviewParam.operateRecord += operateCode + ";";
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
            // this.devicePreviewParam.operateRecord += operateCode + ";";
        },
        // 灵敏模式按下事件
        fastModelDown(eventType){
            let needClear = false;
            if(window.deviceMouseDown){
                needClear = true;
                window.hideRemoteScriptNotify = true;
            }
            if(eventType === 'mouse'){
                window.deviceMouseDown = true;
            } else {
                window.deviceTouchDown = true;
            }

            let remoteScript = `
                    if(!utilsObj.hasAdb){
                        utilsObj.hasAdb =  $shell.checkAccess("adb") ? 1 : 2;
                    }
                    if (!utilsObj.hasRoot) {
                        utilsObj.hasRoot =  $shell.checkAccess("root") ? 1 : 2;  
                    }
                    if(utilsObj.raObj && ${needClear}){
                        utilsObj.raObj.flush();
                        utilsObj.raObj.touchUp();
                    }
                    if(utilsObj.hasAdb === 1){
                        utilsObj.raObj = utilsObj.raObj || new RootAutomator2({
                            adb: true
                        });
                    }
                    if(utilsObj.hasRoot === 1){
                        utilsObj.raObj = utilsObj.raObj || new RootAutomator2({
                            root: true
                        });
                    }
                    
                    
                    let execFun = ()=>{
                        if(!utilsObj.raObj){
                            toastLog("无adb和root权限,建议使用Shizuku进行adb授权")
                            return;
                        }
                        let ra = utilsObj.raObj;
                        try{
                            ra.touchDown([{
                                x: ${eventType === 'mouse' ? window.deviceMouseX1 : window.deviceTouchX1},
                                y: ${eventType === 'mouse' ? window.deviceMouseY1 : window.deviceTouchY2},
                                id: 0
                            }]);
                        }catch(e){
                            utilsObj.raObj.touchUp();
                            utilsObj.raObj.flush();
                        }
                    }
                    execFun();
                `;
            this.remoteExecuteScript(remoteScript);
            window.hideRemoteScriptNotify = true;
        },
        // 设备鼠标按下
        deviceMouseDown(e) {
            // 按下记录开始鼠标位置
            window.deviceMouseX1 = this.deviceMousePosition.x;
            window.deviceMouseY1 = this.deviceMousePosition.y;
            window.deviceMouseStartTime = new Date().getTime();

            // 初始化手势数组
            window.deviceGestures = [{x:window.deviceMouseX1,y:window.deviceMouseY1,time:window.deviceMouseStartTime}];
            // 灵敏模式 鼠标按下 直接发送按下指令
            if(this.devicePreviewParam.isOpenFastModel){
                this.fastModelDown('mouse');
            }
        },
        getElementTop(elem) {
            const rect = elem.getBoundingClientRect(); // 获取元素大小、位置等信息
            return rect.top + window.pageYOffset; // 返回元素顶部距离页面顶部的距离
        },
        getElementLeft(elem) {
            const rect = elem.getBoundingClientRect(); // 获取元素大小、位置等信息
            return rect.left + window.pageXOffset;
        },
        // 手指按下
        deviceTouchStart(e){
            // 当前屏幕的触摸列表
            let touchers = e.touches;
            // 只有一个点触发时
            if(touchers.length === 1){
                let curToucher = touchers[0];
                let curX = curToucher.pageX- this.getElementLeft(curToucher.target);
                let curY = curToucher.pageY- this.getElementTop(curToucher.target);
                let result = this.convertPosition(curX,curY);
                if(!result){
                    e.preventDefault();
                    return;
                }
                this.deviceMousePosition.x = result.x;
                this.deviceMousePosition.y = result.y;
                // 按下记录开始鼠标位置
                window.deviceTouchX1 = this.deviceMousePosition.x;
                window.deviceTouchY1 = this.deviceMousePosition.y;
                window.deviceTouchStartTime = new Date().getTime();

                // 初始化手势数组
                window.deviceGestures = [{x:window.deviceTouchX1,y:window.deviceTouchY1,time:window.deviceTouchStartTime}];

                // 灵敏模式 触摸按下 直接发送按下指令
                if(this.devicePreviewParam.isOpenFastModel){
                    this.fastModelDown('touch');
                }
            }
            e.preventDefault();
        },
        deviceTouchMove(e){
            // 当前屏幕的触摸列表
            let touchers = e.touches;
            if(touchers && touchers.length>0){
                let curToucher = touchers[0];
                let curX = curToucher.pageX-this.getElementLeft(curToucher.target);
                let curY = curToucher.pageY-this.getElementTop(curToucher.target);
                let result = this.convertPosition(curX,curY);
                if(!result){
                    e.preventDefault();
                    return;
                }
                this.deviceMousePosition.x = result.x;
                this.deviceMousePosition.y = result.y;

                let deviceGestures = window.deviceGestures || [];
                // 如果存在手势数组时
                if(deviceGestures && deviceGestures.length){
                    // 获取最后一个手势对象
                    let lastGestureObj = deviceGestures[deviceGestures.length-1];
                    // 时间差
                    let differentTimes = new Date().getTime() - lastGestureObj.time;
                    // 大于等于10毫秒
                    if(differentTimes>=10){
                        // 记录新的手势点
                        let newGestureObj = {
                            x:this.deviceMousePosition.x,
                            y:this.deviceMousePosition.y,
                            time:new Date().getTime()
                        };
                        window.deviceGestures.push(newGestureObj);

                        // 灵敏模式 触摸移动 直接发送移动指令
                        if(this.devicePreviewParam.isOpenFastModel && window.deviceTouchDown){
                            this.fastModelMove();
                        }
                    }
                }

            }
            e.preventDefault();
        },
        // 手指松开
        deviceTouchEnd(e) {
            // 当前屏幕的触摸列表
            let touchers = e.touches;
            // 没有点时触发
            if(touchers.length === 0){
                // 松开记录结束鼠标位置
                window.deviceTouchX2 = this.deviceMousePosition.x;
                window.deviceTouchY2 = this.deviceMousePosition.y;
                window.deviceTouchEndTime = new Date().getTime();

                if(!window.deviceTouchX1 && window.deviceTouchX1!==0){
                    e.preventDefault();
                    return;
                }

                let positionVal1 = window.deviceTouchX1 + "," + window.deviceTouchY1;
                let positionVal2 = window.deviceTouchX2 + "," + window.deviceTouchY2;

                if (!this.deviceInfo.startPreview) {
                    return
                }
                // 灵敏模式 触摸松开 直接发送松开指令
                if(this.devicePreviewParam.isOpenFastModel){
                    window.deviceTouchDown = false;
                    this.fastModelUp();
                    return;
                }
                // 坐标值不相同
                if (positionVal1 !== positionVal2) {
                    let deviceGestures = window.deviceGestures || [];
                    if(deviceGestures && deviceGestures.length){
                        let lastTime = deviceGestures[deviceGestures.length-1].time;
                        let firstTime = deviceGestures[0].time;
                        // 持续时长
                        let duration = Number(lastTime)-Number(firstTime);
                        // 拼接手势点
                        let otherPoints = deviceGestures.map(item=> '['+item.x+','+item.y+']').join(',');
                        // 拼接操作代码
                        let operateCode =  `gesture(${duration},${otherPoints})`;
                        // this.devicePreviewParam.operateRecord += operateCode + ";";
                        // 发送滑动指令
                        this.remoteExecuteScript(operateCode);
                        window.deviceGestures = [];
                        return;
                    }
                    let operateCode = 'swipe(' + window.deviceTouchX1 + ',' + window.deviceMouseY1 + ',' + window.deviceTouchX2 + ',' + window.deviceMouseY2 + ',' + (window.deviceTouchEndTime - window.deviceTouchStartTime) + ')';
                    // this.devicePreviewParam.operateRecord += operateCode + ";";
                    // 发送滑动指令
                    this.remoteExecuteScript(operateCode);
                    // 坐标相同
                } else {
                    // 大于500毫秒 即为长按
                    if (window.deviceTouchEndTime - window.deviceTouchStartTime > 500) {
                        if (!this.deviceInfo.startPreview) {
                            return
                        }
                        let operateCode = 'longClick(' + window.deviceTouchX1 + ',' + window.deviceMouseY1 + ')';
                        // this.devicePreviewParam.operateRecord += operateCode + ";";
                        // 发送长按指令
                        this.remoteExecuteScript(operateCode);
                    } else {
                        let operateCode = 'click(' + this.deviceMousePosition.x + ',' + this.deviceMousePosition.y + ')';
                        this.remoteExecuteScript(operateCode);
                        // this.devicePreviewParam.operateRecord += operateCode + ";";
                    }
                }
            }
            e.preventDefault();
        },
        // 转换坐标
        convertPosition(x,y){
            let box = document.querySelector('#devicePreviewImg');
            let obj = {
                x:0,
                y:0
            };
            // 竖屏
            if (this.screenDirection === "竖屏") {
                obj.x = Number(x * (this.deviceInfo.screenWidth / box.width)).toFixed(0);
                obj.y = Number(y * (this.deviceInfo.screenHeight / box.height)).toFixed(0);
                // 超过范围
                if(obj.x < 0 || obj.x > (this.deviceInfo.screenWidth / box.width) * box.width || obj.y < 0 || obj.y > (this.deviceInfo.screenHeight / box.height) * box.height){
                    return null;
                }
                // 横屏
            } else if (this.screenDirection === "横屏") {
                obj.x = Number(x * (this.deviceInfo.screenHeight / box.width)).toFixed(0);
                obj.y = Number(y * (this.deviceInfo.screenWidth / box.height)).toFixed(0);

                // 超过范围
                if(obj.x < 0 || obj.x > (this.deviceInfo.screenHeight / box.width) * box.width || obj.y < 0 || obj.y > (this.deviceInfo.screenWidth / box.height) * box.height){
                    return null;
                }
            }
            return obj;
        },
        // 灵敏模式移动事件
        fastModelMove(eventType){
            let remoteScript = `
                if(!utilsObj.hasAdb){
                    utilsObj.hasAdb =  $shell.checkAccess("adb") ? 1 : 2;
                }
                if (!utilsObj.hasRoot) {
                    utilsObj.hasRoot =  $shell.checkAccess("root") ? 1 : 2;  
                }
                if(utilsObj.hasAdb === 1){
                    utilsObj.raObj = utilsObj.raObj || new RootAutomator2({
                        adb: true
                    });
                }
                if(utilsObj.hasRoot === 1){
                    utilsObj.raObj = utilsObj.raObj || new RootAutomator2({
                        root: true
                    });
                }
                let execFun = ()=>{
                    if(!utilsObj.raObj){
                        toastLog("无adb和root权限,建议使用Shizuku进行adb授权")
                        return;
                    }
                    let ra = utilsObj.raObj;
                    try{
                        ra.touchMove([{
                            x: ${this.deviceMousePosition.x},
                            y: ${this.deviceMousePosition.y},
                            id: 0
                        }]);
                    }catch(e){
                        utilsObj.raObj.touchUp();
                        utilsObj.raObj.flush();
                    }
                }
                execFun();
                `;
            this.remoteExecuteScript(remoteScript);
        },
        // 设备鼠标移动
        deviceMouseMove(e) {
            // 转换坐标
            let result = this.convertPosition(e.offsetX,e.offsetY);
            if(!result){
                e.preventDefault();
                return;
            }
            this.deviceMousePosition.x = result.x;
            this.deviceMousePosition.y = result.y;

            let deviceGestures = window.deviceGestures || [];
            // 如果存在手势数组时
            if(deviceGestures && deviceGestures.length){
                // 获取最后一个手势对象
                let lastGestureObj = deviceGestures[deviceGestures.length-1];
                // 时间差
                let differentTimes = new Date().getTime() - lastGestureObj.time;
                // 大于等于10毫秒
                if(differentTimes>=10){
                    // 记录新的手势点
                    let newGestureObj = {
                        x:this.deviceMousePosition.x,
                        y:this.deviceMousePosition.y,
                        time:new Date().getTime()
                    };
                    window.deviceGestures.push(newGestureObj);
                    // 灵敏模式 鼠标移动 直接发送移动指令
                    if(this.devicePreviewParam.isOpenFastModel && window.deviceMouseDown){
                        this.fastModelMove();
                    }
                }
            }

        },
        // 灵敏模式松开事件
        fastModelUp(){
            let remoteScript = `
                        if(!utilsObj.hasAdb){
                            utilsObj.hasAdb =  $shell.checkAccess("adb") ? 1 : 2;
                        }
                        if (!utilsObj.hasRoot) {
                            utilsObj.hasRoot =  $shell.checkAccess("root") ? 1 : 2;  
                        }
                        if(utilsObj.hasAdb === 1){
                            utilsObj.raObj = utilsObj.raObj || new RootAutomator2({
                                adb: true
                            });
                        }
                        if(utilsObj.hasRoot === 1){
                            utilsObj.raObj = utilsObj.raObj || new RootAutomator2({
                                root: true
                            });
                        }
                        let execFun = ()=>{
                            if(!utilsObj.raObj){
                                toastLog("无adb和root权限,建议使用Shizuku进行adb授权")
                                return;
                            }
                            let ra = utilsObj.raObj;
                            try{
                                ra.touchUp();
                                ra.flush();
                             } catch(e){
                                utilsObj.raObj.touchUp();
                                utilsObj.raObj.flush();
                             }
                        }
                        execFun();
                    `;
            this.remoteExecuteScript(remoteScript);
            window.hideRemoteScriptNotify = false;
        },
        // 设备鼠标松开
        deviceMouseUp(e) {
            // 松开记录结束鼠标位置
            window.deviceMouseX2 = this.deviceMousePosition.x;
            window.deviceMouseY2 = this.deviceMousePosition.y;
            window.deviceMouseEndTime = new Date().getTime();

            let positionVal1 = window.deviceMouseX1 + "," + window.deviceMouseY1;
            let positionVal2 = window.deviceMouseX2 + "," + window.deviceMouseY2;

            if (!this.deviceInfo.startPreview) {
                return
            }
            // 灵敏模式 鼠标松开 直接发送松开指令
            if(this.devicePreviewParam.isOpenFastModel){
                window.deviceMouseDown = false;
                this.fastModelUp();
                return;
            }
            // 坐标值不相同
            if (positionVal1 !== positionVal2) {
                let deviceGestures = window.deviceGestures || [];
                if(deviceGestures && deviceGestures.length){
                    let lastTime = deviceGestures[deviceGestures.length-1].time;
                    let firstTime = deviceGestures[0].time;
                    // 持续时长
                    let duration = Number(lastTime)-Number(firstTime);
                    // 拼接手势点
                    let otherPoints = deviceGestures.map(item=> '['+item.x+','+item.y+']').join(',');
                    // 拼接操作代码
                    let operateCode =  `gesture(${duration},${otherPoints})`;
                    // this.devicePreviewParam.operateRecord += operateCode + ";";
                    // 发送滑动指令
                    this.remoteExecuteScript(operateCode);
                    window.deviceGestures = [];
                    return;
                }
                let operateCode = 'swipe(' + window.deviceMouseX1 + ',' + window.deviceMouseY1 + ',' + window.deviceMouseX2 + ',' + window.deviceMouseY2 + ',' + (window.deviceMouseEndTime - window.deviceMouseStartTime) + ')';
                // this.devicePreviewParam.operateRecord += operateCode + ";";
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
                    // this.devicePreviewParam.operateRecord += operateCode + ";";
                    // 发送长按指令
                    this.remoteExecuteScript(operateCode);
                }
            }
        },
    }
}