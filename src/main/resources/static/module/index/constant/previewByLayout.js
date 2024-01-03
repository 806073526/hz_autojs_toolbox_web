auto.setWindowFilter(function(window){
    //不管是如何窗口，都返回true，表示在该窗口中搜索
    return true;
});

// 通过布局预览设备
let getNodeJsonArr = ()=>{
    let allNodes = classNameStartsWith("android").visibleToUser().boundsInside(0,0,device.width,device.height).find();
    let convertNodeToObj = (UINode)=>{
        let obj = {};
        obj.content = UINode.text() || UINode.desc() || "";
        let bounds = UINode.bounds();
        obj.boundsInfo = {
            left: bounds.left,
            top: bounds.top,
            right: bounds.right,
            bottom: bounds.bottom
        };
        return obj;
    };
    // 获取转换后对象
    let objArr = allNodes.map(item=> convertNodeToObj(item));
    return objArr;
};

if(utilsObj.previewLayoutTimer){
    clearInterval(utilsObj.previewLayoutTimer);
    utilsObj.previewLayoutTimer = null;
}
utilsObj.previewLayoutTimer = setInterval(()=>{
    let startTime = new Date().getTime();
    let jsonArr = getNodeJsonArr();
    let layoutJSON = JSON.stringify(jsonArr);
    // 编码参数
    layoutJSON = $base64.encode(encodeURI(layoutJSON));
    let requestBody = {
        "deviceUUID": utilsObj.getDeviceUUID(),
        "layoutJSON":layoutJSON
    };
    // 记录布局信息
    utilsObj.request("/device/writeLayoutJson", "POST", JSON.stringify(requestBody), () => {
        console.log("获取节点："+jsonArr.length+"个,已上传,共计耗时:"+ ((new Date().getTime()) - startTime));
    });
},200);





