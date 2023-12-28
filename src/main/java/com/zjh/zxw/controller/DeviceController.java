package com.zjh.zxw.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.img.Img;
import cn.hutool.core.img.ImgUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.RuntimeUtil;
import cn.hutool.core.util.ZipUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.xpath.internal.operations.Bool;
import com.zjh.commonUtils;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.DateUtils;
import com.zjh.zxw.common.util.FileListener;
import com.zjh.zxw.common.util.NumberHelper;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.*;
import com.zjh.zxw.websocket.AutoJsSession;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import com.zjh.zxw.websocket.IPUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
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

    @Value("${com.zjh.onlineStatusAccessPwd:}")
    private String onlineStatusAccessPwd;

    @Value("${com.zjh.uploadPath}")
    private String uploadPath;

    @Value("${server.port:9998}")
    public String port;

    @Value("${com.zjh.webFileListener.interval:2}")
    private static int webFileListenerInterval;

    /**
     * 禁止打开资源管理器
     */
    @Value("${com.zjh.forbidOpenExplorer:0}")
    private static int forbidOpenExplorer;


    // 监听文件监视器map
    private static Map<String, FileAlterationMonitor> watchFileMap = new ConcurrentHashMap<>();

    // 监听文件map
    private static Map<String, FileListener> watchFileListenerMap = new ConcurrentHashMap<>();

    // 在线机器码map
    private static Map<String, Map<String,String>> onlineMachineMap = new ConcurrentHashMap<>();

    // 检查QtScrcpy
    private String checkQtScrcpy(){
        File QtzipFile = new File("QtScrcpy.zip");
        if(!QtzipFile.exists()){
            // 执行下载zip
            RuntimeUtil.execForStr("curl -o \"QtScrcpy.zip\" \"https://gitee.com/zjh336/hz_autojs_toolbox_web/raw/master/QtScrcpy.zip\"");
        }
        File QtFile = new File("QtScrcpy");
        // 没有文件夹 才进行解压
        if(!QtFile.exists()){
            // 解压zip
            ZipUtil.unzip(QtzipFile,new File(System.getProperty("user.dir")));
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        File adbFile = new File("QtScrcpy/adb.exe");
        if(!adbFile.exists()){
            return "QtScrcpy/adb.exe文件不存在";
        }
        return "";
    }


    @ApiOperation(value = "开启无线调试", notes = "开启无线调试")
    @GetMapping("/pairDevice")
    public R<String> pairDevice(@RequestParam("ip") String ip,@RequestParam("port") String port,@RequestParam("code") String code){
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        String result = RuntimeUtil.execForStr("QtScrcpy/adb.exe pair "+ip+":"+port+" "+code);
        return success(result);
    }

    @ApiOperation(value = "开启adb授权", notes = "开启adb授权")
    @GetMapping("/grantAdb")
    public R<String> grantAdb(@RequestParam(value = "packageName",required = false) String packageName){
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        if(StringUtils.isBlank(packageName)){
            packageName = "com.zjh336.cn.tools";
        }
        String result = RuntimeUtil.execForStr("QtScrcpy/adb.exe shell pm grant "+packageName+" android.permission.WRITE_SECURE_SETTINGS");
        return success(result);
    }


    @ApiOperation(value = "截取手机屏幕", notes = "截取手机屏幕")
    @GetMapping("/screenCap")
    public R<String> screenCap(@RequestParam(value = "ip",required = false) String ip,@RequestParam(value = "imagePath",required = false) String imagePath){
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        LocalDateTime time1 = LocalDateTime.now();
        Process sh = RuntimeUtil.exec("QtScrcpy/adb.exe -s "+ip+" exec-out screencap -p");
        LocalDateTime time2 = LocalDateTime.now();
        System.out.println("获取耗时："+Duration.between(time1,time2).toMillis());
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            BufferedInputStream inputStream = new BufferedInputStream(sh.getInputStream());
            byte[] data = new byte[1024 * 1024 * 100];
            int length = 0;
            while ((length = inputStream.read(data)) != -1){
                bos.write(data, 0, length);
            }
            inputStream.close();
            byte[] compressedImageData = bos.toByteArray();
            /*// 把图片读入到内存中
            BufferedImage bufImg = ImageIO.read(sh.getInputStream());
            LocalDateTime time3 = LocalDateTime.now();
            System.out.println("读入内存耗时："+Duration.between(time2,time3).toMillis());
            // 压缩代码,存储图片文件byte数组
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            //防止图片变红,这一步非常重要
            BufferedImage bufferedImage = new BufferedImage(bufImg.getWidth(), bufImg.getHeight(), BufferedImage.TYPE_INT_RGB);
            bufferedImage.createGraphics().drawImage(bufImg,0,0, Color.WHITE,null);
            //先转成jpg格式来压缩,然后在通过OSS来修改成源文件本来的后缀格式
            ImageIO.write(bufferedImage,"jpg",bos);
            LocalDateTime time4 = LocalDateTime.now();
            */
            LocalDateTime time4 = LocalDateTime.now();
            System.out.println("读入内存耗时："+Duration.between(time2,time4).toMillis());

            if (imagePath != null && !imagePath.isEmpty()) {
                // 写入本地文件
                File file = new File(imagePath);
                File parentDir = file.getParentFile();
                if (parentDir != null && !parentDir.exists()) {
                    parentDir.mkdirs(); // 创建目录
                }
                try (OutputStream outputStream = new FileOutputStream(file)) {
                    outputStream.write(compressedImageData);
                }
                LocalDateTime time5 = LocalDateTime.now();
                System.out.println("写入文件耗时："+Duration.between(time4,time5).toMillis());
                return success("截取并保存手机屏幕成功！");
            } else {
                // 返回 base64
                String base64String = Base64.getEncoder().encodeToString(compressedImageData);
                LocalDateTime time5 = LocalDateTime.now();
                System.out.println("转换base64耗时："+Duration.between(time4,time5).toMillis());
                return success(base64String);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("截取手机屏幕失败！请联系管理员");
        }
    }

    @ApiOperation(value = "启动QtScrcpy", notes = "启动QtScrcpy")
    @GetMapping("/startQtScrcpy")
    public R<String> startQtScrcpy() throws InterruptedException {
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        File QtScrcpyFile = new File("QtScrcpy/QtScrcpy.exe");
        if(QtScrcpyFile.exists()){
            RuntimeUtil.exec("taskkill /f /im QtScrcpy.exe");
            Thread.sleep(1000);
            RuntimeUtil.exec("QtScrcpy/QtScrcpy.exe");
        }
        return success("");
    }

    @ApiOperation(value = "开启无线调试执行代码", notes = "开启无线调试执行代码")
    @GetMapping("/openWirelessDebugExec")
    public R<String> openWirelessDebug(@RequestParam("deviceUUID") String deviceUUID) throws Exception {
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        String tempPath = UploadPathHelper.getUploadPath(uploadPath);
        String wirelessDebugPath = (tempPath.endsWith(File.separator) ? tempPath : (tempPath + File.separator))  + "autoJsTools" + File.separator+ deviceUUID + File.separator + "system" + File.separator + "remoteScript" + File.separator + "wirelessDebug.js";
        // 远程无线调试代码
        File remoteScriptFile = new File(wirelessDebugPath);
        if(!remoteScriptFile.exists()){
            FileOutputStream fos = null;
            try {
                remoteScriptFile.createNewFile();
                fos  = new FileOutputStream(wirelessDebugPath);
                OutputStreamWriter osw = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
                osw.write(AutoJsWsServerEndpoint.getFileScriptContent("","wirelessDebug.js"));
                osw.close();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    fos.close();
                }catch (Exception ex){
                    ex.printStackTrace();
                }
            }
        }

        File remoteScriptEndFile = new File(wirelessDebugPath);
        StringBuilder remoteScript = new StringBuilder();
        try (FileInputStream fis = new FileInputStream(remoteScriptEndFile);
             InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
             BufferedReader br = new BufferedReader(isr)) {
            String line;
            while ((line = br.readLine()) != null) {
                remoteScript.append(line).append("\r\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 远程执行代码
        AutoJsWsServerEndpoint.execRemoteScript(deviceUUID,remoteScript.toString(),false,"","");
        return success("");
    }

    @ApiOperation(value = "执行adb指令", notes = "执行adb指令")
    @GetMapping("/execAdbDirect")
    public R<String> execAdbDirect(@RequestParam("adbDirect") String adbDirect) {
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        if(StringUtils.isNotBlank(adbDirect)){
            // 解码base64 再解URL编码
            adbDirect = StrHelper.decode(new String(Base64.getDecoder().decode(adbDirect.getBytes())));
            if(adbDirect.startsWith("adb.exe")){
                adbDirect = adbDirect.replaceFirst("adb.exe","");
            } else if(adbDirect.startsWith("adb")){
                adbDirect = adbDirect.replaceFirst("adb","");
            }
        }
        String result = RuntimeUtil.execForStr("QtScrcpy/adb.exe"+adbDirect);
        return success(result);
    }


    @ApiOperation(value = "连接adb", notes = "连接adb")
    @GetMapping("/connectDevice")
    public R<String> connectDevice(@RequestParam("ip") String ip,@RequestParam("port") String port) {
        String mess = checkQtScrcpy();
        if(StringUtils.isNotBlank(mess)){
            return success(mess);
        }
        String result = RuntimeUtil.execForStr("QtScrcpy/adb.exe connect "+ip+":"+port);
        return success(result);
    }


    @ApiOperation(value = "断连全部adb", notes = "断连全部adb")
    @GetMapping("/disconnectDevice")
    public R<String> disconnectDevice(){
        File adbFile = new File("QtScrcpy/adb.exe");
        if(!adbFile.exists()){
            return success("QtScrcpy/adb.exe文件不存在");
        }
        String result = RuntimeUtil.execForStr("QtScrcpy/adb.exe disconnect");
        return success(result);
    }



    @ApiOperation(value = "完成同步文件(或其他操作)", notes = "完成同步文件(或其他操作)")
    @GetMapping("/completeSyncFile")
    public R<Boolean> completeSyncFile(@RequestParam("syncFileUUID") String syncFileUUID){
        AutoJsWsServerEndpoint.completeSyncFile(syncFileUUID);
        return success(true);
    }

    @ApiOperation(value = "手机端复制文件", notes = "手机端复制文件")
    @PostMapping("/phoneCopyFiles")
    public R<Boolean> phoneCopyFiles(@RequestHeader("deviceUuid") String deviceUUID,@RequestBody CopyFileInterfaceDTO copyFileInterfaceDTO){
        try {
            return success(AutoJsWsServerEndpoint.execCopyFileScript(deviceUUID,copyFileInterfaceDTO));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("手机端复制文件失败！请联系管理员");
        }
    }

    @ApiOperation(value = "手机端移动文件", notes = "手机端移动文件")
    @PostMapping("/phoneMoveFiles")
    public R<Boolean> phoneMoveFiles(@RequestHeader("deviceUuid") String deviceUUID,@RequestBody CopyFileInterfaceDTO copyFileInterfaceDTO){
        try {
            return success(AutoJsWsServerEndpoint.execMoveFileScript(deviceUUID,copyFileInterfaceDTO));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("手机端移动文件失败！请联系管理员");
        }
    }


    @ApiOperation(value = "手机端执行脚本", notes = "手机端移动文件")
    @PostMapping("/phoneExecScript")
    public R<Boolean> phoneExecScript(@RequestHeader("deviceUuid") String deviceUUID,@RequestBody CommonExecScriptInterfaceDTO interfaceDTO){
        try {
            return success(AutoJsWsServerEndpoint.phoneExecScript(deviceUUID,interfaceDTO));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("手机端移动文件失败！请联系管理员");
        }
    }

    @ApiOperation(value = "手机端同步文件到web脚本", notes = "手机端同步文件到web脚本")
    @PostMapping("/phoneSyncToWebScript")
    public R<Boolean> phoneSyncToWebScript(@RequestHeader("deviceUuid") String deviceUUID,@RequestBody PhoneSyncFileToWebScriptInterfaceDTO interfaceDTO){
        try {
            return success(AutoJsWsServerEndpoint.phoneSyncToWebScript(deviceUUID,interfaceDTO));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("手机端同步文件到web脚本失败！请联系管理员");
        }
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
                                                     @RequestParam("webDirPath") String webDirPath,
                                                     @RequestParam(value = "phoneDirPath",required = false) String phoneDirPath,
                                                     @RequestParam(value = "checkChangeAutoRestart",required = false,defaultValue = "false") Boolean checkChangeAutoRestart) {
        try {
            if(StringUtils.isBlank(serverUrl)){
                serverUrl =  "http://"+ IPUtil.getRealIP() +":"+port;
            }
            if(StringUtils.isBlank(phoneDirPath)){
                // 手机端默认 临时目录
                phoneDirPath = "appSync/tempRemoteScript";
            }
            phoneDirPath = StrHelper.replaceFirstLastChart(phoneDirPath,"/");
            // 去除前面的斜杠
            webDirPath = webDirPath.startsWith("/") ? webDirPath.substring(1,webDirPath.length()) : webDirPath;
            File webDir = new File(uploadPath + File.separator + "autoJsTools" + File.separator + deviceUUID + File.separator +  StrHelper.replaceSystemSeparator(webDirPath));
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

            List<String> syncIgnorePaths = new ArrayList<>();
            File ignoreFile = new File(uploadPath + File.separator +  "autoJsTools"  + File.separator + deviceUUID + File.separator + webDirPath + File.separator + ".syncignore");
            if(ignoreFile.exists()){
                BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(ignoreFile), StandardCharsets.UTF_8));

                String line;
                while ((line = reader.readLine()) != null) {
                    // #表示注释 跳过
                    if(!line.startsWith("#")){
                        syncIgnorePaths.add(line);
                    }
                }
                reader.close();
            }

            long intervalTime = TimeUnit.SECONDS.toMillis(webFileListenerInterval);
            FileAlterationObserver observer = new FileAlterationObserver(webDir.getAbsolutePath());
            FileListener fileListener = new FileListener();
            fileListener.setIgnorePathArr(syncIgnorePaths);
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

    @ApiOperation(value = "同步web文件到手机端(基础方法)", notes = "同步web文件到手机端(基础方法)")
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


    /**
     *
     * @param deviceUUID 设备uuid
     * @param webScriptDirPath   web端脚本目录 例如  fb375905dd112762/200wLOGO
     * @param tempPhoneTargetPath 手机端临时同步目录
     * @return
     */
    @ApiOperation(value = "同步web项目到手机端", notes = "同步web项目到手机端")
    @GetMapping("/syncWebProjectToPhone")
    public R<Boolean> syncWebProjectToPhone(@RequestParam("deviceUUID") String deviceUUID,
                                            @RequestParam("webScriptDirPath") String webScriptDirPath,
                                            @RequestParam(value = "serverUrl",required = false) String serverUrl,
                                            @RequestParam(value = "tempPhoneTargetPath",required = false) String tempPhoneTargetPath) {
        try {
            AutoJsWsServerEndpoint.syncWebProjectToPhone(deviceUUID,serverUrl,webScriptDirPath,tempPhoneTargetPath,()->{});
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("同步web项目到手机端失败！请联系管理员");
        }
    }




    /**
     * 初始化Web项目同步忽略文件
     * @param webScriptDirPath web端脚本目录
     * @return
     */
    @ApiOperation(value = "初始化Web项目同步忽略文件", notes = "初始化Web项目同步忽略文件")
    @GetMapping("/initWebProjectIgnore")
    public R<Boolean> initWebProjectIgnore(@RequestParam("webScriptDirPath") String webScriptDirPath) {
        try {
            AutoJsWsServerEndpoint.initWebProjectIgnore(webScriptDirPath);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("初始化Web项目同步忽略文件失败！请联系管理员");
        }
    }


    /**
     *
     * @param deviceUUID 设备uuid
     * @param webScriptDirPath web端脚本目录
     * @return
     */
    @ApiOperation(value = "初始化Web项目bat", notes = "初始化Web项目bat")
    @GetMapping("/initWebProjectBat")
    public R<Boolean> initWebProjectBat(@RequestParam("deviceUUID") String deviceUUID,
                                    @RequestParam("webScriptDirPath") String webScriptDirPath,
                                    @RequestParam(value = "serverUrl",required = false) String serverUrl,
                                    @RequestParam(value = "tempPhoneTargetPath",required = false) String tempPhoneTargetPath) {
        try {
            AutoJsWsServerEndpoint.initWebProjectBat(deviceUUID,serverUrl,webScriptDirPath,tempPhoneTargetPath);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("初始化WEB端bat失败！请联系管理员");
        }
    }

    /**
     * 开启实时日志
     * @param deviceUUID 设备uuid
     * @param maxLineCount 最大行数
     * @return
     */
    @ApiOperation(value = "开启实时日志", notes = "开启实时日志")
    @GetMapping("/startOnlineLog")
    public R<Boolean> startOnlineLog(@RequestParam("deviceUUID") String deviceUUID,
                                        @RequestParam("maxLineCount") int maxLineCount){
        try {
            AutoJsWsServerEndpoint.execOnlineLogScript(deviceUUID,maxLineCount,false);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("开启实时日志失败！请联系管理员");
        }
    }

    /**
     * 停止实时日志
     * @param deviceUUID 设备uuid
     * @return
     */
    @ApiOperation(value = "停止实时日志", notes = "停止实时日志")
    @GetMapping("/stopOnlineLog")
    public R<Boolean> stopOnlineLog(@RequestParam("deviceUUID") String deviceUUID){
        try {
            AutoJsWsServerEndpoint.execOnlineLogScript(deviceUUID,20,true);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("停止实时日志失败！请联系管理员");
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
     * 获取当前版本号
     */
    @ApiOperation(value = "获取当前版本号", notes = "获取当前版本号")
    @GetMapping("/getCursVersion")
    public R<String> getCursVersion() {
        try {
            return success(AutoJsWsServerEndpoint.getCurVersion());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取当前版本号失败！请联系管理员");
        }
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
     * 创建空项目
     */
    @ApiOperation(value = "创建空项目", notes = "创建空项目")
    @GetMapping("/createEmptyProject")
    public R<String> createEmptyProject(@RequestParam("openPath") String openPath) {
        try {
            String emptyProjectUrl = "http://localhost:" + port + "/emptyProject.zip?t="+(new Date().getTime());
            URL url = new URL(emptyProjectUrl);
            InputStream in = url.openStream();
            Path downloadPath = Paths.get(UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + StrHelper.replaceSystemSeparator(openPath), "emptyProject.zip");
            Files.copy(in, downloadPath, StandardCopyOption.REPLACE_EXISTING);

            String emptyProjectPath = UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + StrHelper.replaceSystemSeparator(openPath) + File.separator + "emptyProject.zip";
            File emptyProjectFile = new File(emptyProjectPath);
            // 直接解压
            ZipUtil.unzip(emptyProjectFile);
            in.close();
            return success("");
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("创建空项目失败！请联系管理员");
        }
    }


    /**
     * 打开资源管理器
     */
    @ApiOperation(value = "打开资源管理器", notes = "打开资源管理器")
    @GetMapping("/openExplorer")
    public R<String> openExplorer(@RequestParam("openPath") String openPath) {
        try {
            // 设置参数为1 禁止开启
            if(forbidOpenExplorer == 1){
                return success("当前系统不支持打开资源管理器");
            } else {
                RuntimeUtil.execForStr("cmd /c start explorer \"" + UploadPathHelper.getUploadPath(uploadPath) + "autoJsTools" + File.separator + StrHelper.replaceSystemSeparator(openPath) +"\"");
                return success("");
            }
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("打开资源管理器失败！请联系管理员");
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

    private String getJsonByLocal(String fileName){
        File fileStart = new File(fileName);
        StringBuilder resultJson = new StringBuilder();
        try {
            if(fileStart.exists()){
                BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(fileStart), StandardCharsets.UTF_8));
                String line;
                while ((line = reader.readLine()) != null) {
                    resultJson.append(line);
                }
                reader.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultJson.toString();
    }


    private void writeLocalJson(String fileName,String fileContent){
        FileOutputStream fos = null;
        try {
            File fileStart = new File(fileName);
            if(!fileStart.exists()){
                fileStart.createNewFile();
            }
            fos  = new FileOutputStream(fileName);
            OutputStreamWriter osw = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
            osw.write(fileContent);
            osw.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                fos.close();
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
    }


    /**
     * 查询在线状态
     */
    @ApiOperation(value = "查询在线状态", notes = "查询在线状态")
    @GetMapping("/queryOnlineStatus")
    public R<List<Map<String, String>>> queryOnlineStatus(@RequestParam(value = "accessPwd",required = false) String accessPwd) {
        try {
            if(!onlineStatusAccessPwd.equals(accessPwd)){
                return fail("访问密码不正确");
            }
            // 如果缓存里面没有
            if(MapUtils.isEmpty(onlineMachineMap)){
                // 从本地文件读取
                String onlineMachineJson = getJsonByLocal("onlineMachine.json");
                if(StringUtils.isNotBlank(onlineMachineJson)){
                    // 写入到缓存中去
                    JSONArray jsonArray = JSONArray.parseArray(onlineMachineJson);
                    List<Map> tempList = jsonArray.toJavaList(Map.class);
                    if(CollectionUtil.isNotEmpty(tempList)){
                        tempList.forEach(map -> {
                            String machineCodeParam =  StrHelper.getObjectValue(map.get("machineCode"));
                            onlineMachineMap.put(machineCodeParam, map);
                        });
                    }
                }
            }
            List<Map<String,String>> list = new ArrayList<>(onlineMachineMap.values());
            List<String> machineCodeList = list.stream().map(stringStringMap -> stringStringMap.get("machineCode")).collect(Collectors.toList());
            // 获取已授权的机器码
            List<String> authorizes = commonUtils.checkAuthorizeMachineCode(machineCodeList);


            Map<String,String> authorizeMap = new HashMap<String, String>();
            authorizes.forEach(ss -> {
                List<String> authoriezes = new ArrayList<String>(StrHelper.str2ArrayListBySplit(ss,","));
                if(authoriezes.size() >= 2){
                    authorizeMap.put(authoriezes.get(0),authoriezes.get(1));
                }
            });

            list.stream().forEach(stringStringMap -> {
                String curMachineCode = StrHelper.getObjectValue(stringStringMap.get("machineCode"));
                // 设置授权状态
                stringStringMap.put("authorize",StrHelper.getObjectValue(authorizeMap.containsKey(curMachineCode)));
                // 设置授权信息
                stringStringMap.put("authorizeMsg", authorizeMap.getOrDefault(curMachineCode,""));
            });
            // 排序
            list = list.stream().sorted((o1, o2) -> {
                String lastConnectTime1 = o1.getOrDefault("lastConnectTime","");
                String lastConnectTime2 = o2.getOrDefault("lastConnectTime","");

                LocalDateTime time1 = DateUtils.parseToLocalDateTime(lastConnectTime1,DateUtils.DEFAULT_DATE_TIME_FORMAT);
                LocalDateTime time2 = DateUtils.parseToLocalDateTime(lastConnectTime2,DateUtils.DEFAULT_DATE_TIME_FORMAT);
                if(Objects.isNull(time1) || Objects.isNull(time2)){
                    return 0;
                }
                if(time1.isAfter(time2)){
                    return -1;
                } else if(time1.isBefore(time2)){
                    return 1;
                } else {
                    return 0;
                }
            }).collect(Collectors.toList());
            return success(list);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("查询在线状态失败！请联系管理员");
        }
    }


    /**
     * 记录在线状态(写入活跃用户)
     */
    @ApiOperation(value = "记录在线状态", notes = "记录在线状态")
    @GetMapping("/recordOnlineStatus")
    public R<Boolean> recordOnlineStatus(@RequestParam("machineCode") String machineCode,@RequestParam("systemType") String systemType,@RequestParam("curVersion") String curVersion) {
        try {
            // 如果缓存里面没有
            if(MapUtils.isEmpty(onlineMachineMap)){
                // 从本地文件读取
                String onlineMachineJson = getJsonByLocal("onlineMachine.json");
                if(StringUtils.isNotBlank(onlineMachineJson)){
                    // 写入到缓存中去
                    JSONArray jsonArray = JSONArray.parseArray(onlineMachineJson);
                    List<Map> tempList = jsonArray.toJavaList(Map.class);
                    if(CollectionUtil.isNotEmpty(tempList)){
                        tempList.forEach(map -> {
                           String machineCodeParam =  StrHelper.getObjectValue(map.get("machineCode"));
                            onlineMachineMap.put(machineCodeParam, map);
                        });
                    }
                }
            }
            File file = new File("zxw-aj-tools.vmoptions");
            Map<String, String> defaultMap = new HashMap<>();
            Map<String, String> onlineMap =  onlineMachineMap.getOrDefault(machineCode,defaultMap);
            String lastConnectTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern(DateUtils.DEFAULT_DATE_TIME_FORMAT));
            onlineMap.put("machineCode",machineCode);
            onlineMap.put("lastConnectTime",lastConnectTime);
            onlineMap.put("systemType",systemType);
            onlineMap.put("curVersion",StrHelper.decode(curVersion));
            onlineMap.put("isExeDeploy",StrHelper.getObjectValue(file.exists()));
            onlineMachineMap.put(machineCode,onlineMap);

            if(CollectionUtil.isNotEmpty(onlineMachineMap.values())){
                // 写入本地文件
                JSONArray jsonArray = (JSONArray) JSONArray.toJSON(onlineMachineMap.values());
                writeLocalJson("onlineMachine.json",jsonArray.toJSONString());
            }
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("记录在线状态失败！请联系管理员");
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
