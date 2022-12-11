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
            breadcrumbList: [{ label: '全部文件', value: '' }], // 面包屑
            checkFileCount:0, // 已选文件数量
            fileLoading:false,// 加载文件loading
            checkAllFile:false,// 全选文件
            uploadFileList:[],// 需要上传的文件列表
            curFileData:{},// 选中的文件数据
            fileList: [] // 文件列表
        }
    },
    mounted(){
    },
    methods: {
        // 初始化方法
        init(){
            // 加载文件列表
            this.queryFileList();
        },
        // 查询文件列表
        queryFileList(){
            let relativeFilePath = this.deviceInfo.deviceUuid;
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
        // 全选
        checkAllFileChange(){
            if(!this.validSelectDevice()){
                return;
            }
        },
        // 面包屑change
        breadcrumbChange(){

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