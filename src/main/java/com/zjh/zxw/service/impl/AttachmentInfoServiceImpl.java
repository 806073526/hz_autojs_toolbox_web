package com.zjh.zxw.service.impl;

import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.service.AttachmentInfoService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

/**
 * <p>
 * 业务实现类
 * 附件表
 * </p>
 *
 * @author zhengjianhua
 * @date 2021-06-05
 */
@Slf4j
@Service
public class AttachmentInfoServiceImpl implements AttachmentInfoService {

    @Value("${com.zjh.uploadPath}")
    private String uploadPath;


    @Override
    public String uploadFileToAutoJs(MultipartFile multipartFile, String imageName) {
        //判断文件保存是否存在
        File file = new File(uploadPath + File.separator + "autoJsTools" + File.separator + imageName);
        if (file.getParentFile() != null || !Objects.requireNonNull(file.getParentFile()).isDirectory()) {
            //创建文件
            file.getParentFile().mkdirs();
        }
        InputStream inputStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            inputStream = multipartFile.getInputStream();
            fileOutputStream = new FileOutputStream(file);
            //写出文件
            byte[] buffer = new byte[2048];
            IOUtils.copyLarge(inputStream, fileOutputStream, buffer);

        } catch (IOException e) {
            throw new BusinessException("操作失败" + e.getMessage());
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
                if (fileOutputStream != null) {
                    fileOutputStream.flush();
                    fileOutputStream.close();
                }
            } catch (IOException e) {
                throw new BusinessException("操作失败" + e.getMessage());
            }
        }
        return "uploadPath/autoJsTools/" + imageName;
    }


}