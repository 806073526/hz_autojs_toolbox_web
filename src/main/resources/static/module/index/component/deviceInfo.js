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
            deviceInfo: {// 当前设备信息
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
    mounted() {
        this.getOnlineDevice();
    },
    methods: {
        // 选中行
        selectRowChange(row) {
            // 初始化设备
            let initDevice = (row) => {
                this.$set(row, 'standardWidth', row.screenWidth);
                this.$set(row, 'standardHeight', row.screenHeight);
                this.$set(row, 'standardConvert', false);
                this.$set(row, 'offsetX', 0);
                this.$set(row, 'offsetY', 0);
                this.deviceInfo = row;
                this.$set(this.deviceInfo, 'standardWidth', row.screenWidth);
                this.$set(this.deviceInfo, 'standardHeight', row.screenHeight);
                this.$set(this.deviceInfo, 'standardConvert', false);
                this.$set(this.deviceInfo, 'offsetX', 0);
                this.$set(this.deviceInfo, 'offsetY', 0);
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
            let script = "commonStorage.put('x偏移系数'," + this.deviceInfo.offsetX + ");commonStorage.put('y偏移系数'," + this.deviceInfo.offsetY + ");commonStorage.put('standardConvert'," + this.deviceInfo.standardConvert + ");commonStorage.put('standardWidth'," + this.deviceInfo.standardWidth + ");commonStorage.put('standardHeight'," + this.deviceInfo.standardHeight + ");events.broadcast.emit('refreshUI');";
            this.remoteExecuteScript(script);
        },
    }
}