package com.zjh.zxw.service.impl;

import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.zjh.zxw.common.util.FileUtil;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.domain.dto.AttachInfo;
import com.zjh.zxw.domain.dto.BatchFileDTO;
import com.zjh.zxw.service.AttachmentInfoService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.TimeZone;

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
    public List<AttachInfo> queryAttachInfoListByPath(String filePath){
        List<AttachInfo> attachInfos = new ArrayList<>();
        File file = new File(uploadPath + "autoJsTools" + File.separator + filePath);
        // 当前不是一个目录，直接返回空集合
        if (!file.isDirectory()) {
            return attachInfos;
        }
        File[] files = file.listFiles();
        if(Objects.nonNull(files) && files.length>0){
            for (File f : files) {
                AttachInfo attachInfo = convertAttachInfo(f);
                attachInfos.add(attachInfo);
            }
        }
        return attachInfos;
    }

    public AttachInfo convertAttachInfo(File f){
        AttachInfo attachInfo = new AttachInfo();
        String fileName = f.getName();
        boolean isDirectory = f.isDirectory();
        attachInfo.setIsDirectory(isDirectory);
        if(!isDirectory){
            String poFileName = fileName.substring(0,fileName.lastIndexOf("."));
            String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
            attachInfo.setFileName(poFileName);
            attachInfo.setFileType(fileType);
        } else {
            attachInfo.setFileName(f.getName());
        }
        attachInfo.setPathName(f.getPath());
        attachInfo.setParentPathName(f.getParent());
        attachInfo.setAbsolutePathName(f.getAbsolutePath());
        attachInfo.setFileSize(f.length());
        attachInfo.setLastUpdateTime(LocalDateTime.ofInstant(Instant.ofEpochSecond(f.lastModified()), TimeZone.getDefault().toZoneId()));
        return attachInfo;
    }

    @Override
    public AttachInfo uploadFile(MultipartFile multipartFile, String fileName){
        this.uploadFileToAutoJs(multipartFile,fileName);
        File file = new File(uploadPath + "autoJsTools" + File.separator + fileName);
        AttachInfo attachInfo = convertAttachInfo(file);
        return attachInfo;
    }


    @Override
    public String uploadFileToAutoJs(MultipartFile multipartFile, String imageName) {
        //判断文件保存是否存在
        File file = new File(uploadPath + "autoJsTools" + File.separator + imageName);
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

    @Override
    public Boolean copyFile(String sourcePath, String targetFolderPath) throws IOException {
        String prePath = uploadPath + "autoJsTools" + File.separator;
        if(!sourcePath.contains(prePath) || !targetFolderPath.contains(prePath)){
            throw new BusinessException("非指定目录,不可进行操作");
        }
        // 读取源文件
        File sourceFile = new File(sourcePath);
        if(!sourceFile.exists()){
            // throw new BusinessException("源文件不存在");
            return false;
        }
        //创建目标目录的File对象
        File targetDir = new File(targetFolderPath);
        //如果目的目录不存在
        if(!targetDir.exists()){
            //创建目的目录
            targetDir.mkdirs();
        }
        // 如果是目录
        if(sourceFile.isDirectory()){
            // 先复制目录
            String targetFilePath = targetFolderPath + File.separator + sourceFile.getName();
            FileUtil.copyFile(sourcePath,targetFilePath);
            // 遍历源文件子目录
            File[] files = sourceFile.listFiles();
            if(Objects.nonNull(files) && files.length>0){
                // 遍历文件
                for (File file : files) {
                    // 子文件原始路径
                    String childSourcePath = sourcePath + File.separator + file.getName();
                    // 递归调用复制文件方法
                    this.copyFile(childSourcePath,targetFilePath);
                }
            }
        } else {
            String targetFilePath = targetFolderPath + File.separator + sourceFile.getName();
            FileUtil.copyFile(sourcePath,targetFilePath);
        }
        return true;
    }

    @Override
    public Boolean moveFile(String sourcePath, String targetFolderPath) throws IOException {
        String prePath = uploadPath + "autoJsTools" + File.separator;
        if(!sourcePath.contains(prePath) || !targetFolderPath.contains(prePath)){
            throw new BusinessException("非指定目录,不可进行操作");
        }
        // 先复制
        this.copyFile(sourcePath,targetFolderPath);
        // 再删除
        this.deleteFile(sourcePath);
        return true;
    }



    @Override
    public Boolean reNameFile(String oldFileName, String newFileName) {
        File file = new File(uploadPath + "autoJsTools" + File.separator + oldFileName);
        File newFile = new File(uploadPath + "autoJsTools" + File.separator + newFileName);
        boolean renameTo = file.renameTo(newFile);
        return renameTo;
    }

    @Override
    public Boolean deleteFile(String filePath) throws IOException {
        String prePath = uploadPath + "autoJsTools" + File.separator;
        if(!filePath.contains(prePath)){
            throw new BusinessException("非指定目录,不可进行操作");
        }
        FileUtil.delete(filePath);
        return true;
    }

    @Override
    public Boolean createFolder(String folderName) {
        String folderPath = uploadPath + "autoJsTools" + File.separator + folderName;
        FileUtil.createFolder(folderPath);
        return true;
    }

    @Override
    public Boolean copyFileBatch(BatchFileDTO batchFileDTO) throws IOException {
        List<String> sourcePathList = batchFileDTO.getSourcePathList();
        String targetFolderPath = batchFileDTO.getTargetFolderPath();
        if(CollectionUtils.isNotEmpty(sourcePathList)){
            for (String s : sourcePathList) {
                this.copyFile(s,targetFolderPath);
            }
        }
        return true;
    }

    @Override
    public Boolean moveFileBatch(BatchFileDTO batchFileDTO) throws IOException {
        List<String> sourcePathList = batchFileDTO.getSourcePathList();
        String targetFolderPath = batchFileDTO.getTargetFolderPath();
        if(CollectionUtils.isNotEmpty(sourcePathList)){
            for (String s : sourcePathList) {
                this.moveFile(s,targetFolderPath);
            }
        }
        return true;
    }


}