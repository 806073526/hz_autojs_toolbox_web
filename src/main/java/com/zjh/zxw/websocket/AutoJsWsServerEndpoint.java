package com.zjh.zxw.websocket;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.zjh.PackageProjectUtils;
import com.zjh.zxw.common.util.DateUtils;
import com.zjh.zxw.common.util.NumberHelper;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.email.EmailSender;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.domain.dto.EmailConfig;
import com.zjh.zxw.domain.dto.SyncFileInterfaceDTO;
import com.zjh.zxw.dozer.DozerUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@ServerEndpoint(value = "/autoJsWs/{deviceUuid}/{deviceHeight}/{deviceWidth}", configurator = WebSocketConfigurator.class)
@Slf4j
@EnableAutoConfiguration
@Component
public class AutoJsWsServerEndpoint {
    /**
     * 当前在线连接数
     */
    private static AtomicInteger onlineCount = new AtomicInteger(0);

    private static ConcurrentHashMap<String, AutoJsSession> sessionMap = new ConcurrentHashMap<String, AutoJsSession>();

    private static ConcurrentHashMap<String, Object> curConnectMap = new ConcurrentHashMap<String, Object>();

    private static String SESSION_CODE = "autoJsSession";

    private static EmailConfig emailConfig;


    // 默认加入监听的项目路径
    private static String defaultProjectPaths;

    // 项目文件监听变化间隔
    private static int interval;

    // 默认项目路径 是否定期刷新 bat文件 1是 0否  如果只要启动时生成一次 设置0即可
    // ps:定期刷新会同步设备的操作访问到bat中,如果不开定期刷新,且后期修改设备访问密码,则需要手动同步密码到bat中
    private static int intervalGenerateBat;

    // 默认项目路径 是否自动开启监听 1是 0否
    private static int autoOpenListener;

    // 默认加入监听项目 是否变化后自动运行 1是 0否
    private static int checkChangeAutoRestart;

    private static String uploadPath;

    public static String port;

    // 设置版本号
    public static String curVersion =  "V3.6.0";

    public static String getCurVersion(){
        return curVersion;
    }


    @Value("${server.port:9998}")
    public void setPort(String portParam){
        port = portParam;
    }

    @Value("${com.zjh.uploadPath}")
    public void setUploadPath(String uploadPathParam){
        uploadPath = uploadPathParam;
    }

    @Value("${com.zjh.webFileListener.defaultProjectPaths:''}")
    public void setDefaultProjectPaths(String defaultProjectPathsParam) throws UnsupportedEncodingException {
        defaultProjectPaths = StrHelper.decode(defaultProjectPathsParam);
    }

    @Value("${com.zjh.webFileListener.intervalGenerateBat:1}")
    public void setIntervalGenerateBat(int intervalGenerateBatParam){
        intervalGenerateBat = intervalGenerateBatParam;
    }

    @Value("${com.zjh.webFileListener.autoOpenListener:1}")
    public void setAutoOpenListener(int autoOpenListenerParam){
        autoOpenListener = autoOpenListenerParam;
    }


    @Value("${com.zjh.webFileListener.interval:2}")
    public void setInterval(int intervalParam){
        interval = intervalParam;
    }

    @Value("${com.zjh.webFileListener.checkChangeAutoRestart:0}")
    public void setCheckChangeAutoRestart(int checkChangeAutoRestartPram){
        checkChangeAutoRestart = checkChangeAutoRestartPram;
    }


    // app消息map
    // key deviceUUID_serviceKey   value:具体值
    private static ConcurrentHashMap<String, String> appMessageMap = new ConcurrentHashMap<String,String>();

    // 同步文件map
    private static ConcurrentHashMap<String, String> syncFileMap = new ConcurrentHashMap<String,String>();

    // 已生成bat文件的项目路径列表
    private static List<String> alreadyGenerateBatProjectPathList = new ArrayList<>();

    // 已开启监听的项目路径列表
    private static List<String> alreadyListenerBatProjectPathList = new ArrayList<>();

    private static DozerUtils dozerUtils;


