package com.zjh.zxw.service;

import com.zjh.zxw.domain.dto.AttachInfo;
import com.zjh.zxw.domain.dto.BatchFileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;


/**
 * <p>
 * 业务接口
 * 附件表
 * </p>
 *
 * @author zhengjianhua
 * @date 2021-06-05
 */
public interface AttachmentInfoService {

    List<AttachInfo> queryAttachInfoListByPath(String relativeFilePath);

    List<AttachInfo> queryAllAttachInfoListByPath(String relativeFilePath,Boolean onlyQueryFolder);

    AttachInfo uploadFile(MultipartFile multipartFile, String fileName);

    String uploadFileToAutoJs(MultipartFile file, String imageName);

    Boolean copyFile(String sourcePath, String targetFolderPath) throws IOException;

    Boolean moveFile(String sourcePath, String targetFolderPath) throws IOException;

    Boolean reNameFile(String oldFilePathName, String newFilePathName);

    Boolean reNameFileReCount(String oldFilePathName, String newFilePathName, Integer reCount) throws InterruptedException;

    Boolean deleteFile(String filePath) throws IOException;

    Boolean createFolder(String folderName);

    Boolean copyFileBatch(BatchFileDTO batchFileDTO) throws IOException;

    Boolean moveFileBatch(BatchFileDTO batchFileDTO) throws IOException;

    AttachInfo querySingleAttachInfoByPath(String relativeFilePath);

    void unServerFileZip(String sourcePathName,String targetPathName) throws Exception;

    void zipServerFileZip(String sourceFolderPathName, String targetFilePathName, String zipPathName) throws Exception;
}
