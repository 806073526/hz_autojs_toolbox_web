// 通过布局预览设备

// 获取屏幕方向
let getOrientation = () => {
    // 1 竖屏 2横屏
    let orientation = context.getResources().getConfiguration().orientation;

    // 宽大于高 平板
    if(device.width > device.height){
        // 转换一下方向
        orientation = orientation === 1 ? 2 : 1
        // 高大于宽 手机
    }
    return orientation;
};

let getNodeJsonArr = ()=>{
    let orientation = getOrientation();
    let maxWidth = orientation === 1 ? device.width : device.height;
    let maxHeight = orientation === 1 ? device.height : device.width;
    // 获取全部有文字的节点
    let allNodes = classNameStartsWith("android").visibleToUser().filter(item=>{
        let isOverScreen = false;
        let boundsInfo = item.boundsInfo;
        if (boundsInfo) {
            let x1 = boundsInfo.left;
            let y1 = boundsInfo.top;
            let x2 = boundsInfo.right;
            let y2 = boundsInfo.bottom;
            // 超出边界值范围 修改标志
            if (x1 < 0 || x1 > maxWidth || y1 < 0 || y1 > maxHeight || x2 < 0 || x2 > maxWidth || y2 < 0 || y2 > maxHeight) {
                isOverScreen = true;
            }
        }
        return ((item.text()||"").length>0 || (item.desc()||"").length>0) && !isOverScreen;
    }).find();

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


setInterval(()=>{
    let startTime = new Date().getTime();
    let jsonArr = getNodeJsonArr();
    console.log("获取节点："+jsonArr.length+"个,耗时:"+ ((new Date().getTime()) - startTime));
    // TODO 请求云端接口 缓存节点数据
},2000);





