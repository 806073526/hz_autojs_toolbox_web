package com.zjh.zxw.common.util;

import com.zjh.zxw.common.util.spring.UploadPathHelper;
import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class runTimeExecUtils {

    /*private static String tempPath = isWindowsSystem() ? "C:"+File.separator+"temp" : File.separator + "temp";
    public static boolean isWindowsSystem(){
        String osName = System.getProperty("os.name");
        return osName.startsWith("Windows");
    }

    public static String executeBatScript(String batScript) {
        StringBuilder stringBuilder = new StringBuilder();
        FileWriter fw = null;
        String location = "";
        try {
            tempPath = UploadPathHelper.getUploadPath(tempPath);
            location = tempPath+ File.separator + (isWindowsSystem() ? "temp.bat" : "temp.sh");
            File fileStart = new File(location);
            if(!fileStart.exists()){
                fileStart.createNewFile();
            }
            FileOutputStream outputStream = new FileOutputStream(location);
            Writer writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8);
            //生成bat文件
            // fw = new FileWriter(location);
            writer.write("chcp 65001\r\n" + batScript);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        Process process;
        try {
            process = Runtime.getRuntime().exec(location);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line).append(" ");
            }
            return stringBuilder.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    *//**
     * 执行bat命令
     * @param batCommand
     * @return
     *//*
    public static String execBatCommand(String batCommand){
        StringBuilder stringBuilder = new StringBuilder();
        Process process;
        try {
            process = Runtime.getRuntime().exec(batCommand);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "GBK"));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line).append(" ");
            }
            return stringBuilder.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }*/
}
