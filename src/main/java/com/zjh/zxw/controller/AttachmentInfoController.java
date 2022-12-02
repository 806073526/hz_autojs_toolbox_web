package com.zjh.zxw.controller;

import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.service.AttachmentInfoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * <p>
 * 前端控制器
 * 附件表
 * </p>
 *
 * @author zhengjianhua
 * @date 2021-06-05
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/attachmentInfo")
@Api(value = "AttachmentInfo", tags = "附件表")
public class AttachmentInfoController extends BaseController {

    @Autowired
    private AttachmentInfoService attachmentInfoService;

    @Autowired
    private RedisTemplate<String,Object> redisTemplate;






    /**
     * 上传图片附件(AutoJs专用)
     *
     * @return 新增结果
     */
    @ApiOperation(value = "上传附件(AutoJs专用)", notes = "上传附件(AutoJs专用)")
    @PostMapping("/uploadFileToAutoJs")
    public R<String> uploadFileToAutoJs(@RequestParam("file") MultipartFile file, @RequestParam("imageName") String imageName) {
        String url = attachmentInfoService.uploadFileToAutoJs(file, imageName);
        return success(url);
    }
}
