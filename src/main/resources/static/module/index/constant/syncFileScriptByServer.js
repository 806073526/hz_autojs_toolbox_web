importClass(android.widget.Toast);
importClass(android.view.Gravity);
importClass(android.os.Build);
importClass("java.io.FileOutputStream")
importClass("java.io.IOException")
importClass("java.io.InputStream")
importClass("java.net.MalformedURLException")
importClass("java.net.URL")
importClass("java.net.URLConnection")
importClass("java.util.ArrayList")

importClass(java.io.FileReader);
importClass("android.os.BatteryManager");
importClass(android.content.IntentFilter);
importClass(android.os.HardwarePropertiesManager);
importClass(android.app.ActivityManager);
importClass(java.io.BufferedReader);
importClass(java.io.InputStreamReader);
importClass(java.io.File);
importClass(java.io.RandomAccessFile);
importClass(android.os.Process);
importClass(java.util.Scanner);
importClass(java.util.HashMap);
//importClass(java.util.ArrayList);
importClass(java.lang.ProcessBuilder);
importClass(android.net.ConnectivityManager);
importClass(android.net.TrafficStats);

let params = ${paramsJson}
let serverUrl_param = params.serverUrl;
// web端同步目录 从设备uuid开始 开头和结尾都不能有斜杠  ["fb375905dd112762/system]
let webPathArr_param = params.webPathArr || [];
// 手机端同步目录 默认为sdcard目录 开头和结尾都不能有斜杠 "appSync/test"
let phoneTargetPath_param = params.phoneTargetPath || "";
// 显示进度
let showProcess_param = params.showProcess;
// 完成消息
let completeMsg_param = params.completeMsg || "";
// 额外的web下载地址
let downloadFileUrlArr_param = params.downloadFileUrlArr || [];
// 额外的手机端存储路径
let localFileUrlArr_param = params.localFileUrlArr || [];
// 获取同步uuid
let syncFileUUID = params.syncFileUUID || "";
// 自身脚本名称
let selfScriptName = params.selfScriptName || "";
// 忽略目录
let ignorePathArr = params.ignorePathArr || [];

if (selfScriptName && selfScriptName.indexOf('_') !== -1 && selfScriptName.indexOf('.') !== -1) {
    // 文件名称 去除后面的毫秒数
    let syncFileName = selfScriptName.substring(0, selfScriptName.indexOf('_'));
    // 当前毫秒数
    let nowTime = new Date().getTime();
    // 获取当前目录全部文件
    let listFileArr = files.listDir(files.cwd());
    // 过滤以当前文件名开头的 js文件
    listFileArr = listFileArr.filter(item => item.startsWith(syncFileName + "_") && item.endsWith(".js"));
    // 五分钟
    let fiveBeforeTime = 5 * 60 * 1000;
    // 过滤5分钟前的数据
    listFileArr = listFileArr.filter(item => {
        let dateTime = item.replace(syncFileName + "_", "").replace(".js", "");
        try {
            // 删除5分钟前生成的 同步文件
            if (nowTime - Number(dateTime) >  fiveBeforeTime) {
                // 删除文件
                files.remove(files.join(files.cwd(), item));
            }
        } catch (e) {
        }
    });
}


let showProcess = showProcess_param;
let utilsObj = {};
let startTimeLong = new Date().getTime();
let canvasFloat
if (showProcess) {
    canvasFloat = floaty.rawWindow(
        <frame elevation="2" alpha="1" padding="10 15" shape="rounded" bg="#ffffff" margin="5">
            <vertical w="*">
                <text id="syncTitle" text="同步文件进度" textColor="black" textSize="16sp" singleLine="true"/>
                <progressbar w="*" id="progress" progress="0" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                <horizontal w="*" h="100">
                    <text id="progressPath" textColor="black" textSize="16sp" margin="8" text="正在获取待同步目录,请稍候......" singleLine="false"/>
                </horizontal>
                <button id="boardClose"  h="auto" w="*" layout_gravity="bottom" text="停止同步" />
            </vertical>
        </frame>
    );
    canvasFloat.setPosition(0, (device.height / 2 - device.height / 4));
    canvasFloat.setSize(device.width, device.height / 4);
    canvasFloat.boardClose.on("click", () => {
        dialogs.confirm("您确定要停止同步文件吗？").then(value => {
            if (value) {
                canvasFloat.close();
                exit();
            }
        });
    })
}


function msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    var hoursDisplay = (hours < 10) ? "0" + hours : hours;
    var minutesDisplay = (minutes < 10) ? "0" + minutes : minutes;
    var secondsDisplay = (seconds < 10) ? "0" + seconds : seconds;

    return hoursDisplay + ":" + minutesDisplay + ":" + secondsDisplay;
}


utilsObj.downLoadFiles = (downloadFileUrlArr, localFileUrlArr, callback) => {

    let completeCount = 0;
    for (let i = 0; i < downloadFileUrlArr.length; i++) {
        let downloadFileUrl = downloadFileUrlArr[i];
        if(downloadFileUrl){
            downloadFileUrl+="?t="+new Date().getTime();
        }
       /* ignorePathArr.filter(ignorePath=>{
            downloadFileUrl.contains("/" + ignorePath +"/")
        });*/
        let localFileUrl = localFileUrlArr[i];
        try {
            let url = new URL(downloadFileUrl);
            let conn = url.openConnection(); //URLConnection
            let inStream = conn.getInputStream(); //InputStream
            files.ensureDir("/sdcard/" + localFileUrl);
            let fs = new FileOutputStream("/sdcard/" + localFileUrl); //FileOutputStream
            let connLength = conn.getContentLength(); //int
            let startTime = java.lang.System.currentTimeMillis();
            let buffer = util.java.array('byte', 1024); //byte[]
            let prevTime = java.lang.System.currentTimeMillis();
            let bytePrev = 0; //前一次记录的文件大小
            let byteSum = 0; //总共读取的文件大小
            let byteRead; //每次读取的byte数

            let curIndex = i;
            let curLocalFileUrl = localFileUrl;
            threads.start(() => {
                while (true) {
                    let 当前写入的文件大小 = byteSum
                    // var 百分比 = parseInt(当前写入的文件大小 / connLength * 100)
                    if (当前写入的文件大小 >= connLength) {
                        completeCount++;
                        let process = Number(completeCount / downloadFileUrlArr.length) * 100;
                        let cacheProgress = canvasFloat && canvasFloat.progress ? canvasFloat.progress.getProgress() : 0;
                        if (showProcess) {
                            ui.run(() => {
                                let totalCount = downloadFileUrlArr.length;
                                let duration = (new Date().getTime() - startTimeLong);
                                canvasFloat.syncTitle.attr("text", "同步文件进度【耗时:" + msToTime(duration) + "】" + "【完成:" + (Number(process) >= Number(cacheProgress) ?  process.toFixed(2) : cacheProgress.toFixed(2))+ "%】");
                                canvasFloat.progressPath.attr("text", "/sdcard/" + curLocalFileUrl);
                            })
                        }
                        if (showProcess && Number(process) >= Number(cacheProgress)) {
                            canvasFloat.progress.setProgress(process.toFixed(2));
                            sleep(50)
                        }
                        if (process === 100) {
                            if (callback) {
                                callback();
                            }
                        }
                        break;
                    }
                    sleep(1000)
                }
            })
            while ((byteRead = inStream.read(buffer)) != -1) {
                byteSum += byteRead;
                //当前时间
                // currentTime = java.lang.System.currentTimeMillis();
                fs.write(buffer, 0, byteRead); //读取
            }
            inStream.close();
            fs.close();
        } catch (error) {
            console.error(error);
        }

    }
}


/**
 * http请求
 * @param {*} url 请求地址
 * @param {*} requestMethod 请求方法
 * @param {*} requestBody 消息体
 * @param {*} callback 回调函数
 */
utilsObj.request = (url, requestMethod, requestBody, callback) => {
    // GET-键值对 POST-JSON
    let contentType = requestMethod === "GET" ? "application/x-www-form-urlencoded" : 'application/json'
    http.request(url, {
        headers: {
            "deviceUUID": 'deviceUUID'
        },
        method: requestMethod,
        contentType: contentType,
        body: requestBody
    }, callback);
}


let webPathArr = webPathArr_param;
// 手机端目标路径
let phoneTargetPath = phoneTargetPath_param;


// 服务端地址
let serverPath = serverUrl_param;
// 获取文件接口地址
let interfacePath = serverPath + "/attachmentInfo/queryAllAttachInfoListByPaths";

// 同步文件数量
let syncFileCount = 0;

