package com.zjh.zxw.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.RuntimeUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.xpath.internal.operations.Bool;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.FileListener;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.domain.dto.SyncFileInterfaceDTO;
import com.zjh.zxw.websocket.AutoJsSession;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import com.zjh.zxw.websocket.IPUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.monitor.FileAlterationListener;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import sun.applet.Main;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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
@RequestMapping("/device")
@Api(value = "DeviceController", tags = "设备控制")
public class DeviceController extends BaseController {

    @Value("${com.zjh.pageAccessPassword}")
    private String pageAccessPassword;

    @Value("${com.zjh.uploadPath}")
    private String uploadPath;

    @Value("${server.port:9998}")
    public String port;

    @Value("${com.zjh.webFileListener.interval:2}")
    private static int webFileListenerInterval;


    // 监听文件监视器map
    private static Map<String, FileAlterationMonitor> watchFileMap = new ConcurrentHashMap<>();

    // 监听文件map
    private static Map<String, FileListener> watchFileListenerMap = new ConcurrentHashMap<>();

    @ApiOperation(value = "完成同步文件", notes = "完成同步文件")
    @GetMapping("/completeSyncFile")
    public R<Boolean> completeSyncFile(@RequestParam("syncFileUUID") String syncFileUUID){
        AutoJsWsServerEndpoint.completeSyncFile(syncFileUUID);
        return success(true);
    }



    @ApiOperation(value = "查询文件监听列表", notes = "查询文件监听列表")
    @GetMapping("/queryFileListenerList")
    public R<List<FileListener>> queryFileListenerList(@RequestParam("deviceUUID") String deviceUUID){
        List<String> keyList = new ArrayList<String>(watchFileListenerMap.keySet());
        // 过滤以 设备uuid加下划线开头的数据
        keyList = keyList.stream().filter(s ->  s.startsWith(deviceUUID+"/")).collect(Collectors.toList());
        // 返回监听数据
        List<FileListener> listeners = keyList.stream().map(s-> watchFileListenerMap.get(s)).collect(Collectors.toList());
        return success(listeners);
    }


    @ApiOperation(value = "停止文件变化监听", notes = "停止文件变化监听")
    @GetMapping("/stopFileChangeListener")
    public R<Boolean> stopFileChangeListener(@RequestParam("deviceUUID") String deviceUUID,
                                                     @RequestParam("webDirPath") String webDirPath
                                                     ) {
        try {
            // 去除前面的斜杠
            webDirPath = webDirPath.startsWith("/") ? webDirPath.substring(1,webDirPath.length()) : webDirPath;
            String watchFileKey = deviceUUID + "/" + webDirPath;
            if(watchFileMap.containsKey(watchFileKey)){
                FileAlterationMonitor monitor = watchFileMap.get(watchFileKey);
                monitor.stop();
                // 移除
                watchFileMap.remove(watchFileKey);
                watchFileListenerMap.remove(watchFileKey);
            }
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("停止文件变化监听失败！请联系管理员");
        }
    }



