export const getContext = () => {
    let contextPath = ""
    const host = self.location.hostname
    var protocol = self.location.protocol
    var port = self.location.port
    var path = self.location.pathname
    if (port == null) {
        contextPath = protocol + '//' + host
    } else {
        contextPath = protocol + '//' + host + ':' + port
    }
    return contextPath
}

export const initLoginUser = () => {
    var adminUser = new Object();
    $.ajax({
        url: getContext() + "/adminUser/getLoginUser.do",
        type: "post",
        dataType: "json",
        async: false,
        success: function (data) {
            adminUser = data.adminUser;
        }
    });
    return adminUser;
}


/**
 * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
 **/

export const isNumber = (val) => {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}