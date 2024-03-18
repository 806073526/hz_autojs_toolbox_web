let template ='<div></div>';
$.ajax({
    url: "/module/online/template/main.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});
import {getContext,urlParam,formatDate} from "./../../utils/utils.js";

window.ZXW_VUE = new Vue({
    el: "#app",
    template: template,
    data: {
        serverList:[],
        serverLoading:false,
        newVersion:"",
        showType:"all"
    },
    mounted() {
        let accessPwd = urlParam("accessPwd") || "";
        this.queryServerInfo(accessPwd);

        // 获取版本号
        this.newVersion = this.getNewVersion();
    },
    computed:{
        allCount(){ // 全部数量
            let count = this.serverList.length;
            return count;
        },
        todayOnlineCount(){ // 今日在线数量
            let todayDate = formatDate(new Date());
            let count = this.serverList.filter(value => {
                let lastConnectTime = value.lastConnectTime || "";
                return lastConnectTime.length >=11 && todayDate === lastConnectTime.substring(0,11);
            }).length;
            return count;
        },
        newVersionCount(){ // 最新版本数量
            let count = this.serverList.filter(value => {
                let curVersion = value.curVersion || "";
                return curVersion === this.newVersion;
            }).length;
            return count;
        },
        authorizeCount(){// 授权数量
            let count = this.serverList.filter(value => value.authorize === "true").length;
            return count;
        },
        showServerList(){
            let resultList = [];
            switch (this.showType) {
                case "todayOnline": // 今日在线
                    let todayDate = formatDate(new Date());
                    resultList = this.serverList.filter(value => {
                        let lastConnectTime = value.lastConnectTime || "";
                        return lastConnectTime.length >=11 && todayDate === lastConnectTime.substring(0,11);
                    });
                    break;
                case "newVersion":// 最新版本
                    resultList = this.serverList.filter(value => {
                        let curVersion = value.curVersion || "";
                        return curVersion === this.newVersion;
                    });
                    break;
                case "authorize": // 授权
                    resultList = this.serverList.filter(value => value.authorize === "true");
                    break;
                case "all":
                default:
                    resultList = this.serverList;
            }
            return resultList;
        },
    },
    methods: {
        clickShowType(showType){
            this.showType = showType;
        },
        // 获取最新版本号
        getNewVersion(){
            let newVersion = '';
            let _that = this;
            $.ajax({
                url: getContext() + "/device/getNewVersion",
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.isSuccess) {
                        newVersion = data.data;
                    }
                },
                error: function (msg) {
                }
            });
            return newVersion;
        },
        // 查询服务端信息
        queryServerInfo(accessPwd){
            // 调用接口查询日志
            let _that = this;
            this.serverLoading = true;
            $.ajax({
                url: getContext() + "/device/queryOnlineStatus",
                type: "GET",
                dataType: "json",
                async: false,
                data: {
                    "accessPwd": accessPwd
                },
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            _that.serverList = data.data;
                        } else {
                            alert(data.msg);
                        }
                    }
                    _that.serverLoading = false;
                },
                error: function (msg) {
                    console.log(msg);
                    _that.serverLoading = false;
                    if(msg.msg){
                        alert(msg.msg);
                    }
                }
            });
        }
    }
});
window.ZXW_VUE.$EventBus = new Vue();