    @ApiOperation(value = "开启文件变化监听和增量同步", notes = "开启文件变化监听和增量同步")
    @GetMapping("/startFileChangeListenerAndSync")
    public R<Boolean> startListenerFileChangeAndSync(@RequestParam("deviceUUID") String deviceUUID,
                                                     @RequestParam(value = "serverUrl",required = false) String serverUrl,
                                                     @RequestParam(value = "checkChangeAutoRestart",required = false,defaultValue = "false") Boolean checkChangeAutoRestart,
                                                     @RequestParam("webDirPath") String webDirPath,
                                                     @RequestParam(value = "phoneDirPath",required = false) String phoneDirPath) {
        try {
            if(StringUtils.isBlank(serverUrl)){
                serverUrl =  "http://"+ IPUtil.getRealIP() +":"+port;
            }
            if(StringUtils.isBlank(phoneDirPath)){
                // 手机端默认 临时目录
                phoneDirPath = "appSync/tempRemoteScript";
            }
            // 处理前后斜杠
            phoneDirPath = phoneDirPath.startsWith("/") ? phoneDirPath.substring(1,phoneDirPath.length()) : phoneDirPath;
            phoneDirPath = phoneDirPath.endsWith("/") ? phoneDirPath.substring(0,phoneDirPath.lastIndexOf("/")) : phoneDirPath;

            // 去除前面的斜杠
            webDirPath = webDirPath.startsWith("/") ? webDirPath.substring(1,webDirPath.length()) : webDirPath;
            File webDir = new File(uploadPath + File.separator + "autoJsTools" + File.separator + deviceUUID + File.separator +  webDirPath);
            if(!webDir.exists()){
                throw new BusinessException("目录不存在");
            }
            String watchFileKey = deviceUUID + "/" + webDirPath;
            if(watchFileMap.containsKey(watchFileKey)){
                FileAlterationMonitor monitor = watchFileMap.get(watchFileKey);
                monitor.stop();
                // 移除
                watchFileMap.remove(watchFileKey);
                watchFileListenerMap.remove(watchFileKey);
            }
            long intervalTime = TimeUnit.SECONDS.toMillis(webFileListenerInterval);
            FileAlterationObserver observer = new FileAlterationObserver(webDir.getAbsolutePath());
            FileListener fileListener = new FileListener();
            fileListener.setWebDirPath(webDir.getAbsolutePath());
            fileListener.setCheckChangeAutoRestart(checkChangeAutoRestart);
            fileListener.setDeviceUUID(deviceUUID);
            fileListener.setPhoneDirPath(phoneDirPath);
            fileListener.setServerUrl(serverUrl);

            observer.addListener(fileListener);
            FileAlterationMonitor monitor = new FileAlterationMonitor(intervalTime, observer);
            monitor.start();
            watchFileMap.put(watchFileKey,monitor);
            watchFileListenerMap.put(watchFileKey,fileListener);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("开启文件变化监听和同步失败！请联系管理员");
        }
    }

    @ApiOperation(value = "同步web文件到手机端", notes = "同步web文件到手机端")
    @PostMapping("/syncWebFileToPhone")
    public R<Boolean> syncWebFileToPhone(@RequestHeader("deviceUUID") String deviceUUID, @RequestBody SyncFileInterfaceDTO syncFileInterfaceDTO) {
        try {
            // 独立引擎执行 同步文件脚本
            AutoJsWsServerEndpoint.execSyncFileScript(deviceUUID,syncFileInterfaceDTO,()->{});
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("同步web文件到手机端失败！请联系管理员");
        }
    }

    @ApiOperation(value = "运行手机端脚本", notes = "运行手机端脚本")
    @GetMapping("/execStartProjectByPhone")
    public R<Boolean> execStartProjectByPhone(@RequestHeader("deviceUUID") String deviceUUID, @RequestParam("scriptFilePath") String scriptFilePath) {
        try {
            AutoJsWsServerEndpoint.execStartProjectByPhone(deviceUUID,scriptFilePath);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("运行手机端脚本失败！请联系管理员");
        }
    }

    /**
     *
     * @param deviceUUID 设备uuid
     * @param webScriptDirPath web端脚本目录
     * @return
     */
    @ApiOperation(value = "初始化Web项目脚本", notes = "初始化Web项目脚本")
    @GetMapping("/initWebProjectBat")
    public R<Boolean> initWebProjectBat(@RequestParam("deviceUUID") String deviceUUID,
                                    @RequestParam("webScriptDirPath") String webScriptDirPath,
                                    @RequestParam(value = "serverUrl",required = false) String serverUrl,
                                    @RequestParam(value = "tempPhoneTargetPath",required = false) String tempPhoneTargetPath,
                                    @RequestParam(value = "isSyncProject", required = false, defaultValue = "true") Boolean isSyncProject) {

        try {
            AutoJsWsServerEndpoint.initWebProjectBat(deviceUUID,serverUrl,webScriptDirPath,tempPhoneTargetPath,isSyncProject);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("运行WEB端脚本失败！请联系管理员");
        }
    }


    /**
     *
     * @param deviceUUID 设备uuid
     * @param webScriptDirPath   web端脚本目录(自动以project.json的配置读取主运行文件，没有则默认读取main.js)
     * @param tempPhoneTargetPath 手机端临时同步目录
     * @param isSyncProject 是否先同步目录 再执行
     * @return
     */
    @ApiOperation(value = "运行WEB端脚本", notes = "运行WEB端脚本")
    @GetMapping("/execStartWebProject")
    public R<Boolean> execStartProjectByWeb(@RequestParam("deviceUUID") String deviceUUID,
                                            @RequestParam("webScriptDirPath") String webScriptDirPath,
                                            @RequestParam(value = "serverUrl",required = false) String serverUrl,
                                            @RequestParam(value = "tempPhoneTargetPath",required = false) String tempPhoneTargetPath,
                                            @RequestParam(value = "isSyncProject", required = false, defaultValue = "true") Boolean isSyncProject) {

        try {
            AutoJsWsServerEndpoint.execStartProjectByWeb(deviceUUID,serverUrl,webScriptDirPath,tempPhoneTargetPath,isSyncProject,"");
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("运行WEB端脚本失败！请联系管理员");
        }
    }