    /**
     * 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private AutoJsSession autoJsSession;


    // 开始同步
    public static void startSyncFile(String syncFileUUID){
        syncFileMap.put(syncFileUUID,"start");
    }

    // 结束同步
    public static void completeSyncFile(String syncFileUUID){
        syncFileMap.put(syncFileUUID,"complete");
    }

    // 获取状态
    public static String getSyncFileStatus(String syncFileUUID){
        return syncFileMap.get(syncFileUUID);
    }


    // 清除业务key的值
    public static void clearServiceKey(String appMsgServiceKey){
        appMessageMap.remove(appMsgServiceKey);
    }

    // 查询业务key的值
    public static String queryServiceKey(String appMsgServiceKey){
        return appMessageMap.get(appMsgServiceKey);
    }

    public static String getOtherPropertyJson(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return "";
        }
        AutoJsSession session = sessionMap.get(deviceUUID);
        return session.getOtherPropertyJson();
    }

    public static boolean isNeedPassword(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return false;
        }
        AutoJsSession session = sessionMap.get(deviceUUID);
        return StringUtils.isNotBlank(session.getPassword());
    }

    private static String getDevicePassword(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return "";
        }
        AutoJsSession session = sessionMap.get(deviceUUID);
        return StrHelper.getObjectValue(session.getPassword());
    }


    public static boolean validPassword(String deviceUUID,String password){
        if(!sessionMap.containsKey(deviceUUID)){
           return false;
        }
        AutoJsSession session = sessionMap.get(deviceUUID);
        return StrHelper.getObjectValue(session.getPassword()).equals(StrHelper.getObjectValue(password));
    }

    public static AutoJsSession getDeviceByAdmin(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return null;
        }
        AutoJsSession session = sessionMap.get(deviceUUID);
        // 获取复制参数
        AutoJsSession copySession = dozerUtils.map(session,AutoJsSession.class);
        copySession.setSession(null);
        return copySession;
    }

    /**
     * 获取在线设备
     *
     * @return
     */
    public static List<AutoJsSession> getOnlineDevice() {
        List<AutoJsSession> autoJsSessionList = sessionMap.entrySet().stream().map(Map.Entry::getValue).collect(Collectors.toList());
        List<AutoJsSession> otherList = new ArrayList<AutoJsSession>();

        List<String> needRemoveList = new ArrayList<String>();
        if (CollectionUtils.isNotEmpty(autoJsSessionList)) {
            for (AutoJsSession autoJsSession : autoJsSessionList) {

                LocalDateTime lastHeartTime = autoJsSession.getLastHeartTime();
                if(Objects.nonNull(lastHeartTime)){
                    Duration duration = Duration.between(lastHeartTime,LocalDateTime.now());
                    long minutes = NumberHelper.getOrDef(duration.toMinutes(),0L);
                    // 超过5分钟
                    if(minutes>5){
                        // 移除
                        needRemoveList.add(autoJsSession.getDeviceUuid());
                        continue;
                    }
                }
                String otherPropertyJson = autoJsSession.getOtherPropertyJson();
                AutoJsSession obj = AutoJsSession.builder()
                        .deviceUuid(autoJsSession.getDeviceUuid())
                        .connectTime(autoJsSession.getConnectTime())
                        .screenHeight(autoJsSession.getScreenHeight())
                        .screenWidth(autoJsSession.getScreenWidth())
                        .otherPropertyJson(otherPropertyJson)
                        .lastHeartTime(autoJsSession.getLastHeartTime()).build();
                otherList.add(obj);
            }
            if(CollectionUtils.isNotEmpty(needRemoveList)){
                for (String s : needRemoveList) {
                    sessionMap.remove(s);
                }
            }
        }
        return otherList;
    }

    /**
     * 发送消息到客户端
     */
    public static void sendMessageToClient(AjMessageDTO messageDTO) throws IOException {
        messageDTO.setMessageDateTime(LocalDateTime.now());
        String deviceUUID = messageDTO.getDeviceUuid();
        AutoJsSession curAutoJsSession = sessionMap.get(deviceUUID);
        if (Objects.nonNull(curAutoJsSession)) {
            curAutoJsSession.sendText(JSONUtil.toJsonStr(messageDTO));
        }
    }

