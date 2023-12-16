let params = ${paramsJson};
utilsObj.getCurrentTime = () => {
    let date = new Date(); //当前时间
    let month = utilsObj.zeroFill(date.getMonth() + 1); //月
    let day = utilsObj.zeroFill(date.getDate()); //日
    let hour = utilsObj.zeroFill(date.getHours()); //时
    //当前时间
    let curTime = date.getFullYear() + month + day +
        hour;
    return curTime;
};
utilsObj.zeroFill = (i) => {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return String(i);
    }
};


// 最后执行的方法
let finishFun = ()=>{
    if(utilsObj.timerStopPushLog){
        if(utilsObj.checkLogPathThread){
            utilsObj.checkLogPathThread.interrupt();
        }
        // 先停止
        utilsObj.timerStopPushLog();
    }
    if(params.onlyStop) {
        // 仅停止才提示
        console.log("停止推送消息");
    }
    // 仅停止
    if(!params.onlyStop){
        console.log("开始推送消息");
        if(utilsObj.timerStartPushLog){
            // 推送日志
            utilsObj.timerStartPushLog();
        }
    }

};

// 检测日志路径变化
utilsObj.checkLogPathChange = ()=>{
    if(utilsObj.checkLogPathThread){
        utilsObj.checkLogPathThread.interrupt();
    }
    utilsObj.checkLogPathThread = threads.start(()=>{
        // 每五秒钟检测一次 文件是否变化
        utilsObj.checkLogPathTimer = setInterval(()=>{
            // 读取日志配置
            let logConfig = console.getGlobalLogConfig();
            // 完整路径
            let logFilePath = logConfig && logConfig.file ? logConfig.file : "/sdcard/autoJsToolsLog/log"+utilsObj.getCurrentTime()+".txt";

            // 路径发生变化
            if(utilsObj.lastLogFilePath && String(utilsObj.lastLogFilePath)!== String(logFilePath)){
                if(utilsObj.timerStopPushLog){
                    console.log("停止推送消息");
                    // 先停止
                    utilsObj.timerStopPushLog();
                }
                console.log("开始推送消息");
                if(utilsObj.timerStartPushLog){
                    // 推送日志
                    utilsObj.timerStartPushLog();
                }
            }
        },5000)
    });
};


