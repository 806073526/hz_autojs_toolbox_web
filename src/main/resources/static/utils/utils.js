export const getContext = () => {
    let contextPath = "";
    const host = self.location.hostname;
    let protocol = self.location.protocol;
    let port = self.location.port;
    let path = self.location.pathname;
    if (port == null) {
        contextPath = protocol + '//' + host;
    } else {
        contextPath = protocol + '//' + host + ':' + port;
    }
    return contextPath;
};


/**
 * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
 **/

export const isNumber = (val) => {
    let regPos = /^\d+(\.\d+)?$/; //非负浮点数
    let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    return regPos.test(val) || regNeg.test(val);
};



/**
 * 创建排序方法
 * @param {Array} array 原数组
 * @param {String} key 排序key
 * @param {Boolean} order 排序方法 true正序 false倒序
 * @returns
 */
export const sortByKey = (array, key, order) => {
    return array.sort(function (a, b) {
        let x = a[key]; let y = b[key];
        if (order) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        } else {
            return ((x < y) ? ((x > y) ? 1 : 0) : -1)
        }
    })
};

// 获取链接参数
export const urlParam = (name)=> {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
};

// 颜色转换
export const rgb2hex = (rgb)=> {
    let reg=/(\d{1,3}),(\d{1,3}),(\d{1,3})/;
    let arr=reg.exec(rgb);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    let _hex="#" + hex(arr[1]) + hex(arr[2]) + hex(arr[3]);
    return _hex.toUpperCase();
};

// 补0
export const zeroFill = (i)=> {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return String(i);
    }
};


/**
 * 初始化文件编辑器
 * @param _that this对象
 * @param editorKey 编辑器key
 * @param containerId 容器id
 * @param getEditorCompleteFun 获取编辑器依赖加载完成方法
 * @param fileContent 文件内容
 * @param language 语言 默认javascript
 * @param theme 主题 vs-dark
 * @param editorChangeCallBack 编辑器值变化回调函数 e对象 value编辑器值
 */
export const initFileEditor = (_that,editorKey,containerId,getEditorCompleteFun,fileContent,language='javascript',theme='vs-dark',editorChangeCallBack) =>{
    _that.$nextTick(()=>{
        let interval = null;
        // 初始化编辑器
        let initEditorFun = ()=>{
            // 校验依赖是否已初始化完成
            let flag = getEditorCompleteFun();
            if(flag){
                // 已经初始化 则直接设置值
                if(_that[editorKey]){
                    _that[editorKey].setValue(fileContent)
                    // 未初始化则 初始化
                } else {
                    _that[editorKey] = monaco.editor.create(document.getElementById(containerId), {
                        value: fileContent,
                        language: language,
                        theme: theme
                    });
                    _that[editorKey].onDidChangeModelContent((e)=>{
                        if(editorChangeCallBack){
                            editorChangeCallBack(e,_that[editorKey].getValue())
                        }
                    });
                }
                // 关闭定时器
                clearInterval(interval);
            }
        };
        // 立即触发一次
        initEditorFun();
        // 再开启定时器
        interval = setInterval(()=>{
            initEditorFun();
        },200);
    })
};