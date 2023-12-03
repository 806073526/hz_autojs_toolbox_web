package com.zjh.zxw.common.util;


import org.springframework.util.AntPathMatcher;

import java.util.Arrays;
import java.util.List;

public class ValidateInterfaceConfig {
    public static final List<String> LIST = Arrays.asList(
            "/device/sendMessageToClient",
            "/device/sendMessageToMultipleClient",
            "/device/syncWebFileToPhone"
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