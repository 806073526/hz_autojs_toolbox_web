layui.define(['jquery'], function (exports) {
	'use strict';
	//var $ = layui.jquery;
	
	var Day_Param = 1000 * 60 * 60 * 24; // 一天等于毫秒数
    var Hour_Param = 1000 * 60 * 60; // 一小时等于毫秒数
    var customTime = 30 * 60 * 1000; // 30分钟毫秒数
    var common ={
    		/**
             * 抛出异常错误信息
             * @param {String} msg
             */
            cmsError: function(msg,title){
    			parent.layer.alert(msg, {
    				title: title,
    				icon: 2,
    				time: 0,
    				resize: false,
    				zIndex: layer.zIndex,
    				anim: Math.ceil(Math.random() * 6)
    			});
    			return;
            },
            cmsInfo: function(msg,title){
                parent.layer.alert(msg, {
                    title: title,
                    icon: 6,
                    time: 0,
                    resize: false,
                    zIndex: layer.zIndex,
                    anim: Math.ceil(Math.random() * 6)
                });
                return;
            },
            cmsConfirm: function(){

            },
            initLoginUser:function(){
            	var adminUser=new Object();
            	$.ajax({
					url: common.getContext()+"/adminUser/getLoginUser.do",
					type: "post",
		            dataType: "json",
		            async: false,
					success: function (data) {
						adminUser=data.adminUser;
					}
				});
            	return adminUser;
            },
            //退出系统
            logOut: function (title, text, url,type, dataType, data, callback) {
                parent.layer.confirm(text, {
                    title: title,
                    resize: false,
                    btn: ['确定退出系统', '不，我点错了！'],
                    btnAlign: 'c',
                    icon: 3

                }, function () {
                	$.ajax({
    					url: common.getContext()+"/login/loginOut.do",
    					type: "post",
    		            dataType: "json",
    		            async: false,
    					success: function (data) {
    						location.href = url;
    						window.sessionStorage.removeItem('adminUser');
    					}
    				});
                }, function () {
                 /*   layer.msg('返回系统', {
                        time: 1500,
                        btnAlign: 'c',
                        btn: ['OK']
                    });*/
                });
            },
    		//遮罩
    		load:{
    			 loadDiv:function(text) {
       		     	var div = "<div id='_layer_'> <div id='_MaskLayer_' style='filter: alpha(opacity=30); -moz-opacity: 0.3; opacity: 0.3;background-color: #000; width: 100%; height: 100%; z-index: 1000; position: absolute;" +       
       		     	"left: 0; top: 0; overflow: hidden; display: none'></div><div id='_wait_' style='z-index: 1005; position: absolute; width:430px;height:218px; display: none'  ><center><h3>" +             
       		     	"" + text + "<img src='../common/images/loading.gif' /></h3></center></div></div>"; 
       		     	return div; 
    			 },
    			//触发遮罩层
    			 LayerShow:function(text) {
    			    var addDiv= this.loadDiv(text);  
	    			var element = $(document.body).append(addDiv);     
	    			//$(window).resize(Position);  
	    			var deHeight = $(document).height();    
	    			var deWidth = $(document).width();    
	    			this.Position();     
	    			$("#_MaskLayer_").show();   
	    			$("#_wait_").show();
    			 },
    			//获取相对位置
    			  Position:function() {  
    				 $("#_MaskLayer_").width($(document).width());   
    				  var deHeight = $(window).height();     
    				  var deWidth = $(window).width();     
    				  $("#_wait_").css({ left: (deWidth - $("#_wait_").width()) / 2 + "px", top: (deHeight - $("#_wait_").height()) / 2 + "px" }); 
    			  },
    			//隐藏遮罩层
    			 LayerHide:function() { 
    				    $("#_MaskLayer_").hide(); 
    				    $("#_wait_").hide(); 
    				    this.del(); 
    			 },
    			//清空div,避免产生重复
    			 del:function() { 
    					 var delDiv = document.getElementById("_layer_");   
    					 delDiv.parentNode.removeChild(delDiv); 
    				//删除
    			  }
    			
    		},
    		/**
             * 获取当前应用的上下文路径
             * @returns {*}
             */
            getContext: function () {
               /* var host = $.url.attr('host');
                var protocol = $.url.attr('protocol');
                var port = $.url.attr('port');
                var path = $.url.attr('path');
                var contextPath;
                if (port == null) {
                    contextPath = protocol + '://' + host + '/' + path.split('/')[1];
                } else {
                    contextPath = protocol + '://' + host + ':' + port + '/' + path.split('/')[1];
                }
                return contextPath;*/
            	var contextPath = "";
                var host=self.location.hostname;
                var protocol = self.location.protocol;
                var port =  self.location.port;
                var path =  self.location.pathname;
               /* if (port == null) {
                    contextPath = protocol + '//' + host + '/' + path.split('/')[1];
                } else {
                    contextPath = protocol + '//' + host + ':' + port + '/' + path.split('/')[1];
                }*/
                /**
                 * spring boot 无需应用名称，直接截取到端口即可
                 * */
                if (port == null) {
                    contextPath = protocol + '//' + host;
                } else {
                    contextPath = protocol + '//' + host + ':' + port;
                }
                return contextPath;
            },
            /**
             * 获取url中指定name的值
             * @param name key
             * @returns {*}
             */
            urlParam: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            },
            /**
             * 增加ajax请求状态处理
             */
            ajaxSessionHandle: function () {
                $.ajaxSetup({
                    contentType: "application/x-www-form-urlencoded;charset=utf-8",
                    cache: false,
                    complete: function (XHR,TS) {
                        var resText=XHR.responseText;
                        if(resText!=null && resText.indexOf("sessionState:0")>0){
                            $.messager.confirm('提示', '您的登录已超时，请重新登录',
                                function(r) {
                                    if(r){
                                        var url = location.pathname;
                                        var urlArray = url.split("/");
                                        window.location.href='/'+urlArray[1]+'/login.html';
                                    }
                                    else{
                                        window.opener=null;
                                        window.open('','_self');
                                        window.close();
                                    }
                                });
                        }
                    }
                });
            },
            /**
             * 日期处理
             */
            date :{
                    /**
                     * 转换日期对象为字符串
                     * @param date 日期对象
                     * @param flag 返回类型标记；true：yyyy-MM-dd;false: yyyy-MM-dd HH:mm:ss
                     */
                    convertDate2String: function (date, flag) {
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var hour = checkTime(date.getHours());
                        var min = checkTime(date.getMinutes());
                        if (flag) {
                            return year + "-" + month + "-" + day + " ";
                        } else {
                            return year + "-" + month + "-" + day + " " + hour + ":" + min;
                        }
                    },
                    /**
                     * 返回与指定日期相差指定时间差的日期
                     * @param interval 要转换的时间类型：y:年；q：季度；m:月；w:周；d:天；hh:时；mm:分；ss:秒
                     * @param date 要转换的日期
                     * @param number 转换的时间
                     * @param flag true:增加；false：减
                     * @returns {string}
                     */
                    getDaydiffDate: function (interval, number, flag, date) {
                        switch (interval) {
                            case "y ":
                            {
                                if (flag)
                                    date.setFullYear(date.getFullYear() + number);
                                else
                                    date.setFullYear(date.getFullYear() - number);
                                return date;
                                break;
                            }
                            case "q ":
                            {
                                if (flag)
                                    date.setMonth(date.getMonth() + number * 3);
                                else
                                    date.setMonth(date.getMonth() - number * 3);
                                return date;
                                break;
                            }
                            case "m ":
                            {
                                if (flag)
                                    date.setMonth(date.getMonth() + number);
                                else
                                    date.setMonth(date.getMonth() - number);
                                return date;
                                break;
                            }
                            case "w ":
                            {
                                if (flag)
                                    date.setDate(date.getDate() + number * 7);
                                else
                                    date.setDate(date.getDate() - number * 7);
                                return date;
                                break;
                            }
                            case "d ":
                            {
                                if (flag)
                                    date.setDate(date.getDate() + number);
                                else
                                    date.setDate(date.getDate() - number);
                                return date;
                                break;
                            }
                            case "hh":
                            {
                                if (flag)
                                    date.setHours(date.getHours() + number);
                                else
                                    date.setHours(date.getHours() - number);
                                return date;
                                break;
                            }
                            case "mm":
                            {
                                if (flag)
                                    date.setMinutes(date.getMinutes() + number);
                                else
                                    date.setMinutes(date.getMinutes() - number);
                                return date;
                                break;
                            }
                            case "ss":
                            {
                                if (flag)
                                    date.setSeconds(date.getSeconds() + number);
                                else
                                    date.setSeconds(date.getSeconds() - number);
                                return date;
                                break;
                            }
                            default:
                            {
                                if (flag)
                                    date.setDate(date.getDate() + number);
                                else
                                    date.setDate(date.getDate() - number);
                                return date;
                                break;
                            }

                        }
                    },
                    /**
                     * 重新格式化日期字符串，排除时间后带“.0”的格式，如“2015-11-11 12:12:20.0”，并通过标记判断是否显示时间
                     * @param dateString 日期字符串
                     * @param flag true：显示时间；false：不显示时间
                     */
                    reformateDateString: function (dateString, flag) {
                        if(dateString){
                            if (dateString.indexOf(".0") != -1) {
                                dateString = dateString.replace(".0", "");
                            }

                            var regEx = new RegExp("\\-", "gi");
                            dateString = dateString.replace(regEx, "/");
                            if (!flag) {

                                dateString = commonutil.date.convertDate2String(new Date(dateString), true);
                            }
                        }
                        return dateString;
                    },
                    /**
                     * 根据传入的日期类型以及标记为获取对应的日期中的年、月、日的值
                     *
                     * @param date 日期类型
                     * @param flag "y":year;"m":mounth;"d":day
                     */
                    getNumFromDate: function (date, flag) {
                        var re = "";
                        if (flag == "y") {
                            re = date.getFullYear();
                        } else if (flag == "m") {
                            re = date.getMonth()+1;
                        }
                        else if (flag == "d") {
                            re = date.getDay();
                        }
                        return re;
                    },
                    //js比较日期大小
                     dateCompare:function(startdate, enddate) {
                    var arr = startdate.split("-");
                    var starttime = new Date(arr[0], arr[1], arr[2]);
                    var starttimes = starttime.getTime();

                    var arrs = enddate.split("-");
                    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
                    var lktimes = lktime.getTime();

                    if (starttimes > lktimes) {
                        return false;
                    }
                    else
                        return true;
                }
            }
    }
    
    exports("common",common);
});

// 将时间为个位数时增加'0'，即'09:10'
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}