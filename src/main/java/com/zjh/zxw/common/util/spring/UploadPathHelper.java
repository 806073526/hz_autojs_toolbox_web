package com.zjh.zxw.common.util.spring;

import java.io.File;

public  class UploadPathHelper {
    public static String getUploadPath(String uploadPath){
        File file = new File(uploadPath);
        if(!file.exists()){
            boolean createSuccess = file.mkdirs();
            if(!createSuccess){
                uploadPath = "C:\\zxwAjUpload\\";
                file = new File(uploadPath);
                file.mkdirs();
            }
        }
        return uploadPath;
    }
}
