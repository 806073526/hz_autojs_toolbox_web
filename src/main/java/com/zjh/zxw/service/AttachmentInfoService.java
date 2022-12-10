package com.zjh.zxw.service;

import com.zjh.zxw.domain.dto.AttachInfo;
import org.springframework.web.multipart.MultipartFile;

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


    List<AttachInfo> queryAttachInfoListByPath(String path);

    AttachInfo uploadFile(MultipartFile multipartFile, String fileName);

    String uploadFileToAutoJs(MultipartFile file, String imageName);

    Boolean copyFile(String sourcePath, String targetPath) throws IOException;

    Boolean moveFile(String sourcePath, String targetPath) throws IOException;

    Boolean reNameFile(String oldFileName, String newFileName);

    Boolean deleteFile(String filePath) throws IOException;

    Boolean createFolder(String folderName);
}
