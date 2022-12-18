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
            joinDebug:true,
            expand:true,
            pageSettingArray:[ // 页面设置数组
                {
                    'settingKey':'1080_1920',
                    'expand':true,
                    'width':1080,
                    'height':1920,
                    'relation':{"total": "or", "analysisChart": "or", "multipleColor": "or", "multipleImg": "or" },
                    'analysisChart':[{ "position": [0, 0, 1080, 1920], "threshold": 180, "maxVal": 255, "context": "测试文字", "matchingType": "contains", "isOpenGray": 0, "isOpenThreshold": 0, "canvasMsg": "测试文字" }],
                    'multipleColor':[{ "position": [0, 0, 1080, 1920], "threshold": 25, "maxVal": 255, "color": "#FFFFFF", "colorThreshold": 26, "colorOther": [[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]], "isOpenGray": 1, "isOpenThreshold": 1, "canvasMsg": "测试颜色" }],
                    'multipleImg':[{ "position": [0, 0, 1080, 1920], "threshold": 120, "maxVal": 255, "pathName": "/sdcard/测试找图.png", "imgThreshold": 0.8, "bigScale":1, "smallScale": 1, "featuresThreshold": 0.8, "isOpenGray": 1, "isOpenThreshold": 1, "canvasMsg": "测试找图" }],
                    'analysisChartKey':Math.random(),
                    'multipleColorKey':Math.random(),
                    'multipleImgKey':Math.random(),
                }
            ]
        }
    ]
};

let defaultPageSettingParam = { // 默认页面设置参数
    pageSettingParamName:'pageSetting.json', // 页面设置参数名称
    pageSettingParamArray:[ // 页面设置参数数组
        {
            pageName:'', // 页面名称
            joinDebug:true,
            expand:true,
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
                    'analysisChartKey':Math.random(),
                    'multipleColorKey':Math.random(),
                    'multipleImgKey':Math.random(),
                }
            ]
        }
    ]
};
export default {
    template: template,
    name: 'PageMatching',
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
    computed:{
    },
    data() {
        return {
            sourcePathName:'./res/',
            targetPathName:'/sdcard/appSync/',
            // 页面设置参数对象
            pageSettingParam: JSON.parse(JSON.stringify(defaultPageSettingParam)),
            // 页面设置参数json内容
            pageSettingParamJson:'',
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
        // 远程页面匹配
        remotePageMatching(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.validatePageSetting()){
                return;
            }
            let joinMatchingPageKeysArray = this.pageSettingParam.pageSettingParamArray.filter(item=>item.joinDebug).map(item=>item.pageName);
            let scriptContent = "let pageSetting="+this.convertToJson(true)+";";
            scriptContent += "let allScreenImg = captureScreen();";
            scriptContent += "let joinMatchingPageKeysArray = "+JSON.stringify(joinMatchingPageKeysArray)+";";
            scriptContent += "let matchingPage = utilsObj.multipleConditionMatchingByPageSetting(pageSetting, allScreenImg, joinMatchingPageKeysArray);";
            scriptContent += "toastLog(matchingPage ? '当前匹配页面为'+matchingPage : '未匹配到页面');";
            this.remoteExecuteScript(scriptContent);
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
                        settingObj.analysisChartKey = Math.random();
                        settingObj.multipleColorKey = Math.random();
                        settingObj.multipleImgKey = Math.random();
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
                param.append('pathName', this.deviceInfo.deviceUuid+"/");
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
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/"+this.pageSettingParam.pageSettingParamName,
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