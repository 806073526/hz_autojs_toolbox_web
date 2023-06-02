import {getContext,handlerAppByCacheChange,sortByKey} from "./../../../utils/utils.js";

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
            noticeListenerName:'noticeListenerRules.json',// 通知监听名称
            historyNoticeMessageList:[],// 历史通知消息列表
            historyNoticeLoading:false,
            scriptArr:[],// 脚本数组
            scriptLoading:false,
            timerTaskArr:[],
            timerTaskLoading:false,
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
    computed:{
      allowOpenNoticeListener(){ // 允许开启通知监听
          let notCompleted =this.noticeListenerRules.find(item=> JSON.stringify(item) === JSON.stringify(this.tableDefaultRowMap["noticeListenerRules"]));
          return !notCompleted;
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
            if(!this.noticeListenerName){
                window.ZXW_VUE.$message.warning('请设置规则名称');
                return false;
            }
            let notCompleted =this.noticeListenerRules.find(item=> JSON.stringify(item) === JSON.stringify(this.tableDefaultRowMap["noticeListenerRules"]));
            if(notCompleted){
                window.ZXW_VUE.$message.warning('请将规则填写完整');
                return false;
            }
            window.localStorage.setItem("noticeListenerRules_"+this.noticeListenerName,JSON.stringify(this.noticeListenerRules));
            window.ZXW_VUE.$notify.success({message: '保存草稿成功', duration: '1000'});
        },
        // 从草稿读取
        readForDraft(){
            if(!this.noticeListenerName){
                window.ZXW_VUE.$message.warning('请设置规则名称');
                return false;
            }
            let noticeListenerRulesJson = window.localStorage.getItem("noticeListenerRules_"+this.noticeListenerName);
            this.noticeListenerRules = noticeListenerRulesJson ? JSON.parse(noticeListenerRulesJson) : [];
            window.ZXW_VUE.$notify.success({message: '读取草稿成功', duration: '1000'});
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
                param.append('pathName', this.deviceInfo.deviceUuid+"/");
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
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/"+this.noticeListenerName + "?t="+(new Date().getTime()),
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
                            console.log(data.data);
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
                    }, 200)
                },
                error: function (msg) {
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
                    let rules = decodeURI($base64.decode('${btoa(encodeURI(JSON.stringify(this.noticeListenerRules)))}'));
                    let matchingRules = rules ? JSON.parse(rules) : [];
                    events.removeAllListeners('notification');
                    events.observeNotification();
                    events.onNotification(function(notification) {
                        let messageObj = {
                            "应用包名": notification.getPackageName() || "",
                            "通知文本": notification.getText() || "",
                            "通知优先级": notification.priority || 0,
                            "通知目录": notification.category || "",
                            "通知时间": new Date(notification.when),
                            "通知数": notification.number || 0,
                            "通知摘要": notification.tickerText || ""
                        }
                        try{
                            matchingRules.forEach(item=>{
                                item.matchingPackageName = item.matchingPackageName ? item.matchingPackageName : "";
                                item.matchingText = item.matchingText ? item.matchingText : "";
                                if ((!item.matchingPackageName || messageObj["应用包名"].indexOf(item.matchingPackageName) !== -1) && (!item.matchingText || (messageObj["通知文本"].indexOf(item.matchingText) !== -1 || messageObj["通知摘要"].indexOf(item.matchingText) !== -1))) {
                                    if (item.autoClick) {
                                        notification.click();
                                    }
                                    let message = JSON.stringify(messageObj)
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
                                    utilsObj.request("/attachmentInfo/writeNoticeMessage?deviceUUID=" + deviceUUID + "&message=" + item.message, "GET", null, () => {
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