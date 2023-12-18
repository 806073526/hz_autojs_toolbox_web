package com.zjh.zxw.common.util;


import org.springframework.util.AntPathMatcher;

import java.util.Arrays;
import java.util.List;

public class ValidateInterfaceConfig {
    public static final List<String> LIST = Arrays.asList(
            "/device/sendMessageToClient",
            "/device/sendMessageToMultipleClient",
            "/device/syncWebFileToPhone", // 同步文件到手机
            "/device/syncWebProjectToPhone", // 同步项目到手机
            "/device/execStartWebProject", // 运行项目
            "/device/execStopProject", // 停止项目
            "/device/phoneCopyFiles", // 手机端复制文件
            "/device/phoneMoveFiles", // 手机端移动文件
            "/device/phoneExecScript", // 手机端执行脚本
            "/device/startOnlineLog",// 开启实时日志
            "/device/stopOnlineLog"// 停止实时日志
    );
    private static final AntPathMatcher ANT_PATH_MATCHER = new AntPathMatcher();

    public static boolean needValidateInterface(String currentUri) {
        return validateInterface(LIST, currentUri);
    }

    public static boolean validateInterface(List<String> list, String currentUri) {
        if (list.isEmpty()) {
            return false;
        }
        return list.stream().anyMatch((url) ->
                currentUri.startsWith(url) || ANT_PATH_MATCHER.match(url, currentUri)
        );
    }
}