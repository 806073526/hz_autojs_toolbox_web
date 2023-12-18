let params = ${paramsJson}
let showProcess_param = params.showProcess;
// 自身脚本名称
let selfScriptName = params.selfScriptName || "";
// 获取操作UUID
let syncFileUUID = params.syncFileUUID || "";
// 服务端地址
let serverPath = params.serverUrl;

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
};
let canvasFloat
if (showProcess) {
    canvasFloat = floaty.rawWindow(
        <frame elevation="2" alpha="1" padding="10 15" shape="rounded" bg="#ffffff" margin="5">
        <vertical w="*">
        <text id="syncTitle" text="复制文件进度" textColor="black" textSize="16sp" singleLine="true"/>
        <progressbar w="*" id="progress" progress="0" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
        <horizontal w="*" h="100">
        <text id="progressPath" textColor="black" textSize="16sp" margin="8" text="正在获取待复制目录,请稍候......" singleLine="false"/>
        </horizontal>
        <button id="boardClose"  h="auto" w="*" layout_gravity="bottom" text="停止复制" />
        </vertical>
        </frame>
);
    canvasFloat.setPosition(0, (device.height / 2 - device.height / 4));
    canvasFloat.setSize(device.width, device.height / 4);
    canvasFloat.boardClose.on("click", () => {
        dialogs.confirm("您确定要停止复制文件吗？").then(value => {
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
// 单个复制方法
let singleCopy = (soucePath, targetPath) => {
    let resultObj = {};
    // 基础路径
    let basePath = soucePath;
    // 源对象
    let sourceObj = {
        fileDirArr: [], // 目录数组
        filePathArr: [] // 文件路径数组
    }
    // 目标对象
    let targetObj = {
        fileDirArr: [], // 目录数组
        filePathArr: [] // 文件路径数组
    }
    // 处理文件方法
    let handlerFilePath = (curPath) => {
        if (files.isFile(curPath)) {
            // 添加到源对象中
            sourceObj.filePathArr.push(curPath);
            let fileName = basePath.substring(basePath.lastIndexOf('/') + 1, basePath.length);
            let targetFilePath = targetPath + fileName + curPath.replace(basePath, '');
            targetFilePath = targetFilePath.replace("//", "/");
            // 添加到目标对象汇总
            targetObj.filePathArr.push(targetFilePath);
            return;
        } else if (files.isDir(curPath)) { // 当前路径是目录
            // 添加到源对象中
            sourceObj.fileDirArr.push(curPath);
            let fileName = basePath.substring(basePath.lastIndexOf('/'), basePath.length);
            let targetFilePath = targetPath + fileName + curPath.replace(basePath, '');
            targetFilePath = targetFilePath.replace("//", "/");
            // 添加到目标对象汇总
            targetObj.fileDirArr.push(targetFilePath);

            let list = files.listDir(curPath);
            list.forEach(item => {
                let path = files.join(curPath, item);
                handlerFilePath(path);
            })
        }
    };
    // 调用一次
    handlerFilePath(basePath);
    resultObj.sourceObj = sourceObj;
    resultObj.targetObj = targetObj;
    return resultObj;
}

// 完成数量
let completeCount = 0;
let totalCount = 0;
let curCopyPath = "";
let copyCompleted = false;
let startTimeLong = new Date().getTime();

// 批量复制方法
let batchCopy = (sourcePathArr, targetPath) => {
    if(sourcePathArr.length === 0 || !targetPath){
        toastLog("复制参数异常");
        return;
    }
    let allSourceObj = {
        filePathArr: [],
        fileDirArr: []
    };
    let allTargetObj = {
        filePathArr: [],
        fileDirArr: []
    };
    sourcePathArr.forEach((sourcePath) => {
        let result = singleCopy(sourcePath, targetPath);
        allSourceObj.filePathArr = allSourceObj.filePathArr.concat(result.sourceObj.filePathArr);
        allSourceObj.fileDirArr = allSourceObj.fileDirArr.concat(result.sourceObj.fileDirArr);
        allTargetObj.filePathArr = allTargetObj.filePathArr.concat(result.targetObj.filePathArr);
        allTargetObj.fileDirArr = allTargetObj.fileDirArr.concat(result.targetObj.fileDirArr);
    });
    totalCount = allTargetObj.filePathArr.length;

    if (showProcess) {
        ui.run(() => {
            canvasFloat.progressPath.attr("text", "待复制目录" + allTargetObj.fileDirArr.length + "个,待复制文件" + allTargetObj.filePathArr.length + "个,请稍候......");
        });
        sleep(500);
    }
    allTargetObj.fileDirArr.forEach(dir => {
        files.ensureDir(dir.endsWith("/") ? dir : dir + "/");
    });
    startTimeLong = new Date().getTime();

    if (showProcess) {
        threads.start(() => {
            setInterval(() => {

                ui.run(() => {
                    let duration = (new Date().getTime() - startTimeLong);
                    canvasFloat.syncTitle.attr("text", "复制文件进度【耗时:" + msToTime(duration) + "】" + "【完成:" + (Number(completeCount / totalCount) * 100).toFixed(2) + "%】");
                    canvasFloat.progressPath.attr("text", "复制到:"+curCopyPath);
                })
                if(copyCompleted){
                    // 调用修改完成同步状态接口
                    utilsObj.request(serverPath + "/device/completeSyncFile?syncFileUUID="+syncFileUUID, 'GET', "", (res, error) => {
                        try {
                            exit();
                        } catch (e) {
                        }
                    });
                }

            }, 50)
        })
    }
    allTargetObj.filePathArr.forEach((filePath, index) => {
        curCopyPath = filePath;
        completeCount++;
        files.copy(allSourceObj.filePathArr[index], filePath);
    })
    copyCompleted = true;
}
batchCopy(params.sourcePathArr || [], params.targetPath || '');
