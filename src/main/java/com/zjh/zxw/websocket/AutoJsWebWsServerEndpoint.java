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
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.domain.dto.EmailConfig;
import com.zjh.zxw.dozer.DozerUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.InetAddress;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@ServerEndpoint(value = "/autoJsWebWs/{deviceUuid}", configurator = WebSocketConfigurator.class)
@Slf4j
@EnableAutoConfiguration
@Component
public class AutoJsWebWsServerEndpoint {
    /**
     * 当前在线连接数
     */
    private static AtomicInteger onlineCount = new AtomicInteger(0);

    private static ConcurrentHashMap<String, AutoJsWebSession> sessionMap = new ConcurrentHashMap<String, AutoJsWebSession>();

    private static ConcurrentHashMap<String, Object> curConnectMap = new ConcurrentHashMap<String, Object>();


    private static EmailConfig emailConfig;

    // web消息map
    // key deviceUUID_serviceKey   value:具体值
    private static ConcurrentHashMap<String, String> webMessageMap = new ConcurrentHashMap<String,String>();

    private static DozerUtils dozerUtils;


    /**
     * 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private AutoJsWebSession autoJsSession;

    // 清除业务key的值
    public static void clearServiceKey(String appMsgServiceKey){
        webMessageMap.remove(appMsgServiceKey);
    }

    // 查询业务key的值
    public static String queryServiceKey(String appMsgServiceKey){
        return webMessageMap.get(appMsgServiceKey);
    }

    public static String getOtherPropertyJson(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return "";
        }
        AutoJsWebSession session = sessionMap.get(deviceUUID);
        return session.getOtherPropertyJson();
    }

    public static boolean isNeedPassword(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return false;
        }
        AutoJsWebSession session = sessionMap.get(deviceUUID);
        return StringUtils.isNotBlank(session.getPassword());
    }


    public static boolean validPassword(String deviceUUID,String password){
        if(!sessionMap.containsKey(deviceUUID)){
           return false;
        }
        AutoJsWebSession session = sessionMap.get(deviceUUID);
        return StrHelper.getObjectValue(session.getPassword()).equals(password);
    }

    public static AutoJsWebSession getDeviceByAdmin(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return null;
        }
        AutoJsWebSession session = sessionMap.get(deviceUUID);
        // 获取复制参数
        AutoJsWebSession copySession = dozerUtils.map(session,AutoJsWebSession.class);
        copySession.setSession(null);
        return copySession;
    }

    /**
     * 获取在线设备
     *
     * @return
     */
    public static List<AutoJsWebSession> getOnlineDevice() {
        List<AutoJsWebSession> autoJsSessionList = sessionMap.entrySet().stream().map(Map.Entry::getValue).collect(Collectors.toList());
        List<AutoJsWebSession> otherList = new ArrayList<AutoJsWebSession>();

        List<String> needRemoveList = new ArrayList<String>();
        if (CollectionUtils.isNotEmpty(autoJsSessionList)) {
            for (AutoJsWebSession autoJsSession : autoJsSessionList) {

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
                AutoJsWebSession obj = AutoJsWebSession.builder()
                        .deviceUuid(autoJsSession.getDeviceUuid())
                        .selectAppDeviceUuid(autoJsSession.getSelectAppDeviceUuid())
                        .connectTime(autoJsSession.getConnectTime())
                        .otherPropertyJson(autoJsSession.getOtherPropertyJson())
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
     * 获取已连接指定app的在线web设备  如果设备uuid为空 则发送所有设备
     * @param appDeviceUuid
     * @return
     */
    public static List<AutoJsWebSession> getOnlineDeviceBySelectAppDevice(String appDeviceUuid){
        List<AutoJsWebSession> onlineDevices = getOnlineDevice();
        if(StringUtils.isBlank(appDeviceUuid)){
            return onlineDevices;
        }
        // 过滤数据  仅显示选中设备的
        onlineDevices = Optional.ofNullable(onlineDevices).orElse(new ArrayList<>()).stream().filter(autoJsWebSession -> StrHelper.getObjectValue(appDeviceUuid).equals(StrHelper.getObjectValue(autoJsWebSession.getSelectAppDeviceUuid()))).collect(Collectors.toList());
        return onlineDevices;
    }

    /**
     * 发送消息到客户端
     */
    public static void sendMessageToClient(AjMessageDTO messageDTO) throws IOException {
        messageDTO.setMessageDateTime(LocalDateTime.now());
        String deviceUUID = messageDTO.getDeviceUuid();
        AutoJsWebSession curAutoJsWebSession = sessionMap.get(deviceUUID);
        if (Objects.nonNull(curAutoJsWebSession)) {
            curAutoJsWebSession.sendText(JSONUtil.toJsonStr(messageDTO));
        }
    }

    public static void sendMessageToMultipleClient(AjMessageDTO messageDTO) throws IOException {
        messageDTO.setMessageDateTime(LocalDateTime.now());
        String deviceUUID = messageDTO.getDeviceUuid();

        List<String> deviceUUIDList = new ArrayList<String>(StrHelper.str2ArrayListBySplit(deviceUUID,","));
        for (String deviceUUIDSingle : deviceUUIDList) {
            AutoJsWebSession curAutoJsWebSession = sessionMap.get(deviceUUIDSingle);
            if (Objects.nonNull(curAutoJsWebSession)) {
                curAutoJsWebSession.sendText(JSONUtil.toJsonStr(messageDTO));
            }
        }
    }


    /**
     * 群发指令到web页面
     * @param selectAppDeviceUuid 选中app的deviceUUID  不为空 则发送选中了这个APP设备的在线web端  为空 则发送全部在线web端
     * @param selectWebDeviceUuid 选中web的deviceUUID  不为空 则发送指定的的web端  为空 发送全部web端
     * @param messageDTO
     * @throws IOException
     */
    public static void sendMessageToClientSelectAppDevice(String selectAppDeviceUuid,String selectWebDeviceUuid,AjMessageDTO messageDTO) throws IOException {
        List<AutoJsWebSession> autoJsWebSessions = getOnlineDeviceBySelectAppDevice(selectAppDeviceUuid);
        if(CollectionUtils.isEmpty(autoJsWebSessions)){
            return;
        }
        messageDTO.setMessageDateTime(LocalDateTime.now());
        // 获取符合条件的 web端 设备uuid列表
        List<String> deviceUUIDList = autoJsWebSessions.stream().map(AutoJsWebSession::getDeviceUuid).collect(Collectors.toList());
        if(StringUtils.isNotBlank(selectWebDeviceUuid)){
            deviceUUIDList = deviceUUIDList.stream().filter(s -> StrHelper.getObjectValue(selectWebDeviceUuid).equals(s)).collect(Collectors.toList());
        }
        if(CollectionUtils.isEmpty(deviceUUIDList)){
            return;
        }
        for (String deviceUUIDSingle : deviceUUIDList) {
            AutoJsWebSession curAutoJsWebSession = sessionMap.get(deviceUUIDSingle);
            if (Objects.nonNull(curAutoJsWebSession)) {
                curAutoJsWebSession.sendText(JSONUtil.toJsonStr(messageDTO));
            }
        }
    }



    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("deviceUuid") String deviceUuid, @PathParam("deviceWidth") String deviceWidth, @PathParam("deviceHeight") String deviceHeight) throws IOException {
        AutoJsWebSession autoJsSession = AutoJsWebSession.builder().lastHeartTime(LocalDateTime.now()).deviceUuid(deviceUuid).session(session).build();
        autoJsSession.setConnectTime(LocalDateTime.now());

        Map<String, Object> userProperties = session.getUserProperties();
        String IP = (String) userProperties.get("IP");
        sessionMap.put(deviceUuid, autoJsSession);
        this.autoJsSession = autoJsSession;
        // 未包含的设备id
        if(!curConnectMap.containsKey(deviceUuid)){
            // 记录
            curConnectMap.put(deviceUuid,LocalDateTime.now());
        }
        autoJsSession.sendText("连接成功！" + deviceUuid);
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("deviceUuid") String deviceUuid) {
        sessionMap.remove(deviceUuid);
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
            // 同步选中app设备
            if("syncSelectAppDeviceUuid".equals(action)){
                if(StringUtils.isNotBlank(messageStr)){
                    this.autoJsSession.setSelectAppDeviceUuid(messageStr);
                    // 设置到本地缓存
                    sessionMap.put(this.autoJsSession.getDeviceUuid(), this.autoJsSession);
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
                    webMessageMap.put(deviceUUID+"_"+serviceKey,serviceValue);
                }
            }
        }
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
        AutoJsWebWsServerEndpoint.emailConfig = emailConfig;
    }



    public static synchronized AtomicInteger getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        AutoJsWebWsServerEndpoint.onlineCount.getAndIncrement();
    }

    public static synchronized void subOnlineCount() {
        AutoJsWebWsServerEndpoint.onlineCount.getAndDecrement();
    }
}
