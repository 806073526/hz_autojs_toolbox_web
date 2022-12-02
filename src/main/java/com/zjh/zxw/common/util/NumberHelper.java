package com.zjh.zxw.common.util;

import java.util.function.Function;


/**
 * 数字类型 帮助类
 *
 * @author duanX
 * @date 2019/11/20
 */
public class NumberHelper {

    private static <T, R> R valueOfDef(T t, Function<T, R> function, R def) {
        try {
            return function.apply(t);
        } catch (Exception e) {
            return def;
        }
    }

    public static Long longValueOfNil(String value) {
        return valueOfDef(value, (val) -> Long.valueOf(val), null);
    }

    public static Long longValueOf0(String value) {
        return valueOfDef(value, (val) -> Long.valueOf(val), 0L);
    }

    public static Long longValueOfNil(Object value) {
        return valueOfDef(value, (val) -> Long.valueOf(val.toString()), null);
    }

    public static Long longValueOf0(Object value) {
        return valueOfDef(value, (val) -> Long.valueOf(val.toString()), 0L);
    }

    public static Integer intValueOfNil(String value) {
        return valueOfDef(value, (val) -> Integer.valueOf(val), null);
    }

    public static Integer intValueOf0(String value) {
        return intValueOf(value, 0);
    }

    public static Integer intValueOf(String value, Integer def) {
        return valueOfDef(value, (val) -> Integer.valueOf(val), def);
    }

    public static Integer intValueOfNil(Object value) {
        return valueOfDef(value, (val) -> Integer.valueOf(val.toString()), null);
    }

    public static Integer intValueOf0(Object value) {
        return valueOfDef(value, (val) -> Integer.valueOf(val.toString()), 0);
    }

    public static Integer getOrDef(Integer val, Integer def) {
        return val == null ? def : val;
    }

    public static Long getOrDef(Long val, Long def) {
        return val == null ? def : val;
    }

    public static Boolean getOrDef(Boolean val, Boolean def) {
        return val == null ? def : val;
    }

    public static Double getOrDef(Double val, Double def) {
        return val == null ? def : val;
    }

    /**
     * 是否连续的数组
     * @param a
     * @return
     */
    public static boolean isContinusArray(Integer a[]) {
        int min = a[0];
        int max = a[0];
        for(int i = 1; i < a.length; i++) {
            if(a[i] < min && a[i] !=0 ) {
                min = a[i];
            }
            if(a[i] > max && a[i] != 0) {
                max = a[i];
            }
        }

        if((max - min) <= a.length-1 ) {
            return true;
        }
        return false;

    }
}