// 大于安卓7  采用监听文件变化并阻塞的方式
if(android.os.Build.VERSION.SDK_INT > 25){
    utilsObj.timerStartPushLog = () => {
        // 监测变化 自动重启监听
        utilsObj.checkLogPathChange();

        let timerStorage = storages.create("zjh336.cn_timer");
        timerStorage.remove('stop');
        let timerFlag = true;

        // 读取日志配置
        let logConfig = console.getGlobalLogConfig();
        // 完整路径
        let logFilePath = logConfig && logConfig.file ? logConfig.file : "/sdcard/autoJsToolsLog/log"+utilsObj.getCurrentTime()+".txt";
        // 日志目录
        let filePath = logFilePath.substring(0,logFilePath.lastIndexOf("/")+1);
        // 日志文件名
        let fileName = logFilePath.substring(logFilePath.lastIndexOf("/")+1,logFilePath.length);
        // 记录最后一次的日志文件路径
        utilsObj.lastLogFilePath = logFilePath;


        files.createWithDirs(filePath);
        let charset = "UTF-8"; // 文件编码
        let lineNum = Number(params.maxLineCount) || 10; // 需要读取的行数
        // 监听文件变化
        let watchService = java.nio.file.FileSystems.getDefault().newWatchService();
        let path = java.nio.file.Paths.get(filePath);
        path.register(watchService, java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY);
        let watchFun = () => {
            let key = watchService.take();
            let stop = timerStorage.get('stop');
            if (stop !== undefined) {
                timerFlag = false;
            }
            // 获取当前时间字符串
            let currenTimes = utilsObj.getCurrentTime()
            // 读取日志配置
            let logConfig = console.getGlobalLogConfig();
            // 完整路径
            let logFilePath = logConfig && logConfig.file ? logConfig.file : "/sdcard/autoJsToolsLog/log" + currenTimes + ".txt";
            // 日志目录
            let filePath = logFilePath.substring(0,logFilePath.lastIndexOf("/")+1);
            // 日志文件名
            let fileName = logFilePath.substring(logFilePath.lastIndexOf("/")+1,logFilePath.length);

            let events = key.pollEvents();
            if (events.size() > 0) {
                for (var i = 0; i < events.size(); i++) {
                    let event = events.get(i);
                    if (event.kind() === java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY && String(event.context().toString()) === fileName) {
                        // 读取文件最后指定行
                        let file = new java.io.RandomAccessFile(filePath + fileName, "r");
                        let fileLength = file.length();
                        let pos = fileLength - 1;
                        let lineCount = 0;
                        let lineArr = [];
                        while (pos >= 0 && lineCount < lineNum) {
                            file.seek(pos);
                            let c = file.readByte();
                            if (c == 10 || c == 13) {
                                if (pos < fileLength - 1) {
                                    lineArr.unshift(new java.lang.String(new java.lang.String(file.readLine()).getBytes("iso-8859-1"), charset));
                                    lineCount++;
                                }
                            }
                            pos--;
                        }
                        if (pos < 0) {
                            lineArr.unshift(new java.lang.String(new java.lang.String(file.readLine()).getBytes("iso-8859-1"), charset));
                        }
                        file.close();
                        try {
                            sleep(100);
                            let logContent = lineArr.join("\n");
                            // url编码base64加密
                            let result = $base64.encode(encodeURI(logContent));
                            http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998) + '/attachmentInfo/updateLogMap', {
                                headers: {
                                    "deviceUUID": commonStorage.get('deviceUUID')
                                },
                                method: 'POST',
                                contentType: 'application/json',
                                body: JSON.stringify({
                                    'key': commonStorage.get('deviceUUID'),
                                    'logJson': result
                                })
                            }, (e) => {});
                        } catch (e) {
                            console.error("同步日志失败！", e);
                        }
                    }
                }
                key.reset();
            }
            // 如果还是true则继续执行 否则停止监听
            if(timerFlag){
                watchFun();
            }
        }
        watchFun();
    }
    utilsObj.timerStopPushLog = () => {
    let timerStorage = storages.create("zjh336.cn_timer");
    timerStorage.put('stop', 'stop');
    http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998) + '/attachmentInfo/updateLogMap', {
        headers: {
            "deviceUUID": commonStorage.get('deviceUUID')
        },
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({
            'key': commonStorage.get('deviceUUID'),
            'logJson': ''
        })
    }, (e) => {})
}
// 安卓7 采用引入jar 观察者模式监听文件变化
} else {
    // 执行方法
    let execFun = ()=>{
        utilsObj.timerStartPushLog = () => {
            // 监测变化 自动重启监听
            utilsObj.checkLogPathChange();

            // 读取日志配置
            let logConfig = console.getGlobalLogConfig();
            // 完整路径
            let logFilePath = logConfig && logConfig.file ? logConfig.file : "/sdcard/autoJsToolsLog/log"+utilsObj.getCurrentTime()+".txt";
            // 日志目录
            let filePath = logFilePath.substring(0,logFilePath.lastIndexOf("/")+1);
            // 日志文件名
            let fileName = logFilePath.substring(logFilePath.lastIndexOf("/")+1,logFilePath.length);
            files.createWithDirs(filePath);
            // 记录最后一次的日志文件路径
            utilsObj.lastLogFilePath = logFilePath;

            // 处理日志方法
            let handlerLog=()=>{
                // 读取日志配置
                let logConfig = console.getGlobalLogConfig();
                // 获取当前日志目录
                let curLogFilePath = logConfig && logConfig.file ? logConfig.file : "/sdcard/autoJsToolsLog/log"+utilsObj.getCurrentTime()+".txt";
                utilsObj.lastLogFilePath = curLogFilePath;

                let charset = "UTF-8"; // 文件编码
                let lineNum = Number(params.maxLineCount) || 10; // 需要读取的行数
                // 读取文件最后指定行
                let file = new java.io.RandomAccessFile(curLogFilePath, "r");
                let fileLength = file.length();
                let pos = fileLength - 1;
                let lineCount = 0;
                let lineArr = [];
                while (pos >= 0 && lineCount < lineNum) {
                    file.seek(pos);
                    let c = file.readByte();
                    if (c == 10 || c == 13) {
                        if (pos < fileLength - 1) {
                            lineArr.unshift(new java.lang.String(new java.lang.String(file.readLine()).getBytes("iso-8859-1"), charset));
                            lineCount++;
                        }
                    }
                    pos--;
                }
                if (pos < 0) {
                    lineArr.unshift(new java.lang.String(new java.lang.String(file.readLine()).getBytes("iso-8859-1"), charset));
                }
                file.close();
                try {
                    sleep(100);
                    let logContent = lineArr.join("\n");
                    // url编码base64加密
                    let result = $base64.encode(encodeURI(logContent));
                    http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998) + '/attachmentInfo/updateLogMap', {
                        headers: {
                            "deviceUUID": commonStorage.get('deviceUUID')
                        },
                        method: 'POST',
                        contentType: 'application/json',
                        body: JSON.stringify({
                            'key': commonStorage.get('deviceUUID'),
                            'logJson': result
                        })
                    }, (e) => {});
                } catch (e) {
                    console.error("同步日志失败！", e);
                }
            };
            // 开启新的监听器
            let fileAlterationObserver = new org.apache.commons.io.monitor.FileAlterationObserver(filePath);
            let fileListener = new JavaAdapter(org.apache.commons.io.monitor.FileAlterationListenerAdaptor, {
                onStart: function(observer) {
                },
                onDirectoryCreate: function(directory) {
                },
                onDirectoryChange: function(directory) {
                },
                onDirectoryDelete: function(directory) {
                },
                onFileCreate: function(file) {
                },
                onFileChange: function(file) {
                    handlerLog();
                },
                onFileDelete: function(file) {
                },
                onStop: function(observer) {
                },
            });
            fileAlterationObserver.addListener(fileListener);
            utilsObj.logMonitor = new FileAlterationMonitor(1000, fileAlterationObserver);
            utilsObj.logMonitor.start();
        };

        utilsObj.timerStopPushLog = () => {
            try {
                // 存在监听器
                if(utilsObj.logMonitor){
                    // 先停止
                    utilsObj.logMonitor.stop();
                }
            } catch (e) {

            }
            http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998) + '/attachmentInfo/updateLogMap', {
                headers: {
                    "deviceUUID": commonStorage.get('deviceUUID')
                },
                method: 'POST',
                contentType: 'application/json',
                body: JSON.stringify({
                    'key': commonStorage.get('deviceUUID'),
                    'logJson': ''
                })
            }, (e) => {})
        };
    };
    let dexFilePath = "/sdcard/appSync/commons_io.dex";
    try{
        // 如果不存在
        if(!files.exists(dexFilePath)){
            console.log("开始下载dex依赖");
            // 执行下载
            utilsObj.downLoadFile("http://"+commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  + "/commons_io.dex","appSync/commons_io.dex",()=>{
                console.log("下载dex依赖完成");
                runtime.unloadDex(dexFilePath);
                runtime.loadDex(dexFilePath);
                importClass("org.apache.commons.io.monitor.FileAlterationObserver")
                importClass("org.apache.commons.io.monitor.FileAlterationListenerAdaptor")
                importClass("org.apache.commons.io.monitor.FileAlterationMonitor")
                execFun();
                // 下载完成后再执行
                finishFun();
            });
        } else {
            console.log("已有dex依赖");
            runtime.unloadDex(dexFilePath);
            runtime.loadDex(dexFilePath);
            importClass("org.apache.commons.io.monitor.FileAlterationObserver")
            importClass("org.apache.commons.io.monitor.FileAlterationListenerAdaptor")
            importClass("org.apache.commons.io.monitor.FileAlterationMonitor")
            execFun();
        }
    }catch(e){
        console.error(e);
    }
}



finishFun();


