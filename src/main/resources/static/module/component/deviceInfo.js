import {getContext} from "./../../utils/utils.js";

let template='' +
    '<div>' +
    '<p class="basicInfo" style="position: relative;">已连接设备列表' +
    '    <i class="el-icon-refresh-right" style="cursor: pointer;font-weight: 600!important;" @click="getOnlineDevice"></i>' +
    '    <span style="position: absolute;right: 10px;">' +
    '        <a href="https://www.zjh336.cn/?id=2109" target="_blank" style="margin-right: 5px;color: #2f871a">博客地址</a>' +
    '        <a href="https://gitee.com/zjh336/hz_autojs_toolbox_web/releases" target="_blank" style="margin-right: 5px;color: #2ECC40">Web端本地部署</a>' +
    '        <a href="https://gitee.com/zjh336/hz_autojs_toolbox/releases" target="_blank" style="color: blue;">APP端下载</a>' +
    '        <a href="https://space.bilibili.com/69729485/channel/series" target="_blank" style="margin-right: 5px;color:brown;">演示(操作)视频</a>' +
    '        <a href="https://tool.gljlw.com/qq/?qq=806073526" target="_blank" style="color: #3c663f;">联系QQ:806073526</a>' +
    '    </span>' +
    '</p>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-table' +
    '               :data="deviceList"' +
    '               v-loading="deviceLoading"' +
    '               border' +
    '               ref="deviceTable"' +
    '               highlight-current-row' +
    '               @current-change="selectRowChange"' +
    '               style="width: 100%">' +
    '            <el-table-column' +
    '               prop="deviceUuid"' +
    '               align="left"' +
    '               label="设备UUID"' +
    '            >' +
    '               <template slot-scope="{ row, $index}">' +
    '               {{ row.deviceUuid }}' +
    '               </template>' +
    '            </el-table-column>' +
    '            <el-table-column' +
    '              prop="connectTime"' +
    '              label="建立连接时间"' +
    '               align="left">' +
    '            </el-table-column>' +
    '            <el-table-column' +
    '               prop="lastHeartTime"' +
    '               label="最后一次心跳时间"' +
    '               align="left">' +
    '            </el-table-column>' +
    '            <el-table-column' +
    '               prop="screenHeight"' +
    '               label="屏幕高度"' +
    '               align="left">' +
    '            </el-table-column>' +
    '            <el-table-column' +
    '               prop="screenWidth"' +
    '               label="屏幕宽度"' +
    '               align="left">' +
    '            </el-table-column>' +
    '        </el-table>' +
    '    </div>' +
    '</el-row>' +
    '<el-row  style="margin-top: 10px;">' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="标准宽度:" prop="x1" class="width20">' +
    '            <el-input type="number"' +
    '              v-model="deviceInfo.standardWidth"' +
    '              placeholder="请设置标准宽度"' +
    '              class="width100" @change="syncWidthHeightToApp"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="标准高度:" prop="y1" class="width20">' +
    '            <el-input type="number"' +
    '               v-model="deviceInfo.standardHeight" placeholder="请设置标准高度"' +
    '               class="width100" @change="syncWidthHeightToApp"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="x偏移系数:" prop="x1" class="width20">' +
    '            <el-input type="number"' +
    '               v-model="deviceInfo.offsetX"' +
    '               placeholder="请设置x偏移系数"' +
    '               class="width100" @change="syncWidthHeightToApp"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="y偏移系数:" prop="y1" class="width20">' +
    '            <el-input type="number"' +
    '               v-model="deviceInfo.offsetY" placeholder="请设置y偏移系数"' +
    '               class="width100" @change="syncWidthHeightToApp"' +
    '            >' +
    '            </el-input>' +
    '        </el-form-item>' +
    '        <el-form-item label="标准坐标转换:" label-width="120px" class="width10">' +
    '            <el-switch v-model="deviceInfo.standardConvert" @change="syncWidthHeightToApp"/>' +
    '        </el-form-item>' +
    '        <div class="width10 d-flex a-center" style="justify-content: right;margin-bottom:15px;">' +
    '            <el-button @click.stop="syncWidthHeightToApp">同步到APP</el-button>' +
    '        </div>' +
    '    </div>' +
    '</el-row>' +
    '</div>';

export default {
    template: template,
    name: 'DeviceInfo',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript'],
    props: {
    },
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
    mounted(){
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
                this.$emit('deviceSelectRowCallback',{
                    deviceInfo:this.deviceInfo,
                    screenDirection:row.orientation === 1 ? "竖屏" : "横屏"
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