package com.zjh.zxw.common.util;

import java.util.function.BiConsumer;
import java.util.function.Consumer;

/**
 * @ClassName LambdaUtils
 * @Description 遍历list
 * @Author duanX
 * @Date 2021/4/13 16:35
 * @Version 1.0
 */
public class LambdaUtils {
    /**
     * 主要作用，为for循环提供项目值和index索引
     * @param consumer
     * @param <T>
     * @return
     */
    public static <T> Consumer<T> consumerWithIndex(BiConsumer<T, Integer> consumer) {
        class Obj {
            int i;
        }
        Obj obj = new Obj();
        return t -> {
            int index = obj.i++;
            consumer.accept(t, index);
        };
    }


}
