import {getContext,getEditorType,initFileEditor} from "../../../utils/utils.js";

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
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript', 'getMonacoEditorComplete'],
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
        remoteScriptKeys(){
          let arr = Object.values(this.remoteScript);
          return arr.filter(item=> item.type === 'keys')
        },
        remoteScriptOperate(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item=> item.type === 'operate')
        },
        remoteScriptTask(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item=> item.type === 'task')
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
                    scriptName:'remoteScript.js',
                    scriptText: '',
                    scriptImmediatelyExec: true,
                    isNodeScript: false
                }
            },
            scriptEditor: null,
            tempCustomScript:[],// 自定义模块缓存数据
            customScript:[],// 自定义模块 [{moduleName:'',scriptName:''}]
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
                observeNotification:{type: 'other', name: '开启通知监听', code:
                   `events.obverseNotification();
                    events.onNotification(function(notification){
                        log("应用包名: " + notification.getPackageName());
                        log("通知文本: " + notification.getText());
                        log("通知优先级: " + notification.priority);
                        log("通知目录: " + notification.category);
                        log("通知时间: " + new Date(notification.when));
                        log("通知数: " + notification.number);
                        log("通知摘要: " + notification.tickerText);
                        // 点击通知 notification.click();
                        // 删除通知 notification.delete();
                    });`
                },
                observeToast:{type: 'other', name: '开启Toast监听', code:
                  `events.observeToast();
                   events.onToast(function(toast){
                      log("Toast内容: " + toast.getText() + " 包名: " + toast.getPackageName());
                   });
                   `
                },

                back: {type: 'keys', name: '返回上一层', code: 'back();'},
                home: {type: 'keys', name: '返回主页', code: 'home();'},
                powerDialog: {type: 'keys', name: '电源', code: 'powerDialog();'},
                notifications: {type: 'keys', name: '通知栏拉出', code: 'notifications();'},
                quickSettings: {type: 'keys', name: '通知栏拉到底', code: 'back();'},
                recents: {type: 'keys', name: '最近任务', code: 'recents();'},
                observeKey: {type: 'keys', name: '启用按键监听', code: 'events.observeKey();'},
                onKeyDown: {type: 'keys', name: '监听按键按下', code:
                    `//启用按键监听
                    events.observeKey();
                    //监听音量上键按下
                    events.onKeyDown("volume_up", function(event){
                        toast("音量上键被按下了");
                    });
                    //监听菜单键按下
                    events.onKeyDown("menu", function(event){
                        toast("菜单键被按下了");
                    });`
                },
                onKeyUp: {type: 'keys', name: '监听按键弹起', code:
                   `//启用按键监听
                    events.observeKey();
                    //监听音量上键按下
                    events.onKeyUp("volume_up", function(event){
                        toast("音量上键弹起");
                    });
                    //监听菜单键按下
                    events.onKeyUp("menu", function(event){
                        toast("Home键弹起");
                    });`
                },
                onceKeyDown: {type: 'keys', name: '监听按键按下一次', code:
                    ` //启用按键监听
                    events.observeKey();
                    //监听音量上键按下
                    events.onceKeyDown("volume_up", function(event){
                        toast("音量上键被按下了一次");
                    });
                    //监听菜单键按下
                    events.onceKeyDown("menu", function(event){
                        toast("菜单键被按下了一次");
                    });`
                },
                onceKeyUp: {type: 'keys', name: '监听按键弹起一次', code:
                   `//启用按键监听
                    events.observeKey();
                    //监听音量上键按下
                    events.onceKeyUp("volume_up", function(event){
                        toast("音量上键弹起一次");
                    });
                    //监听菜单键按下
                    events.onceKeyUp("menu", function(event){
                        toast("Home键弹起一次");
                    });`
                },
                removeAllKeyDownListeners: {type: 'keys', name: '删除全部按键按下事件', code:
                   `//启用按键监听
                    events.observeKey();
                    //删除音量全部按下事件
                    events.removeAllKeyDownListeners("volume_up");
                    //删除菜单全部按下事件
                    events.removeAllKeyDownListeners("menu");`
                },
                setKeyInterceptionEnabled:{type: 'keys', name: '设置按键屏蔽是否启用', code:
                  `// 会使系统的音量、Home、返回等键不再具有调节音量、回到主页、返回的作用，但此时仍然能通过按键事件监听按键
                    // 屏蔽全部按键 events.setKeyInterceptionEnabled(true)
                    events.setKeyInterceptionEnabled("volume_up", true);
                    events.observeKey();
                    events.onKeyDown("volume_up", ()=>{
                        log("音量上键被按下");
                    });`
                },
                observeTouch:{type: 'keys', name: '启用屏幕触摸监听(需要root)', code:
                    `events.observeTouch()
                    events.setTouchEventTimeout("100");
                    events.getTouchEventTimeout()
                    events.onTouch(function(p){
                        //触摸事件发生时, 打印出触摸的点的坐标
                         log(p.x + ", " + p.y);
                    });
                    events.removeAllTouchListeners();`
                },

                click: {type: 'operate', name: '点击坐标', code: 'click(0,0);'},
                longClick: {type: 'operate', name: '长按坐标', code: 'longClick(0,0);'},
                press: {type: 'operate', name: '按住坐标', code: 'press(0,0,100);'},
                swipe: {type: 'operate', name: '滑动', code: 'swipe(0,0,10,10,100);'},
                gesture: {type: 'operate', name: '手势', code:
                   `// 为模拟一个从(0, 0)到(500, 500)到(500, 100)的手势操作，时长为1秒。
                    gesture(1000, [0, 0], [500, 500], [500, 100])`
                },
                gestures: {type: 'operate', name: '多个手势', code:
                  `// 同时模拟多个手势。每个手势的参数为[delay, duration, 坐标], delay为延迟多久(毫秒)才执行该手势；duration为手势执行时长；坐标为手势经过的点的坐标。其中delay参数可以省略，默认为0。
                    gestures([0, 500, [800, 300], [500, 1000]],
                        [0, 500, [300, 1500], [500, 1000]]);`
                },
                clickText: {type: 'operate', name: '点击文本', code: 'click("扫一扫",0);'},
                longClickText: {type: 'operate', name: '长按文本', code: 'longClick("运行",0);'},
                scrollUp: {type: 'operate', name: '上滑或左滑', code: 'scrollUp(0);'},
                scrollDown: {type: 'operate', name: '下滑或右滑', code: 'scrollDown(0);'},
                setText: {type: 'operate', name: '设置文本', code: 'setText("测试");'},
                input: {type: 'operate', name: '输入文本', code: 'input("测试");'},
                takeScreenshot:  {type: 'operate', name: '无障碍权限截图', code: 'let capture = $automator.takeScreenshot();\n' +
                        '$images.save(capture, "sdcard/capture.png")'},

                removeTimedTask: {type: 'task', name: '通过id删除按时间运行的定时任务', code:
                  `$work_manager.removeTimedTask(0);`
                },
                removeIntentTask: {type: 'task', name: '通过id删除按事件运行的定时任务', code:
                  `$work_manager.removeIntentTask(0);`
                },
                getTimedTask: {type: 'task', name: '通过id获取按时间运行的定时任务', code:
                 `$work_manager.getTimedTask(0)`
                },
                getIntentTask: {type: 'task', name: '通过id获取按事件运行的定时任务', code:
                 `$work_manager.getIntentTask(0);`},
                queryTimedTasks: {type: 'task', name: '通过脚本路径查找按时间运行的定时任务', code:
                 `let tasks = $work_manager.queryTimedTasks({
                    path: "/sdcard/appSync/main.js",
                  });
                  let tasks2 = $work_manager.queryTimedTasks();`
                },
                queryIntentTasks: {type: 'task', name: '通过脚本路径或监听广播查找按广播运行的定时任务', code:
                  `let tasks = $work_manager.queryIntentTasks({
                    path: "/sdcard/appSync/main.js",
                  });
                  let tasks2 = $work_manager.queryIntentTasks();`
                },
                addDailyTask: {type: 'task', name: '每日运行一次的定时任务', code:
                    `// path {string} 需要运行的脚本的绝对路径
                    // time {number} | {string} | {Date} 此定时任务每天运行的时间，支持时间戳、字符串和Date对象
                    // delay {number} 任务开始前的延迟，单位毫秒，默认为0；如果延时较长，则此参数并不可靠，建议勿用此参数控制大于30s的延迟
                    // loopTimes {number} 任务循环次数，默认为1
                    // interval {number} 任务循环间隔，单位毫秒，默认为0；如果间隔较长，则此参数并不可靠，建议勿用此参数控制大于30s的间隔
                    console.log($work_manager.addDailyTask({
                        path: "/sdcard/appSync/main.js",
                        time: new Date(0, 0, 0, 13, 14, 0),
                        delay: 0,
                        loopTimes: 1,
                        interval: 0,
                   }));`
                },
                addWeeklyTask: {type: 'task', name: '每周运行的定时任务', code:
                   `// path {string} 需要运行的脚本的绝对路径
                    // time {number} | {string} | {Date} 此定时任务每天运行的时间，支持时间戳、字符串和Date对象
                    // daysOfWeek {string[]} 每周几运行，参数包括：['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] 或 ['一', '二', '三', '四', '五', '六', '日']
                    // delay {number} 任务开始前的延迟，单位毫秒，默认为0；如果延时较长，则此参数并不可靠，建议勿用此参数控制大于30s的延迟
                    // loopTimes {number} 任务循环次数，默认为1
                    // interval {number} 任务循环间隔，单位毫秒，默认为0；如果间隔较长，则此参数并不可靠，建议勿用此参数控制大于30s的间隔
                    log($work_manager.addWeeklyTask({
                        path: "/sdcard/appSync/main.js",
                        // 时间戳为Mon Jun 21 2021 13:14:00 GMT+0800 (中国标准时间)，事实上只有13:14:00的参数起作用
                        time: 1624252440000,
                        daysOfWeek: ['一', '二'],
                        delay: 0,
                        loopTimes: 5,
                        interval: 10
                    }));`
                },
                addDisposableTask: {type: 'task', name: '一次性的定时任务', code:
                   `// path {string} 需要运行的脚本的绝对路径
                    // time {number} | {string} | {Date} 此定时任务开始运行的时间，支持时间戳、字符串和Date对象（9.3以上版本可以用这个字段代替date）
                    // date {number} | {string} | {Date} 同time，由于一个失误，原本这个字段应该是time（9.2以之前版本需要用这个字段指定时间）
                    // delay {number} 任务开始前的延迟，单位毫秒，默认为0；如果延时较长，则此参数并不可靠，建议勿用此参数控制大于30s的延迟
                    // loopTimes {number} 任务循环次数，默认为1
                    // interval {number} 任务循环间隔，单位毫秒，默认为0；如果间隔较长，则此参数并不可靠，建议勿用此参数控制大于30s的间隔
                    log($work_manager.addDisposableTask({
                        path: "/sdcard/appSync/main.js",
                        date: new Date(2021, 5, 21, 13, 14, 0),
                    }));`},
                addIntentTask: {type: 'task', name: '广播定时任务', code:
                    `// path {string} 需要运行的脚本的绝对路径
                    // action {string} 需要监听的事件的广播的Action名称
                    // delay {number} 任务开始前的延迟，单位毫秒，默认为0；如果延时较长，则此参数并不可靠，建议勿用此参数控制大于30s的延迟
                    // loopTimes {number} 任务循环次数，默认为1
                    // interval {number} 任务循环间隔，单位毫秒，默认为0；如果间隔较长，则此参数并不可靠，建议勿用此参数控制大于30s的间隔
                    // 安卓意图列表 http://localhost:9998/Intent.txt
                    log($work_manager.addIntentTask({
                        path: "/sdcard/appSync/main.js",
                        action: Intent.ACTION_BATTERY_CHANGED,
                    }));`
                },
                TimedTask: {type:'task' ,name: '定时任务对象', code:
                `// TimedTask.id
                // 此定时任务的唯一id，用于查找定时任务。
                // TimedTask.scriptPath
                // 此定时任务的所执行脚本的路径。
                // TimedTask.millis
                // 此定时任务的执行时间的时间戳，单位为毫秒。
                // TimedTask.delay
                // 此定时任务所设置的延迟，
                // TimedTask.interval
                // 此定时任务循环的间隔。
                //TimedTask.loopTimes
                // 此定时任务循环的次数。
                // TimedTask.action
                //此定时任务的触发事件（只有广播定时任务才有该参数）`
                }
            }
        }
    },
    methods: {
        init(){
            let fileContent = this.remoteHandler.param4.scriptText ? this.remoteHandler.param4.scriptText : "";
            // 初始化文件编辑器
            initFileEditor(this,'scriptEditor','scriptTextEditor',this.getMonacoEditorComplete,fileContent,'javascript','vs-dark',(e,value)=>{
                this.remoteHandler.param4.scriptText = value
            });
        },
        // 初始自定义模块
        initCustomScript(){
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/remoteCustomScriptSetting.json?t="+(new Date().getTime()),
                type: 'get',
                async: false,
                success: function (res) {
                    // 初始自定义模块
                    _that.customScript = JSON.parse(JSON.stringify(res));
                    _that.tempCustomScript = JSON.parse(JSON.stringify(res));
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        },
        // 自定义模块设置
        customScriptSetting(){
            this.tempCustomScript = JSON.parse(JSON.stringify(this.customScript));
            this.$refs['customScriptSettingPopover'].doShow();
        },
        // 取消自定义模块设置
        cancelCustomScriptSetting(){
            this.$refs['customScriptSettingPopover'].doClose();
        },
        // 保存自定义模块设置
        saveCustomScriptSetting(){
            this.$refs['customScriptSettingPopover'].doClose();
            // 过滤掉未填写的数据
            this.customScript = JSON.parse(JSON.stringify(this.tempCustomScript.filter(item=> item.moduleName && item.scriptName)));
            let scriptFile = new File([JSON.stringify(this.customScript)], 'remoteCustomScriptSetting.json', {
                type: "application/json",
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
        },
        // 添加行
        addRow(){
            this.tempCustomScript.push({ moduleName: '', scriptName: '' })
        },
        // 删除行
        delRow(index) {
            // 删除行数据
            this.tempCustomScript.splice(index, 1)
        },
        // 清空脚本
        clearScript() {
            // this.remoteHandler.param4.scriptText = '';
            this.scriptEditor.setValue('');
            if(getEditorType() === 'ace'){
                this.scriptEditor.clearSelection();
            }
        },
        // 保存到草稿
        saveToDraft(){
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return false;
            }
            window.localStorage.setItem("remoteScriptText_"+this.remoteHandler.param4.scriptName,this.scriptEditor.getValue());
            window.ZXW_VUE.$notify.success({message: '保存草稿成功', duration: '1000'});
        },
        // 从草稿读取
        readForDraft(){
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return false;
            }
            this.scriptEditor.setValue( window.localStorage.getItem("remoteScriptText_"+this.remoteHandler.param4.scriptName));
            if(getEditorType() === 'ace'){
                this.scriptEditor.clearSelection();
            }
            window.ZXW_VUE.$notify.success({message: '读取草稿成功', duration: '1000'});
        },
        // 存为文件
        saveToFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return;
            }
            window.ZXW_VUE.$confirm('是否确认将当前脚本内容存为' + this.remoteHandler.param4.scriptName + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let scriptFile = new File([this.scriptEditor.getValue()], this.remoteHandler.param4.scriptName, {
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
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return;
            }
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/"+this.remoteHandler.param4.scriptName,
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    _that.scriptEditor.setValue(String(res));
                    if(getEditorType() === 'ace'){
                        _that.scriptEditor.clearSelection();
                    }
                    window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'});
                },
                error: function (msg) {
                    console.log(msg);
                    window.ZXW_VUE.$notify.error({message: _that.remoteHandler.param4.scriptName+'文件不存在', duration: '1000'});
                }
            });
        },
        // 获取远程代码
        getRemoteScript(code) {
            if (code) {
                if (this.remoteHandler.param4.scriptImmediatelyExec && this.validSelectDevice()) {
                    // 远程执行
                    this.remoteExecuteScript(code);
                }
                let scriptText = this.scriptEditor.getValue();
                code = code.replace(/^\s+|\s+$/g,"");
                this.scriptEditor.setValue(scriptText+=code+"\n");
                if(getEditorType() === 'ace'){
                    this.scriptEditor.clearSelection();
                }
                // this.remoteHandler.param4.scriptText += code +"\n";
            }
        },
        // 远程执行脚本
        remoteExecuteScriptFun(code){
            if(!this.remoteHandler.param4.isNodeScript){
                this.remoteExecuteScript(code);
            // NODE脚本 先写入手机端再执行文件
            } else {
                let remoteScript = `
                    let remoteScriptPath = '/sdcard/appSync/nodeRemoteScript/remoteScript.node.js'; 
                    files.createWithDirs(remoteScriptPath)
                    files.write(remoteScriptPath, decodeURI($base64.decode('${btoa(encodeURI(code))}')));
                    engines.execScriptFile("/sdcard/appSync/nodeRemoteScript/remoteScript.node.js",{path:["/sdcard/appSync/nodeRemoteScript/"]})
                `;
                this.remoteExecuteScript(remoteScript);
            }
        },
        // 获取自定义模块远程代码
        getCustomRemoteScript(scriptName){
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/"+scriptName,
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    if (_that.remoteHandler.param4.scriptImmediatelyExec && _that.validSelectDevice()) {
                        // 远程执行
                        _that.remoteExecuteScript(_that.scriptEditor.getValue());
                    }
                    //_that.remoteHandler.param4.scriptText += String(res) + "\n";
                    let scriptText = _that.scriptEditor.getValue();
                    _that.scriptEditor.setValue(scriptText+=String(res)+"\n");
                    if(getEditorType() === 'ace'){
                        _that.scriptEditor.clearSelection();
                    }
                    window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'});
                },
                error: function (msg) {
                    window.ZXW_VUE.$notify.fail({message: '读取失败', duration: '1000'});
                }
            });
        },
        // 远程运行脚本
        remoteRunScript() {
        }
    }
}