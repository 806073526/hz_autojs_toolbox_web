import {getContext, sortByKey} from "./../../../utils/utils.js";
let template='<div></div>';
$.ajax({
    url: "/module/index/template/layoutAnalysis.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});
export default {
    template: template,
    name: 'LayoutAnalysis',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript','copyToClipboard'],
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
            default: '竖屏'
        }
    },
    data() {
        return {
            isActive:false,
            arrowArr:{
                commonParam:true,
                otherParam:true,
                scriptPreview:true,
                jsonParam:true,
                otherOperate:true
            },
            defaultExpandedKeys:[],// 默认展开节点key数组
            layoutLoading:false,
            remoteHandler: {
                param5: {
                    rootNodeJson: '',
                    rootNodeObj: [],
                    filterRootNodeObj:[],// 条件过滤数据
                    rootOneNodeArr:[],// 一维节点数组
                    filterFunction:'(dataArr)=>{return dataArr.filter(item=>item.depth === 1);}',
                    openCustomFilterFunction:false,// 开启自定义过滤函数处理
                    nodeKeyArr: [],// key数组
                    selectNode: {},
                    rectCanvasArr: [],// 绘制方框数组
                    highlightRect: null,// 高亮方框
                    dialogVisible: false,
                    isOnlyShowVisible: true,
                    isOnlyShowInScreen: true,
                    isShowBgImg: true,
                    checkAll: false,//全选
                    scriptPreview: '',// 代码预览
                    openClickGenerateCode: true,// 开启点击生成代码
                    layoutAnalysisRange:'active',// 布局分析范围 active活跃窗口 all全部窗口
                    nodeInfo: '',// 节点信息
                    uiSelect: ['id', 'text', 'desc', 'className'],// ui选择器
                    uiSelectCondition: 'findOnce',// ui选择器条件
                    uiSelectAction: 'clickCenter',// 动作
                    checkStrictly: true,// 父子相关联
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    },
                    nodeType: 'tree',
                    uiSelectConditionOption:[
                        {label:'找到findOnce', value:'findOnce',},
                        {label:'找到一个(阻塞)findOne', value:'findOne',},
                        {label:'找到所有untilFind', value:'untilFind',},
                        {label:'等待出现waitFor', value:'waitFor',},
                        {label:'存在exists', value:'exists',},
                        {label:"空", value:null,}
                    ],
                    uiSelectActionOption:[
                        {label:'点击中心clickCenter', value:'clickCenter',},
                        {label:'点击click', value:'click',},
                        {label:'长按longClick', value:'longClick',},
                        {label:"空", value:null,}
                    ],
                    layoutAnalysisRangeOption:[

                        {label:'活跃窗口', value:'active',},
                        {label:'全部窗口', value:'all',},
                    ],
                }
            },
            commonCustomFilterFunction:[
                { name:'深度过滤(depth)',code:'(dataArr)=>{return dataArr.filter(item=>item.depth === 1);}' },
                { name:'可点击过滤(clickable)',code:'(dataArr)=>{return dataArr.filter(item=>item.clickable);}' },
                { name:'可长按过滤(longClickable)',code:'(dataArr)=>{return dataArr.filter(item=>item.longClickable);}' },
                { name:'可滚动过滤(scrollable)',code:'(dataArr)=>{return dataArr.filter(item=>item.scrollable);}' },
                { name:'有文字过滤(text)',code:'(dataArr)=>{return dataArr.filter(item=>item.text);}' },
                { name:'有描述过滤(desc)',code:'(dataArr)=>{return dataArr.filter(item=>item.desc);}' },
            ]
        }
    },
    computed: {
        param5DialogVisible() {
            return this.remoteHandler.param5.dialogVisible;
        },
        // 根节点数组
        rootNodeObjArr(){
            if(this.remoteHandler.param5.openCustomFilterFunction){
                return this.remoteHandler.param5.filterRootNodeObj;
            } else {
                return this.remoteHandler.param5.rootNodeObj;
            }
        },
    },
    watch: {
        param5DialogVisible(val) {
            if (val) {
                $(".nodeDetailDiv").on("click", ".contentClass", this.nodeContentClick);
            } else {
                $(".nodeDetailDiv").off("click");
            }
        }
    },
    methods: {
        refreshScrollHeight(){
            let zoomSize = 100;
            let systemConfigCache = window.localStorage.getItem("systemConfig");
            if(systemConfigCache){
                let systemConfigObj = JSON.parse(systemConfigCache);
                if(systemConfigObj){
                    zoomSize = systemConfigObj.zoomSize;
                }
                if(zoomSize<30){
                    zoomSize = 30
                }
            }
            let containers = $(".layoutDivContainer");
            if(containers && containers.length){
                for(let i=0;i<containers.length;i++){
                    $(containers[i]).css("height",1500 * zoomSize / 100);
                }
            }
        },
        init(){
          this.refreshScrollHeight();
        },
        // 开启自定义过滤函数处理开关change
        openCustomFilterFunctionChange(){
            this.remoteHandler.param5.filterRootNodeObj = [];
            // 是否开启自定义节点过滤
            let openCustomFilterFunction = this.remoteHandler.param5.openCustomFilterFunction;
            // 开启了节点过滤 且 已挂载自定义节点过滤方法
            if(openCustomFilterFunction){
                if(!window.customFilterFunction){
                    // 获取代码内容
                    let scriptContent = "window.customFilterFunction="+this.remoteHandler.param5.filterFunction;
                    // 执行代码
                    eval(scriptContent);
                }
                this.remoteHandler.param5.filterRootNodeObj = window.customFilterFunction(this.remoteHandler.param5.rootOneNodeArr);
            }
        },
        // 递归获取子节点
        recursionNodeArr(allChildNodeArr,childNodeObj){
            // 获取子节点数组
            let children = childNodeObj.children ? childNodeObj.children : [];
            if(children && children.length){
                for (let i = 0; i < children.length; i++) {
                    // 获取子节点
                    let childNode = children[i];
                    // 递归获取子节点
                    this.recursionNodeArr(allChildNodeArr,childNode);
                }
            }
            let copyObj = JSON.parse(JSON.stringify(childNodeObj));
            copyObj.children = [];
            allChildNodeArr.push(copyObj);
        },
        // 生成常用自定义过滤函数代码
        generateCommonCustomFilterFunction(code){
            this.remoteHandler.param5.filterFunction = code;
            // 获取代码内容
            let scriptContent = "window.customFilterFunction="+this.remoteHandler.param5.filterFunction;
            // 执行代码
            eval(scriptContent);
            setTimeout(()=>{
                // 触发过滤
                this.openCustomFilterFunctionChange();
            },200);
            window.ZXW_VUE.$notify.success({message: '操作成功', duration: '1000'})
        },
        // 保存自定义过滤函数
        loadCustomFilterFunction(){
            // 获取代码内容
            let scriptContent = "window.customFilterFunction="+this.remoteHandler.param5.filterFunction;
            // 执行代码
            eval(scriptContent);
            setTimeout(()=>{
                // 触发过滤
                this.openCustomFilterFunctionChange();
            },200);
            window.ZXW_VUE.$notify.success({message: '执行成功', duration: '1000'})
        },

        // 仅显示可见控件方法
        onlyShowVisible() {
            // 重置key数组
            this.remoteHandler.param5.nodeKeyArr = [];
            this.$refs.nodeTree.filter();
        },
        // 仅显示屏幕范围内控件
        onlyShowInScreen() {
            // 重置key数组
            this.remoteHandler.param5.nodeKeyArr = [];
            this.$refs.nodeTree.filter();
        },
        // 绘制背景图片
        showDrawBgImg() {
            // 获取已选中的节点
            let checkedNodes = this.$refs.nodeTree.getCheckedNodes();
            // 重新绘图
            this.rectNodeToCanvas(checkedNodes);
        },
        // 全选控件
        checkAllNode() {
            this.$refs.nodeTree.setCheckedKeys(this.remoteHandler.param5.checkAll ? this.remoteHandler.param5.nodeKeyArr : []);
            // 获取已选中的节点
            let checkedNodes = this.$refs.nodeTree.getCheckedNodes();
            // 重新绘图
            this.rectNodeToCanvas(checkedNodes);
        },
        // 控件过滤
        filterNode(value, data) {
            let nodeKeyArr = this.remoteHandler.param5.nodeKeyArr || [];
            let maxWidth = this.screenDirection === "竖屏" ? this.deviceInfo.screenWidth : this.deviceInfo.screenHeight;
            let maxHeight = this.screenDirection === "竖屏" ? this.deviceInfo.screenHeight : this.deviceInfo.screenWidth;
            let isOverScreen = false;
            let boundsInfo = data.boundsInfo;
            this.remoteHandler.param5.nodeKeyArr.push(data.nodeKey);
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
            // 两个条件同时满足
            if (this.remoteHandler.param5.isOnlyShowVisible && this.remoteHandler.param5.isOnlyShowInScreen) {
                // 节点可见 且  没有超过范围的
                /*if(data.visible && !isOverScreen && !nodeKeyArr.includes(data.nodeKey)){
                    nodeKeyArr.push(data.nodeKey);
                }
                this.remoteHandler.param5.nodeKeyArr = nodeKeyArr;*/
                return data.visible && !isOverScreen;
                // 可见节点过滤
            } else if (this.remoteHandler.param5.isOnlyShowVisible) {
                /*if(data.visible && !nodeKeyArr.includes(data.nodeKey)){
                    nodeKeyArr.push(data.nodeKey);
                }
                this.remoteHandler.param5.nodeKeyArr = nodeKeyArr;*/
                return data.visible;
                // 屏幕范围内节点过滤
            } else if (this.remoteHandler.param5.isOnlyShowInScreen) {
                // 没有超过范围的
                /*if(!isOverScreen && !nodeKeyArr.includes(data.nodeKey)){
                    nodeKeyArr.push(data.nodeKey);
                }
                this.remoteHandler.param5.nodeKeyArr = nodeKeyArr;*/
                return !isOverScreen;
            } else {
                // 正常节点处理
                /* if(!nodeKeyArr.includes(data.nodeKey)){
                     nodeKeyArr.push(data.nodeKey);
                 }
                 this.remoteHandler.param5.nodeKeyArr = nodeKeyArr;*/
            }
            return true;
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
        // 一键远程布局分析
        remoteLayoutAnalysisOneKey(){
            if (!this.validSelectDevice()) {
                return
            }
            this.layoutLoading = true;
            this.clearNodeJson();
            let remoteScript = `auto.clearCache();
            /**
             * 远程上传根节点json到服务器
             */
            utilsObj.remoteUploadRootNodeJsonToServer = () => {
                let localPathName = "/sdcard/autoJsTools/rootNode.json"
                // 调用远程上传文件方法
                utilsObj.uploadFileToServer(localPathName, deviceUUID + "/system/layoutAnalysis/" + "rootNode.json", (remoteRootURL) => {
                    if (commonStorage.get("debugModel")) {
                        console.log("远程节点地址：" + remoteRootURL)
                    }
                })
            }
            /**
             * 上传节点预览图片
             */
            utilsObj.uploadNodePreviewImg = () => {
                // 唤醒设备
                device.wakeUpIfNeeded();
                // 申请 截图权限
                utilsObj.requestScreenCaptureCommonFun(()=>{
                    let img = images.captureScreen()
                    let tempImgPath = '/sdcard/screenImg/nodePreviewImg.jpg'
                    files.createWithDirs("/sdcard/screenImg/")
                    // 临时图片路径
                    files.remove(tempImgPath)
                    sleep(10)
                    images.save(img, tempImgPath, "jpg", "100");
                    utilsObj.uploadFileToServer(tempImgPath, deviceUUID + '/system/layoutAnalysis/nodePreviewImg.jpg', (a) => {
                    })
                    img.recycle()
                })
            }
            utilsObj.getRootNodeWriteLocal("tree","${this.remoteHandler.param5.layoutAnalysisRange}");
            utilsObj.remoteUploadRootNodeJsonToServer();
            utilsObj.uploadNodePreviewImg();`;
            this.remoteExecuteScript(remoteScript);

            let fileNoChangeCount = 0;//连续未变化次数
            let startFlag = false; //开始处理标志

            let fileNoChangeCountImg = 0; // 图片连续未变化次数
            let startFlagImg = false; // 图片开始处理标志

            // 节点
            let relativeFilePath = this.deviceInfo.deviceUuid + "/system/layoutAnalysis/rootNode.json";
            // 图片
            let relativeFilePathImg = this.deviceInfo.deviceUuid + "/system/layoutAnalysis/nodePreviewImg.jpg";

            // 原始文件信息
            let sourceFileInfo = this.getFileInfoByPath(relativeFilePath);
            let sourceFileSize = sourceFileInfo ? sourceFileInfo.fileSize : 0;
            let sourceLastUpdateTime = sourceFileInfo ? sourceFileInfo.lastUpdateTime : '';

            // 图片原始文件信息
            let sourceFileInfoImg = this.getFileInfoByPath(relativeFilePathImg);
            let sourceFileSizeImg = sourceFileInfoImg ? sourceFileInfoImg.fileSize : 0;
            let sourceLastUpdateTimeImg = sourceFileInfoImg ? sourceFileInfoImg.lastUpdateTime : '';


            let reConnectCount = 0;
            // 每隔200毫秒执行一次查询
            let refreshTimer = setInterval(()=>{
                if(reConnectCount > 60){
                    reConnectCount = 0;
                    this.layoutLoading = false;
                    window.ZXW_VUE.$message.warning('一键布局分析超时,请重试或检查APP后台运行权限！');
                    clearInterval(refreshTimer);
                }

                // 当前文件信息
                let curFileInfo = this.getFileInfoByPath(relativeFilePath);
                let curFileSize = curFileInfo ? curFileInfo.fileSize : 0;
                let curLastUpdateTime = curFileInfo ? curFileInfo.lastUpdateTime : '';

                // 图片当前文件信息
                let curFileInfoImg = this.getFileInfoByPath(relativeFilePathImg);
                let curFileSizeImg = curFileInfoImg ? curFileInfoImg.fileSize : 0;
                let curLastUpdateTimeImg = curFileInfoImg ? curFileInfoImg.lastUpdateTime : '';

                if(sourceFileSize !== curFileSize || sourceLastUpdateTime !== curLastUpdateTime){
                    // 内容有变化时开始记录
                    startFlag = true;
                }
                if(sourceFileSizeImg !== curFileSizeImg || sourceLastUpdateTimeImg !== curLastUpdateTimeImg){
                    // 内容有变化时开始记录
                    startFlagImg = true;
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

                // 图片有一次变化后 文件大小和时间连续没有变化
                if(sourceFileSizeImg === curFileSizeImg && sourceLastUpdateTimeImg === curLastUpdateTimeImg && startFlagImg){
                    // 文件未变化计数加一
                    fileNoChangeCountImg++;
                } else {
                    sourceFileSizeImg = curFileSizeImg;
                    sourceLastUpdateTimeImg = curLastUpdateTimeImg;
                    fileNoChangeCountImg = 0;// 重置次数
                }

                // 200*3 0.6秒钟未变化 认为节点和图片 都上传完成
                if(fileNoChangeCount >= 3 && fileNoChangeCountImg>=3){
                    // 执行加载图片
                    this.loadNodeJson();
                    setTimeout(()=>{
                        this.layoutLoading = false;
                        this.$nextTick(()=>{
                            this.remoteHandler.param5.checkAll = true;
                            this.checkAllNode();
                        })
                    },200);
                    // 关闭定时器
                    clearInterval(refreshTimer);
                    refreshTimer = null;
                }
                // 累计次数
                reConnectCount+=1;
            },200);

        },
        // 远程布局分析
        remoteLayoutAnalysis() {
            if (!this.validSelectDevice()) {
                return
            }
            // 发送指令并上传文件
            this.remoteExecuteScript('auto.clearCache();utilsObj.getRootNodeWriteLocal("tree","'+this.remoteHandler.param5.layoutAnalysisRange+'");');
        },
        // 远程限制应用布局分析
        remoteLimitLayoutAnalysis() {
            window.ZXW_VUE.$message.warning('客户端APP未去限制时,才需要使用该功能！');
            // 发送指令
            this.remoteExecuteScript('utilsObj.remoteLimitLayoutAnalysis("'+this.remoteHandler.param5.layoutAnalysisRange+'");');
        },
        // 上传并加载布局分析json
        uploadAndLoadNodeJson() {
            if (!this.validSelectDevice()) {
                return
            }
            this.clearNodeJson();
            // 发送指令并上传文件
            this.remoteExecuteScript('utilsObj.remoteUploadRootNodeJsonToServer();utilsObj.uploadNodePreviewImg();');
            // 延时后读取json
            setTimeout(() => {
                this.loadNodeJson();
            }, 1500)
        },
        // 执行预览代码
        execNodePreviewScript() {
            if (!this.validSelectDevice()) {
                return
            }
            this.remoteExecuteScript(this.remoteHandler.param5.scriptPreview);
        },
        // 清空预览代码
        clearNodePreviewScript() {
            this.remoteHandler.param5.scriptPreview = "";
            window.ZXW_VUE.$notify.success({message: '操作成功', duration: '1000'})
        },
        // 节点右键点击
        nodeRightKeyFun(event, data, node, component) {
        },
        // 选中节点change
        currentChangeFun(data, node) {
        },
        // 节点信息点击
        nodeContentClick(e) {
            this.remoteHandler.param5.nodeInfo = String(e.target.innerHTML).replace(/(^\s*)|(\s*$)/g, "");
            // 复制到剪切板
            this.copyToClipboard(this.remoteHandler.param5.nodeInfo);
        },
        // 节点左键点击
        nodeClickFun(data, node, component) {
            // 获取已选中的节点
            let checkedNodes = this.$refs.nodeTree.getCheckedNodes();
            // 重新绘图
            this.rectNodeToCanvas(checkedNodes);
            // 高亮画框
            let boundsInfo = data.boundsInfo;
            let x1 = boundsInfo.left;
            let y1 = boundsInfo.top;
            let x2 = boundsInfo.right;
            let y2 = boundsInfo.bottom;
            let width = Number(x2) - Number(x1);
            let height = Number(y2) - Number(y1);
            window.ctxNode.beginPath();
            // 设置颜色 高亮色
            window.ctxNode.strokeStyle = "#c4d10c";
            //绘制一个方框
            window.ctxNode.strokeRect(Number(x1), Number(y1), width, height);
            window.ctxNode.closePath();

            this.remoteHandler.param5.selectNode = data;
            this.remoteHandler.param5.dialogVisible = true;

            // 点击生成代码
            this.nodeGenerateCode();
        },
        // 节点选中
        nodeCheckFun(data, treeNode) {
            if (!window.nodeSourceImg) {
                return;
            }
            this.rectNodeToCanvas(treeNode.checkedNodes);
        },
        // 画框到canvas
        rectNodeToCanvas(checkedNodes) {
            // 清空画框数组
            this.remoteHandler.param5.rectCanvasArr = [];
            // 获取canvas对象
            let canvas = document.getElementById('nodePreviewCanvas');
            window.ctxNode.beginPath();
            // 先清除画布
            window.ctxNode.clearRect(0, 0, canvas.width, canvas.height); //清空这个范围的画布

            if (this.remoteHandler.param5.isShowBgImg) {
                // 重新画图
                window.ctxNode.drawImage(window.nodeSourceImg, 0, 0, canvas.width, canvas.height);
            }
            window.ctxNode.strokeStyle = "#9a3616";
            window.ctxNode.lineWidth = 3;
            // 获取全部已选择节点
            let checkNodes = checkedNodes;
            // 按照层级倒序
            checkNodes = sortByKey(checkNodes, 'depth', false);
            if (window.ctxNode && checkNodes && checkNodes.length) {
                for (let i = 0; i < checkNodes.length; i++) {
                    let checkNode = checkNodes[i];
                    let boundsInfo = checkNode.boundsInfo;
                    let x1 = boundsInfo.left;
                    let y1 = boundsInfo.top;
                    let x2 = boundsInfo.right;
                    let y2 = boundsInfo.bottom;
                    let width = Number(x2) - Number(x1);
                    let height = Number(y2) - Number(y1);
                    //绘制一个方框
                    window.ctxNode.rect(Number(x1), Number(y1), width, height);
                    // 添加方框数组
                    this.remoteHandler.param5.rectCanvasArr.push({
                        nodeKey: checkNode.nodeKey,
                        index: i,
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        width: width,
                        height: height
                    })
                }
            }
            window.ctxNode.stroke();
            window.ctxNode.closePath();
        },
        // 加载节点Json
        loadNodeJson() {
            let _that = this;
            // 设置key数组
            _that.remoteHandler.param5.nodeKeyArr = [];
            $.ajax({
                url: "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/system/layoutAnalysis/rootNode.json?"+(new Date().getTime()),
                type: "GET",//请求方式为get
                dataType: "json", //返回数据格式为json
                success: function (data) {//请求成功完成后要执行的方法
                    _that.remoteHandler.param5.rootNodeJson = JSON.stringify(data, "", "\t");
                    // 赋值对象
                    _that.remoteHandler.param5.rootNodeObj = data.constructor === Array ? data :  [data] ;
                    // 删除节点信息显示
                    _that.remoteHandler.param5.dialogVisible = false;
                    // 加载控件图片
                    let imgUrl = getContext() + "/uploadPath/autoJsTools/" + _that.deviceInfo.deviceUuid + "/system/layoutAnalysis/nodePreviewImg.jpg";
                    _that.$nextTick(() => {
                        _that.$refs.nodeTree.filter();
                        $("#nodePreviewImg").attr("src", imgUrl + "?t=" + new Date().getTime());
                        let img = new Image();
                        img.src = imgUrl + "?t=" + new Date().getTime();
                        let canvas = document.getElementById('nodePreviewCanvas');
                        canvas.width = _that.screenDirection === "竖屏" ? _that.deviceInfo.screenWidth : _that.deviceInfo.screenHeight;
                        canvas.height = _that.screenDirection === "竖屏" ? _that.deviceInfo.screenHeight : _that.deviceInfo.screenWidth;
                        window.ctxNode = canvas.getContext('2d');
                        // 储存原始图像
                        window.nodeSourceImg = img;
                        img.onload = function () {
                            if (_that.remoteHandler.param5.isShowBgImg) {
                                // 在canvas上画图片
                                window.ctxNode.drawImage(img, 0, 0, canvas.width, canvas.height);
                            }
                        };

                        canvas.removeEventListener('click', _that.nodeMouseClick);
                        canvas.addEventListener('click', _that.nodeMouseClick);

                        canvas.removeEventListener('contextmenu', _that.nodeMouseRightClick);
                        canvas.addEventListener('contextmenu', _that.nodeMouseRightClick);


                        canvas.removeEventListener('mousemove', _that.nodeMouseMove);
                        canvas.addEventListener('mousemove', _that.nodeMouseMove);

                        setTimeout(() => {
                            // 获取已选中的节点
                            let checkedNodes = _that.$refs.nodeTree.getCheckedNodes();
                            // 重新绘图
                            _that.rectNodeToCanvas(checkedNodes);
                        }, 500)
                    });
                    if (data && data.msg) {
                        window.ZXW_VUE.$notify.error({message: data.msg, duration: '2000'})
                    } else {
                        window.ZXW_VUE.$notify.success({message: '加载完成', duration: '1000'})
                    }
                    // 读取一维节点数组
                    let allChildNodeArr = [];
                    for(let i=0;i<_that.remoteHandler.param5.rootNodeObj.length;i++){
                        let cur = _that.remoteHandler.param5.rootNodeObj[i];
                        _that.recursionNodeArr(allChildNodeArr,cur);
                    }
                    _that.remoteHandler.param5.rootOneNodeArr = allChildNodeArr;
                },
                error: function (msg) {
                }
            })
        },
        // 清除节点Json
        clearNodeJson(showMessage) {
            this.remoteHandler.param5.rootNodeJson = "";
            // 赋值对象
            this.remoteHandler.param5.rootNodeObj = [];
            window.nodeSourceImg = null;
            // 获取canvas对象
            let canvas = document.getElementById('nodePreviewCanvas');
            if (window.ctxNode && canvas && canvas.width) {
                window.ctxNode.beginPath();
                // 先清除画布
                window.ctxNode.clearRect(0, 0, canvas.width, canvas.height); //清空这个范围的画布
                window.ctxNode.closePath();
            }
            // 删除节点信息显示
            this.remoteHandler.param5.dialogVisible = false;
            // 清空控件框数组
            this.remoteHandler.param5.rectCanvasArr = [];
            // 取消全选
            this.remoteHandler.param5.checkAll = false;
            if (showMessage) {
                window.ZXW_VUE.$notify.success({message: '清空完成', duration: '1000'})
            }
        },
        // 控件鼠标移动监听
        nodeMouseMove(e) {
            let canvas = document.getElementById('nodePreviewCanvas');
            let x = e.offsetX * (canvas.width / canvas.offsetWidth);
            let y = e.offsetY * (canvas.height / canvas.offsetHeight);
            let rectCanvasArr = JSON.parse(JSON.stringify(this.remoteHandler.param5.rectCanvasArr || []));
            // 倒序数组
            // rectCanvasArr = rectCanvasArr.reverse();
            // 重绘数组
            let reRectCanvasArr = [];
            // 第一个所在范围的方框
            let inRect = null;
            // 遍历  从小范围到大范围
            for (let i = 0; i < rectCanvasArr.length; i++) {
                let rect = rectCanvasArr[i];
                // 在范围内
                let inRectRange = (x >= rect.x1 && y >= rect.y1 && x <= rect.x2 && y <= rect.y2);
                // 如果在范围内
                if (inRectRange) {
                    // 还没有第一个符合的方框
                    if (!inRect) {
                        // 设置第一个方框
                        inRect = rect;
                        continue;
                    }
                }
                // 添加到重绘元素中
                reRectCanvasArr.push(rect);
            }
            window.ctxNode.beginPath();
            window.ctxNode.lineWidth = 3;
            // 方框颜色 原始色
            let rectColor = "#9a3616";
            for (let i = 0; i < reRectCanvasArr.length - 1; i++) {
                let reRect = reRectCanvasArr[i];
                // 原始色
                rectColor = "#9a3616";
                // 设置颜色
                window.ctxNode.strokeStyle = rectColor;
                // 画框
                window.ctxNode.rect(reRect.x1, reRect.y1, reRect.width, reRect.height);
            }
            window.ctxNode.stroke();
            if (inRect) {
                // 高亮色
                rectColor = "#c4d10c";
                // 设置颜色
                window.ctxNode.strokeStyle = rectColor;
                // 画框
                window.ctxNode.strokeRect(inRect.x1, inRect.y1, inRect.width, inRect.height);
            }
            this.remoteHandler.param5.highlightRect = inRect;
            window.ctxNode.closePath();
        },
        // 监控鼠标右键
        nodeMouseRightClick(e) {
            e.stopPropagation();
            e.preventDefault();
            let canvas = document.getElementById('nodePreviewCanvas');
            let x = e.offsetX * (canvas.width / canvas.offsetWidth);
            let y = e.offsetY * (canvas.height / canvas.offsetHeight);
            let rectCanvasArr = JSON.parse(JSON.stringify(this.remoteHandler.param5.rectCanvasArr || []));
            // 第一个所在范围的方框
            let inRect = null;
            // 遍历  从小范围到大范围
            for (let i = 0; i < rectCanvasArr.length; i++) {
                let rect = rectCanvasArr[i];
                // 在范围内
                let inRectRange = (x >= rect.x1 && y >= rect.y1 && x <= rect.x2 && y <= rect.y2);
                // 如果在范围内
                if (inRectRange) {
                    // 还没有第一个符合的方框
                    if (!inRect) {
                        // 设置第一个方框
                        inRect = rect;
                    }
                }
            }
            if (inRect) {
                // 取消勾选
                this.$refs.nodeTree.setChecked(inRect.nodeKey, false, false)
            }
            this.remoteHandler.param5.highlightRect = null;
            // 获取已选中的节点
            let checkedNodes = this.$refs.nodeTree.getCheckedNodes();
            // 重新绘图
            this.rectNodeToCanvas(checkedNodes);
        },
        // 控件鼠标点击监听
        nodeMouseClick(e) {
            let highlightRect = this.remoteHandler.param5.highlightRect;
            // 当前已有高亮方框
            if (highlightRect) {
                let nodeObj = this.$refs.nodeTree.getNode(highlightRect.nodeKey);
                this.remoteHandler.param5.selectNode = nodeObj.data;
                this.remoteHandler.param5.dialogVisible = true;
                // 更改选中树节点
                this.$refs.nodeTree.setCurrentKey(highlightRect.nodeKey);

                // 默认展开keys
                this.defaultExpandedKeys = [highlightRect.nodeKey];
                this.$nextTick(()=>{
                    // 获取高亮节点
                    let highlightNode = $('.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content');
                    if(highlightNode && highlightNode.length){
                        let highlightNodeDocument = highlightNode[0];
                        let rect = highlightNodeDocument.getBoundingClientRect();
                        let windowHeight = window.innerHeight || document.documentElement.clientHeight;
                        let windowWidth = window.innerWidth || document.documentElement.clientWidth;
                        if (!(rect.top >= 0 && rect.left >= 0 && rect.bottom <= windowHeight && rect.right <= windowWidth)) {
                            // 元素不在可视窗口内
                            highlightNode[0].scrollIntoView();
                        }
                        rect = highlightNodeDocument.getBoundingClientRect();
                        if(rect.top < 100){
                            let parentDocument =  document.getElementById('layoutScrollParent');
                            parentDocument.scrollBy(0,-100);
                        }
                    }
                });

                // 点击生成代码
                this.nodeGenerateCode();
            }
        },
        // 控件节点生成代码
        nodeGenerateCode() {
            // 未开启不生成
            if (!this.remoteHandler.param5.openClickGenerateCode) {
                return;
            }
            // 获取选中节点
            let selectNode = this.remoteHandler.param5.selectNode;
            if (!selectNode) {
                return;
            }
            let id = selectNode.id;
            let text = selectNode.text;
            let desc = selectNode.desc;
            let className = selectNode.className;

            let uiSelect = this.remoteHandler.param5.uiSelect;
            let uiSelectCondition = this.remoteHandler.param5.uiSelectCondition;
            let uiSelectAction = this.remoteHandler.param5.uiSelectAction;

            let nodeCode = '';
            if (uiSelect.includes("id") && id) {
                nodeCode += 'id("' + id + '")';
            }
            if (uiSelect.includes("text") && text) {
                if (nodeCode) {
                    nodeCode += '.';
                }
                nodeCode += 'text("' + text + '")';
            }
            if (uiSelect.includes("desc") && desc) {
                if (nodeCode) {
                    nodeCode += '.';
                }
                nodeCode += 'desc("' + desc + '")';
            }
            if (uiSelect.includes("className") && className) {
                if (nodeCode) {
                    nodeCode += '.';
                }
                nodeCode += 'className("' + className + '")';
            }
            if (uiSelectCondition) {
                nodeCode += '.' + uiSelectCondition + '()';
            }
            if (uiSelectAction) {
                nodeCode += '.' + uiSelectAction + '()';
            }
            this.remoteHandler.param5.scriptPreview += nodeCode + ";\r\n";
        },
    }
}