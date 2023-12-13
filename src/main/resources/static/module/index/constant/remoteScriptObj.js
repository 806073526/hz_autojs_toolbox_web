export const remoteScriptObj = {
    AppVersionCode: {type: 'app', name: '读取版本号', code: 'toastLog(app.versionCode);'},
    AppVersionName: {type: 'app', name: '读取版本名称', code: 'toastLog(app.versionName);'},
    AppLaunchApp: {type: 'app', name: '根据名称启动App', code: 'launchApp("华仔AutoJs工具箱");'},
    AppLaunch: {type: 'app', name: '启动App', code: 'launch("com.zjh336.cn.tools");'},
    AppLaunchPackage: {type: 'app', name: '根据包名启动App', code: 'launchPackage("com.zjh336.cn.tools");'},
    AppGetPackageName: {type: 'app', name: '获取包名', code: 'toastLog(getPackageName("华仔AutoJs工具箱"));'},
    AppGetAppName: {type: 'app', name: '获取App名', code: 'toastLog(getAppName("com.zjh336.cn.tools"));'},
    AppOpenAppSetting: {type: 'app', name: '打开App设置', code: 'openAppSetting("com.zjh336.cn.tools");'},
    AppViewFile: {type: 'app', name: '预览文件', code: 'app.viewFile("/sdcard/autoJsTools/imageHandlerAfter.png");'},
    AppEditFile: {type: 'app', name: '编辑文件', code: 'app.editFile("/sdcard/autoJsTools/imageHandlerAfter.png");'},
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
    AppIntent: {
        type: 'app', name: '启动意图', code: 'var i = app.intent({\n' +
            '    action: "VIEW",\n' +
            '    type: "image/png",\n' +
            '    data: "file:///sdcard/autoJsTools/imageHandlerAfter.png"\n' +
            '});\n' +
            'context.startActivity(i);'
    },
    AppParseUri: {
        type: 'app',
        name: '解析uri',
        code: 'toastLog(app.parseUri("file:///sdcard/autoJsTools/imageHandlerAfter.png"));'
    },
    AppGetUriForFile: {
        type: 'app',
        name: '从文件路径解析uri',
        code: 'toastLog(app.getUriForFile("file:///sdcard/autoJsTools/imageHandlerAfter.png"));'
    },
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
    deviceGetNotificationVolume: {type: 'device', name: '当前通知音量', code: 'toastLog(device.getNotificationVolume());'},
    deviceGetAlarmVolume: {type: 'device', name: '当前闹钟音量', code: 'toastLog(device.getAlarmVolume());'},
    deviceGetMusicMaxVolume: {type: 'device', name: '媒体音量的最大值', code: 'toastLog(device.getMusicMaxVolume());'},
    deviceGetNotificationMaxVolume: {
        type: 'device',
        name: '通知音量的最大值',
        code: 'toastLog(device.getNotificationMaxVolume());'
    },
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
    observeNotification: {
        type: 'other', name: '开启通知监听', code:
            `events.observeNotification();
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
    observeToast: {
        type: 'other', name: '开启Toast监听', code:
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
    quickSettings: {type: 'keys', name: '通知栏拉到底', code: 'quickSettings();'},
    recents: {type: 'keys', name: '最近任务', code: 'recents();'},
    observeKey: {type: 'keys', name: '启用按键监听', code: 'events.observeKey();'},
    onKeyDown: {
        type: 'keys', name: '监听按键按下', code:
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
    onKeyUp: {
        type: 'keys', name: '监听按键弹起', code:
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
    onceKeyDown: {
        type: 'keys', name: '监听按键按下一次', code:
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
    onceKeyUp: {
        type: 'keys', name: '监听按键弹起一次', code:
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
    removeAllKeyDownListeners: {
        type: 'keys', name: '删除全部按键按下事件', code:
            `//启用按键监听
                    events.observeKey();
                    //删除音量全部按下事件
                    events.removeAllKeyDownListeners("volume_up");
                    //删除菜单全部按下事件
                    events.removeAllKeyDownListeners("menu");`
    },
    setKeyInterceptionEnabled: {
        type: 'keys', name: '设置按键屏蔽是否启用', code:
            `// 会使系统的音量、Home、返回等键不再具有调节音量、回到主页、返回的作用，但此时仍然能通过按键事件监听按键
                    // 屏蔽全部按键 events.setKeyInterceptionEnabled(true)
                    events.setKeyInterceptionEnabled("volume_up", true);
                    events.observeKey();
                    events.onKeyDown("volume_up", ()=>{
                        log("音量上键被按下");
                    });`
    },
    observeTouch: {
        type: 'keys', name: '启用屏幕触摸监听(需要root)', code:
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
    gesture: {
        type: 'operate', name: '手势', code:
            `// 为模拟一个从(0, 0)到(500, 500)到(500, 100)的手势操作，时长为1秒。
                    gesture(1000, [0, 0], [500, 500], [500, 100])`
    },
    gestures: {
        type: 'operate', name: '多个手势', code:
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
    takeScreenshot: {
        type: 'operate', name: '无障碍权限截图', code: 'let capture = $automator.takeScreenshot();\n' +
            '$images.save(capture, "sdcard/capture.png")'
    },

    removeTimedTask: {
        type: 'task', name: '通过id删除按时间运行的定时任务', code:
            `$work_manager.removeTimedTask(0);`
    },
    removeIntentTask: {
        type: 'task', name: '通过id删除按事件运行的定时任务', code:
            `$work_manager.removeIntentTask(0);`
    },
    getTimedTask: {
        type: 'task', name: '通过id获取按时间运行的定时任务', code:
            `$work_manager.getTimedTask(0)`
    },
    getIntentTask: {
        type: 'task', name: '通过id获取按事件运行的定时任务', code:
            `$work_manager.getIntentTask(0);`
    },
    queryTimedTasks: {
        type: 'task', name: '通过脚本路径查找按时间运行的定时任务', code:
            `let tasks = $work_manager.queryTimedTasks({
                    path: "/sdcard/appSync/main.js",
                  });
                  let tasks2 = $work_manager.queryTimedTasks();`
    },
    queryIntentTasks: {
        type: 'task', name: '通过脚本路径或监听广播查找按广播运行的定时任务', code:
            `let tasks = $work_manager.queryIntentTasks({
                    path: "/sdcard/appSync/main.js",
                  });
                  let tasks2 = $work_manager.queryIntentTasks();`
    },
    addDailyTask: {
        type: 'task', name: '每日运行一次的定时任务', code:
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
    addWeeklyTask: {
        type: 'task', name: '每周运行的定时任务', code:
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
    addDisposableTask: {
        type: 'task', name: '一次性的定时任务', code:
            `// path {string} 需要运行的脚本的绝对路径
                    // time {number} | {string} | {Date} 此定时任务开始运行的时间，支持时间戳、字符串和Date对象（9.3以上版本可以用这个字段代替date）
                    // date {number} | {string} | {Date} 同time，由于一个失误，原本这个字段应该是time（9.2以之前版本需要用这个字段指定时间）
                    // delay {number} 任务开始前的延迟，单位毫秒，默认为0；如果延时较长，则此参数并不可靠，建议勿用此参数控制大于30s的延迟
                    // loopTimes {number} 任务循环次数，默认为1
                    // interval {number} 任务循环间隔，单位毫秒，默认为0；如果间隔较长，则此参数并不可靠，建议勿用此参数控制大于30s的间隔
                    log($work_manager.addDisposableTask({
                        path: "/sdcard/appSync/main.js",
                        date: new Date(2021, 5, 21, 13, 14, 0),
                    }));`
    },
    addIntentTask: {
        type: 'task', name: '广播定时任务', code:
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
    TimedTask: {
        type: 'task', name: '定时任务对象', code:
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
    },

    remoteHotUpdateApp: {
        type: 'internal', name: '远程热更新APP', code:
            `
                // 获取项目路径 默认为工具箱APP的路径 如果要更新其他APP 请修改
                let projectPath = files.cwd();
                // 设置本地临时更新路径
                let tempUpdatePath = "/sdcard/appSync/tempUpdateTools/";
                // 创建临时更新js目录
                files.createWithDirs(tempUpdatePath)
                // 可自定义 主要为了app端区分版本 请修改
                let hotUpdateVersion = "热更新";
                // 可替换为本地目录下载目录  注意zip压缩包,请在文件目录下全选文件压缩  
                let url = "http://tool.zjh336.cn/uploadPath/autoJsTools/webCommonPath/hz_autojs_toolbox.zip"
                toastLog(url+"开始下载");
                // 请求压缩包
                let r = http.get(url);
                if (r.statusCode == 200) {
                    let zipPath = tempUpdatePath + "hz_autojs_toolbox.zip";
                    files.remove(zipPath)
                    // 下载压缩包到本地临时更新路径
                    var content = r.body.bytes();
                    files.writeBytes(zipPath, content);
                    toastLog(zipPath + "下载成功！！！");
                    // 解压下载文件到 项目路径  为防止误操作 请放开注释后再执行
                    // $zip.unzip(zipPath, projectPath);
                    // commonStorage.put("hotUpdateVersion", hotUpdateVersion)
                    // toastLog("热更新成功,请重启APP后生效！");
                } else {
                    toastLog(url + "下载失败！！！");
                }
                `
    },
    adbScript: {
        type: 'internal', name: 'adb封装函数', code:
            `
                    var 分辨率宽 = 1080
                    var 分辨率高 = 2340
                    var js = {
                        点击: function (x, y) {
                            var x1 = device.width / 分辨率宽
                            var y1 = device.height / 分辨率高
                            var a = x * x1
                            var b = y * y1
                            var c = random(a - 20, a + 20)
                            var d = random(b - 20, b + 20)
                            var sjsj = random(80, 120)
                            if (shell('input swipe ' + c + " " + d + " " + c + " " + d + " " + sjsj, { adb: true })) {
                                return true
                            } else {
                                return false
                            }
                        },
                        查找: function (参数1, 参数2) {
                            shell('uiautomator dump', { adb: true })
                            var wjkll = files.read('/sdcard/window_dump.xml')
                            var bgh = storages.create("bghka:AB111");
                            bgh.put("bghka", String(wjkll))
                            var cg = bgh.get("bghka")
                            if (cg.indexOf(参数1) != -1 && cg.indexOf(参数2) != -1) {
                                storages.remove("bghka:AB111")
                                return true
                            } else {
                                storages.remove("bghka:AB111")
                                return false
                            }
                    
                        },
                    
                    
                        长按: function (x, y, sjsj) {
                            var x1 = device.width / 分辨率宽
                            var y1 = device.height / 分辨率高
                            var a = x * x1
                            var b = y * y1
                            var c = random(a - 10, a + 20)
                            var d = random(b - 10, b + 20)
                    
                            shell('input swipe ' + c + " " + d + " " + c + " " + d + " " + sjsj, { adb: true })
                        },
                        划动: function (x, y, o, p, sjsj) {
                            var x1 = device.width / 分辨率宽
                            var y1 = device.height / 分辨率高
                            var a = x * x1
                            var b = y * y1
                            var c = o * x1
                            var d = p * y1
                    
                            shell('input swipe ' + a + " " + b + " " + c + " " + d + " " + sjsj, { adb: true })
                        },
                        按键: function 按键(params) {
                            shell('input ' + params, { adb: true })
                    
                        },
                        输入文字: function (ghfy) {
                            var ko = shell('settings get secure default_input_method ', { adb: true })
                            var str = JSON.stringify(ko)
                            var kio = str.indexOf("com.")
                            var kigy = str.indexOf('IME')
                            var dg = str.substring(kio, kigy + 3)
                            shell('settings put secure default_input_method  com.android.adbkeyboard/.AdbIME', { adb: true })
                            sleep(500)
                            if (shell('am broadcast -a ADB_INPUT_TEXT --es msg ' + ghfy, { adb: true }) != -1) {
                                shell('settings put secure default_input_method ' + dg, { adb: true })
                                log("输入成功")
                                return true
                            } else {
                                log("输入失败")
                                shell('settings put secure default_input_method ' + dg, { adb: true })
                                return false
                            }
                        },
                        检测: function () {
                    
                            if (shell.checkAccess('adb')) {
                                return true
                            } else {
                                return false
                            }
                        },
                    
                        截图: function (path) {
                            shell('screencap ' + " " + path, { adb: true })
                        },
                        查看控件: function () {
                            shell('uiautomator dump', { adb: true })
                            let a = files.read('/sdcard/window_dump.xml')
                            var o = a.split('<node').filter(arr => arr.includes(arguments[0]))
                            for (let i = 0; i < o.length; i++) {
                                var 程 = a.split('<node').filter(arr => arr.includes(arguments[0]))[i]
                                return 程 + "\\n"
                            }
                            files.remove('/sdcard/window_dump.xml')
                        },
                        查找控件: function () {
                            shell('uiautomator dump', { adb: true })
                            let a = files.read('/sdcard/window_dump.xml')
                            if (程 = a.split('<node').filter(arr => arr.includes(arguments[0]))[0]) {
                                let a_bounds = (程.split('bounds')[1].match(/\\d+/g)).map(arr => Number(arr))
                                files.remove('/sdcard/window_dump.xml')
                                return a_bounds
                            } else {
                                return false
                            }
                        },
                    
                        随机点击: function (a_bounds) {
                    
                            var c = random(a_bounds[0] + 10, a_bounds[2] - 10)
                            var d = random(a_bounds[1] + 10, a_bounds[3] - 10)
                            var sjsj = random(80, 120)
                            if (shell('input swipe ' + c + " " + d + " " + c + " " + d + " " + sjsj, { adb: true })) {
                                return true
                            } else {
                                return false
                            }
                        }
                    }`
    },

    hideStatusBar: {
        name: '隐藏状态栏和横屏',
        type: 'internal',
        code: `var window = activity.getWindow();
window.setFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN, android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
activity.setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);`
    },

    localListener: {
        name: '监听手机定位小于一定距离后执行',
        type: 'internal',
        code: `importClass("android.content.Context");
importClass("android.location.Location");
importClass("android.location.LocationListener");// 如果提示重复引入 注释这一行
importClass("android.location.LocationManager");
importClass("android.location.Criteria");
importClass("android.os.Bundle");

const lat1 = 0; // 新位置的纬度
const lon1 = 0; // 新位置的经度
const lat2 = 18.237038; // 固定位置的纬度 自己设置
const lon2 = 12.865618; // 固定位置的经度 自己设置

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径，单位为千米
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000;
}


