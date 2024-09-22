let params = ${paramsJson}
let showProcess_param = params.showProcess;
// 自身脚本名称
let selfScriptName = params.selfScriptName || "";
// 获取操作UUID
let syncFileUUID = params.syncFileUUID || "";
// 服务端地址
let serverPath = params.serverUrl;
// 手机端路径
let phonePaths = params.phonePaths || [];
// web端同步路径
let webSyncPath = params.webSyncPath || "";

// 开启
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


let utilsObj =  {};
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


let completeFun = ()=>{
    // 调用修改完成同步状态接口
    utilsObj.request(serverPath + "/device/completeSyncFile?syncFileUUID="+syncFileUUID, 'GET', "", (res, error) => {
        try {
            exit();
        } catch (e) {
        }
    });
};

//let dirs = ["/sdcard/appSync/test"];
//let webPath = utilsObj.getDeviceUUID() + "/dir/";

let getParamDTOsFun = ()=>{
    let getParamDTOFun = (path,basePath)=>{
        let paramDTO = {};
        // 基础根目录名称
        let fileName = basePath.substring(basePath.lastIndexOf('/'), basePath.length);
        let relativePath = webSyncPath + fileName  + path.replace(basePath, '');
        // 相对路径
        paramDTO.relativePath = relativePath.replace("//","/");
        // 是目录
        if(files.isDir(path)){
            paramDTO.isDir = true;
            // 获取子文件夹
            let childrenFile = files.listDir(path);

            let children = [];
            childrenFile.forEach(child=>{
                // 子文件目录
                let childPath = files.join(path,child);
                // 获取子文件
                let childParamDTO = getParamDTOFun(childPath,basePath);
                children.push(childParamDTO);
            });
            paramDTO.children = children;
        } else {
            // 文件字节数组
            paramDTO.fileBytes = files.readBytes(path);
        }
        return paramDTO;
    };
    phonePaths.forEach(dir=>{
        paramDTOs.push(getParamDTOFun(dir,dir));
    });
};
let paramDTOs = [];
// 处理数据
getParamDTOsFun();
// 调用批量上传文件接口
utilsObj.request(serverPath + "/attachmentInfo/batchSyncFileToWeb", 'POST', JSON.stringify(paramDTOs), (res, error) => {
    let data = res.body.json();
    if(data.isSuccess){
        // 执行完成
        completeFun();
    } else {
        console.log(data);
    }
});