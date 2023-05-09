package com.zjh.zxw.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.DateUtils;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.email.EmailSender;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.common.util.runTimeExecUtils;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.AttachInfo;
import com.zjh.zxw.domain.dto.BatchFileDTO;
import com.zjh.zxw.domain.dto.FileBase64DTO;
import com.zjh.zxw.domain.dto.FileBase64ParamDTO;
import com.zjh.zxw.service.AttachmentInfoService;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Decoder;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.InetAddress;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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

    @Value("${com.zjh.uploadPath}")
    private String uploadPath;


    // 文件目录 key为deviceUUID value为当前设备的日志目录结构json
    private final static ConcurrentHashMap<String, String> fileDirectoryMap = new ConcurrentHashMap<String,String>();

    // 文件内容 key为deviceUUID_日期文件夹名_日志名  value为日志内容
    private final static ConcurrentHashMap<String, String> fileMap = new ConcurrentHashMap<String,String>();

    // 在线日志map key为deviceUUID
    private final static ConcurrentHashMap<String, String> onlineLogMap = new ConcurrentHashMap<String,String>();

    // 消息通知map key为deviceUUID
    private final static ConcurrentHashMap<String,List<String>> noticeMessageMap = new ConcurrentHashMap<String,List<String>>();

    // 脚本记录map key为deviceUUID
    private final static ConcurrentHashMap<String,String> scriptMap = new ConcurrentHashMap<String,String>();

    // 定时任务记录map key为deviceUUID
    private final static ConcurrentHashMap<String,String> timerTaskMap = new ConcurrentHashMap<String,String>();

    @ApiOperation(value = "查询手机端定时任务记录", notes = "查询手机端定时任务记录")
    @GetMapping("/queryTimerTaskByKey")
    public R<String> queryTimerTaskByKey(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID){
        String timerTaskJSON = timerTaskMap.get(deviceUUID);
        return success(timerTaskJSON);
    }

    @ApiOperation(value = "清除手机端定时任务记录", notes = "清除手机端定时任务记录")
    @GetMapping("/clearTimerTaskByKey")
    public R<Boolean> clearTimerTaskByKey(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID){
        timerTaskMap.put(deviceUUID,"");
        return success(true);
    }

    /**
     * deviceUUID
     * timerTaskJSON
     * @param mapParam
     * @return
     */
    @ApiOperation(value = "写入手机端定时任务记录", notes = "写入手机端定时任务记录")
    @PostMapping("/writeTimerTask")
    public R<Boolean> writeTimerTask(@RequestBody Map<String,String> mapParam){
        String deviceUUID = mapParam.get("deviceUUID");
        String timerTaskJSON = mapParam.get("timerTaskJSON");
        timerTaskMap.put(deviceUUID,timerTaskJSON);
        return success(true);
    }



    @ApiOperation(value = "查询手机端脚本记录", notes = "查询手机端脚本记录")
    @GetMapping("/queryScriptByKey")
    public R<String> queryScriptByKey(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID){
        String scriptJSON = scriptMap.get(deviceUUID);
        return success(scriptJSON);
    }

    @ApiOperation(value = "清除手机端脚本记录", notes = "清除手机端脚本记录")
    @GetMapping("/clearScriptByKey")
    public R<Boolean> clearScriptByKey(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID){
        scriptMap.put(deviceUUID,"");
        return success(true);
    }

    /**
     * deviceUUID
     * scriptJSON
     * @param mapParam
     * @return
     */
    @ApiOperation(value = "写入手机端脚本记录", notes = "写入手机端脚本记录")
    @PostMapping("/writeScript")
    public R<Boolean> writeScript(@RequestBody Map<String,String> mapParam){
        String deviceUUID = mapParam.get("deviceUUID");
        String scriptJSON = mapParam.get("scriptJSON");
        scriptMap.put(deviceUUID,scriptJSON);
        return success(true);
    }

    @ApiOperation(value = "查询手机端通知消息记录", notes = "查询手机端通知消息记录")
    @GetMapping("/queryNoticeMessageByKey")
    public R<List<String>> queryNoticeMessageByKey(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID){
        List<String> noticeMessageList = noticeMessageMap.get(deviceUUID);
        return success(noticeMessageList);
    }

    @ApiOperation(value = "查询手机端通知消息记录", notes = "查询手机端通知消息记录")
    @GetMapping("/clearNoticeMessageByKey")
    public R<Boolean> clearNoticeMessageByKey(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID){
        noticeMessageMap.put(deviceUUID,new ArrayList<>());
        return success(true);
    }


    @ApiOperation(value = "写入手机端通知消息", notes = "写入手机端通知消息")
    @GetMapping("/writeNoticeMessage")
    public R<Boolean> writeNoticeMessage(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID,@ApiParam("message") @RequestParam(value = "message") String message){
        List<String> noticeMessageList = noticeMessageMap.getOrDefault(deviceUUID,new ArrayList<String>());
        noticeMessageList.add(message);
        noticeMessageMap.put(deviceUUID,noticeMessageList);
        return success(true);
    }

    @ApiOperation(value = "发送邮件消息", notes = "发送邮件消息")
    @GetMapping("/sendEmailMessage")
    public R<Boolean> sendEmailMessage(@ApiParam("receiveEmail") @RequestParam(value = "receiveEmail") String receiveEmail,@ApiParam("title") @RequestParam(value = "title") String title,@ApiParam("message") @RequestParam(value = "message") String message){
       String messageStr = new String(Base64.getDecoder().decode(message.getBytes()));
       messageStr = StrHelper.decode(messageStr);
        EmailSender.sendAutoJsEmail(receiveEmail,title,messageStr);
       return success(true);
    }



    @ApiOperation(value = "清理app消息业务key", notes = "清理app消息业务key")
    @GetMapping("/clearAppMsgServiceKey")
    public R<Boolean> clearAppMsgServiceKey(@ApiParam("deviceUUID_serviceKey") @RequestParam(value = "appMsgServiceKey") String appMsgServiceKey){
        AutoJsWsServerEndpoint.clearServiceKey(appMsgServiceKey);
        return success(true);
    }

    @ApiOperation(value = "查询app消息业务key", notes = "查询app消息业务key")
    @GetMapping("/queryAppMsgServiceKey")
    public R<String> queryAppMsgServiceKey(@ApiParam("deviceUUID_serviceKey") @RequestParam(value = "appMsgServiceKey") String appMsgServiceKey){
        String serviceValue = AutoJsWsServerEndpoint.queryServiceKey(appMsgServiceKey);
        return success(serviceValue);
    }


    @ApiOperation(value = "清理全部文件目录结构", notes = "清理全部文件目录结构")
    @GetMapping("/clearFileDirectoryMapAll")
    public R<Boolean> clearFileDirectoryMapAll(){
        fileDirectoryMap.clear();
        return success(true);
    }

    @ApiOperation(value = "清理文件目录结构", notes = "清理文件目录结构")
    @GetMapping("/clearFileDirectoryMap")
    public R<Boolean> clearFileDirectoryMap(@ApiParam("deviceUUID_pathName") @RequestParam(value = "dirPathKey") String dirPathKey){
        fileDirectoryMap.remove(dirPathKey);
        return success(true);
    }

    @ApiOperation(value = "更新在线日志map", notes = "更新在线日志map")
    @PostMapping("/updateLogMap")
    public R<Boolean> updateLogMap(@RequestBody Map<String,String> mapParam){
        onlineLogMap.put(mapParam.get("key"),mapParam.get("logJson"));
        return success(true);
    }

    @ApiOperation(value = "查询在线日志", notes = "查询在线日志")
    @GetMapping("/queryLog")
    public R<String> queryLog(@ApiParam("key") @RequestParam(value = "key") String key){
        String logContentJson = onlineLogMap.getOrDefault(key,"");
        return success(logContentJson);
    }

    @ApiOperation(value = "清理在线日志", notes = "清理在线日志")
    @GetMapping("/clearLogMap")
    public R<Boolean> clearLogMap(@ApiParam("key") @RequestParam(value = "key") String key){
        onlineLogMap.remove(key);
        return success(true);
    }


    @ApiOperation(value = "更新文件目录结构", notes = "更新文件目录结构")
    @PostMapping("/updateFileDirectoryMap")
    public R<Boolean> updateFileDirectoryMap(@RequestBody Map<String,String> mapParam){
        fileDirectoryMap.put(mapParam.get("dirPathKey"),mapParam.get("fileDirectoryJson"));
        return success(true);
    }

    @ApiOperation(value = "查询文件目录结构", notes = "查询文件目录结构")
    @GetMapping("/queryFileDirectory")
    public R<String> queryFileDirectory(@ApiParam("deviceUUID_pathName") @RequestParam(value = "dirPathKey") String dirPathKey){
        String fileDirectoryJson = fileDirectoryMap.getOrDefault(dirPathKey,"");
        return success(fileDirectoryJson);
    }

    @ApiOperation(value = "清理全部文件内容", notes = "清理全部文件内容")
    @GetMapping("/clearFileMapAll")
    public R<Boolean> clearFileMapAll(){
        fileMap.clear();
        return success(true);
    }

    @ApiOperation(value = "清理文件内容", notes = "清理文件内容")
    @GetMapping("/clearFileMap")
    public R<Boolean> clearFileMap(@ApiParam("deviceUUID_pathName") @RequestParam(value = "dirPathKey") String dirPathKey){
        fileMap.remove(dirPathKey);
        return success(true);
    }

    @ApiOperation(value = "更新文件内容", notes = "更新文件内容")
    @PostMapping("/updateFileMap")
    public R<Boolean> updateFileMap(@RequestBody Map<String,String> mapParam){
        fileMap.put(mapParam.get("dirPathKey"),mapParam.get("fileJson"));
        return success(true);
    }

    @ApiOperation(value = "查询文件内容", notes = "查询文件内容")
    @GetMapping("/queryFileMap")
    public R<String> queryFileMap(@ApiParam("deviceUUID_pathName") @RequestParam(value = "dirPathKey") String dirPathKey){
        String fileJson = fileMap.getOrDefault(dirPathKey,"");
        return success(fileJson);
    }

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
            pathName = pathName.replaceAll("\\\\",File.separator);
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
     * 解压服务端zip文件
     */
    @ApiOperation(value = "解压服务端zip文件", notes = "解压服务端zip文件")
    @GetMapping("/unServerFileZip")
    public R<Boolean> unServerFileZip(@RequestParam("sourcePathName")String sourcePathName,@RequestParam(value = "targetPathName",required = false)String targetPathName) {
        try {
            attachmentInfoService.unServerFileZip(sourcePathName,targetPathName);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("解压服务端zip文件失败！请联系管理员");
        }
    }


    /**
     * 压缩服务端zip文件
     */
    @ApiOperation(value = "压缩服务端zip文件", notes = "压缩服务端zip文件")
    @GetMapping("/zipServerFileZip")
    public R<Boolean> zipServerFileZip(@RequestParam("sourceFolderPathName")String sourceFolderPathName,@RequestParam(value = "targetFilePathName")String targetFilePathName,@RequestParam(value = "zipPathName",required = false)String zipPathName) {
        try {
            attachmentInfoService.zipServerFileZip(sourceFolderPathName,targetFilePathName,zipPathName);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("压缩服务端zip文件失败！请联系管理员");
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
        uploadPath = UploadPathHelper.getUploadPath(uploadPath);
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


    /**
     * 接口开放给前端 用于那些多个文件压缩的 支持多层级
     * @param data
     */
    @ApiOperation(value = "将base64字符串格式文件压缩导出(支持多个文件,也包括可以压缩多层级的文件夹)", notes = "将base64字符串格式文件压缩导出(支持多个文件,也包括可以压缩多层级的文件夹)")
    @PostMapping(value = "/exportBase64StrFileAndCompressV2", produces = "application/octet-stream")
    public void exportBase64StrFileAndCompressComV2(@RequestBody FileBase64DTO data) {
//        MultipartFile file = Base64DecodeMultipartFile.base64Convert(base);
        try (ZipOutputStream zipOutputStream = new ZipOutputStream(response.getOutputStream())) {
            //下载压缩包
            response.setContentType("application/zip");
            response.setHeader("Content-Disposition", "attachment;fileName=" + URLEncoder.encode(StrHelper.getOrDef(data.getZipName(),"附件") +".zip", "UTF-8"));
            for (FileBase64ParamDTO field : data.getData()) {
                recursionCompressExport(zipOutputStream, field,"");
            }
            zipOutputStream.flush();
            // zipOutputStream.write( base.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    private void recursionCompressExport(ZipOutputStream zipOutputStream, FileBase64ParamDTO field,String folderSuffix) throws IOException {
        if ((!field.getIsCatalogue()|| Objects.isNull(field.getIsCatalogue()))&& CollectionUtil.isEmpty(field.getChildren())){
            String fileSuffix= field.getFileSuffix();
            String fileName= StringUtils.isNotBlank(field.getFileName())? field.getFileName():"excel";
            ZipEntry zipEntry = new ZipEntry(folderSuffix+fileName+fileSuffix);
            zipOutputStream.putNextEntry(zipEntry);
            BASE64Decoder decoder = new BASE64Decoder();
            byte[] bytes = decoder.decodeBuffer(field.getBase64Str().split(StringPool.COMMA)[1].trim());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            baos.write(bytes);
            zipOutputStream.write(baos.toByteArray());
            baos.flush();
        }else {
            folderSuffix=folderSuffix+field.getFileName()+"\\";
            if (CollectionUtil.isEmpty(field.getChildren())){
                String fileName= StringUtils.isNotBlank(field.getFileName())? field.getFileName():"excel";
                ZipEntry zipEntry = new ZipEntry(folderSuffix);
                zipOutputStream.putNextEntry(zipEntry);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                zipOutputStream.write(baos.toByteArray());
                zipOutputStream.closeEntry();
            }else {
                for (FileBase64ParamDTO child : field.getChildren()) {
                    recursionCompressExport(zipOutputStream, child, folderSuffix);
                }
            }
        }
    }


    /**
     * 初始化打包模板
     */
    @ApiOperation(value = "初始化打包模板", notes = "初始化打包模板")
    @GetMapping("/initPackageTemplate")
    public R<Boolean> initPackageTemplate(
            @RequestParam("webProjectRootPath") String webProjectRootPath,
            @RequestParam("webProjectName") String webProjectName
            ) {
        try {
           // 获取插件资源目录
           String apkSourcePath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + "webCommonPath" + File.separator + "apkPackage";

           // 检测打包插件是否存在
            File checkFile = new File(apkSourcePath);
            if(!checkFile.exists()){
                return fail("未找到打包插件,请先在公共文件模块初始化！");
            }

           // 模板资源目录
           String sourcePath = apkSourcePath + File.separator + "apkTemplate" + File.separator + "template";
           // 目标资源目录
           String targetPath  = webProjectRootPath;
           // 先删除模板文件
           attachmentInfoService.deleteFile(targetPath + File.separator +  "template.zip");
           // 再删除目标文件目录
           attachmentInfoService.deleteFile(targetPath + File.separator +  webProjectName);
           // 从打包插件模板资源目录拷贝到目标文件目录
           Boolean copySuccess = attachmentInfoService.copyFile(sourcePath + ".zip",  targetPath);
           // 复制成功
           if(copySuccess){
               // 解压文件
               attachmentInfoService.unServerFileZip(targetPath + File.separator +  "template.zip", targetPath);
               // 重命名文件
               attachmentInfoService.reNameFile(targetPath + File.separator + "template", targetPath + File.separator +  webProjectName);
               // 删除压缩文件
               attachmentInfoService.deleteFile(targetPath + File.separator +  "template.zip");
           } else {
               return success(false);
           }
           return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("初始化打包模板异常！请联系管理员");
        }
    }

    // TODO 根据配置信息 动态替换打包模板内容
    /**
     * 项目资源文件
     * 项目插件
     * 项目配置json
     * lib依赖
     * 启动图、桌面图
     * xml配置文件
     */


    /**
     * 生成自定义签名
     */
    @ApiOperation(value = "生成自定义签名", notes = "生成自定义签名")
    @GetMapping("/generateSign")
    public R<String> generateSign(
            @RequestParam(value = "javaHome",required = false) String javaHome,
            @RequestParam(value = "keyStoreAlias") String keyStoreAlias,
            @RequestParam(value = "keyStoreValidity",required = false) String keyStoreValidity,
            @RequestParam(value = "keyStoreDName",required = false) String keyStoreDName,
            @RequestParam(value = "keyStoreALog",required = false) String keyStoreALog,
            @RequestParam(value = "keyStoreFile",required = false) String keyStoreFile,
            @RequestParam(value = "keyStorePwd",required = false) String keyStorePwd,
            @RequestParam(value = "keyStoreAliasPwd",required = false) String keyStoreAliasPwd) {
        try {
            if(StringUtils.isBlank(javaHome)){
                javaHome = "JAVA_HOME";
            }
            if(StringUtils.isBlank(keyStoreFile)){
                keyStoreFile = "zjh336.keystore";
            }
            if(StringUtils.isBlank(keyStoreValidity)){
                keyStoreValidity = "36500";
            }
            if(StringUtils.isBlank(keyStoreDName)){
                keyStoreDName = "CN=,OU=,O=,L=,S=,C=";
            }
            if(StringUtils.isBlank(keyStoreALog)){
                keyStoreALog= "RSA";
            }
            if(StringUtils.isBlank(keyStorePwd)){
                keyStorePwd = "zjh336";
            }
            if(StringUtils.isBlank(keyStoreAliasPwd)){
                keyStoreAliasPwd = "zjh336";
            }
            if(StringUtils.isBlank(keyStoreAlias)){
                keyStoreAlias = "zjh336";
            }
            // 获取插件资源目录
            String apkSourcePath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + "webCommonPath" + File.separator + "apkPackage";

            // 检测打包插件是否存在
            File checkFile = new File(apkSourcePath);
            if(!checkFile.exists()){
                return fail("未找到打包插件,请先在公共文件模块初始化！");
            }

            String packageCommand =
                    apkSourcePath.substring(0,2)+"\n"+
                            "cd "+apkSourcePath + File.separator + "apkTool\n" +
                            "generateKey.bat "+ javaHome +" "+ keyStoreAlias + " " + keyStoreValidity + " " + keyStoreALog + " \"" + keyStoreDName + "\" " + keyStoreAliasPwd + " " + keyStoreFile + " " +  keyStoreAliasPwd;
            return success(runTimeExecUtils.executeBatScript(packageCommand));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("生成签名异常！请联系管理员");
        }
    }


    /**
     * 打包项目
     */
    @ApiOperation(value = "打包项目", notes = "打包项目")
    @GetMapping("/packageProject")
    public R<String> packageProject(
                                    @RequestParam(value = "javaHome",required = false) String javaHome,
                                    @RequestParam("webProjectRootPath") String webProjectRootPath,
                                    @RequestParam("webProjectName") String webProjectName,
                                    @RequestParam(value = "keyStoreFilePath",required = false) String keyStoreFilePath,
                                    @RequestParam(value = "keyStoreAlias",required = false) String keyStoreAlias,
                                    @RequestParam(value = "kyeStorePwd",required = false) String kyeStorePwd,
                                    @RequestParam(value = "kyeStoreAliasPwd",required = false) String kyeStoreAliasPwd) {
        try {
            if(StringUtils.isBlank(javaHome)){
                javaHome = "JAVA_HOME";
            }
            if(StringUtils.isBlank(keyStoreFilePath)){
                keyStoreFilePath = "zjh336.keystore";
            }
            if(StringUtils.isBlank(keyStoreAlias)){
                keyStoreAlias = "zjh336";
            }
            if(StringUtils.isBlank(kyeStorePwd)){
                kyeStorePwd = "zjh336";
            }
            if(StringUtils.isBlank(kyeStoreAliasPwd)){
                kyeStoreAliasPwd = "zjh336";
            }
            // 获取插件资源目录
            String apkSourcePath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + "webCommonPath" + File.separator + "apkPackage";

            // 检测打包插件是否存在
            File checkFile = new File(apkSourcePath);
            if(!checkFile.exists()){
                return fail("未找到打包插件,请先在公共文件模块初始化！");
            }

            String packageCommand =
                    apkSourcePath.substring(0,2)+"\n"+
                    "cd "+apkSourcePath + File.separator + "apkTool\n" +
                    "package.bat "+ javaHome + " " + apkSourcePath + " "+ webProjectRootPath + " " + webProjectName + " " + keyStoreFilePath + " " + keyStoreAlias + " " + kyeStorePwd + " " +  kyeStoreAliasPwd;
            return success(runTimeExecUtils.executeBatScript(packageCommand));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("打包项目异常！请联系管理员");
        }
    }

}
