let template = '<div></div>';
$.ajax({
    url: "/module/index/template/remoteScript.html",
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
    computed:{
        remoteScriptApp(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item => item.type === 'app');
        },
        remoteScriptDevice(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item => item.type === 'device');
        },
        remoteScriptOther(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item => item.type === 'other');
        }
    },
    data() {
        return {
            remoteHandler: {
                param4: {
                    scriptText: '',
                    scriptImmediatelyExec: true
                }
            },
            remoteScript: {
                AppVersionCode: {type: 'app', name: '读取版本号', code: 'toastLog(app.versionCode);'},
                AppVersionName: {type: 'app', name: '读取版本名称', code: 'toastLog(app.versionName);'},
                AppLaunchApp: {type: 'app', name: '根据名称启动App', code: 'launchApp("华仔AutoJs工具箱");'},
                AppLaunch: {type: 'app', name: '启动App', code: 'launch("com.zjh336.cn.tools");'},
                AppLaunchPackage: {type: 'app', name: '根据包名启动App', code: 'launchPackage("com.zjh336.cn.tools");'},
                AppGetPackageName: {type: 'app', name: '获取包名', code: 'toastLog(getPackageName("华仔AutoJs工具箱"));'},
                AppGetAppName: {type: 'app', name: '获取App名', code: 'toastLog(getAppName("com.zjh336.cn.tools"));'},
                AppOpenAppSetting: {type: 'app', name: '打开App设置', code: 'openAppSetting("com.zjh336.cn.tools");'},
                AppViewFile: {type: 'app',name: '预览文件',code: 'app.viewFile("/sdcard/autoJsTools/imageHandlerAfter.png");'},
                AppEditFile: {type: 'app', name: '编辑文件',code: 'app.editFile("/sdcard/autoJsTools/imageHandlerAfter.png");'},
                AppUninstall: {type: 'app', name: '卸载应用', code: 'app.uninstall("com.tencent.mobileqq");'},
                AppOpenUrl: {type: 'app', name: '打开链接', code: 'app.openUrl("https://www.zjh336.cn");'},
                AppSendEmail: {
                    type: 'app', name: '发送邮件', code: 'app.sendEmail({\n' +
                        '    email: ["806073526@qq.com"],\n' +
                        '    subject: "这是一个邮件标题",\n' +
                        '    text: "这是邮件正文"\n' +
                        '});'
                },
                AppStartActivity: {type: 'app', name: '启动活动名称', code: 'app.startActivity("console");'},
                AppIntent: {type: 'app', name: '启动意图', code: 'var i = app.intent({\n' +
                        '    action: "VIEW",\n' +
                        '    type: "image/png",\n' +
                        '    data: "file:///sdcard/autoJsTools/imageHandlerAfter.png"\n' +
                        '});\n' +
                        'context.startActivity(i);'
                },
                AppParseUri: { type: 'app', name: '解析uri', code: 'toastLog(app.parseUri("file:///sdcard/autoJsTools/imageHandlerAfter.png"));' },
                AppGetUriForFile: { type: 'app', name: '从文件路径解析uri', code: 'toastLog(app.getUriForFile("file:///sdcard/autoJsTools/imageHandlerAfter.png"));'},
                AppGetInstalledApps: {
                    name: '获取安装应用列表', code: 'let apps = app.getInstalledApps({\n' +
                        '    get: [\'meta_data\',\'receivers\',\'activities\',\'services\'},\'intent_filters\'],\n' +
                        '    match: [\'system_only\']\n' +
                        '});\n' +
                        'toastLog(apps);'
                },

                deviceWidth: {type: 'device', name: '设备宽度', code: 'toastLog(device.width);'},
                deviceHeight: {type: 'device', name: '设备高度', code: 'toastLog(device.height);'},
                deviceBuildId: {type: 'device', name: '修订版本号', code: 'toastLog(device.buildId);'},
                deviceBroad: {type: 'device', name: '设备的主板型号', code: 'toastLog(device.broad);'},
                deviceBrand: {type: 'device', name: '厂商品牌', code: 'toastLog(device.brand);'},
                deviceDevice: {type: 'device', name: '名称', code: 'toastLog(device.device);'},
                deviceModel: {type: 'device', name: '设备型号', code: 'toastLog(device.model);'},
                deviceProduct: {type: 'device', name: '产品名称', code: 'toastLog(device.product);'},
                deviceBootloader: {type: 'device', name: 'Bootloader', code: 'toastLog(device.bootloader);'},
                deviceHardware: {type: 'device', name: '硬件名称', code: 'toastLog(device.hardware);'},
                deviceFingerprint: {type: 'device', name: '唯一标识码', code: 'toastLog(device.fingerprint);'},
                deviceSerial: {type: 'device', name: '硬件序列号', code: 'toastLog(device.serial);'},
                deviceSdkInt: {type: 'device', name: '安卓系统API版本', code: 'toastLog(device.sdkInt);'},
                deviceIncremental: {type: 'device', name: 'incremental', code: 'toastLog(device.incremental);'},
                deviceRelease: {type: 'device', name: '系统版本号', code: 'toastLog(device.release);'},
                deviceBaseOS: {type: 'device', name: 'baseOS', code: 'toastLog(device.baseOs);'},
                deviceSecurityPatch: {type: 'device', name: '安全补丁程序级别', code: 'toastLog(device.securityPatch);'},
                deviceCodename: {type: 'device', name: '开发代号', code: 'toastLog(device.codename);'},
                deviceGetIMEI: {type: 'device', name: '设备的IMEI', code: 'toastLog(device.getIMEI());'},
                deviceGetAndroidId: {type: 'device', name: 'AndroidID', code: 'toastLog(device.getAndroidId());'},
                deviceGetMacAddress: {type: 'device', name: 'Mac地址', code: 'toastLog(device.getMacAddress());'},
                deviceGetBrightness: {type: 'device', name: '手动亮度', code: 'toastLog(device.getBrightness());'},
                deviceGetBrightnessMode: {type: 'device', name: '当前亮度模式', code: 'toastLog(device.getBrightnessMode());'},
                deviceSetBrightness: {type: 'device', name: '设置当前手动亮度', code: 'device.setBrightness(255);'},
                deviceSetBrightnessMode: {type: 'device', name: '设置当前亮度模式', code: 'device.setBrightnessMode(1);'},
                deviceGetMusicVolume: {type: 'device', name: '当前媒体音量', code: 'toastLog(device.getMusicVolume());'},
                deviceGetNotificationVolume: {type: 'device',name: '当前通知音量',code: 'toastLog(device.getNotificationVolume());'},
                deviceGetAlarmVolume: {type: 'device', name: '当前闹钟音量', code: 'toastLog(device.getAlarmVolume());'},
                deviceGetMusicMaxVolume: {type: 'device', name: '媒体音量的最大值', code: 'toastLog(device.getMusicMaxVolume());'},
                deviceGetNotificationMaxVolume: {type: 'device',name: '通知音量的最大值',code: 'toastLog(device.getNotificationMaxVolume());'},
                deviceGetAlarmMaxVolume: {type: 'device', name: '闹钟音量的最大值', code: 'toastLog(device.getAlarmMaxVolume());'},
                deviceSetMusicVolume: {type: 'device', name: '设置当前媒体音量', code: 'device.setMusicVolume(0);'},
                deviceSetNotificationVolume: {type: 'device', name: '设置当前通知音量', code: 'device.setNotificationVolume(0);'},
                deviceSetAlarmVolume: {type: 'device', name: '设置当前闹钟音量', code: 'device.setAlarmVolume(0);'},
                deviceIsCharging: {type: 'device', name: '是否正在充电', code: 'toastLog(device.isCharging());'},
                deviceGetBattery: {type: 'device', name: '当前电量百分比', code: 'toastLog(device.getBattery());'},
                deviceGetTotalMem: {type: 'device', name: '设备内存总量', code: 'toastLog((device.getTotalMem()/(1024*1024))+"MB");'},
                deviceGetAvailMem: {type: 'device', name: '设备当前可用的内存', code: 'toastLog((device.getAvailMem()/(1024*1024))+"MB");'},
                deviceIsScreenOn: {type: 'device', name: '屏幕是否亮着', code: 'toastLog(device.isScreenOn());'},
                deviceWakeUp: {type: 'device', name: '唤醒设备', code: 'device.wakeUp();'},
                deviceWakeUpIfNeeded: {type: 'device', name: '如果屏幕不亮唤醒设备', code: 'device.wakeUpIfNeeded();'},
                deviceKeepScreenOn: {type: 'device', name: '屏幕保持常亮', code: 'device.keepScreenOn();'},
                deviceCancelKeepingAwake: {type: 'device', name: '取消设备保持唤醒状态', code: 'device.cancelKeepingAwake();'},
                deviceVibrate: {type: 'device', name: '设备震动', code: 'device.vibrate(1000);'},
                deviceCancelVibration: {type: 'device', name: '设备取消震动', code: 'device.cancelVibration();'},

                currentPackage: {type: 'other', name: '正在运行的应用的包名', code: 'toastLog(currentPackage());'},
                currentActivity: {type: 'other', name: '正在运行的Activity的名称', code: 'toastLog(currentActivity());'},
                consoleShow: {type: 'other', name: '显示日志控制台', code: 'console.show();'},
                consoleHide: {type: 'other', name: '隐藏日志控制台', code: 'console.hide();'},
                consoleClear: {type: 'other', name: '清除日志控制台', code: 'console.clear();'},
                setClip: {type: 'other', name: '设置剪切板', code: 'setClip("https://www.zjh336.cn");'},
                getClip: {type: 'other', name: '读取剪切板', code: 'toastLog(getClip());'},
                randomMinMax: {type: 'other', name: '随机数指定范围', code: 'toastLog(random(1,10));'},
                random: {type: 'other', name: '随机数浮点', code: 'toastLog(random());'},
            }
        }
    },
    methods: {
        // 清空脚本
        clearScript() {
            this.remoteHandler.param4.scriptText = '';
        },
        // 获取远程代码
        getRemoteScript(code) {
            if (code) {
                if (this.remoteHandler.param4.scriptImmediatelyExec && this.validSelectDevice()) {
                    // 远程执行
                    this.remoteExecuteScript(code);
                }
                this.remoteHandler.param4.scriptText += code +"\n";
            }
        },
        // 远程运行脚本
        remoteRunScript() {
        }
    }
}