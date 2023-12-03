package com.zjh.zxw.websocket;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import cn.hutool.socket.aio.IoAction;
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
import sun.applet.Main;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.*;
import java.net.InetAddress;
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

    // app消息map
    // key deviceUUID_serviceKey   value:具体值
    private static ConcurrentHashMap<String, String> appMessageMap = new ConcurrentHashMap<String,String>();

    private static DozerUtils dozerUtils;


    /**
     * 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private AutoJsSession autoJsSession;

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
    public void onOpen(Session session, @PathParam("deviceUuid") String deviceUuid, @PathParam("deviceWidth") String deviceWidth, @PathParam("deviceHeight") String deviceHeight) throws IOException {
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
                "engines.execScriptFile(\""+scriptFilePath+"\",{path:[\""+scriptDirPath+"\"]});\n" +
                "sleep(1000);\n" +
                "files.write(remoteScriptPath, \"\");";
        return remoteScript;
    }


    /**
     * 以独立引擎模式 执行 同步文件脚本
     * @return
     * @throws Exception
     */
    public static void execSyncFileScript(String deviceUUID,SyncFileInterfaceDTO syncFileInterfaceDTO) throws Exception {
        // 根据参数获取同步文件脚本
        String scriptContent =  getSyncFileScriptContent(JSONObject.toJSONString(syncFileInterfaceDTO));
        // 指定脚本文件路径  包装独立引擎
        execRemoteScript(deviceUUID,scriptContent,true,"/sdcard/appSync/tempRemoteScript/","/sdcard/appSync/tempRemoteScript/syncFileScript.js");
    }

    /**
     * 获取同步文件脚本原始内容 并替换参数
     * @param paramJson
     * @return
     * @throws Exception
     */
    private static String getSyncFileScriptContent(String paramJson) throws Exception {
        String sourceJsonStr = "";
        InputStream inputStream = Main.class.getResourceAsStream("/static/module/index/constant/syncFileScriptByServer.js");
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        StringBuilder jsonString = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonString.append(line).append("\n");
        }
        reader.close();
        String jsonStr = jsonString.toString();
        sourceJsonStr = jsonStr;
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
