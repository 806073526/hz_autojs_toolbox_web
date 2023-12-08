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
}
utilsObj.zeroFill = (i) => {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return String(i);
    }
}
utilsObj.timerStartPushLog = () => {
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

    files.createWithDirs(filePath)
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
                        let logContent = lineArr.join("\\n");
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
// 先停止
utilsObj.timerStopPushLog();

if(params.onlyStop) {
    // 仅停止才提示
    console.log("停止推送消息");
}
// 仅停止
if(!params.onlyStop){
    console.log("开始推送消息");
    // 推送日志
    utilsObj.timerStartPushLog();
}
