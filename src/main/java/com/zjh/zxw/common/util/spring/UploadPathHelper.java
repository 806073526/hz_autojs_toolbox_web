package com.zjh.zxw.common.util.spring;

import java.io.File;

public  class UploadPathHelper {

    public static boolean isWindowsSystem(){
        String osName = System.getProperty("os.name");
        return osName.startsWith("Windows");
    }

    public static String getUploadPath(String uploadPath){
        File file = new File(uploadPath);
        if(!file.exists()){
            boolean createSuccess = file.mkdirs();
            if(!createSuccess){
                uploadPath = isWindowsSystem() ?  "C:"+File.separator+"zxwAjUpload"+File.separator : File.separator + "zxwAjUpload" + File.separator;
                file = new File(uploadPath);
                file.mkdirs();
            }
        }
        return uploadPath;
    }
}
