package com.zjh.zxw.controller;

import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.domain.dto.AttachInfo;
import com.zjh.zxw.domain.dto.BatchFileDTO;
import com.zjh.zxw.service.AttachmentInfoService;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.lang.reflect.Field;
import java.util.List;

import static com.zjh.zxw.base.R.SERVICE_ERROR;


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
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${com.zjh.uploadPath}")
    private String uploadPath;

    /**
     * 上传附件
     *
     * @return 新增结果
     */
    @ApiOperation(value = "上传附件", notes = "上传附件")
    @PostMapping("/uploadFileSingle")
    public R<String> uploadFileSingle(@RequestParam("file") MultipartFile file,@RequestParam("pathName")String pathName) {
        String url = "";
        try {
            url = attachmentInfoService.uploadFileToAutoJs(file,pathName + File.separator + file.getOriginalFilename());
            return success(url);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("上传附件失败！请联系管理员");
        }
    }


    /**
     * 上传图片附件(AutoJs专用)
     *
     * @return 新增结果
     */
    @ApiOperation(value = "上传附件(AutoJs专用)", notes = "上传附件(AutoJs专用)")
    @PostMapping("/uploadFileToAutoJs")
    public R<String> uploadFileToAutoJs(@RequestParam("file") MultipartFile file, @RequestParam("imageName") String imageName) {
        String url = "";
        try {
            url = attachmentInfoService.uploadFileToAutoJs(file, imageName);
            return success(url);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("上传附件失败！请联系管理员");
        }
    }


    /**
     * 获取绝对路径前缀
     */
    @ApiOperation(value = "获取绝对路径前缀", notes = "获取绝对路径前缀")
    @GetMapping("/getAbsolutePrePath")
    public R<String> getAbsolutePrePath() {
        return success(uploadPath + "autoJsTools" + File.separator);
    }


    /**
     * 根据相对路径获取子文件以及子目录(不递归)
     */
    @ApiOperation(value = "根据相对路径获取子文件以及子目录(不递归)", notes = "根据相对路径获取子文件以及子目录(不递归)")
    @GetMapping("/queryAttachInfoListByPath")
    public R<List<AttachInfo>> queryAttachInfoListByPath(@RequestParam("relativeFilePath") String relativeFilePath) {
        try {
            List<AttachInfo> attachInfos = attachmentInfoService.queryAttachInfoListByPath(relativeFilePath);
            return success(attachInfos);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("查询文件异常！请联系管理员");
        }
    }

    /**
     * 根据相对路径获取子文件以及子目录(递归)
     */
    @ApiOperation(value = "根据相对路径获取子文件以及子目录(递归)", notes = "根据相对路径获取子文件以及子目录(递归)")
    @GetMapping("/queryAllAttachInfoListByPath")
    public R<List<AttachInfo>> queryAllAttachInfoListByPath(@RequestParam("relativeFilePath") String relativeFilePath,@RequestParam("onlyQueryFolder") Boolean onlyQueryFolder) {
        try {
            List<AttachInfo> attachInfos = attachmentInfoService.queryAllAttachInfoListByPath(relativeFilePath,onlyQueryFolder);
            return success(attachInfos);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("查询文件异常！请联系管理员");
        }
    }

    /**
     * 根据相对路径获取文件信息
     */
    @ApiOperation(value = "根据相对路径获取文件信息", notes = "根据相对路径获取文件信息")
    @GetMapping("/querySingleAttachInfoByPath")
    public R<AttachInfo> querySingleAttachInfoByPath(@RequestParam("relativeFilePath") String relativeFilePath) {
        try {
            AttachInfo attachInfo = attachmentInfoService.querySingleAttachInfoByPath(relativeFilePath);
            return success(attachInfo);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("查询文件异常！请联系管理员");
        }
    }


    /**
     * 上传文件
     *
     * @return 新增结果
     */
    @ApiOperation(value = "上传文件", notes = "上传文件")
    @PostMapping("/uploadFile")
    public R<AttachInfo> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("fileName") String fileName) {
        try {
            AttachInfo attachInfo = attachmentInfoService.uploadFile(file, fileName);
            return success(attachInfo);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("上传文件异常！请联系管理员");
        }
    }

    /**
     * 重命名文件
     *
     * @return 新增结果
     */
    @ApiOperation(value = "重命名文件", notes = "重命名文件")
    @GetMapping("/reNameFile")
    public R<Boolean> reNameFile(@RequestParam("oldFilePathName") String oldFilePathName,@RequestParam("newFilePathName") String newFilePathName) {
        try {
            Boolean isSuccess = attachmentInfoService.reNameFile(oldFilePathName, newFilePathName);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("重命名文件异常！请联系管理员");
        }
    }

    /**
     * 复制文件(单个文件，递归复制)
     * @param sourcePath  原文件路径
     * @param targetFolderPath 目标文件夹路径
     * @return 新增结果
     */
    @ApiOperation(value = "复制文件(单个文件，递归复制)", notes = "复制文件(单个文件，递归复制)")
    @GetMapping("/copyFile")
    public R<Boolean> copyFile(@RequestParam("sourcePath") String sourcePath, @RequestParam("targetFolderPath") String targetFolderPath) {
        try {
            Boolean isSuccess = attachmentInfoService.copyFile(sourcePath, targetFolderPath);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("复制文件异常！请联系管理员");
        }
    }

    /**
     * 批量复制文件(多个文件，递归复制)
     * @param batchFileDTO  批量文件对象
     */
    @ApiOperation(value = "批量复制文件(多个文件，递归复制)", notes = "批量复制文件(多个文件，递归复制)")
    @PostMapping("/copyFileBatch")
    public R<Boolean> copyFileBatch(@RequestBody BatchFileDTO batchFileDTO) {
        try {
            Boolean isSuccess = attachmentInfoService.copyFileBatch(batchFileDTO);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("批量复制文件异常！请联系管理员");
        }
    }


    /**
     * 移动文件(单个文件，递归移动)
     *
     * @return 新增结果
     */
    @ApiOperation(value = "移动文件(单个文件，递归移动)", notes = "移动文件(单个文件，递归移动)")
    @GetMapping("/moveFile")
    public R<Boolean> moveFile(@RequestParam("sourcePath") String sourcePath, @RequestParam("targetFolderPath") String targetFolderPath) {
        try {
            Boolean isSuccess = attachmentInfoService.moveFile(sourcePath, targetFolderPath);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("移动文件异常！请联系管理员");
        }
    }


    /**
     * 批量移动文件(多个文件，递归移动)
     * @param batchFileDTO  批量文件对象
     */
    @ApiOperation(value = "批量移动文件(多个文件，递归移动)", notes = "批量移动文件(多个文件，递归移动)")
    @PostMapping("/moveFileBatch")
    public R<Boolean> moveFileBatch(@RequestBody BatchFileDTO batchFileDTO) {
        try {
            Boolean isSuccess = attachmentInfoService.moveFileBatch(batchFileDTO);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("批量移动文件异常！请联系管理员");
        }
    }

    /**
     * 创建文件夹
     *
     * @return 新增结果
     */
    @ApiOperation(value = "创建文件夹", notes = "创建文件夹")
    @GetMapping("/createFolder")
    public R<Boolean> createFolder(@RequestParam("folderName") String folderName) {
        try {
            Boolean isSuccess = attachmentInfoService.createFolder(folderName);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("创建文件夹异常！请联系管理员");
        }
    }

    /**
     * 删除文件(递归删除)
     *
     */
    @ApiOperation(value = "删除文件(递归删除)", notes = "删除文件(递归删除)")
    @GetMapping("/deleteFile")
    public R<Boolean> deleteFile(@RequestParam("filePath") String filePath) {
        try {
            Boolean isSuccess = attachmentInfoService.deleteFile(filePath);
            return success(isSuccess);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("删除文件异常！请联系管理员");
        }
    }


    /**
     * 批量删除文件(递归删除)
     *
     */
    @ApiOperation(value = "批量删除文件(递归删除)", notes = "批量删除文件(递归删除)")
    @PostMapping("/deleteFileBatch")
    public R<Boolean> deleteFileBatch(@RequestBody List<String> filePathList) {
        try {
            if(CollectionUtils.isNotEmpty(filePathList)){
                for (String filePath : filePathList) {
                    attachmentInfoService.deleteFile(filePath);
                }
            }
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("删除文件异常！请联系管理员");
        }
    }
}
