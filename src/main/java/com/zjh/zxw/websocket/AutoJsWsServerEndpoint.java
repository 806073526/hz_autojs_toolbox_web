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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@ServerEndpoint("/autoJsWs/{deviceUuid}/{deviceHeight}/{deviceWidth}")
@Slf4j
@EnableAutoConfiguration
@Component
public class AutoJsWsServerEndpoint {
    /**
     * 当前在线连接数
     */
    private static AtomicInteger onlineCount = new AtomicInteger(0);

    private static RedisTemplate<String, Object> redisTemplate;

    private static ConcurrentHashMap<String, AutoJsSession> sessionMap = new ConcurrentHashMap<String, AutoJsSession>();

    private static String SESSION_CODE = "autoJsSession";

    private static EmailConfig emailConfig;

    /**
     * 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private AutoJsSession autoJsSession;

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
        if (CollectionUtils.isNotEmpty(autoJsSessionList)) {
            for (AutoJsSession autoJsSession : autoJsSessionList) {
                AutoJsSession obj = AutoJsSession.builder()
                        .deviceUuid(autoJsSession.getDeviceUuid())
                        .connectTime(autoJsSession.getConnectTime())
                        .screenHeight(autoJsSession.getScreenHeight())
                        .screenWidth(autoJsSession.getScreenWidth())
                        .otherPropertyJson(autoJsSession.getOtherPropertyJson())
                        .lastHeartTime(autoJsSession.getLastHeartTime()).build();
                otherList.add(obj);
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
        sessionMap.put(deviceUuid, autoJsSession);
        this.autoJsSession = autoJsSession;
        redisTemplate.opsForHash().put(SESSION_CODE, deviceUuid, JSONUtil.toJsonStr(autoJsSession));

        String key = "already_connect_"+deviceUuid;
        String value = StrHelper.getObjectValue(redisTemplate.opsForValue().get(key));
        if(StringUtils.isBlank(value) && Objects.nonNull(emailConfig) && StringUtils.isNotBlank(emailConfig.getReceiveEmail())){
            // 间隔分钟
            redisTemplate.opsForValue().set(key, deviceUuid, NumberHelper.getOrDef(emailConfig.getReceiveSpaceMinute(),0) * 60, TimeUnit.SECONDS);
            EmailSender.sendAutoJsEmail(emailConfig.getReceiveEmail(),"《华仔AutoJs工具箱》"+deviceUuid+"已连接","设备uuid："+deviceUuid+"\r\n设备宽度："+deviceWidth+"\r\n设备高度:"+deviceHeight+"\r\n连接时间："+ DateUtils.format(LocalDateTime.now(),DateUtils.DEFAULT_DATE_TIME_FORMAT));
        }
        autoJsSession.sendText("连接成功！" + deviceUuid);
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("deviceUuid") String deviceUuid) {
        // redisTemplate.opsForHash().delete(SESSION_CODE, deviceUuid);
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
            // 设置redis缓存
            redisTemplate.opsForHash().put(SESSION_CODE, deviceUUID, JSONUtil.toJsonStr(autoJsSession));
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
        log.info("用户消息:" + deviceUuid + ",报文:" + message);
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
    public void setApplicationContext(RedisTemplate<String, Object> redisTemplateParam) throws BeansException {
        AutoJsWsServerEndpoint.redisTemplate = redisTemplateParam;
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
