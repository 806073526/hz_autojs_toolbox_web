import {getContext, sortByKey} from "./../../utils/utils.js";
let template='' +
    '<div>' +
    '<p class="basicInfo">远程布局分析及上传</p>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="UI选择器:"  class="width50">' +
    '            <el-checkbox-group v-model="remoteHandler.param5.uiSelect">' +
    '                <el-checkbox label="id">id选择器</el-checkbox>' +
    '                <el-checkbox label="text">text选择器</el-checkbox>' +
    '                <el-checkbox label="desc">desc选择器</el-checkbox>' +
    '                <el-checkbox label="className">className选择器</el-checkbox>' +
    '            </el-checkbox-group>' +
    '        </el-form-item>' +
    '        <el-form-item label="选择器条件:"  class="width50">' +
    '                <el-radio-group v-model="remoteHandler.param5.uiSelectCondition">' +
    '                    <el-radio label="findOne">找到一个(阻塞)findOne</el-radio>' +
    '                    <el-radio label="findOnce">找到第N个findOnce</el-radio>' +
    '                    <el-radio label="untilFind">找到所有untilFind</el-radio>' +
    '                    <el-radio label="waitFor">等待出现waitFor</el-radio>' +
    '                    <el-radio label="exists">存在exists</el-radio>' +
    '                </el-radio-group>' +
    '        </el-form-item>' +
    '    </div>' +
    '</el-row>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center">' +
    '        <el-form-item label="动作:"  class="width50">' +
    '            <el-radio-group v-model="remoteHandler.param5.uiSelectAction">' +
    '                <el-radio label="click">点击click</el-radio>' +
    '                <el-radio label="clickCenter">点击中心clickCenter</el-radio>' +
    '                <el-radio label="longClick">长按longClick</el-radio>' +
    '            </el-radio-group>' +
    '        </el-form-item>' +
    '        <el-form-item label="开启点击生成代码:" label-width="140px"  class="width50">' +
    '            <el-switch v-model="remoteHandler.param5.openClickGenerateCode"/>' +
    '        </el-form-item>' +
    '    </div>' +
    '</el-row>' +
    '    <el-row>' +
    '        <div class="width100 d-flex a-center">' +
    '            <el-form-item label="代码预览:" class="width60">' +
    '                <el-input type="textarea" v-model="remoteHandler.param5.scriptPreview" :rows="5" placeholder="请点击控件后生成代码"' +
    '                       class="width100">' +
    '                </el-input>' +
    '             </el-form-item>' +
    '            <el-form-item label="控件信息:" class="width40">' +
    '                <el-input type="textarea" v-model="remoteHandler.param5.nodeInfo" :rows="5"  placeholder="点击控件信息快速获取文本内容"' +
    '                       class="width100">' +
    '                </el-input>' +
    '            </el-form-item>' +
    '       </div>' +
    '</el-row>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center" style="display: flex;justify-content: flex-start;align-items: center;text-align: center;">' +
    '        <div>' +
    '            <el-button type="primary" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="remoteLayoutAnalysis">' +
    '                远程布局分析' +
    '            </el-button>' +
    '            <el-button type="primary" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="remoteLimitLayoutAnalysis">' +
    '                远程限制应用布局分析' +
    '            </el-button>' +
    '            <el-button type="primary" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="uploadAndLoadNodeJson">' +
    '                上传布局分析并解析' +
    '            </el-button>' +
    '            <el-button type="info" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="loadNodeJson">' +
    '                解析布局分析' +
    '            </el-button>' +
    '            <el-button type="warning" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="clearNodeJson(true)">' +
    '                清空布局分析' +
    '            </el-button>' +
    '            <el-button type="primary" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="execNodePreviewScript">' +
    '                执行代码' +
    '            </el-button>' +
    '            <el-button type="warning" style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" size="mini"' +
    '                       @click.stop.prevent="clearNodePreviewScript">' +
    '                清空代码' +
    '            </el-button>' +
    '            <el-checkbox style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px" v-model="remoteHandler.param5.checkAll" @change="checkAllNode">全选</el-checkbox>' +
    '            <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px">' +
    '                <span style="margin-right: 5px;">父子不相关联</span>' +
    '                <el-switch v-model="remoteHandler.param5.checkStrictly"/>' +
    '            </div>' +
    '            <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px">' +
    '                <span style="margin-right: 5px;">只显示可见控件</span>' +
    '                <el-switch v-model="remoteHandler.param5.isOnlyShowVisible" @change="onlyShowVisible"/>' +
    '            </div>' +
    '            <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px">' +
    '                <span style="margin-right: 5px;">只显示屏幕范围内控件</span>' +
    '                <el-switch v-model="remoteHandler.param5.isOnlyShowInScreen" @change="onlyShowInScreen"/>' +
    '            </div>' +
    '            <div style="display: inline-flex;justify-content: flex-end;align-items: center;margin-left:10px">' +
    '                <span style="margin-right: 5px;">绘制背景图片</span>' +
    '                <el-switch v-model="remoteHandler.param5.isShowBgImg" @change="showDrawBgImg"/>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</el-row>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-center mt-1">' +
    '        <el-tree :data="remoteHandler.param5.rootNodeObj"' +
    '                :props="remoteHandler.param5.defaultProps"' +
    '                 empty-text="请先上传控件或加载控件"' +
    '                default-expand-all' +
    '                 :highlight-current="true"' +
    '                 ref="nodeTree"' +
    '                 :show-checkbox="true"' +
    '                 node-key="nodeKey"' +
    '                 :check-on-click-node="false"' +
    '                 :filter-node-method="filterNode"' +
    '                 :check-strictly="remoteHandler.param5.checkStrictly"' +
    '                 @check="nodeCheckFun"' +
    '                 @node-click="nodeClickFun"' +
    '                 @current-change="currentChangeFun"' +
    '                 class="nodeTreeClass nodeDivCommon"></el-tree>' +
    '        <div class="nodePreviewClass nodeDivCommon">' +
    '            <img id="nodePreviewImg"  draggable="false"' +
    '                 style="display: none;" />' +
    '            <canvas v-if="remoteHandler.param5.rootNodeJson" id="nodePreviewCanvas" style="width: 100%;margin: 0; padding: 0;"></canvas>' +
    '            <div v-else style="width: 100%;' +
    '                       height: 100%;' +
    '                       display: flex;' +
    '                       justify-content: center;' +
    '                       align-items: center;' +
    '                       color: #909399;">请先上传控件或加载控件</div>' +
    '        </div>' +
    '        <div class="nodeDetailDiv nodeDivCommon">' +
    '            <template v-if="remoteHandler.param5.dialogVisible">' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">className:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.className }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">packageName:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.packageName }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">text:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.text }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">desc:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.desc }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">id:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.id }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">sourceNodeId:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.sourceNodeId }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">bounds:</div>' +
    '                    <div class="contentClass"> {{ \'[\'+remoteHandler.param5.selectNode.boundsInfo.left+\',\'+ remoteHandler.param5.selectNode.boundsInfo.top+\',\' + remoteHandler.param5.selectNode.boundsInfo.right + \',\' + remoteHandler.param5.selectNode.boundsInfo.bottom + \']\'}}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">depth:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.depth }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">checkable:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.checkable }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">checked:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.checked }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">focusable:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.focusable }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">focused:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.focused }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">accessibilityFocused:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.accessibilityFocused }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">selected:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.selected }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">clickable:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.clickable }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">drawingOrder:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.drawingOrder }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">longClickable:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.longClickable }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">enabled:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.enabled }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">password:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.password }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">scrollable:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.scrollable }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">visible:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.visible }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">column:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.column }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">columnCount:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.columnCount }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">columnCount:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.columnCount }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">columnSpan:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.columnSpan }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">row:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.row }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">rowCount:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.rowCount }}</div>' +
    '                </el-row>' +
    '                <el-row class="nodeDetailRow">' +
    '                    <div class="labelClass">rowSpan:</div>' +
    '                    <div class="contentClass">{{ remoteHandler.param5.selectNode.rowSpan }}</div>' +
    '                </el-row>' +
    '            </template>' +
    '            <template v-else>' +
    '                <div style="width: 100%;' +
    '                       height: 100%;' +
    '                       display: flex;' +
    '                       justify-content: center;' +
    '                       align-items: center;' +
    '                       color: #909399;">请点击控件节点或者图中矩形</div>' +
    '            </template>' +
    '        </div>' +
    '    </div>' +
    '</el-row>' +
    '</div>';

