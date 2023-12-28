import {getContext} from "../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/pageMatching.html",
    type: 'get',
    async: false,
    success: function (res) {
        template = String(res);
    }
});
let tableDefaultItem = {
    analysisChart:{ "position": [null, null, null, null], "threshold": null, "maxVal": null, "context": "", "matchingType": "contains", "isOpenGray": 0, "isOpenThreshold": 0, "canvasMsg": null },
    multipleColor:{ "position": [null, null, null, null], "threshold": null, "maxVal": null, "color": "", "colorThreshold": null, "colorOther": [[null, null, null]], "isOpenGray": 0, "isOpenThreshold": 0, "canvasMsg": null },
    multipleImg:{ "position": [null, null, null, null], "threshold": null, "maxVal": null, "pathName": "", "imgThreshold": null, "bigScale":null, "smallScale": null, "featuresThreshold": null, "isOpenGray": 0, "isOpenThreshold": 0, "canvasMsg": null }
};
let defaultPageSettingParamExample = { // 默认页面设置参数 设置
    pageSettingParamName:'pageSetting.json', // 页面设置参数名称
    pageSettingParamArray:[ // 页面设置参数数组
        {
            pageName:'页面1', // 页面名称
            operateScript:'',
            joinDebug:true,
            expand:true,
            pageSettingArray:[ // 页面设置数组
                {
                    'settingKey':'1080_2400',
                    'expand':true,
                    'width':1080,
                    'height':1920,
                    'relation':{"total": "or", "analysisChart": "or", "multipleColor": "or", "multipleImg": "or" },
                    'analysisChart':[{ "position": [0, 0, 1080, 1920], "threshold": 180, "maxVal": 255, "context": "测试文字", "matchingType": "contains", "isOpenGray": 0, "isOpenThreshold": 0, "canvasMsg": "测试文字" }],
                    'multipleColor':[{ "position": [0, 0, 1080, 1920], "threshold": 25, "maxVal": 255, "color": "#FFFFFF", "colorThreshold": 26, "colorOther": [[100, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]], "isOpenGray": 1, "isOpenThreshold": 1, "canvasMsg": "测试颜色" }],
                    'multipleImg':[{ "position": [0, 0, 1080, 1920], "threshold": 120, "maxVal": 255, "pathName": "/sdcard/测试找图.png", "imgThreshold": 0.8, "bigScale":1, "smallScale": 1, "featuresThreshold": 0.8, "isOpenGray": 1, "isOpenThreshold": 1, "canvasMsg": "测试找图" }],
                    'serviceOperateParam':[],
                    'analysisChartKey':Math.random(),
                    'multipleColorKey':Math.random(),
                    'multipleImgKey':Math.random(),
                    'serviceOperateParamKey':Math.random()
                }
            ]
        },{
            pageName:'华仔工具箱页面', // 页面名称
            operateScript:'utilsObj.executeServiceOperate("华仔工具箱页面","点击日志","regionalClickText2");',
            joinDebug:true,
            expand:true,
            pageSettingArray:[ // 页面设置数组
                {
                    'settingKey':'1080_2400',
                    'expand':true,
                    'width':1080,
                    'height':2400,
                    'relation':{"total": "or", "analysisChart": "or", "multipleColor": "or", "multipleImg": "or" },
                    'analysisChart':[{"threshold":60,"maxVal":255,"imgThreshold":0.7,"colorThreshold":26,"bigScale":1,"smallScale":1,"context":"华仔","isOpenGray":0,"isOpenThreshold":0,"position":["36","104","525","200"],"featuresThreshold":0.7,"color":"#009688","colorOther":[[489,96,"#009688"]],"matchingType":"contains"}],
                    'multipleColor':[],
                    'multipleImg':[],
                    'serviceOperateParam':[{'paramKey':'点击日志','paramJson':'{"threshold":60,"maxVal":255,"imgThreshold":0.7,"colorThreshold":26,"bigScale":1,"smallScale":1,"context":"日志","isOpenGray":0,"isOpenThreshold":0,"position":["842","254","1035","321"],"featuresThreshold":0.7,"color":"#009688","colorOther":[[489,96,"#009688"],[806,150,"#009688"],[999,217,"#009688"]]}'}],
                    'analysisChartKey':Math.random(),
                    'multipleColorKey':Math.random(),
                    'multipleImgKey':Math.random(),
                    'serviceOperateParamKey':Math.random()
                }
            ]
        }
    ]
};

