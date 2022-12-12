import {getContext} from "./../../../utils/utils.js";

let template = '<div></div>';
$.ajax({
    url: "/module/index/template/fileManage.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});

export default {
    template: template,
    name: 'FileManage',
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
            webSyncPath:"/",
            phoneSyncPath:"/sdcard/appSync/",
            breadcrumbList: [{ label: '根目录', value: '' }], // 面包屑
            fileLoading:false,// 加载文件loading
            checkAllFile:false,// 全选文件
            uploadFileList:[],// 需要上传的文件列表
            curFileData:{},// 选中的文件数据
            copyFileList:[],// 复制文件列表
            moveFileList:[],// 移动文件列表
            absolutePrePath:'',// 绝对路径前缀
            fileList: [] // 文件列表
        }
    },
    mounted(){
        let _that = this;
        $.ajax({
            url: getContext() + "/attachmentInfo/getAbsolutePrePath",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data) {
                    if (data.isSuccess) {
                        _that.absolutePrePath = data.data;
                    }
                }
            },
            error: function (msg) {
            }
        });
    },
    computed:{
        checkFileCount(){ // 已选文件数量
            return this.fileList.filter(item=>item.check).length;
        }
    },
    methods: {
        // 初始化方法
        init(){
            let relativeFilePath = this.deviceInfo.deviceUuid;
            // 加载文件列表
            this.queryFileList(relativeFilePath);
            this.breadcrumbList = [{label:'根目录',value: this.deviceInfo.deviceUuid}]
        },
        // 查询文件列表
        queryFileList(relativeFilePath){
            this.fileLoading = true;
            let _that = this;
            $.ajax({
                url: getContext() + "/attachmentInfo/queryAttachInfoListByPath",
                type: "GET",
                dataType: "json",
                // contentType: "application/json",
                data:{
                    "relativeFilePath":relativeFilePath
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            data.data.forEach(item=> item.check = false);
                            _that.fileList = data.data;
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
        // 监听拖拽
        onDrop(e){

        },
        // 操作
        operateFun(code){
            switch (code) {
                case 'copy': {
                    if(this.moveFileList && this.moveFileList.length>0){
                        this.moveFileList = [];
                    }
                    // 设置复制文件集合
                    this.copyFileList =  this.fileList.filter(item=>item.check);
                    break;
                }
                case 'paste':{
                    let fileNames = this.copyFileList.map(item=>{
                        return item.isDirectory ? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');
                    let toName = this.breadcrumbList[this.breadcrumbList.length-1].label;
                    let toPath = this.breadcrumbList[this.breadcrumbList.length-1].value;
                    window.ZXW_VUE.$confirm('是否确认将'+fileNames+'复制到'+toName+'?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let sourcePathList = this.copyFileList.map(item=>item.pathName);
                        let _that = this;
                        $.ajax({
                            url: getContext() + "/attachmentInfo/copyFileBatch",
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data:JSON.stringify({
                                "sourcePathList":sourcePathList,
                                "targetFolderPath":_that.absolutePrePath + toPath
                            }),
                            success: function (data) {
                                if (data) {
                                    if (data.isSuccess) {
                                        window.ZXW_VUE.$notify.success({message: '复制成功', duration: '1000'});
                                        // 清空文件列表
                                        _that.copyFileList = [];
                                        // 重新加载文件列表
                                        _that.queryFileList(toPath);
                                    }
                                }
                            },
                            error: function (msg) {
                            }
                        });
                    });
                    break;
                }
                case 'cancel': {
                    this.copyFileList = [];
                    this.moveFileList = [];
                    break;
                }
                case 'move':{
                    if(this.copyFileList && this.copyFileList.length>0){
                        this.copyFileList = [];
                    }
                    // 设置移动文件集合
                    this.moveFileList =   this.fileList.filter(item=>item.check);
                    break;
                }
                case 'moveTo':{
                    break;
                    // 需要过滤 考虑多种情况 TODO
                    // 已选文件在当前目录下的
                    let fileNames = this.moveFileList.filter(item=>{

                    }).map(item=>{
                        return item.isDirectory ? item.fileName : (item.fileName + "." + item.fileType);
                    }).join(',');
                    let toName = this.breadcrumbList[this.breadcrumbList.length-1].label;
                    let toPath = this.breadcrumbList[this.breadcrumbList.length-1].value;
                    window.ZXW_VUE.$confirm('是否确认将'+fileNames+'移动到'+toName+'?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        let sourcePathList = this.moveFileList.map(item=>item.pathName);
                        let _that = this;
                        $.ajax({
                            url: getContext() + "/attachmentInfo/moveFileBatch",
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data:JSON.stringify({
                                "sourcePathList":sourcePathList,
                                "targetFolderPath":_that.absolutePrePath + toPath
                            }),
                            success: function (data) {
                                if (data) {
                                    if (data.isSuccess) {
                                        window.ZXW_VUE.$notify.success({message: '移动成功', duration: '1000'});
                                        // 清空文件列表
                                        _that.copyFileList = [];
                                        // 重新加载文件列表
                                        _that.queryFileList(toPath);
                                    }
                                }
                            },
                            error: function (msg) {
                            }
                        });
                    });
                }
            }
        },
        // 全选
        checkAllFileChange(){
            this.fileList.forEach(item=>{
                this.$set(item,'check',this.checkAllFile);
            });
        },
        // 文件名点击
        fileClick(row){
            // this.$set(row,'check',!row.check);
        },
        // 文件名双击
        fileNameDbClick(row){
            // 如果是目录
            if(row.isDirectory){
                // 记录到面包屑导航栏
                let pathName = row.pathName;
                let index = pathName.indexOf(this.deviceInfo.deviceUuid);
                pathName = pathName.substring(index,pathName.length);
                let array = pathName.split("\\");

                // 面包屑数组
                let breadcrumbArr = [];
                let pathArr = [];
                for(let i=0;i<array.length;i++){
                    pathArr.push(array[i]);
                    breadcrumbArr.push({
                        label:i === 0 ? "根目录" : array[i],
                        value:pathArr.join("/")
                    });
                }
                this.breadcrumbList = breadcrumbArr;
                // 默认加载最后一个
                this.breadcrumbChange(this.breadcrumbList[this.breadcrumbList.length - 1],(this.breadcrumbList.length - 1))
            }
        },
        // 面包屑change
        breadcrumbChange(item,index){
            // 加载文件列表
            this.queryFileList(item.value);
            // 重新加载面包屑
            this.breadcrumbList = this.breadcrumbList.slice(0,index+1);
        },
        // 计算文件大小
        calculateSize(fileSize){
            let gb = 1024*1024*1024;
            let mb = 1024*1024;
            let kb = 1024;
            let val = parseFloat(fileSize/gb).toFixed(2);
            if(val>1){
                return val+"GB";
            }
            val = parseFloat(fileSize/mb).toFixed(2);
            if(val>1){
                return val+"MB";
            }
            val = parseFloat(fileSize/kb).toFixed(2);
            if(val>1){
                return val+"KB";
            }
            return fileSize+"B";
        },
        // 同步文件到手机端
        syncFileToPhone(){
            if(!this.validSelectDevice()){
                return;
            }
            if(!this.phoneSyncPath){
                window.ZXW_VUE.$message.warning('请设置手机端同步路径');
                return;
            }
        },
        // 同步文件到Web端
        syncFileToWeb(){
            if(!this.validSelectDevice()){
                return;
            }
            if(!this.webSyncPath){
                window.ZXW_VUE.$message.warning('请设置web端同步路径');
                return;
            }
            window.ZXW_VUE.$message.warning('建设中');
        },
        // 上传文件
        uploadFile(){
            if(!this.validSelectDevice()){
                return;
            }
            window.ZXW_VUE.$message.warning('建设中');
        },
        // 创建文件夹
        createFolder(){
            if(!this.validSelectDevice()){
                return;
            }
            window.ZXW_VUE.$message.warning('建设中');
        },
        // 预览文件
        previewFile(previewUrl){
            window.open(getContext()+"/"+previewUrl)
        }
    }
}