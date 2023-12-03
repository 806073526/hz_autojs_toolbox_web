package com.zjh.zxw.common.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.*;

/**
 * 字符串帮助类
 *
 * @author duanX
 * @date 2019-01-29 22:09
 */
@Slf4j
public class StrHelper {
   /**
   * @Description 将Object对象转换为String对象
   * @Author  duanX
   * @Date   2019-12-2 11:32
   * @Param  Object
   * @Return  String
   * @Exception
   *
   */
    public static String getObjectValue(Object obj) {
        return obj == null ? "" : obj.toString();
    }

    public static String encode(String value) {
        try {
            String reuslt =  URLEncoder.encode(value, "utf-8");
            return reuslt.replaceAll("\\+","%20");
        } catch (Exception e) {
            return "";
        }
    }

    public static String decode(String value) {
        try {
            return URLDecoder.decode(value, "utf-8");
        } catch (Exception e) {
            return "";
        }
    }

    /**
    * @Description 获取String对象，如果为空则取默认值
    * @Author  duanX
    * @Date   2019-12-2 11:33
    * @Param  String
    * @Return String
    * @Exception
    *
    */
    public static String getOrDef(String val, String def) {
        return StringUtils.isEmpty(val) ? def : val;
    }

    public static String getOrDef(Object val, String def) {
        return Objects.isNull(val) ? def : val.toString();
    }


    /**
     * 补零函数
     * @param num  需要补零的数字字符串,可针对普通字符串补零,为null，补n个零
     * @param n    补零后的字符串长度
     * @param left 从左侧开始补零，false,从右侧开始补零
     * @return
     */
    public static String fillZero(String num, int n,boolean left){
        if(num == null){
            num = "";
        }
        if(n < 0){
            throw new RuntimeException("补零后的长度不能为负数");
        }
        if(n < num.length()){
            throw new RuntimeException("所给字符串长度大于补零后字符串长度，补零失败");
        }
        if(n == num.length()){
            return num;
        }
        int zoreNum = n - num.length();
        StringBuilder sb = new StringBuilder("");
        for(int i = 0; i < zoreNum; i++){
            sb.append("0");
        }
        if(left){
            sb.append(num);
        }else{
            sb.insert(0,num);
        }
        return sb.toString();
    }


    /**
     * 查询一个字符串再另一个字符串中出现的下标
     * @param str
     * @param key
     * @return
     */
    public static List<Integer> searchAllIndex(String str, String key) {
        List<Integer> allIndex=new ArrayList<Integer>();
        int a = str.indexOf(key);//*第一个出现的索引位置
        while (a != -1) {
            allIndex.add(a);
            a = str.indexOf(key, a + 1);//*从这个索引往后开始第一个出现的位置
        }
        return allIndex;
    }

    /**
     * 根据关键字 获取字符串中参数
     * @param string
     * @param keyStart 如'${
     * @param keyEnd 如 }'
     * @return
     */
    public static List<String> getKeyListFromString(String string,String keyStart,String keyEnd){
        // 返回数据
        List<String> allStringList=new ArrayList<String>();
        // 判断不为空
        if(StringUtils.isNotBlank(string)){
            // 去空格
            string = string.replaceAll("\\\\s*","");
            // 开始keyIndex集合
            List<Integer> firstIndex=searchAllIndex(string,keyStart);
            // 结束keyIndex集合
            List<Integer> endIndex=searchAllIndex(string,keyEnd);
            // 不为空
            if(CollectionUtils.isNotEmpty(firstIndex)){
                // 循环
                for(int i=0;i<firstIndex.size();i++){
                    // 截取关键字部分
                    String temp = string.substring(firstIndex.get(i)+keyStart.length(),endIndex.get(i)) ;
                    // 添加到返回数据中
                    allStringList.add(temp);
                }
            }
        }
        return allStringList;
    }

    /**
     * 字符串分割成ArrayList
     * @param source  源字符串
     * @param split  分隔符
     * @return
     */
    public static List<String>  str2ArrayListBySplit(String source,String split) {
        if(org.apache.commons.lang3.StringUtils.isBlank(source)) {
            return Collections.emptyList();
        }
        if(org.apache.commons.lang3.StringUtils.isBlank(split)) {
            split = StrPool.COMMA;
        }
        return Arrays.asList(org.apache.commons.lang3.StringUtils.split(source,split));
    }

}
