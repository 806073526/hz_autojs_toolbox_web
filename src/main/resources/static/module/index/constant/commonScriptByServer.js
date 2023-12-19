let params = ${paramsJson}
let showProcess_param = params.showProcess;
// 自身脚本名称
let selfScriptName = params.selfScriptName || "";
// 获取操作UUID
let syncFileUUID = params.syncFileUUID || "";
// 服务端地址
let serverPath = params.serverUrl;
// 是否开启独立引擎执行
let openIndependentEngine = params.openIndependentEngine;
// 是否手动完成(由传入代码调用完成方法completeFun)
let manualComplete = params.manualComplete;
// 脚本内容
let scriptContent =  decodeURI($base64.decode(params.scriptContent));

// 开启
if(openIndependentEngine){
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

}


let showProcess = showProcess_param;

let curUtilsObj = openIndependentEngine ? {} : utilsObj;
/**
 * http请求
 * @param {*} url 请求地址
 * @param {*} requestMethod 请求方法
 * @param {*} requestBody 消息体
 * @param {*} callback 回调函数
 */
curUtilsObj.request = (url, requestMethod, requestBody, callback) => {
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

let completeFun = ()=>{
    // 调用修改完成同步状态接口
    curUtilsObj.request(serverPath + "/device/completeSyncFile?syncFileUUID="+syncFileUUID, 'GET', "", (res, error) => {
        // 开启独立引擎时才关闭
        if(openIndependentEngine){
            try {
                exit();
            } catch (e) {
            }
        }
    });
};

try{
    // 执行传入脚本
   eval(scriptContent);
}catch(e){
   console.error(e);
}
if(!manualComplete){
    completeFun();
}