var locationManager = context.getSystemService(Context.LOCATION_SERVICE);

var LocationListener = android.location.LocationListener;

var listener = new JavaAdapter(LocationListener, {
    onStatusChanged: function(provider, status, extras) {
       
        console.log("变化")
    },
    onProviderEnabled: function(provider) {
        // Provider was enabled
        console.log("启用")
    },
    onProviderDisabled: function(provider) {
        // Provider was disabled
        console.log("停用")
    },
    onLocationChanged: function(location) {
        console.log("位置变化")
        if (location != null) {
            // Location changed

            var latitude = location.getLatitude();
            var longitude = location.getLongitude();


            console.log(latitude, longitude)
            
            let distanceVal = distance(latitude,longitude,lat2,lon2);
            
            console.log("相差距离："+distanceVal+"米")
            
            if(distanceVal <= 300){
                launchApp("钉钉");
                sleep(1000);
                click("允许")
                console.log("退出脚本");
                exit();
            }

        }
    }
});

var criteria = new Criteria();
    criteria.setAccuracy(Criteria.ACCURACY_FINE); //定位精度: 最高
    criteria.setAltitudeRequired(false); //海拔信息：不需要
    criteria.setBearingRequired(false); //方位信息: 不需要
    criteria.setCostAllowed(true);  //是否允许付费
    criteria.setPowerRequirement(Criteria.POWER_LOW); //耗电量: 低功耗
    
