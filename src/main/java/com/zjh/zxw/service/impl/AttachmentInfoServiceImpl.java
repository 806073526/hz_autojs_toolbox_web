package com.zjh.zxw.service.impl;

import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.zjh.zxw.common.util.FileUtil;
import com.zjh.zxw.common.util.UnZipUtils;
import com.zjh.zxw.common.util.ZipUtils;
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
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

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

    private static final int BUFFER_SIZE = 1024;
    @Value("${com.zjh.uploadPath}")
    private String uploadPath;

    private String getRootPath() {
        return uploadPath + "autoJsTools" + File.separator;
    }

    private String getPreviewRootUrl() {
        return "uploadPath/autoJsTools/";
    }

    @Override
    public List<AttachInfo> queryAttachInfoListByPath(String relativeFilePath){
        List<AttachInfo> attachInfos = new ArrayList<>();
        File file = new File(this.getRootPath() + relativeFilePath);
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
        attachInfos = attachInfos.stream().sorted(Comparator.comparing(attachInfo -> !attachInfo.getIsDirectory())).collect(Collectors.toList());
        return attachInfos;
    }

    @Override
    public List<AttachInfo> queryAllAttachInfoListByPath(String relativeFilePath, Boolean onlyQueryFolder) {
        List<AttachInfo> attachInfos = new ArrayList<>();
        File file = new File(this.getRootPath() + relativeFilePath);
        // 当前不是一个目录，直接返回空集合
        if (!file.isDirectory()) {
            return attachInfos;
        }
        File[] files = file.listFiles();
        if(Objects.nonNull(files) && files.length>0){
            for (File f : files) {
                // 仅查询文件夹 且当前是文件
                if(onlyQueryFolder && f.isFile()){
                    continue;
                }
                AttachInfo attachInfo = convertAttachInfo(f);
                // 如果文件是一个目录
                if(f.isDirectory()){
                    // 获取子文件夹的绝对路径
                    String childRelativeFilePath = relativeFilePath + File.separator + f.getName();
                    // 获取子目录的附件信息
                    List<AttachInfo> childAttachList =  this.queryAllAttachInfoListByPath(childRelativeFilePath,onlyQueryFolder);
                    // 设置children
                    attachInfo.setChildren(childAttachList);
                }
                attachInfos.add(attachInfo);
            }
        }
        attachInfos = attachInfos.stream().sorted(Comparator.comparing(attachInfo -> !attachInfo.getIsDirectory())).collect(Collectors.toList());
        return attachInfos;
    }

    public AttachInfo convertAttachInfo(File f){
        AttachInfo attachInfo = new AttachInfo();
        String fileName = f.getName();
        boolean isDirectory = f.isDirectory();
        attachInfo.setIsDirectory(isDirectory);
        if(!isDirectory){
            if(fileName.lastIndexOf(".")!=-1){
                String poFileName = fileName.substring(0,fileName.lastIndexOf("."));
                String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
                attachInfo.setFileName(poFileName);
                attachInfo.setFileType(fileType);
            } else {
                attachInfo.setFileName(fileName);
            }
        } else {
            attachInfo.setFileName(f.getName());
        }
        String filePath = f.getPath();
        String rootPath = this.getRootPath();
        String previewRootUrl = this.getPreviewRootUrl();
        String previewUrl =  previewRootUrl + filePath.replace(rootPath,"");
        previewUrl = previewUrl.replace("\\","/");
        attachInfo.setPreviewUrl(previewUrl);
        attachInfo.setPathName(filePath);
        attachInfo.setParentPathName(f.getParent());
        attachInfo.setAbsolutePathName(f.getAbsolutePath());
        attachInfo.setFileSize(f.length());
        // LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochSecond(f.lastModified()), ZoneId.systemDefault());
        Date date = new Date(f.lastModified());
        LocalDateTime localDateTime = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
        attachInfo.setLastUpdateTime(localDateTime);
        return attachInfo;
    }

    @Override
    public AttachInfo uploadFile(MultipartFile multipartFile, String fileName){
        this.uploadFileToAutoJs(multipartFile,fileName);
        File file = new File(this.getRootPath() + fileName);
        AttachInfo attachInfo = convertAttachInfo(file);
        return attachInfo;
    }


    @Override
    public String uploadFileToAutoJs(MultipartFile multipartFile, String imageName) {
        //判断文件保存是否存在
        File file = new File(this.getRootPath() + imageName);
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
        String prePath = this.getRootPath();
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
            targetFilePath = getTargetFilePathNoExit(targetFilePath,true);
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
            // 获取不重复的名称
            targetFilePath = getTargetFilePathNoExit(targetFilePath,false);
            FileUtil.copyFile(sourcePath,targetFilePath);
        }
        return true;
    }

    /**
     * 返回一个不存在的名称
     * @param targetFilePath
     * @return
     */
    private String getTargetFilePathNoExit(String targetFilePath,Boolean isDirectory){
        File targetFile = new File(targetFilePath);
        if(targetFile.exists()){
            if(isDirectory){
                targetFilePath = targetFilePath+"(1)";
                return getTargetFilePathNoExit(targetFilePath,isDirectory);
            } else {
                List<String> stringList = new ArrayList<String>(Arrays.asList(StringUtils.split(targetFilePath,".")));
                targetFilePath = stringList.get(0) +  "(1)." + stringList.get(stringList.size()-1);
                return getTargetFilePathNoExit(targetFilePath,isDirectory);
            }
        } else {
            return targetFilePath;
        }
    }

    @Override
    public Boolean moveFile(String sourcePath, String targetFolderPath) throws IOException {
        String prePath = this.getRootPath();
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
    public Boolean reNameFile(String oldFilePathName, String newFilePathName) {
        String prePath = this.getRootPath();
        if(!oldFilePathName.contains(prePath) || !newFilePathName.contains(prePath)){
            throw new BusinessException("非指定目录,不可进行操作");
        }

        File file = new File(oldFilePathName);
        File newFile = new File(newFilePathName);
        if(newFile.exists()){
            throw new BusinessException("当前名称已存在");
        }
        boolean renameTo = file.renameTo(newFile);
        return renameTo;
    }

    @Override
    public Boolean deleteFile(String filePath) throws IOException {
        String prePath = this.getRootPath();
        if(!filePath.contains(prePath)){
            throw new BusinessException("非指定目录,不可进行操作");
        }
        FileUtil.delete(filePath);
        return true;
    }

    @Override
    public Boolean createFolder(String folderName) {
        String folderPath = this.getRootPath() + folderName;
        folderPath = this.getTargetFilePathNoExit(folderPath,true);
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

    @Override
    public AttachInfo querySingleAttachInfoByPath(String relativeFilePath) {
        File file = new File(this.getRootPath() + relativeFilePath);
        if(!file.exists()){
            return null;
        }
        // 当前是一个目录，直接返回空集合
        if (file.isDirectory()) {
            return null;
        }
        AttachInfo attachInfo = convertAttachInfo(file);
        return attachInfo;
    }

    @Override
    public void unServerFileZip(String sourcePathName,String targetPathName) throws Exception {
        File file = new File(sourcePathName);
        // 判断源文件是否存在
        if (!file.exists()) {
            throw new BusinessException(file.getPath() + "所指文件不存在");
        }
        String fileName = file.getName();
        String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
        if(!"zip".equals(fileType)){
            throw new BusinessException(file.getPath() + "不是zip格式文件");
        }
        if(StringUtils.isBlank(targetPathName)){
            UnZipUtils.decompress(sourcePathName);
        } else {
            UnZipUtils.decompress(sourcePathName,targetPathName);
        }
    }

    @Override
    public void zipServerFileZip(String sourceFolderPathName, String targetFilePathName, String zipPathName) throws Exception {
        File file = new File(sourceFolderPathName);
        // 判断源文件是否存在
        if (!file.exists()) {
            throw new BusinessException(file.getPath() + "所指文件夹不存在");
        }
        ZipUtils.zip(targetFilePathName,sourceFolderPathName,zipPathName);
    }
}