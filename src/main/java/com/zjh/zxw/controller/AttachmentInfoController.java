package com.zjh.zxw.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.sun.org.apache.xpath.internal.operations.Bool;
import com.wf.captcha.ArithmeticCaptcha;
import com.wf.captcha.ChineseCaptcha;
import com.wf.captcha.GifCaptcha;
import com.wf.captcha.SpecCaptcha;
import com.wf.captcha.base.Captcha;
import com.zjh.PackageProjectUtils;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.ArithmeticCaptchaZ;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.email.EmailSender;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.*;
import com.zjh.zxw.service.AttachmentInfoService;
import com.zjh.zxw.websocket.AutoJsWebWsServerEndpoint;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.annotations.Param;
import org.apache.tools.zip.ZipFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import sun.misc.BASE64Decoder;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
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

    @ApiOperation(value = "根据参数校验机器码是否已授权", notes = "根据参数校验机器码是否已授权")
    @PostMapping("/validateMachineCode")
    public Boolean validateMachineCode(@RequestParam(value = "machineCode") String machineCode) throws IOException {
        if(StringUtils.isBlank(machineCode)){
            return false;
        }
        try{
            return PackageProjectUtils.validateMachineCodeCommonByFile(machineCode);
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
    }

    @ApiOperation(value = "根据参数校验机器码是否已授权提供前端调用", notes = "根据参数校验机器码是否已授权提供前端调用")
    @PostMapping("/validateMachineCodeWithSelf")
    public Boolean validateMachineCodeWithSelf(@RequestParam(value = "machineCode") String machineCode) throws IOException {
        Boolean flag = false;
        try {
            flag =  PackageProjectUtils.checkMachineCodeValid(machineCode);
        }catch (Exception e){
            log.error(e.getMessage());
        }
        return flag;
    }

    @ApiOperation(value = "获取机器码", notes = "获取机器码")
    @GetMapping("/getMachineCode")
    public R<String> getMachineCode(){
        String curMachineCode = "";
        try{
            curMachineCode = PackageProjectUtils.getMachineCode();
        }catch (Exception e){
            log.error(e.getMessage());
        }
        return success(curMachineCode);
    }

    @ApiOperation(value = "刷新机器码", notes = "刷新机器码")
    @GetMapping("/refreshMachineCode")
    public R<Boolean> refreshMachineCode(){
        PackageProjectUtils.clearCurMachineCode();
        return success(true);
    }


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
    public R<Boolean> writeNoticeMessage(@ApiParam("deviceUUID") @RequestParam(value = "deviceUUID") String deviceUUID,
                                         @ApiParam("message") @RequestParam(value = "message") String message,
                                         @ApiParam("pushRange 推送范围 onlyLine仅连接设备 all全部设备") @RequestParam(value = "pushRange",required = false) String pushRange,
                                         @ApiParam("messagePushChannel 消息推送渠道 web web网页 app App端") @RequestParam(value = "messagePushChannel",required = false) String messagePushChannel) throws IOException {
        List<String> noticeMessageList = noticeMessageMap.getOrDefault(deviceUUID,new ArrayList<String>());
        noticeMessageList.add(message);
        noticeMessageMap.put(deviceUUID,noticeMessageList);
        // 推送范围
        if(StringUtils.isNotBlank(pushRange)){
            AjMessageDTO ajMessageDTO = new AjMessageDTO();
            ajMessageDTO.setAction("appPushNoticeMessage");
            ajMessageDTO.setMessage(message+"&"+messagePushChannel);
            // 推送消息通知到web端页面
            AutoJsWebWsServerEndpoint.sendMessageToClientSelectAppDevice("onlyLine".equals(pushRange) ? deviceUUID : "","",ajMessageDTO);
        }
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
    public R<Boolean> updateLogMap(@RequestBody Map<String,String> mapParam) throws IOException {
        // 获取上次缓存的文件
        String lastLogJson= onlineLogMap.getOrDefault(mapParam.get("key"),"");

        onlineLogMap.put(mapParam.get("key"),mapParam.get("logJson"));

        // 内容发生变化
        if(!lastLogJson.equals(mapParam.get("logJson"))){
            String deviceUUID = request.getHeader("deviceUUID");
            // 发送指令 给web端  刷新实时日志
            AjMessageDTO ajMessageDTO = new AjMessageDTO();
            ajMessageDTO.setAction("refreshOnLineRemoteLog");
            ajMessageDTO.setMessage(deviceUUID);
            // 推送消息通知到web端页面
            AutoJsWebWsServerEndpoint.sendMessageToClientSelectAppDevice("","",ajMessageDTO);
        }

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
    public R<Boolean> updateFileMap(@RequestBody Map<String,String> mapParam) throws IOException {

        String dirPathKey = StrHelper.getObjectValue(mapParam.get("dirPathKey"));
        String fileJson = StrHelper.getObjectValue(mapParam.get("fileJson"));

        // 包含该路径 表示  预览设备的图片缓存
        if(dirPathKey.contains("/sdcard/screenImg/tempImg.jpg")){
            // 获取上次缓存的文件
            String lastFileJson= fileMap.getOrDefault(dirPathKey,"");

            // 内容发生变化
            if(!lastFileJson.equals(fileJson)){
                String deviceUUID = request.getHeader("deviceUUID");
                // 发送指令 给web端  刷新预览图片
                AjMessageDTO ajMessageDTO = new AjMessageDTO();
                ajMessageDTO.setAction("refreshPreviewImg");
                ajMessageDTO.setMessage(deviceUUID);
                // 推送消息通知到web端页面
                AutoJsWebWsServerEndpoint.sendMessageToClientSelectAppDevice(deviceUUID,"",ajMessageDTO);
            }
        }

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
            pathName = pathName.replaceAll("\\\\", Matcher.quoteReplacement(File.separator));
            File dir = new File(pathName + File.separator);
            if(!dir.exists()){
                dir.mkdirs();
            }
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
     * 设置打包目录权限(linux)
     *
     * @return 新增结果
     */
    @ApiOperation(value = "设置打包目录权限(linux)", notes = "设置打包目录权限(linux)")
    @GetMapping("/authorizePackagePath")
    public R<String> authorizePackagePath() {
        try {
            if(!UploadPathHelper.isWindowsSystem()){
                return success(chmodPackagePath());
            }
            return success("无需授权");
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("设置打包目录权限(linux)！请联系管理员");
        }
    }

    /**
     * 设置文件目录权限
     * @return
     */
    public String chmodPackagePath() {
        // 插件资源路径
        String apkSourcePath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + "webCommonPath" + File.separator + "apkPackage";
        // 验证打包模板是否存在
        File checkTemplateFile = new File(apkSourcePath);
        if(!checkTemplateFile.exists()){
            return apkSourcePath +"不存在";
        }
        StringBuilder stringBuilderSuccessMsg = new StringBuilder();
        StringBuilder stringBuilderErrorMsg = new StringBuilder();
        FileWriter fw = null;
        String location = "chmod -R 777 "+apkSourcePath;
        Process process;
        try {
            process = Runtime.getRuntime().exec(location);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilderSuccessMsg.append(line).append(" ");
            }
            BufferedReader errorBufferedReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "GBK"));
            String errorLine;
            while ((errorLine = errorBufferedReader.readLine()) != null) {
                stringBuilderErrorMsg.append(errorLine).append(" ");
            }
            if(StringUtils.isNotBlank(stringBuilderErrorMsg.toString())){
                return stringBuilderErrorMsg.toString();
            }
            return stringBuilderSuccessMsg.toString();
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(),e);
            return e.getMessage();
        }
    }
   @ApiOperation(value = "测试接口", notes = "测试接口")
    @GetMapping("/testhx")
    public R<String> testhx(@RequestParam("apkSourcePath") String apkSourcePath,
                            @RequestParam("webProjectRootPath") String webProjectRootPath,
                            @RequestParam("webProjectName") String webProjectName,
                            @RequestParam(value = "excludeUrls",required = false) String excludeUrls
                            ) throws IOException {
        return success(PackageProjectUtils.obfuscatorProjectRes(apkSourcePath,webProjectRootPath,webProjectName,excludeUrls));
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

           File templateFie = new File(sourcePath);
           // 模板资源目录不存在时 进行解压操作
           if(!templateFie.exists()){
               // 解压文件
               attachmentInfoService.unServerFileZip(apkSourcePath + File.separator + "apkTemplate" + File.separator + "template.zip", apkSourcePath + File.separator + "apkTemplate");
           }

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
               Thread.sleep(100);
               // 重命名文件
               attachmentInfoService.reNameFileReCount(targetPath + File.separator + "template", targetPath + File.separator +  webProjectName, 150);
               Thread.sleep(100);
               // 删除压缩文件
               attachmentInfoService.deleteFile(targetPath + File.separator +  "template.zip");
               Thread.sleep(100);
               // 删除lib依赖
              attachmentInfoService.deleteFile(targetPath + File.separator +  webProjectName + File.separator + "lib");
               Thread.sleep(100);
               // 删除project
               attachmentInfoService.deleteFile(targetPath + File.separator +  webProjectName + File.separator + "assets" + File.separator + "project");
           } else {
               return success(false);
           }
           File checkFile1 = new File(targetPath + File.separator +  webProjectName);
           return success(checkFile1.exists());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("处理打包项目资源异常！请联系管理员");
        }
    }


    /**
     * 初始化打包模板
     */
    @ApiOperation(value = "初始化打包模板(新)", notes = "初始化打包模板(新)")
    @GetMapping("/initPackageTemplateNew")
    public R<Boolean> initPackageTemplateNew(
            @RequestParam("webProjectRootPath") String webProjectRootPath,
            @RequestParam("webProjectName") String webProjectName,
            @RequestParam(value = "resetPackage",required = false) String resetPackage
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

            File templateFie = new File(sourcePath);
            // 模板资源目录不存在时 进行解压操作
            if(!templateFie.exists()){
                // 解压文件
                attachmentInfoService.unServerFileZip(apkSourcePath + File.separator + "apkTemplate" + File.separator + "template.zip", apkSourcePath + File.separator + "apkTemplate");
            }

            // 目标资源目录
            String targetPath  = webProjectRootPath;

            // 参数不为空
            if(StringUtils.isNotBlank(resetPackage)){
                // 删除项目模板
                attachmentInfoService.deleteFile(targetPath + File.separator +  webProjectName);
            }

            // 检测项目是否存在
            File webProjectFile = new File(targetPath + File.separator +  webProjectName);

            // 如果不存在项目
            if(!webProjectFile.exists()){
                // 先删除模板文件
                attachmentInfoService.deleteFile(targetPath + File.separator +  "template.zip");
                // 从打包插件模板资源目录拷贝到目标文件目录
                Boolean copySuccess = attachmentInfoService.copyFile(sourcePath + ".zip",  targetPath);
                // 复制成功
                if(copySuccess){
                    // 解压文件
                    attachmentInfoService.unServerFileZip(targetPath + File.separator +  "template.zip", targetPath);
                    Thread.sleep(100);
                    // 重命名文件
                    attachmentInfoService.reNameFileReCount(targetPath + File.separator + "template", targetPath + File.separator +  webProjectName, 150);
                    Thread.sleep(100);
                    // 删除压缩文件
                    attachmentInfoService.deleteFile(targetPath + File.separator +  "template.zip");
                } else {
                    return success(false);
                }
            }
            // 删除lib依赖
            attachmentInfoService.deleteFile(targetPath + File.separator +  webProjectName + File.separator + "lib");
            // 删除project
            attachmentInfoService.deleteFile(targetPath + File.separator +  webProjectName + File.separator + "assets" + File.separator + "project");
            File checkFile1 = new File(targetPath + File.separator +  webProjectName);
            return success(checkFile1.exists());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("处理打包项目资源异常！请联系管理员");
        }
    }

    /**
     * 处理打包项目资源
     */
    @ApiOperation(value = "处理打包项目资源", notes = "处理打包项目资源")
    @PostMapping("/handlerPackageProjectRes")
    public R<String> handlerPackageProjectRes(@RequestBody PackageProjectDTO packageProjectDTO) {
        try {
            String webProjectRootPath = packageProjectDTO.getWebProjectRootPath();
            String webProjectName = packageProjectDTO.getWebProjectName();
            // 打包模板路径
            String packageTemplatePath = webProjectRootPath + File.separator + webProjectName;
            // 项目资源路径
            String projectResPath = webProjectRootPath + File.separator + webProjectName + "_projectRes.zip";
            // 插件资源路径
            String apkSourcePath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + "webCommonPath" + File.separator + "apkPackage";
            // 模板资源目录
            String packageTemplateSourcePath = apkSourcePath + File.separator + "apkTemplate" + File.separator + "template";
            // 验证打包模板是否存在
            File checkTemplateFile = new File(packageTemplatePath);
            if(!checkTemplateFile.exists()){
                return fail("打包模板不存在,请先初始化打包模板！");
            }
            // 验证项目资源文件是否存在
            File checkPackageResFile = new File(projectResPath);
            if(!checkPackageResFile.exists()){
                return fail("项目资源文件不存在,请先上传项目资源文件！");
            }
            // 检测打包插件是否存在
            File checkFile = new File(apkSourcePath);
            if(!checkFile.exists()){
                return fail("未找到打包插件,请先在公共文件模块初始化！");
            }

            File templateFie = new File(packageTemplateSourcePath);
            // 模板资源目录不存在时 进行解压操作
            if(!templateFie.exists()){
                // 解压文件
                attachmentInfoService.unServerFileZip(apkSourcePath + File.separator + "apkTemplate" + File.separator + "template.zip", apkSourcePath + File.separator + "apkTemplate");
            }
            // 先删除文件
            attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "assets" + File.separator + "project");

            System.out.println("传入资源路径名称："+packageProjectDTO.getResPathName());
            // 资源包目录名称
            String resName = StringUtils.isNotBlank(packageProjectDTO.getResPathName()) ? packageProjectDTO.getResPathName() : webProjectName;


            // 解压项目资源到 打包模板的assets目录
            attachmentInfoService.unServerFileZip(projectResPath, packageTemplatePath + File.separator + "assets");

            // 等待解压完成
            int unZipCount = 0;
            while (!Files.exists(Paths.get(packageTemplatePath + File.separator + "assets" + File.separator + resName))) {
                Thread.sleep(100);
                unZipCount++;
                if(unZipCount>20){
                    break;
                }
            }
            Thread.sleep(100);

            // 重命名文件为project
            attachmentInfoService.reNameFileReCount(packageTemplatePath + File.separator + "assets" + File.separator + resName, packageTemplatePath + File.separator + "assets" + File.separator + "project",150);


            // plugins的复制
            String plugins = packageProjectDTO.getPlugins();
            // 读取已选插件列表
            List<String> pluginsList = new ArrayList<String>(StrHelper.str2ArrayListBySplit(plugins,","));

            // 需要删除V8内置模块标记
            Boolean needRemoveNodeV8Module = false;
            // 需要删除ocr模块标记
            Boolean needRemoveOcrModule = false;

            // 目标插件根路径
            String targetPluginRootPath = packageTemplatePath + File.separator + "assets" + File.separator + "project" + File.separator + "plugins";

            // 先删除插件
            attachmentInfoService.deleteFile(targetPluginRootPath);

            // 等待插件删除完成
            int count = 0;
            while (Files.exists(Paths.get(targetPluginRootPath))) {
                Thread.sleep(100);
                count++;
                if(count>20){
                    break;
                }
            }

            // 遍历插件 复制插件到目标目录
            for (String plugin : pluginsList) {
                if(StringUtils.isBlank(plugin)){
                    continue;
                }
                // 模板插件路径
                String pluginPath = packageTemplateSourcePath + File.separator + "assets" + File.separator + "project" + File.separator + "plugins" + File.separator + plugin + ".apk";

                // 复制文件
                attachmentInfoService.copyFile(pluginPath,targetPluginRootPath);
            }

            // lib依赖的复制
            // 先获取架构  arm64-v8a  armeabi-v7a
            String abis = packageProjectDTO.getAbis();

            // 架构集合
            List<String> abisList = new ArrayList<String>(StrHelper.str2ArrayListBySplit(abis,","));

            // 获取是否开启nodejs开关 是否需要libnode.so的依赖
            boolean openNodeJs = Objects.nonNull(packageProjectDTO.getOpenNodeJs()) ? packageProjectDTO.getOpenNodeJs() : false;

            // 未开启nodejs模块则需要删除
            needRemoveNodeV8Module = !openNodeJs;

            // 获取是否开启图色模块 开关
            boolean openImageModule = Objects.nonNull(packageProjectDTO.getOpenImageModule()) ? packageProjectDTO.getOpenImageModule() : false;

            // 需要排除的依赖集合
            List<String> excludesLibList = new ArrayList<String>();
            // 未开启 则 排除nodejs的 libnode.so、libv8.so依赖
            if(!openNodeJs){
                excludesLibList.add("libnode.so");
                excludesLibList.add("libv8.so");
            }
            // 未开启 则排除图色模块
            if(!openImageModule){
                excludesLibList.add("libautojspro_cvext.so");
                excludesLibList.add("libopencv_java4.so");
            }

            // 未包含 官方的ocr模块 则排除 对应依赖so
            if(!pluginsList.contains("org.autojs.autojspro.ocr.v2")){
                excludesLibList.add("libocrautojspro.so");
                excludesLibList.add("libpaddle_light_api_shared.so");
                // 不包含官方ocr模块则需要删除
                needRemoveOcrModule = true;
            }

            // 先删除
            attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "lib");

            // 等待依赖删除完成
            int libCount = 0;
            while (Files.exists(Paths.get(packageTemplatePath + File.separator + "lib"))) {
                Thread.sleep(100);
                libCount++;
                if(libCount>20){
                    break;
                }
            }

            // 遍历架构
            for (String abisName : abisList) {
                // 读取模板资源文件 当前CPU架构的 依赖列表
                File libFile = new File(packageTemplateSourcePath + File.separator + "lib" + File.separator + abisName);
                if(!libFile.exists()){
                    continue;
                }
                File[] libAbisFiles = libFile.exists() ? libFile.listFiles() : new File[0];
                if(Objects.nonNull(libAbisFiles) && libAbisFiles.length>0){
                    // 目标依赖根路径
                    String targetLibSoRootPath = packageTemplatePath + File.separator + "lib" + File.separator + abisName;
                    // 遍历so依赖文件
                    for (File libSoFile : libAbisFiles) {
                        // 包含排除文件则跳过
                        if(excludesLibList.contains(libSoFile.getName())){
                            continue;
                        }
                        // 模板依赖路径
                        String libSoPath = packageTemplateSourcePath + File.separator + "lib" +  File.separator + abisName + File.separator + libSoFile.getName();
                        // 复制文件
                        attachmentInfoService.copyFile(libSoPath,targetLibSoRootPath);
                    }
                }
            }
            // 移除nodejs V8内置模块
            if(needRemoveNodeV8Module){
                attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "assets" + File.separator + "v8" + File.separator + "built_in_modules");
                attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "assets" + File.separator + "v8" + File.separator + "v8java.js");
                attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "assets" + File.separator + "v8" + File.separator + "v8autojs.js");
            }

            // 移除ocr内置模型
            if(needRemoveOcrModule){
                attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "assets" + File.separator + "ocr");
            } else {
                attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "assets" + File.separator + "ocr");
                // 模板资源目录
                String sourcePath = apkSourcePath + File.separator + "apkTemplate" + File.separator + "template";

                // 从打包插件模板资源目录拷贝到目标文件目录
                Boolean copySuccess = attachmentInfoService.copyFile(sourcePath + File.separator + "assets" + File.separator + "ocr",  packageTemplatePath + File.separator + "assets");
            }

            // 桌面图标的复制  res/mipmap/ic_launcher.png

            // 读取桌面图标
            String appIcon = StrHelper.getObjectValue(packageProjectDTO.getAppIcon());

            // 原始图标路径
            String appIconSourcePath = "";
            // 目标图标根路径
            String appIconTargetRootPath = packageTemplatePath + File.separator + "res" + File.separator + "mipmap";

            // 是否需要重命名
            boolean appIconNeedReName = false;

            String appIconImgFileType = "png";
            if(appIcon.endsWith("jpg")){
                appIconImgFileType = "jpg";
            } else if(appIcon.endsWith("jpeg")){
                appIconImgFileType = "jpeg";
            }

            // 如果为空 拼接默认的图标
            if(StringUtils.isBlank(appIcon)){
                appIconSourcePath = packageTemplateSourcePath + File.separator + "res" + File.separator + "mipmap" + File.separator + "ic_launcher." + appIconImgFileType;
            // 如果不为空 拼接设置图标
            } else {
                appIconNeedReName = true;
                appIconSourcePath = packageTemplatePath + File.separator + "assets" + File.separator + "project" + File.separator + appIcon;
            }
            // 先删除目标文件
            attachmentInfoService.deleteFile(appIconTargetRootPath + File.separator + "ic_launcher.jpeg");
            attachmentInfoService.deleteFile(appIconTargetRootPath + File.separator + "ic_launcher.jpg");
            attachmentInfoService.deleteFile(appIconTargetRootPath + File.separator + "ic_launcher.png");

            int icLauncherCount = 0;
            while (Files.exists(Paths.get(appIconTargetRootPath + File.separator + "ic_launcher.png"))) {
                Thread.sleep(100);
                icLauncherCount++;
                if(icLauncherCount>10){
                    break;
                }
            }

            // 等待删除完成
            Thread.sleep(100);
            // 再复制当目标目录
            attachmentInfoService.copyFile(appIconSourcePath,appIconTargetRootPath);

            if(appIconNeedReName){
                // 等待复制完成
                Thread.sleep(200);
                String imgFileName = appIcon.substring(appIcon.lastIndexOf("/") + 1);
                // 重命名图片
                attachmentInfoService.reNameFileReCount(appIconTargetRootPath + File.separator + imgFileName, appIconTargetRootPath +File.separator + "ic_launcher." + appIconImgFileType,150);
            }


            // 启动图的复制 res/drawable-mdpi/splash_icon.png
            String splashIcon = StrHelper.getObjectValue(packageProjectDTO.getSplashIcon());

            // 原始图标路径
            String splashIconSourcePath = "";
            // 目标图标根路径
            String splashIconTargetRootPath = packageTemplatePath + File.separator + "res" + File.separator + "drawable-mdpi";

            // 是否需要重命名
            boolean splashNeedReName = false;

            String splashImgFileType = "png";
            if(splashIcon.endsWith("jpg")){
                splashImgFileType = "jpg";
            } else if(splashIcon.endsWith("jpeg")){
                splashImgFileType = "jpeg";
            }
            // 如果为空 拼接默认的图标
            if(StringUtils.isBlank(splashIcon)){
                splashIconSourcePath = packageTemplateSourcePath + File.separator + "res" + File.separator + "drawable-mdpi" + File.separator + "splash_icon." + splashImgFileType;
                // 如果不为空 拼接设置图标
            } else {
                splashNeedReName = true;
                splashIconSourcePath = packageTemplatePath + File.separator + "assets" + File.separator + "project" + File.separator + splashIcon;
            }
            // 先删除目标文件
            attachmentInfoService.deleteFile(splashIconTargetRootPath + File.separator + "splash_icon.jpg");
            attachmentInfoService.deleteFile(splashIconTargetRootPath + File.separator + "splash_icon.jpeg");
            attachmentInfoService.deleteFile(splashIconTargetRootPath + File.separator + "splash_icon.png");

            int splashIconCount = 0;
            while (Files.exists(Paths.get(appIconTargetRootPath + File.separator + "splash_icon.png"))) {
                Thread.sleep(100);
                splashIconCount++;
                if(splashIconCount>10){
                    break;
                }
            }

            // 等待删除完成
            Thread.sleep(100);
            // 再复制当目标目录
            attachmentInfoService.copyFile(splashIconSourcePath,splashIconTargetRootPath);

            if(splashNeedReName){
                // 等待复制完成
                Thread.sleep(200);
                String imgFileName = splashIcon.substring(splashIcon.lastIndexOf("/") + 1);
                // 重命名图片
                attachmentInfoService.reNameFileReCount(splashIconTargetRootPath + File.separator + imgFileName, splashIconTargetRootPath +File.separator + "splash_icon." + splashImgFileType, 150);
            }

            // apktool.yml 设置版本名称 版本号  apkFileName名称必须保持一致 否则版本号修改无效
            // 未知问题 通过yml文件修改的版本号 版本名称 回编译后一直无效 经验证 直接将版本号写入xml中可以实现
            /*
            InputStream inputStream = new FileInputStream(new File(packageTemplateSourcePath + File.separator + "apktool.yml"));
            DumperOptions dumperOptions = new DumperOptions();
            dumperOptions.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);
            Yaml yaml = new Yaml(dumperOptions);
            LinkedHashMap<String,Object> apkToolMap = yaml.load(inputStream);

            apkToolMap.put("apkFileName",webProjectName+".apk");
            LinkedHashMap<String,Object> versionInfoMap = new LinkedHashMap<String,Object>();
            versionInfoMap.put("versionName",packageProjectDTO.getVersionName());
            versionInfoMap.put("versionCode",packageProjectDTO.getVersionCode());
            apkToolMap.put("versionInfo", versionInfoMap); // 修改属性

            // 输出到打包模板中去
            OutputStream outputStream = new FileOutputStream(new File(packageTemplatePath + File.separator + "apktool.yml"));
            yaml.dump(apkToolMap, new OutputStreamWriter(outputStream));
            outputStream.close();*/

            // xml配置的解析、替换、写入
            // AndroidManifest.xml文件读取
            File templateAndroidManifestFile = new File(packageTemplateSourcePath + File.separator + "AndroidManifest.xml");
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = factory.newDocumentBuilder();
            Document doc = dBuilder.parse(templateAndroidManifestFile);
            doc.getDocumentElement().normalize();


            // 1、修改包名  manifest的package  provider的 android:authorities
            // 2、修改版本号 版本名称 manifest的 android:versionCode  android:versionName
            String packageName = packageProjectDTO.getPackageName();
            NodeList manifestList = doc.getElementsByTagName("manifest");
            for (int temp = 0; temp < manifestList.getLength(); temp++) {
                Node nNode = manifestList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    eElement.setAttribute("package", packageName);
                    eElement.setAttribute("android:versionCode", packageProjectDTO.getVersionCode());
                    eElement.setAttribute("android:versionName", packageProjectDTO.getVersionName());
                }
                // 添加termux权限支持
                Element termuxPermissionElement =  doc.createElement("uses-permission");
                termuxPermissionElement.setAttribute("android:name","com.termux.permission.RUN_COMMAND");
                nNode.appendChild(termuxPermissionElement);
            }
            NodeList providerList = doc.getElementsByTagName("provider");
            for (int temp = 0; temp < providerList.getLength(); temp++) {
                Node nNode = providerList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    if(eElement.hasAttribute("android:authorities")){
                        String authorities = eElement.getAttribute("android:authorities");
                        authorities = authorities.replaceAll("com.zjh336.cn.tools",packageName);
                        eElement.setAttribute("android:authorities", authorities);
                    }
                }
            }

            // 3、修改应用名 application的 android:label     android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"的service  对应的android:label
            String appName = packageProjectDTO.getAppName();
            NodeList applicationList = doc.getElementsByTagName("application");
            for (int temp = 0; temp < applicationList.getLength(); temp++) {
                Node nNode = applicationList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    eElement.setAttribute("android:label", appName);
                }
            }
            NodeList serviceList = doc.getElementsByTagName("service");
            for (int temp = 0; temp < serviceList.getLength(); temp++) {
                Node nNode = serviceList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    if (eElement.getAttribute("android:permission").equals("android.permission.BIND_NOTIFICATION_LISTENER_SERVICE")) {
                        eElement.setAttribute("android:label", appName);
                    }
                }
            }
            // 4、修改开启自启动设置 receiver android:name="com.AutoBootActivity1"  替换com.AutoBootActivity1
            boolean autoOpen = Objects.nonNull(packageProjectDTO.getAutoOpen()) ? packageProjectDTO.getAutoOpen() : false;
            NodeList receiverList = doc.getElementsByTagName("receiver");
            for (int temp = 0; temp < receiverList.getLength(); temp++) {
                Node nNode = receiverList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    if (eElement.getAttribute("android:name").equals("com.AutoBootActivity1")) {
                        if(autoOpen){
                            eElement.setAttribute("android:name", "com.AutoBootActivity");
                        } else {
                            // 删除当前节点
                            eElement.getParentNode().removeChild(eElement);
                        }
                    }
                }
            }


            // 将修改后的DOM对象转换为XML文件
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            DOMSource source = new DOMSource(doc);
            StreamResult result = new StreamResult(new File(packageTemplatePath + File.separator + "AndroidManifest.xml"));
            transformer.transform(source, result);

            // packageResAlreadyHandler.json文件的生成
            File alreadyFile = new File(packageTemplatePath + File.separator + "packageResAlreadyHandler.json");

            boolean openObfuscator = Objects.nonNull(packageProjectDTO.getOpenObfuscator()) ? packageProjectDTO.getOpenObfuscator() : false;
            if(openObfuscator){
                Thread.sleep(1000);
                // 混淆js代码
                String obfuscatorResult = PackageProjectUtils.obfuscatorProjectRes(apkSourcePath,webProjectRootPath,webProjectName,StrHelper.getObjectValue(packageProjectDTO.getObfuscatorIncludePaths()));
                // 项目文件混淆输出路径
                String projectOutPath = webProjectRootPath + File.separator + webProjectName + File.separator + "assets" + File.separator + "project_out";
                // 检测输出路径
                File outPathFile = new File(projectOutPath);
                // 如果目录存在
                if(outPathFile.exists()){
                    try {
                        // 目标项目路径
                        String targetProjectPath = webProjectRootPath + File.separator + webProjectName + File.separator + "assets" + File.separator + "project";
                        // 输出项目路径
                        String projectOutBakFilePath = webProjectRootPath + File.separator + webProjectName + "_projectOut.zip";


                        // 是windows服务
                        if(UploadPathHelper.isWindowsSystem()){
                            // 先移除文件
                            attachmentInfoService.deleteFile(projectOutBakFilePath);
                            attachmentInfoService.deleteFile(projectOutPath);
                            Thread.sleep(100);
                            // 拷贝文件
                            attachmentInfoService.copyFile(targetProjectPath,projectOutPath);
                            Thread.sleep(200);
                            // 移除插件目录
                            attachmentInfoService.deleteFile(projectOutPath + File.separator + "project" + File.separator + "plugins");
                            Thread.sleep(200);
                            // 压缩混淆后项目文件
                            attachmentInfoService.zipServerFileZip(projectOutPath + File.separator + "project",projectOutBakFilePath,"");
                            Thread.sleep(100);
                            // 再次移除目录
                            attachmentInfoService.deleteFile(projectOutPath);
                        } else {
                            // 先移除输出zip文件
                            attachmentInfoService.deleteFile(projectOutBakFilePath);
                            // System.out.println("移除："+projectOutBakFilePath);
                            // 单独处理 复制操作 命令cp 太坑了 各种错误

                            // 先压缩zip
                            attachmentInfoService.zipServerFileZip(projectOutPath,projectOutPath+".zip","");
                            // System.out.println("压缩："+projectOutBakFilePath + "到："+projectOutPath+".zip");

                            // 再解压 模拟递归复制操作  将混淆后的文件解压到目标目录
                            attachmentInfoService.unServerFileZip(projectOutPath+".zip",targetProjectPath);
                            // System.out.println("解压："+projectOutPath+".zip" + "到："+targetProjectPath);

                            // 临时文件路径
                            String tempFilePath = projectOutPath + "_temp";
                            attachmentInfoService.deleteFile(tempFilePath);
                            //  System.out.println("删除："+tempFilePath);
                            Thread.sleep(100);

                            // 拷贝到临时文件目录
                            attachmentInfoService.copyFile(targetProjectPath,tempFilePath);
                            // System.out.println("复制："+targetProjectPath+"到："+tempFilePath);
                            Thread.sleep(200);

                            // 移除插件目录
                            attachmentInfoService.deleteFile(tempFilePath + File.separator + "project" + File.separator + "plugins");
                            // System.out.println("移除："+tempFilePath + File.separator + "project" + File.separator + "plugins");

                            // 压缩混淆后项目文件
                            attachmentInfoService.zipServerFileZip(tempFilePath + File.separator + "project",projectOutBakFilePath,"");
                            // System.out.println("压缩："+tempFilePath + File.separator + "project" + "到："+projectOutBakFilePath);
                            Thread.sleep(100);

                            // 删除临时目录
                            attachmentInfoService.deleteFile(tempFilePath);
                            // System.out.println("移除："+tempFilePath);
                            // 删除临时目录
                            attachmentInfoService.deleteFile(projectOutPath);
                            // System.out.println("移除："+projectOutPath);
                            // 删除临时zip
                            attachmentInfoService.deleteFile(projectOutPath+".zip");
                            // System.out.println("移除："+projectOutPath+".zip");
                        }

                    }catch (Exception e){
                        log.error(e.getMessage(),e);
                    }
                    if(StringUtils.isNotBlank(obfuscatorResult) && obfuscatorResult.contains("命令执行有错误")){
                        // 删除
                        if(alreadyFile.exists()){
                            alreadyFile.delete();
                        }
                    } else {
                        // 创建文件
                        if(!alreadyFile.exists()){
                            alreadyFile.createNewFile();
                        }
                    }
                    return success(obfuscatorResult);
                } else {
                    // 删除
                    if(alreadyFile.exists()){
                        alreadyFile.delete();
                    }
                    // 返回错误信息
                    return fail(obfuscatorResult);
                }
            } else {
                // 创建文件
                if(!alreadyFile.exists()){
                    alreadyFile.createNewFile();
                }
                // 未开启混淆直接返回空
                return success("");
            }
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("打包资源处理异常！请联系管理员"+e.getMessage());
        }
    }


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
            // 执行生成签名命令 返回结果
            String result = PackageProjectUtils.executeGenerateSign(javaHome,apkSourcePath,keyStoreAlias,keyStoreValidity,keyStoreDName,keyStoreALog,keyStoreFile,keyStorePwd,keyStoreAliasPwd);

            if(StrHelper.getObjectValue(result).contains("当前设备未授权")){
                return fail(result);
            }
            return success(result);
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
                                    @RequestParam(value = "keyStoreFile",required = false) String keyStoreFile,
                                    @RequestParam(value = "keyStoreAlias",required = false) String keyStoreAlias,
                                    @RequestParam(value = "keyStorePwd",required = false) String keyStorePwd,
                                    @RequestParam(value = "keyStoreAliasPwd",required = false) String keyStoreAliasPwd) {
        try {
            if(StringUtils.isBlank(javaHome)){
                javaHome = "JAVA_HOME";
            }
            if(StringUtils.isBlank(keyStoreFile)){
                keyStoreFile = "zjh336.keystore";
            }
            if(StringUtils.isBlank(keyStoreAlias)){
                keyStoreAlias = "zjh336";
            }
            if(StringUtils.isBlank(keyStorePwd)){
                keyStorePwd = "zjh336";
            }
            if(StringUtils.isBlank(keyStoreAliasPwd)){
                keyStoreAliasPwd = "zjh336";
            }
            // 获取插件资源目录
            String apkSourcePath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + "webCommonPath" + File.separator + "apkPackage";

            // 检测打包插件是否存在
            File checkFile = new File(apkSourcePath);
            if(!checkFile.exists()){
                return fail("未找到打包插件,请先在公共文件模块初始化！");
            }
            // 打包模板路径
            String packageTemplatePath = webProjectRootPath + File.separator + webProjectName;
            // 先删除build文件
            attachmentInfoService.deleteFile(packageTemplatePath + File.separator + "build");
            // 删除apk文件
            attachmentInfoService.deleteFile(packageTemplatePath + ".apk");
            // 删除apk.idsig文件
            attachmentInfoService.deleteFile(packageTemplatePath + ".apk.idsig");
            // 执行打包命令 返回结果
            String result = PackageProjectUtils.executePackageProjectCommand(javaHome,apkSourcePath,webProjectRootPath,webProjectName,keyStoreFile,keyStoreAlias,keyStorePwd,keyStoreAliasPwd);
            if(StrHelper.getObjectValue(result).contains("当前设备未授权")){
                return fail(result);
            }
            return success(result);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("打包项目异常！请联系管理员");
        }
    }


    private Captcha createCaptcha(String type) {
        Captcha captcha = null;
        if (StringUtils.equalsIgnoreCase(type, "gif")) {
            captcha = new GifCaptcha(115, 42, 4);
        } else if (StringUtils.equalsIgnoreCase(type, "png")) {
            captcha = new SpecCaptcha(115, 42, 4);
        } else if (StringUtils.equalsIgnoreCase(type, "arithmetic")) {
            captcha = new ArithmeticCaptchaZ(115, 42);
        } else if (StringUtils.equalsIgnoreCase(type, "chinese")) {
            captcha = new ChineseCaptcha(115, 42);
        }
        captcha.setCharType(2);
        return captcha;
    }


    @ApiOperation(value = "生成图形验证码", notes = "生成图形验证码")
    @GetMapping("/generateImgVerify")
    public R<Map<String,Object>> generateImgVerify(){
        Map<String,Object> result = new HashMap<>();
        Captcha captcha = createCaptcha("arithmetic");

        ArithmeticCaptchaZ z = (ArithmeticCaptchaZ) captcha;
        result.put("text",captcha.text());
        result.put("list",z.getList());
        result.put("image",captcha.toBase64());
        return success(result);
    }

}
