import {getContext, rgb2hex} from "./../../utils/utils.js";
let template = '<div></div>';
$.ajax({
    url: "/module/template/imgHandler.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});
export default {
    template: template,
    name: 'ImgHandler',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript'],
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
            positionShowType: 'cur', // 坐标显示类型
            remoteHandler: {
                param1: {
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
                    scriptPreview: '',
                    previewImg: '',
                    isOpenFastClip: false,
                    isOpenGray: false,
                    isOpenThreshold: false,
                    isOpenColor: false,
                    showFixedPositionList: false,
                    positionList: '',// 坐标列表
                    operatePositionKey: 'x1',// 操作key
                    operatePositionVal: 100,// 操作坐标值
                }
            }
        }
    },
    methods: {
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
                this.remoteHandler.param1.x2 = this.deviceInfo.screenWidth;
                this.remoteHandler.param1.y2 = this.deviceInfo.screenHeight;
            } else {
                this.remoteHandler.param1.x1 = 0;
                this.remoteHandler.param1.y1 = 0;
                this.remoteHandler.param1.x2 = this.deviceInfo.screenHeight;
                this.remoteHandler.param1.y2 = this.deviceInfo.screenWidth;
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
            this.sendMsgToClient('remoteHandler',messageStr,()=>{
                setTimeout(() => {
                    this.loadPreviewImg()
                }, 1200)
            });
        },
        // 开启快速裁图change方法
        openFastClipChange(val) {
            // 开启
            if (val) {
                // 自动设置全屏
                this.setParam1(false);
            }
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
            this.imgMousePosition.x = Number((e.offsetX * xMul) / xCoefficient).toFixed(0);
            this.imgMousePosition.y = Number((e.offsetY * yMul) / yCoefficient).toFixed(0);
            if (window.ctx) {
                // 获取图片像素信息
                let pixel = window.ctx.getImageData(this.imgMousePosition.x, this.imgMousePosition.y, 1, 1);
                let data = pixel.data;
                // 获取rgba值
                let rgba = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + (data[3] / 255) + ')';
                // 设置小正方形的背景颜色
                this.imgMousePosition.color = rgb2hex(rgba)
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
                    'let afterImg = images.grayscale(img);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(afterImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.recycleNull(afterImg);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                // 阈值化
            } else if ('threshold' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let afterImg = images.threshold(img,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ');\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(afterImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.recycleNull(afterImg);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                // 裁图
            } else if ('clip' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let afterImg = images.clip(img, ' + this.remoteHandler.param1.x1 + ', ' + this.remoteHandler.param1.y1 + ', ' + (this.remoteHandler.param1.x2 - this.remoteHandler.param1.x1) + ', ' + (this.remoteHandler.param1.y2 - this.remoteHandler.param1.y1) + ');\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(afterImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.recycleNull(afterImg);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                // 找图
            } else if ('findImage' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let options = { threshold:' + this.remoteHandler.param1.imgThreshold + '};\r\n' +
                    'let result = images.findImage(img,targetImg,options);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 收集特征
            } else if ('detectAndComputeFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let options = { scale:' + this.remoteHandler.param1.bigScale + '};\r\n' +
                    'let result = images.detectAndComputeFeatures(img,options);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(result);\r\n' +
                    'utilsObj.recycleNull(result);';
                // 特征匹配
            } else if ('matchFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
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
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'utilsObj.recycleNull(bigFeatures);\r\n' +
                    'utilsObj.recycleNull(smallFeatures);\r\n' +
                    'toastLog(JSON.stringify(result));\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath);\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                // 多点找色
            } else if ('findMultiColors' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let options = {threshold:' + this.remoteHandler.param1.colorThreshold + '}\r\n' +
                    'let result = images.findMultiColors(img,' + multipleParam + ',options);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 谷歌MLKITOCR
            } else if ('MLKitOCR' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let MLKitOCR = $plugins.load("org.autojs.autojspro.plugin.mlkit.ocr");\r\n' +
                    'let googleOcr = new MLKitOCR();\r\n' +
                    'let resultMlk = googleOcr.detect(img);\r\n' +
                    'let contentMlkArr = Object.values(resultMlk).map(item => item.text) || [];\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(contentMlkArr));';
                // 模板匹配
            } else if ('matchTemplate' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let matchingResult = images.matchTemplate(img,targetImg,{\r\n' +
                    '       threshold:' + this.remoteHandler.param1.imgThreshold + ',\r\n' +
                    '       max:5,\r\n' +
                    '       transparentMask:false,\r\n' +
                    '});\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(matchingResult));';
                // 区域找图
            } else if ('regionalFindImg2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.regionalFindImg2(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域找图测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域找图点击
            } else if ('regionalClickImg2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let tempImgPath = "' + this.remoteHandler.param1.previewImg + '";\r\n' +
                    'utilsObj.regionalClickImg2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',tempImgPath,' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到图片") });\r\n' +
                    'utilsObj.recycleNull(img);'
                // 区域识字
            } else if ('regionalAnalysisChart2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.regionalAnalysisChart2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域识字测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域识字获取文字坐标
            } else if ('regionalAnalysisChartPosition2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.regionalAnalysisChartPosition2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',"目标文字",' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域模板匹配
            } else if ('regionalMatchTemplate2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.regionalMatchTemplate2(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',5,false,' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域模板匹配测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域识字点击
            } else if ('regionalClickText2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'utilsObj.regionalClickText2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',"目标文字",' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到文字") });\r\n' +
                    'utilsObj.recycleNull(img);'
                // 区域特征匹配点击
            } else if ('regionalClickFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let tempImgPath = "' + this.remoteHandler.param1.previewImg + '";\r\n' +
                    'utilsObj.regionalClickFeatures(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',tempImgPath,' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到特征") });\r\n' +
                    'utilsObj.recycleNull(img);'
                // 区域特征匹配
            } else if ('regionalMatchingFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.regionalMatchingFeatures(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域特征匹配测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域特征匹配模板
            } else if ('regionalMatchFeaturesTemplate' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.regionalMatchFeaturesTemplate(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',5,"区域特征匹配测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域多点找色
            } else if ('regionalFindMultipleColor2' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.regionalFindMultipleColor2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + multipleParam + ',' + this.remoteHandler.param1.colorThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域多点找色测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //   区域多点找色点击
            } else if ('regionalClickColor2' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'utilsObj.regionalClickColor2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + multipleParam + ',' + this.remoteHandler.param1.colorThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',()=>{ toastLog("找到多点颜色") });\r\n' +
                    'utilsObj.recycleNull(img);'
                // 区域找图或者特征匹配
            } else if ('regionalFindImgOrFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.regionalFindImgOrFeatures(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域找图或者特征匹配测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域模板匹配或者特征匹配模板
            } else if ('regionalMatchTemplateOrMatchFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.regionalMatchTemplateOrMatchFeatures(img,targetImg,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',5,false,' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域模板匹配或者特征匹配模板测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 区域灰度化阈值化找圆
            } else if ('regionalFindCircles2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.regionalFindCircles2(img,' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"区域灰度化阈值化找圆测试代码");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 获取分辨率转换系数
            } else if ('getConvertCoefficient' === codeType) {
                code = 'let result = utilsObj.getConvertCoefficient();\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 缩放小图
            } else if ('scaleSmallImg' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let smallImg = utilsObj.scaleSmallImg(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(smallImg, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.recycleNull(smallImg);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                // 按照分辨率转换坐标
            } else if ('convertXY' === codeType) {
                code = 'let result = utilsObj.convertXY(' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',"");\r\n' +
                    'toastLog(JSON.stringify(result));';
                // 图片特征匹配
            } else if ('detectFeaturesScale' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.detectFeaturesScale(img,targetImg,' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ');\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(result);\r\n';
                // 灰度化阈值化特征匹配
            } else if ('matchingFeatures' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.matchingFeatures(img,targetImg,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.bigScale + ',' + this.remoteHandler.param1.smallScale + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ',"");\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(result);\r\n';
                // 随机点击
            } else if ('randomClick' === codeType) {
                code = 'utilsObj.randomClick(' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',5,false);\r\n';
                // 灰度化阈值化图片
            } else if ('grayscaleAndThreshold2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.grayscaleAndThreshold2(img,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(result, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.recycleNull(result);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                //灰度化阈值化找图
            } else if ('grayThresholdFindImg2' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let targetImg = images.load("' + this.remoteHandler.param1.previewImg + '");\r\n' +
                    'let result = utilsObj.grayThresholdFindImg2(img,targetImg,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + this.remoteHandler.param1.imgThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.recycleNull(targetImg);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //灰度化、阈值化多点找色
            } else if ('grayThresholdFindMultipleColor2' === codeType) {
                // 获取多点转换参数
                let multipleParam = this.multipleConvert();
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.grayThresholdFindMultipleColor2(img,' + this.remoteHandler.param1.threshold + ',' + this.remoteHandler.param1.maxVal + ',' + multipleParam + ',' + this.remoteHandler.param1.colorThreshold + ',' + this.remoteHandler.param1.isOpenGray + ',' + this.remoteHandler.param1.isOpenThreshold + ');\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //ocr获取文字识别内容字符串结果
            } else if ('ocrGetContentStr' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.ocrGetContentStr(img);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'toastLog(JSON.stringify(result));';
                //ocr获取文字识别内容字符串结果并绘图
            } else if ('ocrGetResultToCanvas' === codeType) {
                code = 'let img = captureScreen();\r\n' +
                    'let result = utilsObj.ocrGetResultToCanvas(img);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'let newFilepath = "/sdcard/autoJsTools/imageHandlerAfter.png";\r\n' +
                    'files.createWithDirs("/sdcard/autoJsTools/");\r\n' +
                    'files.remove(newFilepath);\r\n' +
                    'images.save(result, newFilepath);\r\n' +
                    'toastLog("图片已存入本地:" + newFilepath)\r\n' +
                    'sleep(500);\r\n' +
                    'app.viewFile(newFilepath);\r\n' +
                    'utilsObj.recycleNull(result);\r\n' +
                    'utilsObj.recycleNull(img);\r\n' +
                    'utilsObj.textFindOneClick("仅此一次", 2000);';
                // 绘制方框canvasRect
            } else if ('canvasRect' === codeType) {
                code = 'utilsObj.canvasRect(' + this.remoteHandler.param1.x1 + ',' + this.remoteHandler.param1.y1 + ',' + this.remoteHandler.param1.x2 + ',' + this.remoteHandler.param1.y2 + ',"img","绘图");\r\n';
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