let defaultPageSettingParam = { // 默认页面设置参数
    pageSettingParamName:'pageSetting.json', // 页面设置参数名称
    pageSettingParamArray:[ // 页面设置参数数组
        {
            pageName:'未命名页面', // 页面名称
            operateScript:'',// 页面操作代码
            joinDebug:true,
            expand:true,
            scriptExpand: true,
            pageSettingArray:[ // 页面设置数组
                {
                    'settingKey':'',
                    'expand':true,
                    'width':null,
                    'height':null,
                    'relation':{"total": "or", "analysisChart": "or", "multipleColor": "or", "multipleImg": "or" },
                    'analysisChart':[],
                    'multipleColor':[],
                    'multipleImg':[],
                    'serviceOperateParam':[
                        /*{"paramKey": "水晶就绪_识字点击", "paramJson":JSON.stringify({{"position": [784, 761, 1858, 954], "threshold": 60, "maxVal": 255, "context": "就绪", "isOpenGray": 0, "isOpenThreshold": 0, "canvasMsg": "就绪"}}) }
                        */
                    ],// 业务操作参数
                    'analysisChartKey':Math.random(),
                    'multipleColorKey':Math.random(),
                    'multipleImgKey':Math.random(),
                    'serviceOperateParamKey':Math.random()
                }
            ]
        }
    ]
};
export default {
    template: template,
    name: 'PageMatching',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript','forwardFileManage'],
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
    computed:{
    },
    data() {
        return {
            isActive:false,
            arrowArr:{
                commonParam:true,
                jsonParam:true,
                serviceJsonParam:true,
                otherOperate:true
            },
            activePageName:"pageIndex0",// 页面名
            sourcePathName:'./res/',
            targetPathName:'/sdcard/appSync/',
            // 页面设置参数对象
            pageSettingParam: JSON.parse(JSON.stringify(defaultPageSettingParam)),
            // 页面设置参数json内容
            pageSettingParamJson:'',
            // 业务参数json内容
            serviceOperateParamJson: '',
            // 选中行
            selectRowObj: {
                tableName: '',
                pageIndex: 0,
                settingIndex: 0,
                tableIndex: 0,
                row: null,
                rowJs:''
            }
        }
    },
    methods: {
        // 跳转文件管理模块
        forwardFileManageFun(){
            this.forwardFileManage("/system/pageMatching/");
        },
        refreshScrollHeight(){
            let zoomSize = 100;
            let systemConfigCache = window.localStorage.getItem("systemConfig");
            if(systemConfigCache){
                let systemConfigObj = JSON.parse(systemConfigCache);
                if(systemConfigObj){
                    zoomSize = systemConfigObj.zoomSize;
                    this.autoRefreshScreenCapture = systemConfigObj.autoRefreshScreenCapture;
                }
                if(zoomSize<30){
                    zoomSize = 30
                }
            }
            let containers = $(".previewDivContainer");
            if(containers && containers.length){
                for(let i=0;i<containers.length;i++){
                    $(containers[i]).css("height",1500 * zoomSize / 100);
                }
            }
        },
        init(){
            this.refreshScrollHeight();
        },
        //tab页切换
        handleClick(tab, event) {
            console.log(tab, event);
        },
        // 远程页面匹配
        remotePageMatching(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.validatePageSetting()){
                return;
            }
            let joinMatchingPageKeysArray = this.pageSettingParam.pageSettingParamArray.filter(item=>item.joinDebug).map(item=>item.pageName);

            // 操作代码
            let pageOperateScriptObj = {};
            let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
            pageSettingParamArray.forEach((page,pageIndex)=>{
                pageOperateScriptObj[page.pageName]=page.operateScript;
            });
            let remoteScript = `      
 /**
 * 获取业务操作参数
 * @param {*} pageName 页面名称
 * @param {*} operateSymbol 操作标志
 */
utilsObj.getServiceOperateParam = (pageName, operateSymbol) => {
    let serviceOperateParam = ${this.operateConvertToJson()};
    // 获取页面参数
    let pageParam = serviceOperateParam[pageName];
    // 获取业务参数
    let serviceParam = pageParam ? pageParam[operateSymbol] : null
    // 未取到业务参数直接返回
    if (!serviceParam) {
        return null;
    }
    // 获取分辨率对应的值
    let serviceParamObj = serviceParam[device.width + "_" + device.height]
  
    let notNeedConvert = false;
   // 如果当前不是标准的分辨率 且获取到了特定的分辨率的配置
    if(!utilsObj.getIsStandard() && serviceParamObj){
        notNeedConvert = true;
    }
    // 未适配当前设备 则读取标准的
    serviceParamObj = serviceParamObj || serviceParam[commonStorage.get('standardWidth') + "_" + commonStorage.get('standardHeight')]
    serviceParamObj.notNeedConvert = notNeedConvert;
    return serviceParamObj;
}
/**
 * 执行业务操作
 * @param {*} pageName 页面名称
 * @param {*} operateSymbol 操作标志
 * @param {*} functionName 方法名称
 * @param {*} successCall 回调函数
 * @param {*} extendParam 拓展参数
 */
utilsObj.executeServiceOperate = (pageName, operateSymbol, functionName, successCall, extendParam) => {
    // 获取业务参数对象
    let serviceOperateParam = utilsObj.getServiceOperateParam(pageName, operateSymbol);
    if (!serviceOperateParam) {
        // 未获取到直接返回
        return;
    }
    // 截全屏
    let img = captureScreen();

    if (extendParam) {
        Object.assign(serviceOperateParam, extendParam);
    }
    // 设置临时参数
    commonStorage.put("notNeedConvert", serviceOperateParam.notNeedConvert ? true : false)

    // 解构参数
    let { position, context, threshold, maxVal, pathName, imgThreshold, color, colorOther, colorThreshold, matchingCount, transparentMask, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg, openSplit } = serviceOperateParam

    let x1 = position[0];
    let y1 = position[1];
    let x2 = position[2];
    let y2 = position[3];
    let matchingImgPath = pathName;
    let matchingContent = context;
    // 读取图片
    let targetImg = null;

    // 结果
    let result;

    // 根据方法名执行参数
    switch (functionName) {
        // 区域找图
        case "regionalFindImg2":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域找图点击
        case "regionalClickImg2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingImgPath, imgThreshold, isOpenGray, isOpenThreshold, successCall);
            break;
        // 区域文字识别
        case "regionalAnalysisChart2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域文字识别返回对象数组
        case "regionalAnalysisChart3":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg);
            break;    
        // 区域文字识别获取坐标
        case "regionalAnalysisChartPosition2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, openSplit);
            break;
        // 区域文字识别点击
        case "regionalClickText2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, successCall);
            break;
        // 区域文字识别点击 支持多条件匹配
        case "regionalClickText3":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, successCall);
            break;
        // 区域匹配图片
        case "regionalMatchTemplate2":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingCount, transparentMask, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域特征匹配
        case "regionalMatchingFeatures":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域匹配特征
        case "regionalMatchFeaturesTemplate":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, canvasMsg);
            break;
        // 区域多点找色
        case "regionalFindMultipleColor2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域多点找色点击
        case "regionalClickColor2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, successCall);
            break;
        // 区域找图或者特征匹配
        case "regionalFindImgOrFeatures":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域匹配图片或者特征
        case "regionalMatchTemplateOrMatchFeatures":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域找圆
        case "regionalFindCircles2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold);
            break;
        default:
    }
    utilsObj.recycleNull(targetImg);
    // 回收图片
    utilsObj.recycleNull(img);
    // 清除临时参数
    commonStorage.remove("notNeedConvert")
    return result;
}
let pageSetting=${this.convertToJson(true)};
let pageOperateScriptObj=${JSON.stringify(pageOperateScriptObj)};
let allScreenImg = captureScreen();
let joinMatchingPageKeysArray = ${JSON.stringify(joinMatchingPageKeysArray)};
let matchingPage = utilsObj.multipleConditionMatchingByPageSetting(pageSetting, allScreenImg, joinMatchingPageKeysArray);
toastLog(matchingPage ? '当前匹配页面为'+matchingPage : '未匹配到页面');
let pageExecuteScript = matchingPage ? pageOperateScriptObj[matchingPage] : "";
eval(pageExecuteScript);
            `;
            this.remoteExecuteScript(remoteScript);
        },
        // 验证页面参数
        validatePageSetting(){
            let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
            if(!pageSettingParamArray || pageSettingParamArray.length === 0){
                window.ZXW_VUE.$message.warning('请将页面配置补充完整');
                return false;
            }
            let continueFlag = true;
            for(let paramIndex=0;paramIndex<pageSettingParamArray.length;paramIndex++){
                let pageSettingParam =  pageSettingParamArray[paramIndex];
                if(!pageSettingParam.pageName){
                    window.ZXW_VUE.$message.warning('请将第'+(paramIndex+1)+'个页面名称补充完整');
                    continueFlag = false;
                    break;
                }
                let arr = pageSettingParam.pageSettingArray.filter(item=> (this.deviceInfo.standardWidth+"_"+this.deviceInfo.standardHeight) ===  (item.width+"_"+item.height));
                if(!arr || arr.length === 0){
                    window.ZXW_VUE.$message.warning('第'+(paramIndex+1)+'个页面必须设置标准分辨率');
                    continueFlag = false;
                    break;
                }
                let pageSettingArray = pageSettingParam.pageSettingArray;
                for(let settingIndex=0;settingIndex<pageSettingArray.length;settingIndex++){
                    let pageSetting = pageSettingArray[settingIndex];
                    let analysisChart = pageSetting.analysisChart;
                    // 获取未校验通过的数组
                    let notValid1 = analysisChart.filter(item=>{
                        return  item.position[0] === null || item.position[1] === null || item.position[2] === null || item.position[3] === null || !item.threshold || !item.maxVal || !item.context
                    });
                    if(notValid1 && notValid1.length > 0){
                        window.ZXW_VUE.$message.warning('请将第'+(paramIndex+1)+'个页面的文字识别参数补充完整');
                        continueFlag = false;
                        break;
                    }
                    let multipleColor = pageSetting.multipleColor;
                    // 获取未校验通过的数组
                    let notValid2 = multipleColor.filter(item=>{
                        return   item.position[0] === null || item.position[1] === null || item.position[2] === null || item.position[3] === null || !item.threshold || !item.maxVal || !item.color || !item.colorThreshold || !item.colorOther;
                    });
                    if(notValid2 && notValid2.length > 0){
                        window.ZXW_VUE.$message.warning('请将第'+(paramIndex+1)+'个页面的多点找色参数补充完整');
                        continueFlag = false;
                        break;
                    }
                    let multipleImg = pageSetting.multipleImg;
                    // 获取未校验通过的数组
                    let notValid3 = multipleImg.filter(item=>{
                        return   item.position[0] === null || item.position[1] === null || item.position[2] === null || item.position[3] === null || !item.threshold || !item.maxVal || !item.imgThreshold || !item.bigScale || !item.smallScale || !item.featuresThreshold;
                    });
                    if(notValid3 && notValid3.length > 0){
                        window.ZXW_VUE.$message.warning('请将第'+(paramIndex+1)+'个页面的区域找图参数补充完整');
                        continueFlag = false;
                        break;
                    }
                }
            }
            return continueFlag;
        },
        // 打开json内容弹出层
        openJsonContentPopover(tableName,pageIndex,settingIndex,tableIndex){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let tableArr = pageSetting[tableName];
            if(tableIndex === -1){
                let rows = JSON.parse(JSON.stringify(tableArr));
                let rowJs = JSON.stringify(rows);
                this.selectRowObj  = {
                    tableName:tableName,
                    pageIndex:pageIndex,
                    settingIndex:settingIndex,
                    tableIndex:tableIndex,
                    row:rows,
                    rowJs:rowJs
                };
                this.$refs['jsonContentPopover'].doShow();
                return;
            }
            let row = JSON.parse(JSON.stringify(tableArr[tableIndex]));
            let rowJs = JSON.stringify(row);
            this.selectRowObj  = {
                tableName:tableName,
                pageIndex:pageIndex,
                settingIndex:settingIndex,
                tableIndex:tableIndex,
                row:row,
                rowJs:rowJs
            };
            this.$refs['jsonContentPopover'].doShow();
        },
        // 从json读取内容
        readJsonContentPopover(){
            let rowJs = this.selectRowObj.rowJs;
            let row = JSON.parse(rowJs);
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[this.selectRowObj.pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[this.selectRowObj.settingIndex];
            if(this.selectRowObj.tableIndex === -1){
                pageSetting[this.selectRowObj.tableName] = row;
            } else {
                pageSetting[this.selectRowObj.tableName][this.selectRowObj.tableIndex] = row;
            }
            this.$refs['jsonContentPopover'].doClose();
            pageSetting[this.selectRowObj.tableName+"Key"] = Math.random();
        },
        // 关闭json内容弹出层
        closeJsonContentPopover(){
            this.selectRowObj= {
                tableName: '',
                pageIndex: 0,
                settingIndex: 0,
                tableIndex: 0,
                row: null,
                rowJs:''
            };
            this.$refs['jsonContentPopover'].doClose();
        },
        // 转换json
        convertToJson(needReplacePath){
            let pageSettingParamJson = "";
            try{
                // 创建对象
                let jsonObj = {};
                // 设置名称
                let pageSettingParamName = this.pageSettingParam.pageSettingParamName;
                let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
                pageSettingParamArray.forEach((page,pageIndex)=>{
                    let pageSettingArray = page.pageSettingArray;
                    // 页面对象
                    let pageObj  = {};
                    pageSettingArray.forEach((pageSetting,settingIndex)=>{
                        // 设置key
                        let settingKey = pageSetting.width + "_" + pageSetting.height;
                        // 设置对象
                        let settingObj = {};
                        settingObj.relation = pageSetting.relation;
                        settingObj.analysisChart = pageSetting.analysisChart;
                        settingObj.multipleColor = pageSetting.multipleColor;
                        settingObj.multipleImg = JSON.parse(JSON.stringify(pageSetting.multipleImg));
                        if(needReplacePath){
                            settingObj.multipleImg.forEach(item=>{
                                item.pathName = item.pathName.replace(this.sourcePathName,this.targetPathName)
                            })
                        }
                        pageObj[settingKey] = settingObj;
                    });
                    // 页面对象
                    jsonObj[page.pageName] = pageObj
                });
                pageSettingParamJson = JSON.stringify(jsonObj);
            }catch (e) {
                console.error(e);
            }
            return pageSettingParamJson;
        },
        // 转换js
        convertToJs(){
            // 目标对象
            let pageSettingParam = null;
            if(!this.pageSettingParamJson){
                return null;
            }
            try{
                let jsObj = JSON.parse(this.pageSettingParamJson);
                // 目标对象
                let targetObj = {};
                // 页面设置参数数组
                let pageSettingParamArray = [];
                // 获取全部的页面名称
                let pageKeyArr = Object.keys(jsObj);
                pageKeyArr.forEach(pageKey=>{
                    let pageSettingParam = {};
                    // 页面配置对象
                    let pageSetting = jsObj[pageKey];
                    pageSettingParam.pageName = pageKey;
                    pageSettingParam.joinDebug = true;
                    pageSettingParam.expand = true;

                    let pageSettingArray = [];
                    // 获取全部的分辨率key数组
                    let pageSettingKeyArr = Object.keys(pageSetting);
                    pageSettingKeyArr.forEach(pageSettingKey=>{
                        // 设置对象
                        let setting = pageSetting[pageSettingKey];
                        let settingObj = {};
                        let pageSettingKeyArr = pageSettingKey.split("_");
                        settingObj.settingKey = pageSettingKey;
                        settingObj.expand = true;
                        settingObj.width = pageSettingKeyArr[0];
                        settingObj.height = pageSettingKeyArr[1];
                        settingObj.relation = setting.relation;
                        settingObj.analysisChart = setting.analysisChart;
                        settingObj.multipleColor = setting.multipleColor;
                        settingObj.multipleImg = setting.multipleImg;
                        settingObj.serviceOperateParam = [];
                        settingObj.analysisChartKey = Math.random();
                        settingObj.multipleColorKey = Math.random();
                        settingObj.multipleImgKey = Math.random();
                        settingObj.serviceOperateParamKey = Math.random();
                        pageSettingArray.push(settingObj);
                    });
                    pageSettingParam.pageSettingArray = pageSettingArray;
                    pageSettingParamArray.push(pageSettingParam);
                });
                targetObj.pageSettingParamName = 'pageSetting.json';
                targetObj.pageSettingParamArray = pageSettingParamArray;
                pageSettingParam = JSON.parse(JSON.stringify(targetObj));
            }catch (e) {
                console.error(e);
            }
            return pageSettingParam;
        },
        // 设置转换json
        settingToJson(){
            this.pageSettingParamJson = this.convertToJson();
            if(this.pageSettingParamJson){
                window.ZXW_VUE.$notify.success({message: '转换成功', duration: '1000'});
            } else {
                window.ZXW_VUE.$notify.error({message: '转换失败！', duration: '1000'})
            }
        },
        // json转换设置
        jsonToSetting(){
            let pageSettingParam = this.convertToJs();
            if(pageSettingParam && Object.keys(pageSettingParam).length){
                this.pageSettingParam = pageSettingParam;
                window.ZXW_VUE.$notify.success({message: '转换成功', duration: '1000'});
            } else {
                window.ZXW_VUE.$notify.error({message: '转换失败！', duration: '1000'})
            }
        },
        operateConvertToJson(){
            let serviceOperateParamObj = {};
            try{
                // 遍历对象
                this.pageSettingParam.pageSettingParamArray.forEach((page,pageIndex)=>{
                    let pageName = page.pageName;
                    let serviceOperateParam = {};
                    page.pageSettingArray.forEach((pageSetting,pageSettingIndex)=>{
                        // 获取该分辨率下的业务参数
                        let serviceOperateParamArr = pageSetting.serviceOperateParam;
                        // 分辨率值
                        let widthHeight = pageSetting.width+'_'+pageSetting.height;
                        // 遍历业务操作参数
                        serviceOperateParamArr.forEach(operateParam=>{
                            // 获取参数key
                            let paramKey = operateParam['paramKey'];
                            // 获取参数json
                            let paramJson = operateParam['paramJson'];
                            // 获取参数对象
                            let paramObj = serviceOperateParam[paramKey]||{};
                            // 获取分辨率对应参数
                            let widthHeightObj = paramObj[widthHeight];
                            // 设置参数
                            paramObj[widthHeight] = widthHeightObj || (paramJson ? JSON.parse(paramJson) : {});
                            // 处理图片
                            let pathName = paramObj[widthHeight].pathName || "";
                            pathName = pathName.replace(this.sourcePathName,this.targetPathName);
                            paramObj[widthHeight].pathName = pathName;
                            // 重新赋值
                            serviceOperateParam[paramKey] = paramObj;
                        })

                    });
                    // 赋值对象
                    serviceOperateParamObj[pageName] = serviceOperateParam;
                });
            }catch (e) {
                console.error(e);
            }
            if(serviceOperateParamObj && Object.keys(serviceOperateParamObj).length){
                return JSON.stringify(serviceOperateParamObj);
            }
            return "";
        },
        // 业务参数配置转换为json
        serviceOperateParamToJson(){
            let serviceOperateParamJson = this.operateConvertToJson();
            if(serviceOperateParamJson){
                this.serviceOperateParamJson = serviceOperateParamJson;
                window.ZXW_VUE.$notify.success({message: '转换成功', duration: '1000'});
            } else {
                window.ZXW_VUE.$notify.error({message: '转换失败！', duration: '1000'})
            }
        },
        // json转换为业务参数配置
        jsonToServiceOperateParam(){
            // 获取业务操作配置对象
            let paramJsonPageObj = JSON.parse(this.serviceOperateParamJson);

           // 获取所有的页面配置
           let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
            pageSettingParamArray.forEach((page,pageIndex)=>{
                // 获取页面名称
                let pageName = page.pageName;
                // 获取当前页面key的业务操作参数
                let paramServiceOperatePageObj = paramJsonPageObj[pageName];
                // 当前有这个业务操作参数
                if(paramServiceOperatePageObj){
                    // 获取业务名称key数组
                    let serviceKeyArr = Object.keys(paramServiceOperatePageObj) || [];

                    // 遍历业务设置数组
                    page.pageSettingArray.forEach((pageSetting,pageSettingIndex)=>{
                        // 业务操作参数对象
                        let serviceOperateParam = pageSetting.serviceOperateParam||[];
                        // 获取keys
                        let serviceOperateParamKeys = serviceOperateParam.map(item=>item.paramKey);
                        // 分辨率
                        let widthHeight = pageSetting.width + '_' + pageSetting.height;
                        // 遍历业务名称key数组
                        serviceKeyArr.forEach(serviceKey=>{
                            let serviceParam = paramServiceOperatePageObj[serviceKey];
                            // 获取分辨率对应参数
                            let widthHeightObj = serviceParam[widthHeight];
                            // 分辨率参数有值
                            if(widthHeightObj && !serviceOperateParamKeys.includes(serviceKey)){
                                serviceOperateParam.push({
                                    "paramKey":serviceKey,
                                    "paramJson":JSON.stringify(widthHeightObj)
                                });
                            }
                        });
                        // 重新赋值
                        pageSetting.serviceOperateParam = serviceOperateParam;
                    })
                }
            });
            window.ZXW_VUE.$notify.success({message: '转换成功', duration: '1000'});
        },
        // 展开全部
        expandAll(){
            let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
            pageSettingParamArray.forEach(pageSettingParam=>{
                pageSettingParam.expand = true;
                let pageSettingArray = pageSettingParam.pageSettingArray;
                pageSettingArray.forEach(setting=>{
                    setting.expand = true;
                })
            })
        },
        // 收起全部
        packUpAll(){
            let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
            pageSettingParamArray.forEach(pageSettingParam=>{
                pageSettingParam.expand = false;
                let pageSettingArray = pageSettingParam.pageSettingArray;
                pageSettingArray.forEach(setting=>{
                    setting.expand = false;
                })
            })
        },
        // 初始化页面参数配置
        initPageSettingParam(){
            window.ZXW_VUE.$confirm('是否确认初始化参数配置示例?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.pageSettingParam = JSON.parse(JSON.stringify(defaultPageSettingParamExample));
                window.ZXW_VUE.$notify.success({message: '初始化成功', duration: '1000'});
            });
        },
        // 写入标准分辨率
        writeStandWidthHeight(setting){
            if (!this.validSelectDevice()) {
                return;
            }
            setting.width = this.deviceInfo.standardWidth;
            setting.height = this.deviceInfo.standardHeight;
        },
        // 添加页面
        addPage(pageIndex){
            let obj = JSON.parse(JSON.stringify(defaultPageSettingParam.pageSettingParamArray[0]));
            obj.pageName = "未命名页面";
            obj.pageSettingArray.forEach(setting=>{
                setting.analysisChartKey = Math.random();
                setting.multipleColorKey = Math.random();
                setting.multipleImgKey = Math.random();
            });
            this.pageSettingParam.pageSettingParamArray.splice(pageIndex + 1, 0, obj);
            window.ZXW_VUE.$notify.success({message: '添加成功', duration: '1000'});
        },
        // 删除页面
        deletePage(pageIndex){
            let pageSettingParamArray = this.pageSettingParam.pageSettingParamArray;
            if(pageSettingParamArray.length === 1){
                window.ZXW_VUE.$message.warning('请至少保留一个页面配置');
                return false;
            }
            let param = pageSettingParamArray[pageIndex];
            window.ZXW_VUE.$confirm('是否确认删除'+param.pageName+'页面配置?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.pageSettingParam.pageSettingParamArray.splice(pageIndex, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
            });
        },
        // 添加分辨率
        addWidthHeight(pageIndex,settingIndex){
            let obj = JSON.parse(JSON.stringify(defaultPageSettingParam.pageSettingParamArray[0].pageSettingArray[0]));
            obj.analysisChartKey = Math.random();
            obj.multipleColorKey = Math.random();
            obj.multipleImgKey = Math.random();
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSettingArray = pageSettingParam.pageSettingArray;
            pageSettingArray.splice(settingIndex + 1, 0 ,obj);
        },
        // 删除分辨率
        deleteWidthHeight(pageIndex,settingIndex){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSettingArray = pageSettingParam.pageSettingArray;
            if(pageSettingArray.length === 1){
                window.ZXW_VUE.$message.warning('请至少保留一个分辨率配置');
                return false;
            }
            let param = pageSettingArray[settingIndex];
            window.ZXW_VUE.$confirm('是否确认删除'+param.settingKey+'分辨率配置?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                pageSettingArray.splice(pageIndex, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
            });
        },
        // 表格添加行
        tableAddRow(tableName,pageIndex,settingIndex,index){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let tableArr = pageSetting[tableName];
            let defaultObj = tableDefaultItem[tableName];
            if(index === -1){
                tableArr.push(JSON.parse(JSON.stringify(defaultObj)));
            } else {
                tableArr.splice(index + 1, 0 ,JSON.parse(JSON.stringify(defaultObj)));
            }
        },
        // 表格删除行
        tableDeleteRow(tableName,pageIndex,settingIndex,index){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let tableArr = pageSetting[tableName];
            window.ZXW_VUE.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                tableArr.splice(index, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
            });

        },
        // 业务参数添加行
        serviceOperateAddRow(pageIndex,settingIndex,index){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let serviceOperateParam = pageSetting['serviceOperateParam'];
            let defaultObj = {"paramKey":"","paramJson":""};
            if(index === -1){
                serviceOperateParam.push(JSON.parse(JSON.stringify(defaultObj)));
            } else {
                serviceOperateParam.splice(index + 1, 0 ,JSON.parse(JSON.stringify(defaultObj)));
            }
        },
        // 业务参数删除行
        serviceOperateDeleteRow(pageIndex,settingIndex,index){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let serviceOperateParam = pageSetting['serviceOperateParam'];
            window.ZXW_VUE.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                serviceOperateParam.splice(index, 1);
                window.ZXW_VUE.$notify.success({message: '删除成功', duration: '1000'});
            });
        },
        // 颜色其他值添加行
        colorOtherAddRow(pageIndex,settingIndex,tableIndex,index){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let item = pageSetting.multipleColor[tableIndex];
            let colorOther = item.colorOther;
            if(index === -1){
                colorOther.push([null,null,'']);
            } else {
                colorOther.splice(index + 1, 0 ,[null,null,'']);
            }
        },
        // 颜色其他值删除行
        colorOtherDeleteRow(pageIndex,settingIndex,tableIndex,index){
            let pageSettingParam = this.pageSettingParam.pageSettingParamArray[pageIndex];
            let pageSetting = pageSettingParam.pageSettingArray[settingIndex];
            let item = pageSetting.multipleColor[tableIndex];
            let colorOther = item.colorOther;
            colorOther.splice(index, 1);
        },
        // 添加行
        addRow(){
            this.tempCustomScript.push({ moduleName: '', scriptName: '' })
        },
        // 删除行
        delRow(index) {
            // 删除行数据
            this.tempCustomScript.splice(index, 1)
        },
        // 清空脚本
        clearScript() {
            this.remoteHandler.param4.scriptText = '';
        },
        // 保存到草稿
        saveToDraft(){
            if(!this.pageSettingParam.pageSettingParamName){
                window.ZXW_VUE.$message.warning('请填写页面配置名称');
                return false;
            }
            window.localStorage.setItem("pageSettingParam_"+this.pageSettingParam.pageSettingParamName,JSON.stringify(this.pageSettingParam));
            window.ZXW_VUE.$notify.success({message: '保存草稿成功', duration: '1000'});
        },
        // 从草稿读取
        readForDraft(){
            if(!this.pageSettingParam.pageSettingParamName){
                window.ZXW_VUE.$message.warning('请填写页面配置名称');
                return false;
            }
            let pageSettingParamJson = window.localStorage.getItem("pageSettingParam_"+this.pageSettingParam.pageSettingParamName);
            if(!pageSettingParamJson){
                window.ZXW_VUE.$message.warning('未发现草稿信息');
                return false;
            }
            this.pageSettingParam = JSON.parse(pageSettingParamJson);
            window.ZXW_VUE.$notify.success({message: '读取草稿成功', duration: '1000'});
        },
        // 存为文件
        saveToFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.pageSettingParam.pageSettingParamName){
                window.ZXW_VUE.$message.warning('请填写页面配置名称');
                return false;
            }
            window.ZXW_VUE.$confirm('是否确认将当前页面配置存为' + this.pageSettingParam.pageSettingParamName + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let pageSettingFile = new File([JSON.stringify(this.pageSettingParam)], this.pageSettingParam.pageSettingParamName, {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', pageSettingFile);
                param.append('pathName', this.deviceInfo.deviceUuid+"/system/pageMatching/");
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
        },
        // 从文件读取
        readForFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.pageSettingParam.pageSettingParamName){
                window.ZXW_VUE.$message.warning('请填写页面配置名称');
                return false;
            }
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/system/pageMatching/"+this.pageSettingParam.pageSettingParamName + "?t="+(new Date().getTime()),
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    let pageSettingParamJson = String(res);
                    if(pageSettingParamJson){
                        _that.pageSettingParam = JSON.parse(pageSettingParamJson);
                        window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'});
                    } else {
                        window.ZXW_VUE.$notify.error({message: '文件内容为空', duration: '1000'});
                    }
                },
                error: function (msg) {
                    console.log(msg);
                    window.ZXW_VUE.$notify.error({message: _that.pageSettingParam.pageSettingParamName+'文件不存在', duration: '1000'});
                }
            });
        }
    }
}