export default {
    template: template,
    name: 'LayoutAnalysis',
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
            remoteHandler: {
                param5: {
                    rootNodeJson: '',
                    rootNodeObj: [],
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
                    openClickGenerateCode: false,// 开启点击生成代码
                    nodeInfo: '',// 节点信息
                    uiSelect: ['id', 'text', 'desc', 'className'],// ui选择器
                    uiSelectCondition: 'findOne',// ui选择器条件
                    uiSelectAction: 'click',// 动作
                    checkStrictly: true,// 父子相关联
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    },
                    nodeType: 'tree'
                }
            }
        }
    },
    computed: {
        param5DialogVisible() {
            return this.remoteHandler.param5.dialogVisible;
        }
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
        // 远程布局分析
        remoteLayoutAnalysis() {
            if (!this.validSelectDevice()) {
                return
            }
            // 发送指令并上传文件
            this.remoteExecuteScript('auto.clearCache();utilsObj.getRootNodeWriteLocal("tree");');
        },
        // 远程限制应用布局分析
        remoteLimitLayoutAnalysis() {
            // 发送指令
            this.remoteExecuteScript('utilsObj.remoteLimitLayoutAnalysis();');
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
            this.remoteHandler.param5.nodeInfo = e.target.innerHTML;
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
                url: "/uploadPath/autoJsTools/" + this.deviceInfo.deviceUuid + "/rootNode.json",
                type: "GET",//请求方式为get
                dataType: "json", //返回数据格式为json
                success: function (data) {//请求成功完成后要执行的方法
                    _that.remoteHandler.param5.rootNodeJson = JSON.stringify(data, "", "\t");
                    // 赋值对象
                    _that.remoteHandler.param5.rootNodeObj = [data];
                    // 删除节点信息显示
                    _that.remoteHandler.param5.dialogVisible = false;
                    // 加载控件图片
                    let imgUrl = getContext() + "/uploadPath/autoJsTools/" + _that.deviceInfo.deviceUuid + "/nodePreviewImg.jpg";
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
            this.remoteHandler.param5.scriptPreview += nodeCode + "\r\n";
        },
    }
}