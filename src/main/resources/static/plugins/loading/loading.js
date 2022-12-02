/**
 * jQuery EasyUI 1.3.3
 *
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
function ajaxLoading(obj){
    if(obj){
        $("<div class='datagrid-mask'></div>").css({display:"block",width:"100%",height:$("#"+obj).height()}).appendTo($("#"+obj));
        $("<div class='datagrid-mask-msg'></div>").html("正在处理，请稍候。。。").appendTo($("#"+obj)).css({display:"block",left:($("#"+obj).outerWidth(true) - 190) / 2,top:($("#"+obj).height() - 45) / 2});
    }else{
        $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");
        $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});
    }

}
function ajaxLoadEnd(obj){
    if(obj){
        $("#"+obj+" .datagrid-mask").remove();
        $("#"+obj+" .datagrid-mask-msg").remove();
    }else{
        $(".datagrid-mask").remove();
        $(".datagrid-mask-msg").remove();
    }
}
function drugformatter(value,row,index)
{
    var indexstr=value.substr(0,1);
    if(indexstr=='.'){
        return '0'+value;
    }else{
        return value;
    }
}

function dateformatter(value,row,index) {
    var indexstr = value.indexOf('.');
    if (indexstr > 0) {
        value = value.substr(0,indexstr);
        return value;
    } else {
        return value;
    }
}

