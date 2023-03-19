package com.zjh.zxw.websocket;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.CollectionUtils;
import com.zjh.zxw.common.util.DateUtils;
import com.zjh.zxw.common.util.NumberHelper;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.email.EmailSender;
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.domain.dto.EmailConfig;
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
        return StrHelper.getObjectValue(session.getPassword()).equals(password);
    }

    public static AutoJsSession getDeviceByAdmin(String deviceUUID){
        if(!sessionMap.containsKey(deviceUUID)){
            return null;
        }
        AutoJsSession session = sessionMap.get(deviceUUID);
        session.setSession(null);
        return session;
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
                AutoJsSession obj = AutoJsSession.builder()
                        .deviceUuid(autoJsSession.getDeviceUuid())
                        .connectTime(autoJsSession.getConnectTime())
                        .screenHeight(autoJsSession.getScreenHeight())
                        .screenWidth(autoJsSession.getScreenWidth())
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
            // 推送上线消息
            EmailSender.sendAutoJsEmail(emailConfig.getReceiveEmail(),"《华仔AutoJs工具箱》"+deviceUuid+"已连接","设备uuid："+deviceUuid+"<br>设备宽度："+deviceWidth+"<br>设备高度："+deviceHeight+"<br>连接时间："+ DateUtils.format(LocalDateTime.now(),DateUtils.DEFAULT_DATE_TIME_FORMAT)+"<br>服务端IP："+ InetAddress.getLocalHost().getHostAddress() +"<br>客户端IP："+IP);
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
                    this.autoJsSession.setOtherPropertyJson(new String(Base64.getDecoder().decode(otherPropertyJson.getBytes())));
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
