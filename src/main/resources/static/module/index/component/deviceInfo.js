import {getContext} from "./../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/deviceInfo.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});

export default {
    template: template,
    name: 'DeviceInfo',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript','timeSyncOtherPropertyFun'],
    props: {},
    data() {
        return {
            versionInfo:"V3.1.2",
            newVersion:"",
            isExeVersion: false,
            deviceList: [],// 设备列表
            deviceLoading: true,
            editorType:'ace',
            editorTypeNeedRefresh:false,
            expandDevice:true,
            authorizeStatus: false,
            showRefresh:true,
            systemConfig:{
                deviceStatusNotice: true,
                allowOperateFile: false,
                lastSelectDeviceUuid: "",
                autoCheckVersionUpdate: true,
                openNoticeMessage: true,
                autoRefreshScreenCapture: false,
                allScreenCaptureAutoRename: false,
                defaultScreenImageName: 'system/imageHandler/allScreen.png',
                zoomSize: 100
            },
            systemSettingDialog: false,
            deviceInfo: {// 当前设备信息
                startPreview: false,
                deviceUuid: '',
                aliasName:"", // 别名
                standardWidth: null,
                standardHeight: null,
                standardConvert: false,
                offsetX: 0,
                offsetY: 0,
                debugModel:true,
                debugSleep:1000
            }
        }
    },
    computed:{
        allowOperateFile(){
            return this.systemConfig.allowOperateFile;
        },
        zoomSize(){
            return this.systemConfig.zoomSize;
        },
        newVersionNotice(){
            return this.versionInfo !== this.newVersion ? "有新版本"  : "";
        }
    },
    watch:{
        zoomSize:{
            handler(val){
                window.ZXW_VUE.$EventBus.$emit('refreshScrollHeight');
            },
            deep: true // 可以深度检测到  对象的属性值的变化
        },
        systemConfig:{
            handler(val){
                window.localStorage.setItem("systemConfig",JSON.stringify(val));
                // 参数发生变化 重新初始化公共文件模块
                if(val.allowOperateFile !== window.allowOperateFile){
                    window.ZXW_VUE.$EventBus.$emit('initModule', "commonFile");
                }
                window.allowOperateFile = val.allowOperateFile;
            },
            /*immediate: true, // 立即触发一次*/
            deep: true // 可以深度检测到  对象的属性值的变化
        }
    },
    mounted() {
        let autoCheckVersionUpdate = true;
        let openNoticeMessage = true;
        let systemConfigCache = window.localStorage.getItem("systemConfig");
        if(systemConfigCache){
            let systemConfigObj = JSON.parse(systemConfigCache);
            if(systemConfigObj){
                this.systemConfig = systemConfigObj;
                autoCheckVersionUpdate = systemConfigObj.autoCheckVersionUpdate;
                openNoticeMessage = systemConfigObj.openNoticeMessage;
            }
        }
        this.getOnlineDevice();

        // 获取编辑器类型未刷新标记
        let editorTypeChangeNoRefresh = window.localStorage.getItem('editorTypeChangeNoRefresh');
        if(editorTypeChangeNoRefresh){
            window.localStorage.removeItem('editorTypeChangeNoRefresh');
            // 获取编辑器类型变化值
            let editorTypeChangeValue = window.localStorage.getItem('editorTypeChangeValue');
            // 获取编辑器类型
            let editorType = window.localStorage.getItem('editorType');
            // 重置当前编辑器类型
            this.editorType = editorTypeChangeValue ? editorTypeChangeValue : editorType;
            // 设置到缓存中
            window.localStorage.setItem('editorType',this.editorType);
            // 清除变化值
            window.localStorage.removeItem('editorTypeChangeValue');
        } else {
            // 获取编辑器类型
            this.editorType = window.localStorage.getItem('editorType') || 'ace';
        }
        // 检查设备授权状态
        this.authorizeStatus = this.checkSelfMachineAuthorize();

        this.isExeVersion = this.checkExeOptions();
        if(this.isExeVersion && autoCheckVersionUpdate){
            this.checkVersion();
        }
        // 获取最新版本
        this.newVersion = this.getNewVersion();

        if(openNoticeMessage){
            // 开启公告显示
            this.openNoticeMessage();
        }

        // 获取当前缓存中最后一次选中的设备
        let lastSelectDeviceUuid = window.localStorage.getItem("lastSelectDeviceUuid");
        // 如果缓存为空 直接返回
        if(!lastSelectDeviceUuid){
            return;
        }
        setTimeout(() => {
            this.$nextTick(() => {
                // 自动选择设备
                this.autoSelectDevice(lastSelectDeviceUuid);
            });
        }, 500);


    },
    methods: {
        // 检查版本更新
        checkVersion(){
            if(!this.isExeVersion){
                window.ZXW_VUE.$message.warning({message:'最新版本为【'+this.newVersion+'】,请注意,只有exe方式部署才支持在线更新', duration: 3000});
                return;
            }
            this.newVersion  = this.getNewVersion();
            this.$confirm('当前最新版为【'+this.newVersion+'】,是否需要在线更新?', '提示', {
                confirmButtonText: '更新版本',
                cancelButtonText: '取消操作',
                type: 'info'
            }).then(() => {
                window.ZXW_VUE.$message.warning({message:'请进入exe目录,等待exe文件更新完成后(刷新目录大小不变化),手动启动服务', duration: 5000});
                $.ajax({
                    url: getContext() + "/device/onlineUpdateVersion",
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                       console.log(data);
                    },
                    error: function (msg) {
                        console.log(msg);
                    }
                });
            })
        },
        // 开启通知消息
        openNoticeMessage(){
            let noticeMessage = '';
            let _that = this;
            $.ajax({
                url: getContext() + "/device/getNoticeMessage",
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.isSuccess) {
                        noticeMessage = data.data;
                    }
                },
                error: function (msg) {
                }
            });
            this.$alert(noticeMessage, '公告', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
            });
        },
        // 是否exe方式部署(根据是否存在zxw-aj-tools.vmoptions配置文件判断)
        checkExeOptions(){
            let isExe = '';
            let _that = this;
            $.ajax({
                url: getContext() + "/device/checkExeOptions",
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.isSuccess) {
                        isExe = data.data;
                    }
                },
                error: function (msg) {
                }
            });
            return isExe;
        },
        // 获取最新版本号
        getNewVersion(){
            let newVersion = '';
            let _that = this;
            $.ajax({
                url: getContext() + "/device/getNewVersion",
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.isSuccess) {
                        newVersion = data.data;
                    }
                },
                error: function (msg) {
                }
            });
            return newVersion;
        },
        // 刷新截图权限
        refreshCaptureScreen(){
            if (!this.validSelectDevice()) {
                return
            }
            let script = `
            // 强制停止截图权限
            images.stopScreenCapture();
            utilsObj.startRequestScreenClickTreadWait = (waitTimes)=>{
                // 读取其他点击文字数据
                let otherClickText = commonStorage.get("otherClickText");
            
                let textRegExp = new RegExp('(允许|立即开始|同意'+(otherClickText ? '|' + otherClickText : '')+')');
            
                // 停止截图点击线程
                if(utilsObj.requestScreenClickThreadWaitTimes){
                    utilsObj.requestScreenClickThreadWaitTimes.interrupt();
                }
            
                // 开启点击线程
                utilsObj.requestScreenClickThreadWaitTimes = threads.start(function () {
                    while (true) {
                        let click1 = textMatches(textRegExp).findOne(100);
                        if(click1){
                            click1.click();
                        }
                        if(utilsObj.requestScreenClickThreadWaitTimes){
                            // 停止点击线程
                            utilsObj.requestScreenClickThreadWaitTimes.interrupt();
                        }
                    }
                });
                // 延迟关闭点击线程
                setTimeout(()=>{
                    // 停止截图点击线程
                    if(utilsObj.requestScreenClickThreadWaitTimes){
                        utilsObj.requestScreenClickThreadWaitTimes.interrupt();
                    }
                },waitTimes)
            }
            utilsObj.requestScreenCaptureCommonFun = (callback)=>{
                try {
                    // 获取截图权限参数
                    let screenCaptureOptions = images.getScreenCaptureOptions();
                    // 不为空
                    if(screenCaptureOptions){
                        // 截图权限与当前屏幕方向相同 
                        if(String(screenCaptureOptions.orientation) === String(utilsObj.getOrientation())){
                            // 开启一个延时1秒关闭的点击线程 
                            utilsObj.startRequestScreenClickTreadWait(1000);
                            if(callback){
                                callback();
                            }
                            // 已有截图权限 直接返回
                            return;
                        }
                        // 关闭当前截图权限 
                        images.stopScreenCapture();
                        sleep(100);
                    }
                    // 未开启无障碍服务
                    if(!auto.service){
                        console.error("未开启无障碍服务")
                        // 直接返回
                        return;
                    }
            
                    // 是否存在截图权限
                    let exitsScreenCaputreOptions = false;
            
                    // 读取其他点击文字数据
                    let otherClickText = commonStorage.get("otherClickText");
            
                    let textRegExp = new RegExp('(允许|立即开始|同意'+(otherClickText ? '|' + otherClickText : '')+')');
            
                    // 停止截图点击线程
                    if(utilsObj.requestScreenClickThread){
                        utilsObj.requestScreenClickThread.interrupt();
                    }
                    sleep(200);
                    // 开启点击线程
                    utilsObj.requestScreenClickThread = threads.start(function () {
                        while (true) {
                            let click1 = textMatches(textRegExp).findOne(100);
                            if(click1){
                                click1.click();
                            }
                            let checkScreenCaptureOptions = images.getScreenCaptureOptions();
                            if(checkScreenCaptureOptions){
                                // 设置标志
                                exitsScreenCaputreOptions = true;
                                if(utilsObj.requestScreenClickThread){
                                    // 停止点击线程
                                    utilsObj.requestScreenClickThread.interrupt();
                                }
                            }
                        }
                    });
                    // 申请截图权限
                    images.requestScreenCapture({orientation:utilsObj.getOrientation()});
            
                    let timeoutLimit = 0;
                    // 没有截图权限时 循环等待
                    while (!exitsScreenCaputreOptions) {
                        sleep(100);
                        timeoutLimit++;
                        // 超过30秒 退出等待
                        if(timeoutLimit> 10 * 30){
                            break;
                        }
                    }
                    if(timeoutLimit < 10 * 30){
                        // 未超时 执行回调
                        if(callback){
                            sleep(1000);
                            callback();
                        }
                    }
                    // 超时不做处理
                } catch (error) {
                    console.error("申请截图权限错误,自动重试", error)
                    // 如果出现错误 则先停止截图权限
                    images.stopScreenCapture();
                    // 开启一个延时3秒关闭的点击线程 
                    utilsObj.startRequestScreenClickTreadWait(3000);
                    // 再重新申请截图权限
                    images.requestScreenCapture({orientation:utilsObj.getOrientation()});
                    // 执行回调
                    if(callback){
                        sleep(1000);
                        callback();
                    }
                }
            }
            files.createWithDirs("/sdcard/autoJsLocalImg/system/imageHandler/");
            utilsObj.requestScreenCaptureCommonFun(()=>{
                toastLog("刷新截图权限完成");
            })
            `;
            this.remoteExecuteScript(script);
        },
        // 显示系统设置弹窗
        showSystemSettingDialog(){
          this.systemConfig.lastSelectDeviceUuid = window.localStorage.getItem("lastSelectDeviceUuid");
          this.systemSettingDialog  = true;
        },
        systemConfigChange(){
            window.ZXW_VUE.$notify.success({message: '修改成功', duration: '1000'});
        },
        //上线处理
        online(deviceUuid) {
            //已连接无需检测
            if (this.deviceInfo.deviceUuid){
                return;
            }
            //寻找上一次连接的设备号
            let lastSelectDeviceUuid = window.localStorage.getItem("lastSelectDeviceUuid");
            // 如果缓存为空 直接返回
            if(!lastSelectDeviceUuid) return;
            // 自动选择设备
            setTimeout(() => {
                this.$nextTick(() => {
                    if(this.systemConfig.deviceStatusNotice){
                        window.ZXW_VUE.$notify({
                            title: 'APP上线通知',
                            dangerouslyUseHTMLString: true,
                            message: "设备【"+deviceUuid+"】已上线",
                            position: 'bottom-right'
                        });
                    }
                    // 自动选择设备
                    this.autoSelectDevice(lastSelectDeviceUuid);
                });
            }, 500);
        },
        //app断开连接处理
        downLine(deviceUuid){
            this.getOnlineDevice();
            if(this.systemConfig.deviceStatusNotice){
                window.ZXW_VUE.$notify({
                    title: 'APP离线通知',
                    dangerouslyUseHTMLString: true,
                    message: "设备【"+deviceUuid+"】已离线",
                    position: 'bottom-right'
                });
            }
            if(deviceUuid===this.deviceInfo.deviceUuid){
                this.$set(this.deviceInfo, 'deviceUuid', "");
            }
        },
        expandDeviceFun(){
            this.expandDevice = !this.expandDevice;
        },
        // 编辑器类型change
        editorTypeChange(){
            // 设置编辑器类型变化值
            window.localStorage.setItem('editorTypeChangeValue',this.editorType);
            // 设置编辑器类型未刷新标记
            window.localStorage.setItem('editorTypeChangeNoRefresh','true');

            let cacheEditorType = window.localStorage.getItem('editorType');
            // 设置需要刷新标记
            this.editorTypeNeedRefresh = cacheEditorType !== this.editorType;
            //刷新页面----
            this.expandDeviceFun();
        },
        refreshPage(){
            window.ZXW_VUE.$confirm('编辑器类型已修改,刷新后才能生效,是否确认刷新页面?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                window.location.reload();
            });
        },
        // 自动选择设备
        autoSelectDevice(selectDeviceUuid){
            // 请求查询设备列表接口
            this.getOnlineDevice(()=>{
                // 获取与选中设备uuid相同的设备
                let selectArr =  this.deviceList.filter(item=> item.deviceUuid === selectDeviceUuid);
                if(selectArr && selectArr.length){
                    // 选中行
                    this.$refs.deviceTable.setCurrentRow(selectArr[0]);
                }
            });
        },
        // 选中行
        selectRowChange(row) {
            if(row==null) return;

            // 初始化设备
            let initDevice = (row) => {
                this.$set(row, 'standardWidth', row.screenWidth);
                this.$set(row, 'standardHeight', row.screenHeight);
                this.$set(row, 'standardConvert', false);
                this.$set(row, 'offsetX', 0);
                this.$set(row, 'offsetY', 0);
                this.$set(row, 'debugModel', true);
                this.$set(row, 'debugSleep', 1000);
                this.deviceInfo = row;
                this.$set(this.deviceInfo, 'standardWidth', row.screenWidth);
                this.$set(this.deviceInfo, 'standardHeight', row.screenHeight);
                this.$set(this.deviceInfo, 'standardConvert', false);
                this.$set(this.deviceInfo, 'offsetX', 0);
                this.$set(this.deviceInfo, 'offsetY', 0);
                this.$set(this.deviceInfo, 'debugModel', true);
                this.$set(this.deviceInfo, 'debugSleep', 1000);
                this.$set(this.deviceInfo, 'aliasName', row.aliasName);

                let otherPropertyJson = row.otherPropertyJson;
                if(otherPropertyJson){
                    let otherPropertyObj = JSON.parse(otherPropertyJson);
                    if(otherPropertyObj!=null){
                        row.orientation = otherPropertyObj.orientation;
                    }
                }
                // 同步设备信息
                this.$emit('deviceSelectRowCallback', {
                    deviceInfo: this.deviceInfo,
                    screenDirection: row.orientation === 1 ? "竖屏" : "横屏"
                });
                window.ZXW_VUE.$notify.success({
                    message: "已选择设备:" + row.deviceUuid,
                    duration: '3000'
                })
            };
            // 清空选中行
            let clearSelectRow = () => {
                window.ZXW_VUE.$nextTick(() => {
                    window.ZXW_VUE.$refs["deviceTable"].setCurrentRow()
                })
            };
            let _that = this;
            // 验证密码
            let validPassword = () => {
                // 输入密码
                window.ZXW_VUE.$prompt('请输入APP端设置的访问密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    $.ajax({
                        url: getContext() + "/device/validPassword",
                        type: "GET",
                        dataType: "json",
                        data: {
                            "deviceUUID": row.deviceUuid,
                            "password": value
                        },
                        success: function (data) {
                            if (data) {
                                if (data.isSuccess) {
                                    // 密码正确
                                    if (data.data) {
                                        // 设置访问密码
                                        _that.deviceInfo.devicePassword = value;
                                        _that.$set(row,'devicePassword',value);
                                        initDevice(row)
                                    } else {
                                        clearSelectRow();
                                        window.ZXW_VUE.$notify.error({
                                            message: "访问密码不正确",
                                            duration: '1000'
                                        })
                                    }
                                }
                            }
                        },
                        error: function (msg) {
                            clearSelectRow();
                        }
                    });
                }).catch(() => {
                });
            };
            $.ajax({
                url: getContext() + "/device/isNeedPassword",
                type: "GET",
                dataType: "json",
                data: {
                    "deviceUUID": row.deviceUuid
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            // 不需要密码
                            if (!data.data) {
                                initDevice(row)
                            } else {
                                // 验证密码
                                validPassword();
                            }
                        }
                    }
                },
                error: function (msg) {
                }
            });
        },
        // 获取在线设备
        getOnlineDevice(callback) {
            let _this = this;
            _this.deviceLoading = true;
            $.ajax({
                url: getContext() + "/device/getOnlineDevice",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            _this.deviceList = data.data;
                            if(typeof(callback)=="function"){
                                callback();
                            }
                        }
                    }
                    setTimeout(() => {
                        _this.deviceLoading = false
                    }, 200)
                },
                error: function (msg) {
                    setTimeout(() => {
                        _this.deviceLoading = false
                    }, 200)
                }
            });
        },
        // 同步标准宽高到App
        syncWidthHeightToApp() {
            if (!this.validSelectDevice()) {
                return
            }
            let script = "commonStorage.put('x偏移系数'," + this.deviceInfo.offsetX + ");" +
                "commonStorage.put('y偏移系数'," + this.deviceInfo.offsetY + ");" +
                "commonStorage.put('standardConvert'," + this.deviceInfo.standardConvert + ");" +
                "commonStorage.put('standardWidth'," + this.deviceInfo.standardWidth + ");" +
                "commonStorage.put('standardHeight'," + this.deviceInfo.standardHeight + ");" +
                "commonStorage.put('debugModel'," + this.deviceInfo.debugModel + ");" +
                "commonStorage.put('debugSleep'," + this.deviceInfo.debugSleep + ");" +
                "events.broadcast.emit('refreshUI');";
            this.remoteExecuteScript(script);
        },
        // 检查当前设备机器码授权状态
        checkSelfMachineAuthorize(){
            let authorize = false;
            $.ajax({
                url: getContext() + "/attachmentInfo/validateMachineCodeWithSelf",
                type: 'POST',
                data: {
                    "machineCode":this.getSelfMachineCode()
                },
                async:false,
                dataType: "json",
                success: function (data) {
                    authorize = data;
                },
                error: function (msg) {
                }
            });
            return authorize;
        },
        // 获取当前机器码
        getSelfMachineCode(){
            let machineCode = '';
            $.ajax({
                url: getContext() + "/attachmentInfo/getMachineCode",
                type: 'get',
                data: {
                },
                async:false,
                dataType: "json",
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            machineCode = data.data
                        }
                    }
                },
                error: function (msg) {
                }
            });
            return machineCode;
        },
        // 设备授权方法
        authorizedFun(){
            let message =  "<div>您的机器码是【"+ this.getSelfMachineCode()+"】(机器码授权后可以支持项目打包)</div>";
            if(!this.authorizeStatus){
                message += "<div>请点击确定,联系QQ806073526,进行机器码授权</div>";
            }
            this.$msgbox({
                title: '提示',
                dangerouslyUseHTMLString: true,
                customClass:"messageClass",
                message: message,
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(action => {
                if(action && !this.authorizeStatus){
                    window.open("tencent://message/?uin=806073526&Site=Talklee.Com&Menu=yes","_blank");
                }
            });

        }
    }
}