    @ApiOperation(value = "停止手机端全部脚本", notes = "停止手机端全部脚本")
    @GetMapping("/execStopProject")
    public R<Boolean> execStopProject(@RequestHeader("deviceUUID") String deviceUUID) {
        try {
            AutoJsWsServerEndpoint.execStopProject(deviceUUID);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("停止手机端全部脚本失败！请联系管理员");
        }
    }




    @ApiOperation(value = "检查页面访问限制", notes = "检查页面访问限制")
    @GetMapping("/checkPageAccessLimit")
    public R<Boolean> checkPageAccessLimit(){
        return success(StringUtils.isNotBlank(pageAccessPassword));
    }


    @ApiOperation(value = "校验页面访问密码", notes = "校验页面访问密码")
    @GetMapping("/validatePageAccessPassword")
    public R<Boolean> validatePageAccessPassword(@RequestParam("inputVal") String inputVal){
        return success(StrHelper.getObjectValue(pageAccessPassword).equals(inputVal));
    }

    private List<AutoJsSession> getOnlineDeviceFun() throws IOException {
        List<AutoJsSession> autoJsSessionList = AutoJsWsServerEndpoint.getOnlineDevice();
        String filePath = UploadPathHelper.getUploadPath(uploadPath) +  "autoJsTools" + File.separator + "webCommonPath" + File.separator;
        File fileParent = new File(filePath);
        if(!fileParent.exists()){
            fileParent.mkdirs();
        }
        JSONObject jsonObject = new JSONObject();
        // 原始json
        String sourceJsonStr = "";
        filePath  += "deviceAliasName.json";
        File file = new File(filePath);
        if(file.exists()){
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8));
            StringBuilder jsonString = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
            reader.close();
            String jsonStr = jsonString.toString();
            sourceJsonStr = jsonStr;
            if(StringUtils.isNotBlank(jsonStr)){
                jsonObject = JSONObject.parseObject(jsonStr);
            }
        }
        for (AutoJsSession autoJsSession : autoJsSessionList) {
            String deviceUuid = autoJsSession.getDeviceUuid();
            String aliasName = jsonObject.containsKey(deviceUuid) ? jsonObject.getString(deviceUuid) :"";

            autoJsSession.setAliasName(aliasName);
            jsonObject.put(deviceUuid,aliasName);
        }

        String newJsonStr = jsonObject.toJSONString();
        if(!sourceJsonStr.equals(newJsonStr)){
            FileOutputStream fos = new FileOutputStream(filePath);
            OutputStreamWriter osw = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
            osw.write(newJsonStr);
            osw.close();
        }
        return autoJsSessionList;
    }

    /**
     * 检查exe配置文件
     */
    @ApiOperation(value = "检查exe配置文件", notes = "检查exe配置文件")
    @GetMapping("/checkExeOptions")
    public R<Boolean> checkExeOptions() {
        try {
            File file = new File("zxw-aj-tools.vmoptions");
            return success(file.exists());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("检查exe配置文件失败！请联系管理员");
        }
    }



    /**
     * 获取最新版本
     */
    @ApiOperation(value = "获取最新版本", notes = "获取最新版本")
    @GetMapping("/getNewVersion")
    public R<String> getNewVersion() {
        try {
            URL url = new URL("https://gitee.com/zjh336/zjh336_limit/raw/master/gjx/newVersion/newVersion.txt?t="+(new Date().getTime()));
            // 打开连接
            URLConnection connection = url.openConnection();
            // 设置连接超时时间（可选）
            connection.setConnectTimeout(5000);
            // 建立实际连接
            connection.connect();
            // 读取页面内容
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
            String line;
            StringBuilder content = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
            reader.close();
            return success(content.toString());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取最新版本失败！请联系管理员");
        }
    }


    /**
     * 获取公告信息
     */
    @ApiOperation(value = "获取公告信息", notes = "获取公告信息")
    @GetMapping("/getNoticeMessage")
    public R<String> getNoticeMessage() {
        try {
            URL url = new URL("https://gitee.com/zjh336/zjh336_limit/raw/master/gjx/newVersion/noticeMessage.txt?t="+(new Date().getTime()));
            // 打开连接
            URLConnection connection = url.openConnection();
            // 设置连接超时时间（可选）
            connection.setConnectTimeout(5000);
            // 建立实际连接
            connection.connect();
            // 读取页面内容
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
            String line;
            StringBuilder content = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
            reader.close();
            return success(content.toString());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取公告信息失败！请联系管理员");
        }
    }




    /**
     * 执行在线更新
     */
    @ApiOperation(value = "执行在线更新", notes = "执行在线更新")
    @GetMapping("/onlineUpdateVersion")
    public R<Boolean> onlineUpdateVersion() {
        try {
            String step1 = RuntimeUtil.execForStr("curl -o \"4、在线更新版本.bat\" \"https://gitee.com/zjh336/zjh336_limit/raw/master/gjx/newVersion/4%E3%80%81%E5%9C%A8%E7%BA%BF%E6%9B%B4%E6%96%B0%E7%89%88%E6%9C%AC.bat\"");
            System.out.println(step1);
            String step3 = RuntimeUtil.execForStr("4、在线更新版本.bat");
            System.out.println(step3);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("执行在线更新失败！请联系管理员");
        }
    }

    /**
     * 获取在线设备
     */
    @ApiOperation(value = "获取在线设备", notes = "获取在线设备")
    @PostMapping("/getOnlineDevice")
    public R<List<AutoJsSession>> getOnlineDevice() {
        try {
            return success(getOnlineDeviceFun());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取在线设备失败！请联系管理员");
        }
    }

    /**
     * 管理员获取设备
     */
   /* @ApiOperation(value = "管理员获取设备", notes = "管理员获取设备")
    @PostMapping("/getDeviceByAdmin")
    public R<AutoJsSession> getDeviceByAdmin(@RequestParam("deviceUUID") String deviceUUID,@RequestParam("token") String token) {
        try {
            if(!"www.zjh336.cn".equals(token)){
                return null;
            }
            AutoJsSession autoJsSession = AutoJsWsServerEndpoint.getDeviceByAdmin(deviceUUID);
            return success(autoJsSession);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("管理员获取设备失败！请联系管理员");
        }
    }*/

    /**
     * 获取设备是否需要访问密码
     */
    @ApiOperation(value = "获取设备是否需要访问密码", notes = "获取设备是否需要访问密码")
    @GetMapping("/isNeedPassword")
    public R<Boolean> isNeedPassword(@RequestParam("deviceUUID") String deviceUUID) {
        try {
            return success(AutoJsWsServerEndpoint.isNeedPassword(deviceUUID));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取设备是否需要访问密码失败！请联系管理员");
        }
    }

    /**
     * 验证访问密码
     */
    @ApiOperation(value = "验证访问密码", notes = "验证访问密码")
    @GetMapping("/validPassword")
    public R<Boolean> validPassword(@RequestParam("deviceUUID") String deviceUUID,@RequestParam("password") String password) {
        try {
            return success(AutoJsWsServerEndpoint.validPassword(deviceUUID,password));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("验证访问密码失败！请联系管理员");
        }
    }

    /**
     * 获取其他属性
     */
    @ApiOperation(value = "获取其他属性", notes = "获取其他属性")
    @GetMapping("/getOtherPropertyJson")
    public R<String> getOtherPropertyJson(@RequestParam("deviceUUID") String deviceUUID) {
        try {
            return success(AutoJsWsServerEndpoint.getOtherPropertyJson(deviceUUID));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取其他属性失败！请联系管理员");
        }
    }

    /**
     * 发送指令到客户端
     */
    @ApiOperation(value = "发送指令到客户端", notes = "发送指令到客户端")
    @PostMapping("/sendMessageToClient")
    public R<Boolean> sendMessageToClient(@RequestBody AjMessageDTO messageDTO) {
        try {
            AutoJsWsServerEndpoint.sendMessageToClient(messageDTO);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("发送指令失败！请联系管理员");
        }
    }

    /**
     * 发送指令到多个客户端
     */
    @ApiOperation(value = "发送指令到多个客户端", notes = "发送指令到多个客户端")
    @PostMapping("/sendMessageToMultipleClient")
    public R<Boolean> sendMessageToMultipleClient(@RequestBody AjMessageDTO messageDTO) {
        try {
            AutoJsWsServerEndpoint.sendMessageToMultipleClient(messageDTO);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("发送指令失败！请联系管理员");
        }
    }



}