    public static void sendMessageToMultipleClient(AjMessageDTO messageDTO) throws IOException {
        messageDTO.setMessageDateTime(LocalDateTime.now());
        String deviceUUID = messageDTO.getDeviceUuid();

        List<String> deviceUUIDList = new ArrayList<String>(StrHelper.str2ArrayListBySplit(deviceUUID,","));
        for (String deviceUUIDSingle : deviceUUIDList) {
            AutoJsSession curAutoJsSession = sessionMap.get(deviceUUIDSingle);
            if (Objects.nonNull(curAutoJsSession)) {
                curAutoJsSession.sendText(JSONUtil.toJsonStr(messageDTO));
            }
        }
    }


    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("deviceUuid") String deviceUuid, @PathParam("deviceWidth") String deviceWidth, @PathParam("deviceHeight") String deviceHeight) throws Exception {
        AutoJsSession autoJsSession = AutoJsSession.builder().lastHeartTime(LocalDateTime.now()).deviceUuid(deviceUuid).session(session).build();
        autoJsSession.setConnectTime(LocalDateTime.now());
        autoJsSession.setScreenWidth(deviceWidth);
        autoJsSession.setScreenHeight(deviceHeight);

        Map<String, Object> userProperties = session.getUserProperties();
        String IP = (String) userProperties.get("IP");
        sessionMap.put(deviceUuid, autoJsSession);
        this.autoJsSession = autoJsSession;
        // 未包含的设备id
        if(!curConnectMap.containsKey(deviceUuid) && StringUtils.isNotBlank(emailConfig.getReceiveEmail())){

            String machineCode = "";
            try {
                machineCode = PackageProjectUtils.getMachineCode();
            }catch (Exception e){
                log.error(e.getMessage());
            }
            // 推送上线消息
            EmailSender.sendAutoJsEmail(emailConfig.getReceiveEmail(),"《华仔AutoJs工具箱》"+deviceUuid+"已连接","服务端机器码:"+ machineCode + "<br>设备uuid："+deviceUuid+"<br>设备宽度："+deviceWidth+"<br>设备高度："+deviceHeight+"<br>连接时间："+ DateUtils.format(LocalDateTime.now(),DateUtils.DEFAULT_DATE_TIME_FORMAT)+"<br>服务端IP："+ InetAddress.getLocalHost().getHostAddress() +"<br>客户端IP："+IP);
            // 记录
            curConnectMap.put(deviceUuid,LocalDateTime.now());
        }

        // 发送指令 给所以连接了的web端  推送app连接成功消息
        AjMessageDTO ajMessageDTO = new AjMessageDTO();
        ajMessageDTO.setDeviceUuid(deviceUuid);
        ajMessageDTO.setAction("appWebSocketConnectSuccess");
        ajMessageDTO.setMessage("上线");
        // 推送消息通知到web端页面
        AutoJsWebWsServerEndpoint.sendMessageToClientSelectAppDevice("","",ajMessageDTO);
        autoJsSession.sendText("连接成功！" + deviceUuid);
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("deviceUuid") String deviceUuid) {
        sessionMap.remove(deviceUuid);
        AjMessageDTO aj = new AjMessageDTO();
        aj.setDeviceUuid(deviceUuid);
        aj.setAction("appWebSocketCloseSuccess");
        aj.setMessage("下线");
        try {
            AutoJsWebWsServerEndpoint.sendMessageToClientSelectAppDevice("","",aj);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println("关闭连接:" + deviceUuid);
    }

    /**
     * 接收到消息并处理
     *
     * @param session
     * @param message
     */
    private void receiveMessage(Session session, String message) throws IOException {
        // 处理 心跳 接收到0  回复1
        if (StringUtils.equals(message, "0")) {
            this.autoJsSession.sendText("1");
            String deviceUUID = this.autoJsSession.getDeviceUuid();
            // 修改最后连接时间
            this.autoJsSession.setLastHeartTime(LocalDateTime.now());
            // 设置到本地缓存
            sessionMap.put(deviceUUID, autoJsSession);
            return;
        }
        // 判断字符串不为空 且可以解析为json字符串
        if (StringUtils.isNotBlank(message) && JSONUtil.isJson(message)) {
            // 解析json对象
            JSONObject messageData = JSONObject.parseObject(message);
            // 获取指令
            String action = messageData.getString("action");
            // 获取消息体
            String messageStr = messageData.getString("message");
            if (StrUtil.isBlank(action)) {
                return;
            }
            //判断是否为同步日期指令。
            if ("asyncTime".equals(action)) {
                this.autoJsSession.sendText(action);
            } else if("sendDeviceInfo".equals(action)){
                if(StringUtils.isNotBlank(messageStr)){
                    // 解析json对象
                    JSONObject messageStrData = JSONObject.parseObject(new String(Base64.getDecoder().decode(messageStr.getBytes())));
                    String deviceHeight = messageStrData.getString("deviceHeight");
                    String deviceWidth =  messageStrData.getString("deviceWidth");
                    String password = messageStrData.getString("password");
                    String otherPropertyJson = messageStrData.getString("otherPropertyJson");

                    String deviceUUID = this.autoJsSession.getDeviceUuid();
                    this.autoJsSession.setScreenHeight(deviceHeight);
                    this.autoJsSession.setScreenWidth(deviceWidth);
                    this.autoJsSession.setPassword(password);

                    String newOtherPropertyJson = new String(Base64.getDecoder().decode(otherPropertyJson.getBytes()));
                    String oldOtherPropertyJson = this.autoJsSession.getOtherPropertyJson();

                    // 如果同步其他属性时  检测到 前后不一致
                    if(!newOtherPropertyJson.equals(oldOtherPropertyJson)){
                        AjMessageDTO syncOtherPropertyMessage = new AjMessageDTO();
                        syncOtherPropertyMessage.setAction("syncOtherPropertyJson");
                        // 编码base64
                        syncOtherPropertyMessage.setMessage(new String(Base64.getEncoder().encode(newOtherPropertyJson.getBytes())));
                        // 则通知所有连接的在线web设备 更新缓存数据
                        AutoJsWebWsServerEndpoint.sendMessageToClientSelectAppDevice(deviceUUID,"",syncOtherPropertyMessage);
                    }
                    this.autoJsSession.setOtherPropertyJson(newOtherPropertyJson);
                    // 设置到本地缓存
                    sessionMap.put(deviceUUID, this.autoJsSession);

                    try {
                        // 默认项目处理
                        defaultProjectHandler(deviceUUID);
                    }catch (Exception e){
                        log.error("默认项目处理出现异常：",e);
                    }
                }
            // 更新业务key
            } else if("updateServiceKey".equals(action)){
                if(StringUtils.isNotBlank(messageStr)){
                    // 解析json对象
                    JSONObject messageStrData = JSONObject.parseObject(new String(Base64.getDecoder().decode(messageStr.getBytes())));
                    String deviceUUID = messageStrData.getString("deviceUUID");
                    String serviceKey = messageStrData.getString("serviceKey");
                    String serviceValue =  messageStrData.getString("serviceValue");
                    log.info("action:"+action+" deviceUUID:"+deviceUUID +" serviceKey:"+serviceKey + "serviceValue:"+serviceValue);
                    // 设置到本地缓存
                    appMessageMap.put(deviceUUID+"_"+serviceKey,serviceValue);
                }
            }
        }
    }

    /**
     * 默认项目处理
     * @param deviceUUID
     */
    private static void defaultProjectHandler(String deviceUUID) throws Exception {
        // 设置监听目录不为空
        if(StringUtils.isNotBlank(defaultProjectPaths)){
            // 默认项目列表
            List<String> defaultProjectPathList = new ArrayList<String>(StrHelper.str2ArrayListBySplit(defaultProjectPaths,","));

            // 遍历项目路径
            for (String projectPath : defaultProjectPathList) {
                if(!projectPath.startsWith(deviceUUID)){
                    continue;
                }
                // 开启了定时刷新 或者 项目未执行过的时候
                if(intervalGenerateBat == 1 || !alreadyGenerateBatProjectPathList.contains(projectPath)) {
                    // 初始化项目运行bat脚本
                    initWebProjectBat(deviceUUID,"",projectPath,"");
                    // 初始化同步忽略文件
                    AutoJsWsServerEndpoint.initWebProjectIgnore(projectPath);
                    // 添加到已执行
                    alreadyGenerateBatProjectPathList.add(projectPath);
                }

                // 开启了自动监听 且 项目未执行过操作
                if(autoOpenListener == 1 && !alreadyListenerBatProjectPathList.contains(projectPath)){
                    System.out.println("开启文件监听");
                    String webDirPath = projectPath.replaceFirst(deviceUUID,"");
                    // 请求开启监听接口
                    String startListenerInterface = "http://localhost:" + port + "/device/startFileChangeListenerAndSync?deviceUUID="+deviceUUID+"&webDirPath="+StrHelper.encode(webDirPath)+"&checkChangeAutoRestart="+(checkChangeAutoRestart == 1);
                    URL url = new URL(startListenerInterface);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    // 设置连接超时时间（可选）
                    connection.setConnectTimeout(5000);
                    // 建立实际连接
                    connection.connect();

                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();
                    System.out.println("返回结果："+response.toString());
                    // 添加到已执行
                    alreadyListenerBatProjectPathList.add(projectPath);
                }

            }
        }
    }

    /**
     * 开启在线实时日志
     * @param deviceUUID 设备uuid
     * @param maxLineCount 最大行数
     * @param isOnlyStop 仅停止
     * @throws Exception
     */
    public static void execOnlineLogScript(String deviceUUID,int maxLineCount,Boolean isOnlyStop) throws Exception {
        Map<String,String> params = new HashMap<>();
        params.put("maxLineCount",StrHelper.getObjectValue(maxLineCount));
        params.put("onlyStop",isOnlyStop ? "true": "");
        String remoteScript = getStartOnlineLogScriptContent(JSONObject.toJSONString(params));
        execRemoteScript(deviceUUID,remoteScript,false,"","");
    }


    /**
     * 以独立引擎模式 执行 同步文件脚本
     * @return
     * @throws Exception
     */
    public static void execSyncFileScript(String deviceUUID,SyncFileInterfaceDTO syncFileInterfaceDTO,Runnable syncAfterFun) throws Exception {
        String syncFileUUID = UUID.randomUUID().toString();
        // 设置uuid
        syncFileInterfaceDTO.setSyncFileUUID(syncFileUUID);

        String selfScriptName = "syncFileScript_" + new Date().getTime()+".js";
        syncFileInterfaceDTO.setSelfScriptName(selfScriptName);
        // 设置同步状态为开始
        startSyncFile(syncFileUUID);
        // 根据参数获取同步文件脚本
        String scriptContent =  getSyncFileScriptContent(JSONObject.toJSONString(syncFileInterfaceDTO));
        // 指定脚本文件路径  包装独立引擎
        execRemoteScript(deviceUUID,scriptContent,true,"/sdcard/appSync/tempRemoteScript/","/sdcard/appSync/tempRemoteScript/"+selfScriptName);
        // 开启一个线程
        Thread thread =  new Thread(()->{
            while (true){
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                // 获取状态
                String syncStatus = getSyncFileStatus(syncFileUUID);
                // 完成了才执行
                if("complete".equals(syncStatus)){
                    syncAfterFun.run();
                    break;
                }
            }
        });
        thread.start();
    }

    /**
     * 运行手机端项目
     * @param deviceUUID
     * @param scriptFilePath 脚本文件
     */
    public static void execStartProjectByPhone(String deviceUUID,String scriptFilePath) throws Exception{
        String scriptDirPath = StringUtils.isNotBlank(scriptFilePath) ?  scriptFilePath.substring(0,scriptFilePath.lastIndexOf('/')) : "";
        String remoteScript =  "engines.execScriptFile(\""+scriptFilePath+"\",{path:[\""+scriptDirPath+"\"]});";
        // 远程执行脚本 直接运行 不开启独立引擎
        execRemoteScript(deviceUUID,remoteScript,false,"","");
    }

    /**
     * 初始化Web项目同步忽略文件
     * @param webScriptDirPath  //  fb375905dd112762/200wLOGO
     * @throws Exception
     */
    public static void initWebProjectIgnore(String webScriptDirPath) throws Exception{
        String fileName = ".syncignore";
        String tempPath = UploadPathHelper.getUploadPath(uploadPath);
        File ignoreFile = new File((tempPath.endsWith(File.separator) ? tempPath : (tempPath + File.separator))  + "autoJsTools" + File.separator + StrHelper.replaceSystemSeparator(webScriptDirPath) + File.separator + fileName);
        if(!ignoreFile.exists()){
            writeBatFile(webScriptDirPath,fileName,"#请填写需要忽略的目录 可以写多级目录 每个目录占一行 #表示注释不生效 示例如下: \n#node_modules\n.git\n.idea\n.vscode");
            System.out.println("初始化同步忽略文件完成");
        }
    }

    /**
     * 初始化web项目运行脚本
     * @param deviceUUID
     * @param serverUrl
     * @param webScriptDirPath  //  fb375905dd112762/200wLOGO
     * @param tempPhoneTargetPath // ""
     * @throws Exception
     */
    public static void initWebProjectBat(String deviceUUID,String serverUrl,String webScriptDirPath,String tempPhoneTargetPath) throws Exception{
        if(StringUtils.isBlank(tempPhoneTargetPath)){
            // 手机端默认 临时目录
            tempPhoneTargetPath = "appSync/tempRemoteScript";
        }
        tempPhoneTargetPath = StrHelper.replaceFirstLastChart(tempPhoneTargetPath,"/");
        if(StringUtils.isBlank(serverUrl)){
            serverUrl =  "http://"+ IPUtil.getRealIP() +":"+port;
        }
        // 运行手机端临时目录的 项目
        // String projectName = webScriptDirPath.substring(webScriptDirPath.lastIndexOf("/"),webScriptDirPath.length());

        if (UploadPathHelper.isWindowsSystem()) {
            String localLogPath = "";
            String tempPath = UploadPathHelper.getUploadPath(uploadPath);
            localLogPath = (tempPath.endsWith(File.separator) ? tempPath : (tempPath + File.separator))  + "autoJsTools" + File.separator + deviceUUID + File.separator + "onlineLog.log";
            File file = new File(localLogPath);
            if(!file.exists()){
                file.createNewFile();
            }

            int maxLineCount = 30;
            // 初始化日志脚本 显示
            String sourceStr0 = "@echo off\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" %s/device/startOnlineLog?deviceUUID=%s^&maxLineCount=%s\n"+
                    ":monitor\n" +
                    "powershell -Command \"$filePath = '%s'; $lastWriteTime = (Get-Item $filePath).LastWriteTime; while ($true) { $newWriteTime = (Get-Item $filePath).LastWriteTime; if ($newWriteTime -ne $lastWriteTime) { Clear-Host; Get-Content -Path $filePath -Tail %d -Encoding UTF8; $lastWriteTime = $newWriteTime; } Start-Sleep -Seconds 1; }\"\n" +
                    "goto monitor";
            String logBatContent = String.format(sourceStr0, deviceUUID, getDevicePassword(deviceUUID), serverUrl, deviceUUID ,maxLineCount, localLogPath, maxLineCount);
            writeBatFile(webScriptDirPath, "showLog.bat", logBatContent);

            // 初始化日志脚本 隐藏
            String sourceStr0_hide = "@echo off\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" %s/device/stopOnlineLog?deviceUUID=%s";
            String logBatContent_hide = String.format(sourceStr0_hide, deviceUUID, getDevicePassword(deviceUUID), serverUrl, deviceUUID ,maxLineCount, localLogPath, maxLineCount);
            writeBatFile(webScriptDirPath, "hideLog.bat", logBatContent_hide);

            // 初始化启动脚本
            String sourceStr = "@echo off\n" +
                    "rem 可以在vscode中设置快捷键 详情见http://doc.zjh336.cn/#/integrate/hz_autojs_tools_box/help/65 \n" +
                    "rem 【同步+运行】 ./start.bat\n" +
                    "rem 【仅运行】 ./start.bat false\n" +
                    "set isSyncProject=%%1\n" +
                    "if \"%%isSyncProject%%\"==\"\" set isSyncProject=true\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" %s/device/execStartWebProject?deviceUUID=%s^&webScriptDirPath=%s^&isSyncProject=%%isSyncProject%%\n";

            // http://localhost:9998  fb375905dd112762  fb375905dd112762/200wLOGO
            String startBatContent = String.format(sourceStr, deviceUUID, getDevicePassword(deviceUUID), serverUrl, deviceUUID, (StrHelper.encode(webScriptDirPath.replaceAll("\\\\", "/")).replaceAll("%", "%%")));
            writeBatFile(webScriptDirPath, "start.bat", startBatContent);

            // 初始化停止脚本
            String sourceStr2 = "@echo off\n" +
                    "rem 可以在vscode中设置快捷键 详情见http://doc.zjh336.cn/#/integrate/hz_autojs_tools_box/help/65 \n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" %s/device/execStopProject";
            String stopBatContent = String.format(sourceStr2, deviceUUID, getDevicePassword(deviceUUID), serverUrl);
            writeBatFile(webScriptDirPath, "stop.bat", stopBatContent);
        } else {
            String localLogPath = "";
            String tempPath = UploadPathHelper.getUploadPath(uploadPath);
            localLogPath = (tempPath.endsWith(File.separator) ? tempPath : (tempPath + File.separator))  + "autoJsTools" + File.separator + deviceUUID + File.separator + "onlineLog.log";
            File file = new File(localLogPath);
            if(!file.exists()){
                file.createNewFile();
            }

            int maxLineCount = 30;
            // 初始化日志脚本 显示
            String sourceStr0 = "@echo off\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" %s/device/startOnlineLog?deviceUUID=%s^&maxLineCount=%s\n"+
                    "tail -f -n %d %s";
            String logBatContent = String.format(sourceStr0, deviceUUID, getDevicePassword(deviceUUID), serverUrl, deviceUUID ,maxLineCount, maxLineCount, localLogPath);
            writeBatFile(webScriptDirPath, "showLog.sh", logBatContent);


            // 初始化日志脚本 隐藏
            String sourceStr0_hide = "@echo off\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" %s/device/stopOnlineLog?deviceUUID=%s^&maxLineCount=%s\n"+
                    "tail -f -n %d %s";
            String logBatContent_hide = String.format(sourceStr0_hide, deviceUUID, getDevicePassword(deviceUUID), serverUrl, deviceUUID ,maxLineCount, maxLineCount, localLogPath);
            writeBatFile(webScriptDirPath, "hideLog.sh", logBatContent_hide);


            // 初始化启动脚本
            String startShContent = "#!/bin/bash\n" +
                    "# 可以在vscode中设置快捷键 详情见http://doc.zjh336.cn/#/integrate/hz_autojs_tools_box/help/65\n" +
                    "# 【同步+运行】 ./start.sh\n" +
                    "# 【仅运行】 ./start.sh false\n" +
                    "isSyncProject=${1:-true}\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\"  \"%s/device/execStartWebProject?deviceUUID=%s&webScriptDirPath=%s&isSyncProject=$isSyncProject\"";
            // http://localhost:9998  fb375905dd112762  fb375905dd112762/200wLOGO
            String startShContentFormatted = String.format(startShContent, deviceUUID, getDevicePassword(deviceUUID), serverUrl, deviceUUID, (StrHelper.encode(webScriptDirPath.replaceAll("\\\\", "/"))));
            writeBatFile(webScriptDirPath, "start.sh", startShContentFormatted);

            // 初始化停止脚本
            String stopShContent = "#!/bin/bash\n" +
                    "# 可以在vscode中设置快捷键 详情见http://doc.zjh336.cn/#/integrate/hz_autojs_tools_box/help/65\n" +
                    "curl -H \"deviceUUID:%s\" -H \"devicePassword:%s\" \"%s/device/execStopProject\"";
            String stopShContentFormatted = String.format(stopShContent, deviceUUID, getDevicePassword(deviceUUID), serverUrl);
            writeBatFile(webScriptDirPath, "stop.sh", stopShContentFormatted);
        }
    }

    private static void writeBatFile(String webScriptDirPath, String fileName,String fileContent) {
        FileOutputStream fos = null;
        String location = "";
        try {
            String tempPath = UploadPathHelper.getUploadPath(uploadPath);
            location = (tempPath.endsWith(File.separator) ? tempPath : (tempPath + File.separator))  + "autoJsTools" + File.separator + StrHelper.replaceSystemSeparator(webScriptDirPath) + File.separator + fileName;
            File fileStart = new File(location);
            if(!fileStart.exists()){
                fileStart.createNewFile();
            }
            fos  = new FileOutputStream(location);
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
     * 同步web项目到手机端
     * @param deviceUUID 设备uuid
     * @param serverUrl 服务端地址
     * @param webScriptDirPath web目录 例如fb375905dd112762/200wLOGO
     * @param tempPhoneTargetPath 手机端目录
     * @param runnable
     */
    public static void syncWebProjectToPhone(String deviceUUID,String serverUrl,String webScriptDirPath,String tempPhoneTargetPath, Runnable runnable) throws Exception {
        if(StringUtils.isBlank(serverUrl)){
            serverUrl =  "http://"+ IPUtil.getRealIP() +":"+port;
        }
        if(StringUtils.isBlank(tempPhoneTargetPath)){
            // 手机端默认 临时目录
            tempPhoneTargetPath = "appSync/tempRemoteScript";
        }
        tempPhoneTargetPath = StrHelper.replaceFirstLastChart(tempPhoneTargetPath,"/");
        webScriptDirPath = StrHelper.replaceFirstLastChart(webScriptDirPath,"/");

        List<String> webPathArr = new ArrayList<String>();
        String webPath = webScriptDirPath.substring(webScriptDirPath.indexOf(deviceUUID),webScriptDirPath.length());
        webPathArr.add(webPath);

        List<String> syncIgnorePaths = new ArrayList<>();
        File ignoreFile = new File(uploadPath + File.separator +  "autoJsTools"  + File.separator + webScriptDirPath + File.separator + ".syncignore");
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

        // 同步后执行
        SyncFileInterfaceDTO syncFileInterfaceDTO = new SyncFileInterfaceDTO();
        syncFileInterfaceDTO.setShowProcess(true);
        syncFileInterfaceDTO.setWebPathArr(webPathArr);
        syncFileInterfaceDTO.setPhoneTargetPath(tempPhoneTargetPath);
        syncFileInterfaceDTO.setServerUrl(serverUrl);
        syncFileInterfaceDTO.setIgnorePathArr(syncIgnorePaths);
        syncFileInterfaceDTO.setCompleteMsg("同步web目录【"+webScriptDirPath+"】到手机端【/sdcard/"+tempPhoneTargetPath+"】完成,共");
        // 同步项目
        execSyncFileScript(deviceUUID,syncFileInterfaceDTO,runnable);
    }


    /**
     * 运行web项目
     * @param deviceUUID 设备UUID
     * @param serverUrl 服务端地址
     * @param webScriptDirPath web项目目录
     * @param tempPhoneTargetPath 手机端同步目录
     * @param isSyncProject 是否同步项目
     * @param preScript 前置脚本
     * @throws Exception
     */
    public static void execStartProjectByWeb(String deviceUUID,String serverUrl,String webScriptDirPath,String tempPhoneTargetPath,Boolean isSyncProject, String preScript) throws Exception{
        if(StringUtils.isBlank(serverUrl)){
            serverUrl =  "http://"+ IPUtil.getRealIP() +":"+port;
        }
        if(StringUtils.isBlank(tempPhoneTargetPath)){
            // 手机端默认 临时目录
            tempPhoneTargetPath = "appSync/tempRemoteScript";
        }
        tempPhoneTargetPath = StrHelper.replaceFirstLastChart(tempPhoneTargetPath,"/");
        webScriptDirPath = StrHelper.replaceFirstLastChart(webScriptDirPath,"/");

        String mainScriptPath = "main.js";
        File projectFile = new File(uploadPath + File.separator +  "autoJsTools"  + File.separator + webScriptDirPath + File.separator + "project.json");
        if(projectFile.exists()){
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(projectFile), StandardCharsets.UTF_8));
            StringBuilder stringBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }
            reader.close();
            String fileContent = stringBuilder.toString();
            JSONObject projectJsonObj = JSONObject.parseObject(fileContent);
            if(StringUtils.isNotBlank(projectJsonObj.getString("main"))){
                mainScriptPath = projectJsonObj.getString("main");
            }
        }

        // 运行手机端临时目录的 项目
        String projectName = webScriptDirPath.substring(webScriptDirPath.lastIndexOf("/"),webScriptDirPath.length());
        // 项目文件路径
        String scriptFilePath = "/sdcard/" + tempPhoneTargetPath + projectName + "/" + mainScriptPath;
        // 项目路径
        String scriptDirPath =  "/sdcard/" + tempPhoneTargetPath + projectName;

        // 运行项目
        String finalMainScriptPath = mainScriptPath;
        Runnable runnable = ()->{
            try {
                String remoteScript = "";
                remoteScript += preScript;
                remoteScript += "if(files.exists(\""+scriptFilePath+"\")){\n" +
                        "engines.execScriptFile(\""+scriptFilePath+"\",{path:[\""+scriptDirPath+"\"]});\n" +
                        "} else {\n" +
                            "toastLog(\"项目运行文件"+ finalMainScriptPath +"不存在,请先初始化项目(或者检查project.json的main配置)\");\n" +
                        "}";
                // 执行远程脚本  运行项目
                execRemoteScript(deviceUUID,remoteScript,false,"","");
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
        // 开启了同步
        if(isSyncProject){
            syncWebProjectToPhone(deviceUUID,serverUrl,webScriptDirPath,tempPhoneTargetPath,runnable);
        } else {
            runnable.run();
        }
    }



    /**
     * 执行停止项目脚本
     * @param deviceUUID
     */
    public static void execStopProject(String deviceUUID) throws Exception{
        String remoteScript =  "let notCloseSourceArr = ['/data/user/0/com.zjh336.cn.tools/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools/files/project/main.js','/data/user/0/com.zjh336.cn.tools8822/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools8822/files/project/main.js','main.js']\n" +
                "const all = engines.all()\n" +
                "all.forEach(item => {\n" +
                    "if (notCloseSourceArr.indexOf(String(item.source))===-1) {\n" +
                        "item.forceStop()\n" +
                     "}\n" +
                "});";
        // 远程执行脚本 直接运行 不开启独立引擎
        execRemoteScript(deviceUUID,remoteScript,false,"","");
    }

    /**
     * 远程执行脚本
     * @param deviceUUID 设备uuid
     * @param remoteScript 远程脚本内容
     * @param openIndependentEngine 是否开启独立引擎执行
     * @return
     * @throws UnsupportedEncodingException
     */
    public static void execRemoteScript(String deviceUUID,String remoteScript,Boolean openIndependentEngine,String scriptDirPath,String scriptFilePath) throws Exception {
        // 转换后代码
        String afterRemoteScript = remoteScript;
        // 开启则进行 独立引擎处理
        if(openIndependentEngine){
            scriptDirPath = StringUtils.isBlank(scriptDirPath) ?  "/sdcard/appSync/tempRemoteScript/" : scriptDirPath;
            scriptFilePath = StringUtils.isBlank(scriptFilePath) ?  "/sdcard/appSync/tempRemoteScript/remoteScript.js" : scriptFilePath;
            // 独立引擎代码 包裹
            afterRemoteScript =   generateIndependentEngineScript(scriptDirPath,scriptFilePath,remoteScript);
        }
        // 编码原始脚本内容
        String encodedScriptContent = StrHelper.encode(afterRemoteScript);
        // 拼接远程执行方法 消息体参数
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("functionName", "remoteExecScript"); // 方法名
        jsonObject.put("functionParam", new String[]{encodedScriptContent}); // 方法参数
        String messageStr = jsonObject.toString();

        // 编码远程执行方法脚本内容
        String encodedMessageStr = StrHelper.encode(messageStr);
        String message = Base64.getEncoder().encodeToString(encodedMessageStr.getBytes("UTF-8"));

        // 创建websocket消息对象
        AjMessageDTO ajMessageDTO = new AjMessageDTO();
        ajMessageDTO.setAction("remoteHandler");
        ajMessageDTO.setDeviceUuid(deviceUUID);
        ajMessageDTO.setMessage(message);

        // 发送指令
        sendMessageToClient(ajMessageDTO);
    }


    /**
     * 生成独立引擎脚本内容
     * @param scriptDirPath 脚本文件父级路径
     * @param scriptFilePath 脚本文件路径
     * @param scriptContent 脚本内容
     * @return
     */
    private static String generateIndependentEngineScript(String scriptDirPath,String scriptFilePath,String scriptContent) throws Exception {
        String encodedScript = StrHelper.encode(scriptContent);
        String syncScript = Base64.getEncoder().encodeToString(encodedScript.getBytes("UTF-8"));

        // 独立引擎脚本
        String remoteScript = "let remoteScriptPath = '"+scriptFilePath+"'; \n" +
                "files.createWithDirs(remoteScriptPath);\n" +
                "files.write(remoteScriptPath, decodeURIComponent($base64.decode('"+syncScript+"')));\n" +
                "engines.execScriptFile(remoteScriptPath,{path:[\""+scriptDirPath+"\"]});\n";
        return remoteScript;
    }


    /**
     * 获取 实时日志 脚本原始内容 并替换参数
     * @param paramJson
     * @return
     * @throws Exception
     */
    private static String getStartOnlineLogScriptContent(String paramJson) throws Exception {
        String sourceJsonStr = "";
        String syncFilePath = "http://localhost:" + port + "/module/index/constant/startOnlineLogByServer.js?t="+(new Date().getTime());
        URL url = new URL(syncFilePath);
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
            content.append(line).append("\n");
        }
        reader.close();
        sourceJsonStr = content.toString();
        sourceJsonStr = sourceJsonStr.replace("${paramsJson}", paramJson);
        return sourceJsonStr;
    }



    /**
     * 获取同步文件脚本原始内容 并替换参数
     * @param paramJson
     * @return
     * @throws Exception
     */
    private static String getSyncFileScriptContent(String paramJson) throws Exception {
        String sourceJsonStr = "";
        String syncFilePath = "http://localhost:" + port + "/module/index/constant/syncFileScriptByServer.js?t="+(new Date().getTime());
        URL url = new URL(syncFilePath);
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
            content.append(line).append("\n");
        }
        reader.close();
        sourceJsonStr = content.toString();
        sourceJsonStr = sourceJsonStr.replace("${paramsJson}", paramJson);
        return sourceJsonStr;
    }



    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session, @PathParam("deviceUuid") String deviceUuid) throws IOException {
        // log.info("用户消息:" + deviceUuid + ",报文:" + message);
        receiveMessage(session, message);
    }

    /**
     * 发生错误时调用
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    @Autowired
    public void setApplicationContext(EmailConfig emailConfig) throws BeansException {
        AutoJsWsServerEndpoint.emailConfig = emailConfig;
    }



    public static synchronized AtomicInteger getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        AutoJsWsServerEndpoint.onlineCount.getAndIncrement();
    }

    public static synchronized void subOnlineCount() {
        AutoJsWsServerEndpoint.onlineCount.getAndDecrement();
    }
}
