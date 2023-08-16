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

export const getEditorType = ()=> {
    // 获取编辑器类型
    return window.localStorage.getItem("editorType") || 'ace';
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
        let x = a[key];
        let y = b[key];
        if (order) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        } else {
            return ((x < y) ? ((x > y) ? 1 : 0) : -1)
        }
    })
};

/**
 * 创建排序方法
 * @param {Array} array 原数组
 * @param {String} key 排序key
 * @param {Boolean} order 排序方法 true正序 false倒序
 * @returns
 */
export const sortByKeyFirst = (array, key, order) => {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        if (order) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        } else {
            return ((x < y) ? ((x > y) ? 1 : 0) : -1)
        }
    })
};
// 获取链接参数
export const urlParam = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
};

// 颜色转换
export const rgb2hex = (rgb) => {
    let reg = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;
    let arr = reg.exec(rgb);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    let _hex = "#" + hex(arr[1]) + hex(arr[2]) + hex(arr[3]);
    return _hex.toUpperCase();
};

// 补0
export const zeroFill = (i) => {
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
 * @param language 语言 默认javascript  ace编辑器固定为JavaScript
 * @param theme 主题 vs-dark  ace编辑器固定为 visual_studio_dark
 * @param editorChangeCallBack 编辑器值变化回调函数 e对象 value编辑器值
 * @param editorScrollChangeCallBack 编辑器滚动变化回调函数
 */
export const initFileEditor = (_that, editorKey, containerId, getEditorCompleteFun, fileContent, language = 'javascript', theme = 'vs-dark', editorChangeCallBack, editorScrollChangeCallBack) => {
    _that.$nextTick(() => {
        // 编辑器类型
        let editorType = getEditorType();
        if('vscode' === editorType){
            let interval = null;
            // 初始化编辑器
            let initEditorFun = () => {
                // 校验依赖是否已初始化完成
                let flag = getEditorCompleteFun();
                if (flag) {
                    // 已经初始化 则直接设置值
                    if (_that[editorKey]) {
                        _that[editorKey].setValue(fileContent)
                        // 未初始化则 初始化
                    } else {
                        _that[editorKey] = monaco.editor.create(document.getElementById(containerId), {
                            value: fileContent,
                            language: language,
                            theme: theme
                        });
                        _that[editorKey].onDidChangeModelContent((e) => {
                            if (editorChangeCallBack) {
                                editorChangeCallBack(e, _that[editorKey].getValue())
                            }
                        });
                        _that[editorKey].onDidScrollChange((e) => {
                            if (editorScrollChangeCallBack) {
                                editorScrollChangeCallBack(e)
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
            interval = setInterval(() => {
                initEditorFun();
            }, 200);
        } else if('ace' === editorType){
            let editor = window.ace.edit(containerId);
            editor.setTheme('ace/theme/visual_studio_dark');
            editor.setFontSize(14);
            editor.renderer.setScrollMargin(0, 0, 0, 50);
            // auto complete options
            editor.setOptions({
                enableSnippets: true,
                enableLiveAutocompletion: true,
                showPrintMargin: false,
                hasCssTransforms: true,
                fixedWidthGutter: false,
                scrollPastEnd: 0.5
            });
            // language mode
            editor.session.setMode("ace/mode/javascript");
            let autojsCompleter = new Completer(AUTOJS_INDICES);
            editor.completers.push(autojsCompleter);

            // code formatting
            editor.beautify = function (indentSize) {
                if (!indentSize) {
                    indentSize = 4;
                }

                function beautifyCode(code) {
                    return js_beautify(code, {
                        'indent_size': indentSize,
                        'e4x': true
                    });
                }

                let selectedText = this.getSelectedText();
                if (selectedText) {
                    editor.session.replace(editor.selection.getRange(), beautifyCode(selectedText));
                } else {
                    editor.setValue(beautifyCode(editor.getValue()), -1);
                }
            };

            // debugging line
            editor.setDebuggingLine = function (line) {
                if (editor.session.$debuggingLineMarkerId !== undefined) {
                    editor.session.removeMarker(editor.session.$debuggingLineMarkerId);
                    editor.session.$debuggingLineMarkerId = undefined;
                }
                if (line !== -1) {
                    editor.session.$debuggingLineMarkerId = editor.session.addMarker(new Range(line, 0, line, 1), "debug-marker", "fullLine");
                }
            };

            // breakpoints
            editor.toggleBreakpoint = function (line) {
                let className = editor.session.getBreakpoints()[line];
                let isBreakpointAdded;
                if (className === 'ace_breakpoint') {
                    editor.session.setBreakpoint(line, null);
                    isBreakpointAdded = false;
                } else {
                    editor.session.setBreakpoint(line, 'ace_breakpoint');
                    isBreakpointAdded = true;
                }
            };

            editor.getBreakpoints = function () {
                return Object.keys(editor.session.getBreakpoints());
            };
            editor.on("guttermousedown", function (e) {
                let target = e.domEvent.target;
                if (target.className.indexOf("ace_gutter-cell") === -1)
                    return;
                let row = e.getDocumentPosition().row;
                e.editor.toggleBreakpoint(row);
                e.stop();
            });

            // undo managers
            editor.isClean = function () {
                let um = this.session.getUndoManager();
                return um && um.isClean ? um.isClean() : true;
            };
            editor.canUndo = function () {
                let um = this.session.getUndoManager();
                return um && um.canUndo && um.canUndo();
            };
            editor.canRedo = function () {
                let um = this.session.getUndoManager();
                return um && um.canRedo && um.canRedo();
            };

            // edit sessions
            editor.resetSession = function () {
                editor.setSession(new ace.EditSession('', 'ace/mode/javascript'))
            };

            editor.on('change', function (e) {
                if (editorChangeCallBack) {
                    editorChangeCallBack(e, editor.getValue());
                }
            });

            editor.session.on('changeScrollTop', function (e) {
                if (editorScrollChangeCallBack) {
                    let obj = {
                        scrollLeft:editor.session.getScrollLeft(),
                        scrollTop:e
                    };
                    editorScrollChangeCallBack(obj, editor.getValue());
                }
            });

            editor.setValue(fileContent);
            editor.clearSelection();
            document.getElementById(containerId).oncontextmenu = (e)=>{
                    e.preventDefault();
                    editor.beautify();
            };
            _that[editorKey]=editor;
        }
    })
};


/**
 * 查询缓存数据方法
 * @param clearCacheFun 清除缓存方法
 * @param queryCacheFun 查询缓存方法
 * @param intervalTime 定时间隔
 * @param intervalCount 定时间隔次数
 * @param completeCallBack 完成回调
 */
export const queryCacheData = (clearCacheFun, queryCacheFun, intervalTime, intervalCount, completeCallBack) => {
    // 调用清除缓存方法
    clearCacheFun();
    // 清除成功后立即执行查询缓存方法
    let cacheResult = queryCacheFun();
    // 有返回结果
    if (cacheResult) {
        // 返回缓存数据
        completeCallBack(cacheResult);
        return;
    }
    // 累计次数
    let totalCount = 0;
    // 开启定时器
    let intervalTimer = setInterval(() => {
        // 调用查询缓存方法
        cacheResult = queryCacheFun();
        totalCount += 1;
        // 结果有值 或者超过次数
        if (cacheResult || totalCount >= intervalCount) {
            // 执行回调
            completeCallBack(cacheResult);
            clearInterval(intervalTimer);
        }
    }, intervalTime);
};

const getFileInfoByPath = (relativeFilePath) => {
    let fileInfo = null;
    $.ajax({
        url: getContext() + "/attachmentInfo/querySingleAttachInfoByPath",
        type: "GET",
        dataType: "json",
        data: {
            "relativeFilePath": relativeFilePath
        },
        async: false,
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
};

/**
 * 处理数据在文件变化后
 * @param changeFilePath 变化文件路径
 * @param changeBeforeFun 变化前处理函数
 * @param changeAfterFun 变化后处理函数
 * @param timeOutFun 超时处理函数
 */
export const handlerByFileChange = (changeFilePath, changeBeforeFun, changeAfterFun, timeOutFun) => {
    let fileNoChangeCount = 0;//连续未变化次数
    let startFlag = false; //开始处理标志
    // 原始文件信息
    let sourceFileInfo = getFileInfoByPath(changeFilePath);
    let sourceFileSize = sourceFileInfo ? sourceFileInfo.fileSize : 0;
    let sourceLastUpdateTime = sourceFileInfo ? sourceFileInfo.lastUpdateTime : '';
    if (changeBeforeFun) {
        changeBeforeFun()
    }
    // 每隔200毫秒执行一次查询
    let refreshTimer = setInterval(() => {
        // 当前文件信息
        let curFileInfo = getFileInfoByPath(changeFilePath);
        let curFileSize = curFileInfo ? curFileInfo.fileSize : 0;
        let curLastUpdateTime = curFileInfo ? curFileInfo.lastUpdateTime : '';
        if (sourceFileSize !== curFileSize || sourceLastUpdateTime !== curLastUpdateTime) {
            // 内容有变化时开始记录
            startFlag = true;
        }
        // 有一次变化后 文件大小和时间连续没有变化
        if (sourceFileSize === curFileSize && sourceLastUpdateTime === curLastUpdateTime && startFlag) {
            // 文件未变化计数加一
            fileNoChangeCount++;
        } else {
            sourceFileSize = curFileSize;
            sourceLastUpdateTime = curLastUpdateTime;
            fileNoChangeCount = 0;// 重置次数
        }
        // 200*3 0.6秒钟未变化 认为图片上传完成
        if (fileNoChangeCount >= 3) {
            setTimeout(() => {
                if (changeAfterFun) {
                    changeAfterFun();
                }
            }, 200);
            // 关闭定时器
            clearInterval(refreshTimer);
            refreshTimer = null;
        }
    }, 200);

    setTimeout(()=>{
        clearInterval(refreshTimer);
        refreshTimer = null;
        if(timeOutFun){
            timeOutFun();
        }
    },1000 * 30)

};


const clearAppMsgServiceKey = (appMsgServiceKey) => {
    $.ajax({
        url: getContext() + "/attachmentInfo/clearAppMsgServiceKey",
        type: "GET",
        dataType: "json",
        data: {
            "appMsgServiceKey": appMsgServiceKey
        },
        async: false,
        success: function (data) {
            if (data) {
            }
        },
        error: function (msg) {
        }
    });
};

const queryAppMsgServiceKey = (appMsgServiceKey) => {
    let serviceValue = null;
    $.ajax({
        url: getContext() + "/attachmentInfo/queryAppMsgServiceKey",
        type: "GET",
        dataType: "json",
        data: {
            "appMsgServiceKey": appMsgServiceKey
        },
        async: false,
        success: function (data) {
            if (data) {
                if (data.isSuccess) {
                    serviceValue = data.data;
                }
            }
        },
        error: function (msg) {
        }
    });
    return serviceValue;
};


/**
 * 处理数据在app消息缓存变化后
 * @param appMsgServiceKey
 * @param changeBeforeFun
 * @param changeAfterFun
 */
export const handlerAppByCacheChange = (appMsgServiceKey, changeBeforeFun, changeAfterFun) => {
    // 先清除缓存
    clearAppMsgServiceKey(appMsgServiceKey);
    // 原始文件信息
    let sourceServiceValue = queryAppMsgServiceKey(appMsgServiceKey);
    if (changeBeforeFun) {
        changeBeforeFun()
    }
    // 每隔200毫秒执行一次查询
    let refreshTimer = setInterval(() => {
        let curServiceValue = queryAppMsgServiceKey(appMsgServiceKey);
        if (sourceServiceValue !== curServiceValue) {
            setTimeout(() => {
                if (changeAfterFun) {
                    changeAfterFun();
                }
            }, 200);
            // 关闭定时器
            clearInterval(refreshTimer);
            refreshTimer = null;
        }
    }, 200);
};