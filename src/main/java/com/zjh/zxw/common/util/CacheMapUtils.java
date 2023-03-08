package com.zjh.zxw.common.util;

import java.util.HashMap;
import java.util.Map;

public class CacheMapUtils {

    private static Map<String, String> CACHE = new HashMap<>();


    public static void Put(String k, String v) {
        CACHE.put(k, v);
    }

    public static void Get(String k){
        CACHE.get(k);
    }


}