// 获取文件信息
let getFileInfo = (files, isDirectory) => {
    // 结果集
    let result = [];
    // 遍历数据
    for (let i = 0; i < files.length; i++) {
        let curFile = files[i];
        // 当前不是目录 且 查找的也不是目录
        if (!curFile.isDirectory && !isDirectory) {
            // 加入结果
            result.push(curFile);
        }
        // 当前是目录
        if (curFile.isDirectory) {
            // 查找的是目录
            if (isDirectory) {
                // 加入结果
                result.push(curFile);
            }
            // 获取子目录
            let children = curFile.children || []
            // 递归获取子目录
            let childrenResult = getFileInfo(children, isDirectory);
            // 拼接数组
            result = result.concat(childrenResult)
        }
    }
    return result;
}

let requestCompleted = false;

// web下载地址
let downloadFileUrlArr = downloadFileUrlArr_param;

// 手机端存储路径
let localFileUrlArr = localFileUrlArr_param;

let requestBody = {
    relativeFilePathList: webPathArr,
    ignorePathList: ignorePathArr,
    onlyQueryFolder: false
}

// 请求接口获取 web端路径下的所有文件
utilsObj.request(interfacePath, 'POST', JSON.stringify(requestBody), (res, error) => {
    if (res) {
        let data = res.body.json()

        let dataMap = data.data || {};
        if (!Object.keys(dataMap).length) {
            requestCompleted = true;
            return;
        }

        syncFileCount = 0;

        // 本地目录数组
        let localDirPathArr = [];
        // 遍历数据
        webPathArr.forEach(webPath => {
            let fileList = dataMap[webPath] || [];


            // 递归获取所有的目录
            let dirArr = getFileInfo(fileList, true);

            // 递归获取所有的文件
            let fileArr = getFileInfo(fileList, false);

            // 累加数量
            syncFileCount += fileArr.length;


            // 获取目录数组
            let dirPathArr = dirArr.map(item => item.previewUrl.replace('uploadPath/autoJsTools/' + webPath, ''));
            // 获取文件数组
            let filePathArr = fileArr.map(item => item.previewUrl.replace('uploadPath/autoJsTools/' + webPath, ''));

            // 创建目录        
            dirPathArr.forEach(item => {
                let dirPath = '/sdcard/' + phoneTargetPath + webPath.substring(webPath.lastIndexOf('/'), webPath.length) + item + '/';
                localDirPathArr.push(dirPath);
            })
            // 添加固定目录
            localDirPathArr.push('/sdcard/' + phoneTargetPath + webPath.substring(webPath.lastIndexOf('/'), webPath.length) + '/');

            // 遍历文件
            filePathArr.forEach(item => {
                // 下载路径 服务地址 + 固定路径 + 文件根路径 + 遍历文件路径
                let downloadFileUrl = serverPath + '/uploadPath/autoJsTools/' + webPath + item;
                downloadFileUrlArr.push(downloadFileUrl);

                // 本地路径  本地路径前缀 + 文件根路径后半部分 + 遍历文件路径
                let localFileUrl = phoneTargetPath + webPath.substring(webPath.lastIndexOf('/'), webPath.length) + item;
                localFileUrlArr.push(localFileUrl);
            })
        })

        if (showProcess) {
            ui.run(() => {
                canvasFloat.progressPath.attr("text", "待同步目录" + localDirPathArr.length + "个,待同步文件" + downloadFileUrlArr.length + "个,请稍候......");
            });
            sleep(50);
        }
        localDirPathArr.forEach(dirPath => {
            if (!files.exists(dirPath)) {
                files.createWithDirs(dirPath);
            }
        })
        // 请求完成
        requestCompleted = true;

    } else {
        console.error("错误", error)
    }
})


let interval = setInterval(() => {
    if (requestCompleted) {
        let startTime1 = new Date().getTime();
        // 重置时间
        startTimeLong = startTime1;
        // 开始下载
        utilsObj.downLoadFiles(downloadFileUrlArr, localFileUrlArr, () => {
            let endTime1 = new Date().getTime();
            console.log(completeMsg_param +"耗时:" + (endTime1 - startTime1) + "ms");
           // 调用修改完成同步状态接口
           utilsObj.request(serverPath + "/device/completeSyncFile?syncFileUUID="+syncFileUUID, 'GET', "", (res, error) => {
               // 删除自己
               if(selfScriptName){
                    // files.remove(files.cwd()+"/" + selfScriptName);
               }
               clearInterval(interval);
           });
        });
    }
}, 300);