let providerSelect = locationManager.getBestProvider(criteria, true);
locationManager.requestLocationUpdates(providerSelect, 5000, 0, listener);
console.log("设置完成");
setInterval(()=>{},1000)`
    },

    hideInput: {
        name: '隐藏输入法',
        type: 'internal',
        code: `function InputHide() {
  for (var i = 0; auto.windows[i] != null; i++) {
    if (auto.windows[i].toString().indexOf("INPUT") != -1) {
    toastLog("能不能在这，输入些内容在关闭？？")
    input("要输的内容")
    sleep(1000);
    click("确定")
      toastLog("输入法弹出状态,关闭输入法");
      sleep(2000)
      context
        .getSystemService(context.INPUT_METHOD_SERVICE)
        .toggleSoftInput(
          0,
          android.view.inputmethod.InputMethodManager.HIDE_NOT_ALWAYS
        )
      break
    }
  }
}
while(1){
 sleep(2000)   
 InputHide()
}`
    },

    recordScreen: {
        name: '免root录屏',
        type: 'internal',
        code: `"ui";
importClass(android.content.Context);
importClass(android.media.MediaRecorder);
importClass(java.io.File);
importClass(java.lang.System);
importClass(android.os.Environment);
importClass(android.hardware.display.DisplayManager);
 
 
/*
￥￥无名小姐  制作
*/
 
