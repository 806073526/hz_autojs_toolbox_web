import {getContext,getEditorType,initFileEditor} from "../../../utils/utils.js";
import {remoteScriptObj} from "../constant/remoteScriptObj.js"

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/remoteScript.html",
    type: 'get',
    async: false,
    success: function (res) {
        template = String(res);
    }
});

export default {
    template: template,
    name: 'RemoteScript',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript', 'getMonacoEditorComplete','forwardFileManage'],
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
    computed:{
        remoteScriptApp(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item => item.type === 'app');
        },
        remoteScriptDevice(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item => item.type === 'device');
        },
        remoteScriptKeys(){
          let arr = Object.values(this.remoteScript);
          return arr.filter(item=> item.type === 'keys')
        },
        remoteScriptOperate(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item=> item.type === 'operate')
        },
        remoteScriptTask(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item=> item.type === 'task')
        },
        remoteScriptInternal(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item=> item.type === 'internal')
        },
        remoteScriptOther(){
            let arr = Object.values(this.remoteScript);
            return arr.filter(item => item.type === 'other');
        }
    },
    mounted(){
        this.refreshScrollHeight();
        window.removeEventListener('keydown',this.editorSaveListener);
        window.addEventListener('keydown',this.editorSaveListener,false);
    },
    data() {
        return {
            isActive: false,
            selectScriptArrays:[],
            firstLoadFile: false,
            remoteHandler: {
                param4: {
                    scriptName: 'remoteScript.js',
                    scriptText: '',
                    scriptImmediatelyExec: true,
                    isNodeScript: false,
                    isIndependentScript: false
                }
            },
            //tab页选中
            activeName: 'app',
            scriptEditor: null,
            tempCustomScript: [],// 自定义模块缓存数据
            customScript: [],// 自定义模块 [{moduleName:'',scriptName:''}]
            remoteScript: JSON.parse(JSON.stringify(remoteScriptObj))
        }
    },
    methods: {
        //tab页切换
        handleClick(tab, event) {
        },
        // 文件编辑器保存监听
        editorSaveListener(e){
            let isEditorContainer = false;
            if(document.activeElement && document.activeElement.parentElement){
                isEditorContainer = document.activeElement.parentElement.id === 'scriptTextEditor';
            }
            if(e.ctrlKey && e.keyCode === 83 && this.getMonacoEditorComplete && this.deviceInfo.deviceUuid && this.remoteHandler.param4.scriptName && isEditorContainer){
                e.stopPropagation();
                e.preventDefault();
                window.localStorage.setItem("remoteScriptText_"+this.remoteHandler.param4.scriptName,this.scriptEditor.getValue());
                let scriptFile = new File([this.scriptEditor.getValue()], this.remoteHandler.param4.scriptName, {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.deviceInfo.deviceUuid+"/system/remoteScript/");
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
            }
        },
        init(){
            let fileContent = this.remoteHandler.param4.scriptText ? this.remoteHandler.param4.scriptText : "";
            // 初始化文件编辑器
            initFileEditor(this,'scriptEditor','scriptTextEditor',this.getMonacoEditorComplete,fileContent,'javascript','vs-dark',(e,value)=>{
                this.remoteHandler.param4.scriptText = value;

                // 自动保存草稿
                if(this.remoteHandler.param4.scriptName){
                    window.localStorage.setItem("remoteScriptText_"+this.remoteHandler.param4.scriptName,this.scriptEditor.getValue());
                }
            });
            this.refreshScrollHeight();
            if(!this.firstLoadFile){
                this.$nextTick(()=>{
                    // 从文件读取
                    this.readForFile();
                    this.firstLoadFile = true;
                });
            }
        },
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
            let containers = $(".imgDivContainer");
            if(containers && containers.length){
                for(let i=0;i<containers.length;i++){
                    $(containers[i]).css("height",1500 * zoomSize / 100);
                }
            }
        },
        // 显示脚本名字
        showSelectScriptName(){
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                data: {
                    "relativeFilePath": this.deviceInfo.deviceUuid + "/system/remoteScript"
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            let arr = data.data.filter(item=> ["js"].includes(item.fileType));
                            _that.selectScriptArrays = arr.map(item=> item.fileName + "." + item.fileType);
                        }
                    }
                    setTimeout(() => {
                        _that.fileLoading = false
                    }, 200)
                },
                error: function (msg) {
                    setTimeout(() => {
                        _that.fileLoading = false
                    }, 200)
                }
            });
        },
        // 选择脚本
        selectScriptName(scriptName){
            // 设置脚本名称
            this.remoteHandler.param4.scriptName = scriptName;
            // 从文件读取
            this.readForFile();
        },
        // 跳转文件管理模块
        forwardFileManageFun(){
            this.forwardFileManage("/system/remoteScript/");
        },
        // 初始自定义模块
        initCustomScript(){
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/system/remoteScript/remoteCustomScriptSetting.json?t="+(new Date().getTime()),
                type: 'get',
                async: false,
                success: function (res) {
                    // 初始自定义模块
                    _that.customScript = JSON.parse(JSON.stringify(res));
                    _that.tempCustomScript = JSON.parse(JSON.stringify(res));
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        },
        // 自定义模块设置
        customScriptSetting(){
            this.tempCustomScript = JSON.parse(JSON.stringify(this.customScript));
            this.$refs['customScriptSettingPopover'].doShow();
        },
        // 取消自定义模块设置
        cancelCustomScriptSetting(){
            this.$refs['customScriptSettingPopover'].doClose();
        },
        // 保存自定义模块设置
        saveCustomScriptSetting(){
            this.$refs['customScriptSettingPopover'].doClose();
            // 过滤掉未填写的数据
            this.customScript = JSON.parse(JSON.stringify(this.tempCustomScript.filter(item=> item.moduleName && item.scriptName)));
            let scriptFile = new File([JSON.stringify(this.customScript)], 'remoteCustomScriptSetting.json', {
                type: "application/json",
            });
            const param = new FormData();
            param.append('file', scriptFile);
            param.append('pathName', this.deviceInfo.deviceUuid+"/system/remoteScript/");
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
        },
        // 添加行
        addRow(){
            this.tempCustomScript.push({ moduleName: '', scriptName: 'system/remoteScript/修改你的文件名.js' })
        },
        // 删除行
        delRow(index) {
            // 删除行数据
            this.tempCustomScript.splice(index, 1)
        },
        // 清空脚本
        clearScript() {
            // this.remoteHandler.param4.scriptText = '';
            this.scriptEditor.setValue('');
            if(getEditorType() === 'ace'){
                this.scriptEditor.clearSelection();
            }
        },
        // 停止脚本
        stopScript(){
            let remoteScript = `let notCloseSourceArr = ['/data/user/0/com.zjh336.cn.tools/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools/files/project/main.js','/data/user/0/com.zjh336.cn.tools8822/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools8822/files/project/main.js','main.js']
            const all = engines.all()
            all.forEach(item => {
            if (notCloseSourceArr.indexOf(String(item.source))===-1) {
            item.forceStop()
            }
            });`;
            this.remoteExecuteScript(remoteScript);
        },
        // 保存到草稿
        saveToDraft(){
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return false;
            }
            window.localStorage.setItem("remoteScriptText_"+this.remoteHandler.param4.scriptName,this.scriptEditor.getValue());
            window.ZXW_VUE.$notify.success({message: '保存草稿成功', duration: '1000'});
        },
        // 从草稿读取
        readForDraft(){
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return false;
            }
            this.scriptEditor.setValue( window.localStorage.getItem("remoteScriptText_"+this.remoteHandler.param4.scriptName));
            if(getEditorType() === 'ace'){
                this.scriptEditor.clearSelection();
            }
            window.ZXW_VUE.$notify.success({message: '读取草稿成功', duration: '1000'});
        },
        // 存为文件
        saveToFile(){
            if (!this.validSelectDevice()) {
                return;
            }
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return;
            }
            window.ZXW_VUE.$confirm('是否确认将当前脚本内容存为' + this.remoteHandler.param4.scriptName + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let scriptFile = new File([this.scriptEditor.getValue()], this.remoteHandler.param4.scriptName, {
                    type: "text/plain",
                });
                const param = new FormData();
                param.append('file', scriptFile);
                param.append('pathName', this.deviceInfo.deviceUuid+"/system/remoteScript/");
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
            if(!this.remoteHandler.param4.scriptName){
                window.ZXW_VUE.$message.warning('请设置脚本名称');
                return;
            }
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/system/remoteScript/"+this.remoteHandler.param4.scriptName + "?t="+(new Date().getTime()),
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    _that.scriptEditor.setValue(String(res));
                    if(getEditorType() === 'ace'){
                        _that.scriptEditor.clearSelection();
                    }
                    window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'});
                },
                error: function (msg) {
                    console.log(msg);
                    window.ZXW_VUE.$notify.error({message: _that.remoteHandler.param4.scriptName+'文件不存在', duration: '1000'});
                }
            });
        },
        // 获取远程代码
        getRemoteScript(code) {
            if (code) {
                if (this.remoteHandler.param4.scriptImmediatelyExec && this.validSelectDevice()) {
                    // 远程执行
                    this.remoteExecuteScript(code);
                }
                let scriptText = this.scriptEditor.getValue();
                code = code.replace(/^\s+|\s+$/g,"");
                this.scriptEditor.setValue(scriptText+=code+"\n");
                if(getEditorType() === 'ace'){
                    this.scriptEditor.clearSelection();
                }
                // this.remoteHandler.param4.scriptText += code +"\n";
            }
        },
        // 远程执行脚本
        remoteExecuteScriptFun(code){
            // NODE脚本 先写入手机端再执行文件
            if(this.remoteHandler.param4.isNodeScript){
                let remoteScript = `
                    let remoteScriptPath = '/sdcard/appSync/nodeRemoteScript/remoteScript.node.js'; 
                    files.createWithDirs(remoteScriptPath)
                    files.write(remoteScriptPath, decodeURI($base64.decode('${btoa(encodeURI(code))}')));
                    engines.execScriptFile("/sdcard/appSync/nodeRemoteScript/remoteScript.node.js",{path:["/sdcard/appSync/nodeRemoteScript/"]})
                `;
                this.remoteExecuteScript(remoteScript);
            } else {
                // ui开头 或者 开启了独立引擎
                if(code.startsWith('"ui"') || this.remoteHandler.param4.isIndependentScript){
                    let remoteScript = `
                    let remoteScriptPath = '/sdcard/appSync/tempRemoteScript/remoteScript.js'; 
                    files.createWithDirs(remoteScriptPath)
                    files.write(remoteScriptPath, decodeURI($base64.decode('${btoa(encodeURI(code))}')));
                    engines.execScriptFile("/sdcard/appSync/tempRemoteScript/remoteScript.js",{path:["/sdcard/appSync/tempRemoteScript/"]})
                    `;
                    this.remoteExecuteScript(remoteScript);
                    return;
                }
                // 否则直接执行脚本
                this.remoteExecuteScript(code);
            }
        },
        // 获取自定义模块远程代码
        getCustomRemoteScript(scriptName){
            let _that = this;
            $.ajax({
                url: getContext() + "/uploadPath/autoJsTools/"+this.deviceInfo.deviceUuid+"/"+scriptName + "?t="+(new Date().getTime()),
                type: 'get',
                async: false,
                dataType:"TEXT", //返回值的类型
                success: function (res) {
                    if (_that.remoteHandler.param4.scriptImmediatelyExec && _that.validSelectDevice()) {
                        // 远程执行
                        _that.remoteExecuteScript(_that.scriptEditor.getValue());
                    }
                    //_that.remoteHandler.param4.scriptText += String(res) + "\n";
                    let scriptText = _that.scriptEditor.getValue();
                    _that.scriptEditor.setValue(scriptText+=String(res)+"\n");
                    if(getEditorType() === 'ace'){
                        _that.scriptEditor.clearSelection();
                    }
                    window.ZXW_VUE.$notify.success({message: '读取成功', duration: '1000'});
                },
                error: function (msg) {
                    window.ZXW_VUE.$notify.fail({message: '读取失败', duration: '1000'});
                }
            });
        },
        // 远程运行脚本
        remoteRunScript() {
        }
    }
}