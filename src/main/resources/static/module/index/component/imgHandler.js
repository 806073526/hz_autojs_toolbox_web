import {getContext, rgb2hex} from "./../../../utils/utils.js";
let template = '<div></div>';
$.ajax({
    url: "/module/index/template/imgHandler.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});
export default {
    template: template,
    name: 'ImgHandler',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript','timeSyncOtherPropertyFun'],
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
    data() {
        return {
            imgMousePosition: {// 图片鼠标坐标
                x: 0,
                y: 0,
                color: ''
            },
            imgDrawLoading:false,
            positionShowType: 'cur', // 坐标显示类型
            previewImageWidth: 100,
            cells:Array.from({ length: 225 }),
            remoteHandler: {
                param1: {
                    paramJson:"",
                    x1: 0,
                    y1: 0,
                    x2: 1080,
                    y2: 2400,
                    cache_x1: 0,
                    cache_y1: 0,
                    cache_x2: 1080,
                    cache_y2: 2400,
                    threshold: 60,
                    maxVal: 255,
                    imgThreshold: 0.7,// 图片相似度
                    colorThreshold: 26,// 颜色相似度
                    bigScale: 1,
                    smallScale: 1,
                    localImageName: 'allScreen.png',
                    pathName:'',
                    context:'',// 文字内容
                    scriptPreview: '',
                    previewImg: '',
                    isOpenFastClip: false,
                    isOpenGray: false,
                    isOpenThreshold: false,
                    showFixedPositionList: false,
                    positionList: '',// 坐标列表
                    operatePositionKey: 'x1',// 操作key
                    operatePositionVal: 100,// 操作坐标值
                }
            }
        }
    },
    methods: {
        init(){
            this.timeSyncOtherPropertyFun();
        },
        // 多点坐标转换
        multipleConvert() {
            let positionList = this.remoteHandler.param1.positionList;
            let tempArr = (positionList || '').split('\n') || [];
            if (tempArr.length === 0) {
                return;
            }
            // 例子 基于第一个点的坐标偏移值 [[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
            let multipleArr = [];
            // 获取第一个点
            let firstPoint = tempArr[0];
            // 第一个点数组
            let firstPointArr = firstPoint.split(',') || [];
            let firstX = firstPointArr[0];
            let firstY = firstPointArr[1];
            let firstColor = firstPointArr[2];
            for (let i = 1; i < tempArr.length; i++) {
                let curPoint = tempArr[i];
                if (!curPoint) {
                    continue;
                }
                // 当前点的数组
                let curPointArr = curPoint.split(',') || [];

                let curX = curPointArr[0];
                let curY = curPointArr[1];
                let curColor = curPointArr[2];
                // 添加元素
                multipleArr.push([(curX - firstX), (curY - firstY), curColor])
            }
            return '"' + firstColor + '",' + JSON.stringify(multipleArr);
        },
        //参数1坐标值减去固定值
        param1Subtract() {
            this.remoteHandler.param1[this.remoteHandler.param1.operatePositionKey] = Number(this.remoteHandler.param1[this.remoteHandler.param1.operatePositionKey]) - Number(this.remoteHandler.param1.operatePositionVal);
        },
        //参数1坐标值加上固定值
        param1Addition() {
            this.remoteHandler.param1[this.remoteHandler.param1.operatePositionKey] = Number(this.remoteHandler.param1[this.remoteHandler.param1.operatePositionKey]) + Number(this.remoteHandler.param1.operatePositionVal);
        },
        // 坐标全屏
        setParam1(showMessage) {
            if (!this.validSelectDevice()) {
                return
            }
            if ("竖屏" === this.screenDirection) {
                this.remoteHandler.param1.x1 = 0;
                this.remoteHandler.param1.y1 = 0;
                this.remoteHandler.param1.x2 = this.deviceInfo.standardWidth;
                this.remoteHandler.param1.y2 = this.deviceInfo.standardHeight;
            } else {
                this.remoteHandler.param1.x1 = 0;
                this.remoteHandler.param1.y1 = 0;
                this.remoteHandler.param1.x2 = this.deviceInfo.standardHeight;
                this.remoteHandler.param1.y2 = this.deviceInfo.standardWidth;
            }
            if (showMessage) {
                window.ZXW_VUE.$notify.success({message: '操作成功', duration: '1000'});
            }
        },
        // 清空坐标
        clearPosition() {
            this.remoteHandler.param1.positionList = '';
            window.ZXW_VUE.$notify.success({message: '清空坐标成功', duration: '1000'})
        },
        // 从json读取参数
        readParamFromJson(){
            let paramJson = this.remoteHandler.param1.paramJson;
            if(!paramJson){
                window.ZXW_VUE.$message.warning('请先填写参数Json');
                return false;
            }
            // 解析对象
            let jsonObj = JSON.parse(paramJson);
            Object.keys(jsonObj).forEach(key=>{
                if(key === 'position'){
                    let position = jsonObj.position;
                    this.remoteHandler.param1.x1 = position[0];
                    this.remoteHandler.param1.y1 = position[1];
                    this.remoteHandler.param1.x2 = position[2];
                    this.remoteHandler.param1.y2 = position[3];
                } else if(key === 'isOpenGray'){
                    this.remoteHandler.param1[key] = jsonObj[key] === 1;
                } else if(key === 'isOpenThreshold'){
                    this.remoteHandler.param1[key] = jsonObj[key] === 1;
                } else {
                    this.remoteHandler.param1[key] = jsonObj[key];
                }
            });
            window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'})
        },
        // 生成参数到json
        generateParamToJson(){
            let pageObj = JSON.parse(JSON.stringify(this.remoteHandler.param1));
            pageObj.position = [pageObj.x1,pageObj.y1,pageObj.x2,pageObj.y2];// 坐标
            pageObj.featuresThreshold = pageObj.imgThreshold;
            pageObj.isOpenGray = pageObj.isOpenGray ? 1 : 0;
            pageObj.isOpenThreshold = pageObj.isOpenThreshold ? 1 : 0;
            let positionList = this.remoteHandler.param1.positionList;
            let tempArr = (positionList || '').split('\n') || [];
            if (tempArr.length !== 0) {
                // 例子 基于第一个点的坐标偏移值 [[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
                let multipleArr = [];
                // 获取第一个点
                let firstPoint = tempArr[0];
                // 第一个点数组
                let firstPointArr = firstPoint.split(',') || [];
                let firstX = firstPointArr[0];
                let firstY = firstPointArr[1];
                let firstColor = firstPointArr[2];
                for (let i = 1; i < tempArr.length; i++) {
                    let curPoint = tempArr[i];
                    if (!curPoint) {
                        continue;
                    }
                    // 当前点的数组
                    let curPointArr = curPoint.split(',') || [];

                    let curX = curPointArr[0];
                    let curY = curPointArr[1];
                    let curColor = curPointArr[2];
                    // 添加元素
                    multipleArr.push([(curX - firstX), (curY - firstY), curColor])
                }
                pageObj.color = firstColor;
                pageObj.colorOther = multipleArr;
            }
            let needDeleteKeys = ['paramJson','x1','y1','x2','y2','cache_x1','cache_y1','cache_x2','cache_y2',
                'localImageName','scriptPreview','previewImg','isOpenFastClip','showFixedPositionList','positionList','operatePositionKey','operatePositionVal'];
            needDeleteKeys.forEach(key=>{
                delete pageObj[key];
            });
            this.remoteHandler.param1.paramJson = JSON.stringify(pageObj);
            window.ZXW_VUE.$notify.success({message: '生成成功', duration: '1000'})
        },
        // 读取坐标
        readPositionList() {
            let positionList = this.remoteHandler.param1.positionList;
            let tempArr = (positionList || '').split('\n') || [];
            if (tempArr.length >= 1) {
                let arr = (tempArr[0] || '').split(',') || [];
                if (arr.length >= 1) {
                    this.remoteHandler.param1.x1 = arr[0] ? (Number(arr[0].replace(/\s/g, "")) || 0) : 0;
                }
                if (arr.length >= 2) {
                    this.remoteHandler.param1.y1 = arr[1] ? (Number(arr[1].replace(/\s/g, "")) || 0) : 0;
                }
            }
            if (tempArr.length >= 2) {
                let arr = (tempArr[1] || '').split(',') || [];
                if (arr.length >= 1) {
                    this.remoteHandler.param1.x2 = arr[0] ? (Number(arr[0].replace(/\s/g, "")) || 0) : 0;
                }
                if (arr.length >= 2) {
                    this.remoteHandler.param1.y2 = arr[1] ? (Number(arr[1].replace(/\s/g, "")) || 0) : 0;
                }
            }
            window.ZXW_VUE.$notify.success({message: '读取坐标成功', duration: '1000'})
        },
        // 发送图像处理指令
        sendImgAction(functionName) {
            if (!this.validSelectDevice()) {
                return
            }
            this.remoteHandler.param1.cache_x1 = this.remoteHandler.param1.x1;
            this.remoteHandler.param1.cache_y1 = this.remoteHandler.param1.y1;
            this.remoteHandler.param1.cache_x2 = this.remoteHandler.param1.x2;
            this.remoteHandler.param1.cache_y2 = this.remoteHandler.param1.y2;
            // 调用utils.js中 对应的functionName
            let messageStr = '{"functionName":"' + functionName + '","functionParam":[' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',"' + this.remoteHandler.param1.localImageName + '",' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ']}';
            // 相对路径
            let relativeFilePath = this.deviceInfo.deviceUuid + "/" + this.remoteHandler.param1.localImageName;
            // 原始文件信息
            let sourceFileInfo = this.getFileInfoByPath(relativeFilePath);
            let sourceFileSize = sourceFileInfo ? sourceFileInfo.fileSize : 0;
            let sourceLastUpdateTime = sourceFileInfo ? sourceFileInfo.lastUpdateTime : '';
            this.imgDrawLoading = true;
            this.sendMsgToClient('remoteHandler',messageStr,()=>{
                let fileNoChangeCount = 0;//连续未变化次数
                let startFlag = false; //开始处理标志
                // 每隔200毫秒执行一次查询
                let refreshTimer = setInterval(()=>{
                    // 当前文件信息
                    let curFileInfo = this.getFileInfoByPath(relativeFilePath);
                    let curFileSize = curFileInfo ? curFileInfo.fileSize : 0;
                    let curLastUpdateTime = curFileInfo ? curFileInfo.lastUpdateTime : '';

                    if(sourceFileSize !== curFileSize || sourceLastUpdateTime !== curLastUpdateTime){
                        // 内容有变化时开始记录
                        startFlag = true;
                    }
                    // 有一次变化后 文件大小和时间连续没有变化
                    if(sourceFileSize === curFileSize && sourceLastUpdateTime === curLastUpdateTime && startFlag){
                        // 文件未变化计数加一
                        fileNoChangeCount++;
                    } else {
                        sourceFileSize = curFileSize;
                        sourceLastUpdateTime = curLastUpdateTime;
                        fileNoChangeCount = 0;// 重置次数
                    }
                    // 200*3 0.6秒钟未变化 认为图片上传完成
                    if(fileNoChangeCount >= 3){
                        // 执行加载图片
                        this.loadPreviewImg();
                        setTimeout(()=>{
                            this.imgDrawLoading = false;
                        },200);
                        // 关闭定时器
                        clearInterval(refreshTimer);
                        refreshTimer = null;
                    }
                },200);
            });
        },
        // 开启快速裁图change方法
        openFastClipChange(val) {
            // 开启
            if (val) {
                // 自动调整缩放
                this.previewImageWidth = 100;
                // 自动设置全屏
                this.setParam1(false);
            }
        },
        // 根据路径获取文件信息
        getFileInfoByPath(relativeFilePath){
            let fileInfo = null;
            $.ajax({
                url: getContext() + "/attachmentInfo/querySingleAttachInfoByPath",
                type: "GET",
                dataType: "json",
                data: {
                    "relativeFilePath": relativeFilePath
                },
                async:false,
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            fileInfo = data.data;
                        }
                    }
                },
                error: function (msg) {
                }
            });
            return fileInfo;
        },
        // 加载预览图片
        loadPreviewImg() {
            if (!this.validSelectDevice()) {
                return
            }
            this.remoteHandler.param1.previewImg = "";
            let imgUrl = getContext() + "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/" + this.remoteHandler.param1.localImageName;
            let _this = this;
            this.remoteHandler.param1.cache_x1 = this.remoteHandler.param1.x1;
            this.remoteHandler.param1.cache_y1 = this.remoteHandler.param1.y1;
            this.remoteHandler.param1.cache_x2 = this.remoteHandler.param1.x2;
            this.remoteHandler.param1.cache_y2 = this.remoteHandler.param1.y2;
            setTimeout(() => {
                this.remoteHandler.param1.previewImg = imgUrl;
                this.$nextTick(() => {
                    $("#previewImg").attr("src", imgUrl + "?t=" + new Date().getTime());

                    let drawBox = document.querySelector('#drawArear');
                    window.drawFlag = false;
                    let drawReact = document.getElementById('drawReact'); // 获取矩形框元素
                    drawReact.style.visibility = 'hidden';
                    drawReact.style.width = '0px'; // 宽
                    drawReact.style.height = '0px'; // 高
                    drawReact.style.left = '0px';
                    drawReact.style.top = '0px';

                    drawBox.removeEventListener('mousemove', _this.drawMouseMove);
                    drawBox.addEventListener('mousemove', _this.drawMouseMove);

                    drawBox.removeEventListener('mousedown', _this.drawMouseDown);
                    drawBox.addEventListener('mousedown', _this.drawMouseDown, true);

                    drawBox.removeEventListener('mouseup', _this.drawMouseUp);
                    drawBox.addEventListener('mouseup', _this.drawMouseUp, true);

                    drawBox.removeEventListener('click', _this.imgMouseClick);
                    drawBox.addEventListener('click', _this.imgMouseClick);


                    let img = new Image();
                    img.src = imgUrl + "?t=" + new Date().getTime();
                    let canvas = document.getElementById('canvas');
                    canvas.width = this.remoteHandler.param1.cache_x2 - this.remoteHandler.param1.cache_x1;
                    canvas.height = this.remoteHandler.param1.cache_y2 - this.remoteHandler.param1.cache_y1;
                    window.ctx = canvas.getContext('2d');
                    img.onload = function () {
                        // 在canvas上画图片
                        window.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };

                    let canvasScale = document.getElementById('canvasScale');
                    canvasScale.width = 200;
                    canvasScale.height = 200;
                    window.ctxScale = canvasScale.getContext('2d');
                });
            }, 200);
        },
        // 图片鼠标点击
        imgMouseClick() {
            let positionList = this.remoteHandler.param1.positionList;
            positionList += (this.imgMousePosition.x + "," + this.imgMousePosition.y + "," + this.imgMousePosition.color + "\n");
            if (window.ctx) {
                // 获取图片像素信息
                let pixel = window.ctx.getImageData(this.imgMousePosition.x, this.imgMousePosition.y, 1, 1);
                let data = pixel.data;
            }
            this.remoteHandler.param1.positionList = positionList
        },
        // 绘画鼠标按下
        drawMouseDown(e) {
            if (!this.remoteHandler.param1.isOpenFastClip) {
                return;
            }
            let drawArear = document.getElementById('drawArear'); // 获取画布元素
            let drawReact = document.getElementById('drawReact'); // 获取矩形框元素
            let areaInfo = drawArear.getBoundingClientRect();
            if (!window.drawFlag) {
                window.drawFlag = true;
                drawReact.style.visibility = 'hidden';
                drawReact.style.width = '0px'; // 宽
                drawReact.style.height = '0px'; // 高
                drawReact.style.left = '0px';
                drawReact.style.top = '0px';
                drawReact.style.visibility = 'visible'; // 进入画布按下鼠标显示默认矩形框
                // 鼠标按下的位置作为矩形框的顶点
                window.beginPoint = {x: e.clientX - areaInfo.x, y: e.clientY - areaInfo.y};
                window.reactTop = e.clientY - areaInfo.y;
                window.reactLeft = e.clientX - areaInfo.x;
                drawReact.style.top = window.reactTop + 'px';
                drawReact.style.left = window.reactLeft + 'px';
            } else {
                window.drawFlag = false;
                // 鼠标弹起的点作为矩形框的终点
                window.endPoint = {x: e.clientX - areaInfo.x, y: e.clientY - areaInfo.y};
                drawReact.style.visibility = 'hidden';
                // 触发读取坐标操作
                setTimeout(() => {
                    // 获取坐标列表
                    let positionList = (this.remoteHandler.param1.positionList || "").trim();
                    let tempArr = (positionList || '').split('\n') || [];
                    if (tempArr.length < 2) {
                        return;
                    }
                    // 第一个点数组
                    let firstPointArr = (tempArr[tempArr.length - 2] || '').split(',') || [];
                    if (firstPointArr && firstPointArr.length <= 3) {
                        this.remoteHandler.param1.x1 = firstPointArr[0];
                        this.remoteHandler.param1.y1 = firstPointArr[1];
                    }
                    // 第二个点数组
                    let secondPointArr = (tempArr[tempArr.length - 1] || '').split(',') || [];
                    if (secondPointArr && secondPointArr.length <= 3) {
                        this.remoteHandler.param1.x2 = secondPointArr[0];
                        this.remoteHandler.param1.y2 = secondPointArr[1];
                    }
                    // 生成图片
                    this.sendImgAction('remoteClipGrayscaleAndThresholdToServer');
                    // 关闭快速裁图
                    this.remoteHandler.param1.isOpenFastClip = false;
                }, 500)
            }
        },
        // 绘画鼠标弹起
        drawMouseUp(e){
            if (!this.remoteHandler.param1.isOpenFastClip) {
                return;
            }
            // 已开启拖选模式
            if (window.drawFlag) {
                let drawArear = document.getElementById('drawArear'); // 获取画布元素
                let areaInfo = drawArear.getBoundingClientRect();
                // 鼠标弹起的点作为矩形框的终点
                let tempEndPoint = {x: e.clientX - areaInfo.x, y: e.clientY - areaInfo.y};
                if(window.beginPoint){
                    //  如果 起点坐标和终点坐标有区别 则以弹起位置为终点坐标
                    if(window.beginPoint.x !== tempEndPoint.x && window.beginPoint.y !== tempEndPoint.y){
                        // 关闭绘画标记
                        window.drawFlag = false;
                        // 清空绘画框
                        let drawReact = document.getElementById('drawReact'); // 获取矩形框元素
                        drawReact.style.visibility = 'hidden';
                        drawReact.style.width = '0px'; // 宽
                        drawReact.style.height = '0px'; // 高
                        drawReact.style.left = '0px';
                        drawReact.style.top = '0px';


                        let box = document.querySelector('#previewImg');
                        let xCoefficient = 1;
                        let yCoefficient = 1;

                        // x乘法系数
                        let xMul = ((this.remoteHandler.param1.cache_x2 || 0) - (this.remoteHandler.param1.cache_x1 || 0)) / box.width;
                        // y乘法系数
                        let yMul = ((this.remoteHandler.param1.cache_y2 || 0) - (this.remoteHandler.param1.cache_y1 || 0)) / box.height;
                        // 竖屏
                        if (this.positionShowType === 'standard' && this.screenDirection === "竖屏") {
                            xCoefficient = xCoefficient * (this.deviceInfo.screenWidth || this.deviceInfo.standardWidth) / this.deviceInfo.standardWidth;
                            yCoefficient = yCoefficient * (this.deviceInfo.screenHeight || this.deviceInfo.standardHeight) / this.deviceInfo.standardHeight;
                            // 横屏
                        } else if (this.positionShowType === 'standard' && this.screenDirection === "横屏") {
                            xCoefficient = xCoefficient * (this.deviceInfo.screenHeight || this.deviceInfo.standardHeight) / this.deviceInfo.standardHeight;
                            yCoefficient = yCoefficient * (this.deviceInfo.screenWidth || this.deviceInfo.standardWidth) / this.deviceInfo.standardWidth;
                        }

                        setTimeout(() => {
                            // 获取坐标列表
                            let positionList = (this.remoteHandler.param1.positionList || "").trim();
                            let tempArr = (positionList || '').split('\n') || [];
                            if (tempArr.length < 1) {
                                return;
                            }
                            // 获取终点实际坐标
                            let endPointArr = (tempArr[tempArr.length - 1] || '').split(',') || [];
                            if (endPointArr && endPointArr.length <= 3) {
                                this.remoteHandler.param1.x2 = endPointArr[0];
                                this.remoteHandler.param1.y2 = endPointArr[1];
                            }
                            // 相比起点坐标x的变化
                            let xVal = tempEndPoint.x - window.beginPoint.x;
                            // 相比起点坐标y的变化
                            let yVal = tempEndPoint.y - window.beginPoint.y;

                            xVal = Number((xVal * xMul) / xCoefficient).toFixed(0);
                            yVal = Number((yVal * yMul) / yCoefficient).toFixed(0);

                            this.remoteHandler.param1.x1 = Number(this.remoteHandler.param1.x2) - Number(xVal);
                            this.remoteHandler.param1.y1 = Number(this.remoteHandler.param1.y2) - Number(yVal);

                            // 生成图片
                            this.sendImgAction('remoteClipGrayscaleAndThresholdToServer');
                            // 关闭快速裁图
                            this.remoteHandler.param1.isOpenFastClip = false;
                        }, 500)
                    }
                }

            }
        },
        // 绘画鼠标移动
        drawMouseMove(e) {
            let box = document.querySelector('#previewImg');
            let xCoefficient = 1;
            let yCoefficient = 1;

            // x乘法系数
            let xMul = ((this.remoteHandler.param1.cache_x2 || 0) - (this.remoteHandler.param1.cache_x1 || 0)) / box.width;
            // y乘法系数
            let yMul = ((this.remoteHandler.param1.cache_y2 || 0) - (this.remoteHandler.param1.cache_y1 || 0)) / box.height;
            // 竖屏
            if (this.positionShowType === 'standard' && this.screenDirection === "竖屏") {
                xCoefficient = xCoefficient * (this.deviceInfo.screenWidth || this.deviceInfo.standardWidth) / this.deviceInfo.standardWidth;
                yCoefficient = yCoefficient * (this.deviceInfo.screenHeight || this.deviceInfo.standardHeight) / this.deviceInfo.standardHeight;
                // 横屏
            } else if (this.positionShowType === 'standard' && this.screenDirection === "横屏") {
                xCoefficient = xCoefficient * (this.deviceInfo.screenHeight || this.deviceInfo.standardHeight) / this.deviceInfo.standardHeight;
                yCoefficient = yCoefficient * (this.deviceInfo.screenWidth || this.deviceInfo.standardWidth) / this.deviceInfo.standardWidth;
            }
            let offsetX = e.offsetX;
            let offsetY = e.offsetY;
            if(e.srcElement.id === 'drawReact'){
                offsetX = e.offsetX + Number(e.srcElement.style.left.replace("px","")) + 4;
                offsetY = e.offsetY + Number(e.srcElement.style.top.replace("px","")) + 4;
            }
            this.imgMousePosition.x = Number((offsetX * xMul) / xCoefficient).toFixed(0);
            this.imgMousePosition.y = Number((offsetY * yMul) / yCoefficient).toFixed(0);
            if (window.ctx) {
                // 获取图片像素信息
                let pixel = window.ctx.getImageData(this.imgMousePosition.x, this.imgMousePosition.y, 1, 1);
                let data = pixel.data;
                // 获取rgba值
                let rgba = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + (data[3] / 255) + ')';
                // 设置小正方形的背景颜色
                this.imgMousePosition.color = rgb2hex(rgba)
            }

            if(window.ctxScale){
                let canvas = document.getElementById('canvas');
                let centerX = this.imgMousePosition.x;
                let centerY = this.imgMousePosition.y;
                let cutWidth = 50; // 裁剪的宽度
                let cutHeight = 50; // 裁剪的高度
                let x1 = (centerX - cutWidth / 2); // 裁剪区域的左上角 x 坐标
                let y1 = centerY - cutHeight / 2; // 裁剪区域的左上角 y 坐标
                window.ctxScale.clearRect(0, 0, 200, 200);
                // 绘制
                window.ctxScale.drawImage(canvas, x1, y1, cutWidth, cutHeight, 0, 0, 200, 200);
            }
            if (!this.remoteHandler.param1.isOpenFastClip) {
                return;
            }
            if (!window.drawFlag) {
                return;
            }
            let drawArear = document.getElementById('drawArear'); // 获取画布元素
            let drawReact = document.getElementById('drawReact'); // 获取矩形框元素
            let areaInfo = drawArear.getBoundingClientRect();

            // 鼠标移动的坐标 - 画布相对视窗的位置 - 矩形相对于画布的偏差（顶点位置） = 矩形框的大小
            window.reactWidth = e.clientX - areaInfo.x; // 宽
            window.reactHeight = e.clientY - areaInfo.y; // 高

            // 超出画布区域 宽度最大为 画布宽度
            window.reactWidth = e.clientX > areaInfo.right ? areaInfo.width + areaInfo.x - beginPoint.x : e.clientX - areaInfo.x;
            window.reactHeight = e.clientY > areaInfo.bottom ? areaInfo.height + areaInfo.y - beginPoint.y : e.clientY - areaInfo.y;

            let absoluteWidth = window.reactWidth - window.reactLeft; // 绝对宽度
            let absoluteHeight = window.reactHeight - window.reactTop; // 绝对高度

            drawReact.style.width = absoluteWidth + 'px'; // 宽
            drawReact.style.height = absoluteHeight + 'px'; // 高
        },
        // 保存图片
        saveImage(){
            window.ZXW_VUE.$prompt('是否确认保存图片到web端,请输入保存路径和名称!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: "/"+this.remoteHandler.param1.localImageName,
                inputValidator: function(val) {
                    if(val){
                        if(!val.startsWith("/")){
                            return "必须以/开头"
                        }
                        if(!val.endsWith(".png")){
                            return "必须以.png结尾"
                        }
                    } else {
                        return "不能为空";
                    }
                    return true;
                }
            }).then(({value}) => {
                // 获取最后一个斜杠的下标
                let lastIndex =  value.lastIndexOf('/');
                // 文件名
               let fileName = value.substring(lastIndex+1,value.length);
               // 文件路径
               let filePath = value.substring(0,lastIndex+1);
               console.log(fileName,filePath);
                let previewImg=document.getElementById("previewImg");
                let tempCanvas = document.createElement('canvas');
                tempCanvas.width= previewImg.width;
                tempCanvas.height = previewImg.height;
                let ctx = tempCanvas.getContext('2d');
                ctx.drawImage(previewImg,0,0,);
                tempCanvas.toBlob((blob)=>{
                    let file = new File([blob],fileName,{type:'image/png'});
                    let scriptFile = new File([file], fileName, {
                        type: "image/png",
                    });
                    const param = new FormData();
                    param.append('file', scriptFile);
                    param.append('pathName', this.deviceInfo.deviceUuid + filePath);
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
            }).catch(() => {
            });
        },
        // 生成代码
        generateCode(codeType) {
            if (!this.validSelectDevice()) {
                return
            }
            // 清空代码
            this.remoteHandler.param1.scriptPreview = '';
            let code = '';
            // 灰度化
            if ('grayscale' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let afterImg = images.grayscale(img);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(afterImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.recycleNull(afterImg);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                // 阈值化
            } else if ('threshold' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let afterImg = images.threshold(img,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ');\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(afterImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.recycleNull(afterImg);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                // 裁图
            } else if ('clip' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let afterImg = images.clip(img, ' + this.remoteHandler.param1.x1 + ', ' + this.remoteHandler.param1.y1 + ', ' + (this.remoteHandler.param1.x2 - this.remoteHandler.param1.x1) + ', ' + (this.remoteHandler.param1.y2 - this.remoteHandler.param1.y1) + ');\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(afterImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.recycleNull(afterImg);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                // 找图
            } else if ('findImage' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let options = { threshold:' + this.remoteHandler.param1.imgThreshold + '};\r\n' +
                    'let result = images.findImage(img,targetImg,options);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 收集特征
            } else if ('detectAndComputeFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let options = { scale:' + this.remoteHandler.param1.bigScale + '};\r\n' +
                    'let result = images.detectAndComputeFeatures(img,options);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));\r\n' +
                    'utils.recycleNull(result);';
                // 特征匹配
            } else if ('matchFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let options1 = { scale:' + this.remoteHandler.param1.bigScale + '};\r\n' +
                    'let options2 = { scale:' + this.remoteHandler.param1.smallScale + '};\r\n' +
                    'let bigFeatures = images.detectAndComputeFeatures(img,options1);\r\n' +
                    'let smallFeatures = images.detectAndComputeFeatures(targetImg,options2);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'let options3 = { drawMatches:newFilepath,thredshold:' + this.remoteHandler.param1.imgThreshold + '};\r\n' +
                    'let result = images.matchFeatures(bigFeatures,smallFeatures,options3);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'utils.recycleNull(bigFeatures);\r\n' +
                    'utils.recycleNull(smallFeatures);\r\n' +
                    'toastLog(JSON.stringify(result));\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath);\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                // 多点找色
            } else if ('findMultiColors' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let options = {threshold:' + this.remoteHandler.param1.colorThreshold + '}\r\n' +
                    'let result = images.findMultiColors(img,' + multipleParam + ',options);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 谷歌MLKITOCR
            } else if ('MLKitOCR' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let MLKitOCR = $plugins.load("org.autojs.autojspro.plugin.mlkit.ocr");\r\n' +
                    'let googleOcr = new MLKitOCR();\r\n' +
                    'let resultMlk = googleOcr.detect(img);\r\n' +
                    'let contentMlkArr = Object.values(resultMlk).map(item => item.text) || [];\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(contentMlkArr));';
                // 谷歌MLKITOCR autox版本
            } else if('MLKitOCR_AUTO_X' === codeType){
code = `let img = captureScreen();
let resultMlk = gmlkit.ocr(img,"zh").toArray(3);
let contentMlkArr=[];
for(let i=0;i<resultMlk.length;i++){
contentMlkArr.push(resultMlk[i].text);
}
utils.recycleNull(img);
toastLog(JSON.stringify(contentMlkArr.join('')));`;
                // 模板匹配
            } else if ('matchTemplate' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let matchingResult = images.matchTemplate(img,targetImg,{\r\n' +
                    '       threshold:' + this.remoteHandler.param1.imgThreshold + ',\r\n' +
                    '       max:5,\r\n' +
                    '       transparentMask:false,\r\n' +
                    '});\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(matchingResult));';
                // 区域找图
            } else if ('regionalFindImg2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.regionalFindImg2(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域找图测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域找图点击
            } else if ('regionalClickImg2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let tempImgPath = "' + this.remoteHandler.param1.previewImg + '";\r\n' +
                    'utils.regionalClickImg2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',tempImgPath,' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到图片") });\r\n' +
                    'utils.recycleNull(img);'
                // 区域识字
            } else if ('regionalAnalysisChart2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.regionalAnalysisChart2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域识字测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域识字获取文字坐标
            } else if ('regionalAnalysisChartPosition2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.regionalAnalysisChartPosition2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',"'+this.remoteHandler.param1.context+'",' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域模板匹配
            } else if ('regionalMatchTemplate2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.regionalMatchTemplate2(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',5,false,' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域模板匹配测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域识字点击
            } else if ('regionalClickText2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'utils.regionalClickText2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',"'+this.remoteHandler.param1.context+'",' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到文字") });\r\n' +
                    'utils.recycleNull(img);'
                // 区域特征匹配点击
            } else if ('regionalClickFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let tempImgPath = "' + this.remoteHandler.param1.previewImg + '";\r\n' +
                    'utils.regionalClickFeatures(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',tempImgPath,' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到特征") });\r\n' +
                    'utils.recycleNull(img);'
                // 区域特征匹配
            } else if ('regionalMatchingFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.regionalMatchingFeatures(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域特征匹配测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域特征匹配模板
            } else if ('regionalMatchFeaturesTemplate' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.regionalMatchFeaturesTemplate(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',5,"区域特征匹配测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域多点找色
            } else if ('regionalFindMultipleColor2' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.regionalFindMultipleColor2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + multipleParam + ',' + this.remoteHandler.param1.colorThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域多点找色测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //   区域多点找色点击
            } else if ('regionalClickColor2' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'utils.regionalClickColor2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + multipleParam + ',' + this.remoteHandler.param1.colorThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到多点颜色") });\r\n' +
                    'utils.recycleNull(img);'
                // 区域找图或者特征匹配
            } else if ('regionalFindImgOrFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.regionalFindImgOrFeatures(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域找图或者特征匹配测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域模板匹配或者特征匹配模板
            } else if ('regionalMatchTemplateOrMatchFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.regionalMatchTemplateOrMatchFeatures(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',5,false,' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域模板匹配或者特征匹配模板测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域灰度化阈值化找圆
            } else if ('regionalFindCircles2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.regionalFindCircles2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域灰度化阈值化找圆测试代码");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 获取分辨率转换系数
            } else if ('getConvertCoefficient' === codeType) {
                code =
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.getConvertCoefficient();\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 缩放小图
            } else if ('scaleSmallImg' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let smallImg = utils.scaleSmallImg(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(smallImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.recycleNull(smallImg);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                // 按照分辨率转换坐标
            } else if ('convertXY' === codeType) {
                code =
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.convertXY(' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',"");\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 图片特征匹配
            } else if ('detectFeaturesScale' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.detectFeaturesScale(img,targetImg,' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ');\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));\r\n';
                // 灰度化阈值化特征匹配
            } else if ('matchingFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.matchingFeatures(img,targetImg,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"");\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));\r\n';
                // 随机点击
            } else if ('randomClick' === codeType) {
                code =
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'utils.randomClick(' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',5,false);\r\n';
                // 灰度化阈值化图片
            } else if ('grayscaleAndThreshold2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.grayscaleAndThreshold2(img,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(result, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.recycleNull(result);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                //灰度化阈值化找图
            } else if ('grayThresholdFindImg2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utils.grayThresholdFindImg2(img,targetImg,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //灰度化、阈值化多点找色
            } else if ('grayThresholdFindMultipleColor2' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.grayThresholdFindMultipleColor2(img,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + multipleParam + ',' + this.remoteHandler.param1.colorThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //ocr获取文字识别内容字符串结果
            } else if ('ocrGetContentStr' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.ocrGetContentStr(img);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //ocr获取文字识别内容字符串结果并绘图
            } else if ('ocrGetResultToCanvas' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'let result = utils.ocrGetResultToCanvas(img);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(result, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utils.recycleNull(result);\r\n' +
                    'utils.recycleNull(img);\r\n' +
                    'utils.textFindOneClick("仅此一次", 2000);';
                // 绘制方框canvasRect
            } else if ('canvasRect' === codeType) {
                code =
                    'let utils =  utilsObj;//本地项目使用utils需要引入utils.js文件 详情见操作文档\r\n' +
                    'utils.canvasRect(' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',"img","绘图");\r\n';
            }
            this.remoteHandler.param1.scriptPreview = code;
            window.ZXW_VUE.$notify.success({message: '生成代码成功', duration: '1000'})
        },
        // 执行预览代码
        execPreviewScript() {
            if (!this.validSelectDevice()) {
                return
            }
            this.remoteExecuteScript(this.remoteHandler.param1.scriptPreview);
        },
    }
}