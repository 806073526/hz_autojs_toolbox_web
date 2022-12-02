package com.zjh.zxw.service;

import org.springframework.web.multipart.MultipartFile;


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


    String uploadFileToAutoJs(MultipartFile file, String imageName);
}