runtime.requestPermissions(["RECORD_AUDIO"]);
//
 
running = false;
width = 720;
height = 1080;
dpi = 1;
 
mediaRecorder = new MediaRecorder();
 
ui.layout(
    <vertical>
         <appbar>
            <toolbar title="无root录屏"/>
        </appbar>
        
        <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" padding="8 8 8 8" textSize="15sp"/>
        
        <frame height="200" gravity="center">
            <text text="脚本群群员专用  攒外快网：zwk365.com.结束运行后,保存在ScreenRecord目录" gravity="center"/>
        </frame>
        <button text="开始录屏"style="Widget.AppCompat.Button.Colored" id="button"/>
        
    </vertical>
);
 
 
ui.button.click(function() {
    if (running) {
        stopRecord();
        ui.button.setText("开始录屏");
    } else {
        startintent();
        ui.button.setText("停止录屏");
    }
});
ui.autoService.on("check", function(checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if(checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if(!checked && auto.service != null){
        auto.service.disableSelf();
    }
});
 
// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function() {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});
 
ui.emitter.on("activity_result", (requestCode, resultCode, data) => {
    mediaProjection = mediaProjectionManager.getMediaProjection(resultCode, data);
    if (mediaProjection) {
        startRecord();
    }
});
 
events.on("exit", function() {
    if (running) {
        stopRecord();
    }
    toastLog("结束运行,保存在ScreenRecord目录");
});
 
 
function createVirtualDisplay() {
    virtualDisplay = mediaProjection.createVirtualDisplay(
        "无名小姐",
        width,
        height,
        dpi,
        DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
        mediaRecorder.getSurface(),
        null, null);
}
 
 
function initRecorder() {
    file = new File(getsaveDirectory(), System.currentTimeMillis() + ".mp4");
    mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
    mediaRecorder.setVideoSource(MediaRecorder.VideoSource.SURFACE);
    mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
    mediaRecorder.setOutputFile(file.getAbsolutePath());
    mediaRecorder.setVideoSize(width, height);
    mediaRecorder.setVideoEncoder(MediaRecorder.VideoEncoder.H264);
    mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
    mediaRecorder.setVideoEncodingBitRate(5 * 1024 * 1024);
    mediaRecorder.setVideoFrameRate(30);
    try {
        mediaRecorder.prepare();
    } catch (e) {
        log(e);
    }
}
 
function startintent() {
    SCREEN_CAPTURE_REQUEST_CODE = 10086;
    mediaProjectionManager = context.getSystemService(Context.MEDIA_PROJECTION_SERVICE);
    intent = mediaProjectionManager.createScreenCaptureIntent();
    activity.startActivityForResult(intent, SCREEN_CAPTURE_REQUEST_CODE);
}
 
 
function startRecord() {
    if (mediaProjection == null || running) {
        return false;
    }
    initRecorder();
    createVirtualDisplay();
    mediaRecorder.start();
    running = true;
    return true;
}
 
function stopRecord() {
    if (!running) {
        return false;
    }
    running = false;
    mediaRecorder.stop();
    mediaRecorder.reset();
    virtualDisplay.release();
    mediaProjection.stop();
    return true;
}
 
 
function getsaveDirectory() {
    if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
        rootDir = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "ScreenRecord" + "/";
        file = new File(rootDir);
        if (!file.exists()) {
            if (!file.mkdirs()) {
                return null;
            }
        }
 
        toastLog(rootDir);
        return rootDir;
    } else {
        return null;
    }
}
`
    }
};