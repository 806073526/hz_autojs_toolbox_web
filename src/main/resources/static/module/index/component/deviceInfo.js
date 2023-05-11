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
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript'],
    props: {},
    data() {
        return {
            deviceList: [],// 设备列表
            deviceLoading: true,
            editorType:'vscode',
            editorTypeNeedRefresh:false,
            expandDevice:true,
            authorizeStatus: false,
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
            }
        }
    },
    mounted() {
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
            this.editorType = window.localStorage.getItem('editorType') || 'vscode';
        }
        // 检查设备授权状态
        this.authorizeStatus = this.checkSelfMachineAuthorize();
    },
    methods: {
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
        // 选中行
        selectRowChange(row) {
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
        getOnlineDevice() {
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
                url: "http://121.4.241.250:9998" + "/attachmentInfo/validateMachineCode",
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
            let message =  "<div>您的机器码是【"+ this.getSelfMachineCode()+"】</div>";
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