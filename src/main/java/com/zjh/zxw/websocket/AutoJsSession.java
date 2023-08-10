package com.zjh.zxw.websocket;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiParam;
import lombok.*;
import lombok.experimental.Accessors;

import javax.websocket.Session;
import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Builder
@ApiModel(value = "AutoJsSession", description = "autoJs会话对象")
public class AutoJsSession implements Serializable {

    /**
     * session内容
     */
    @ApiModelProperty(value = "session内容")
    private Session session;

    /**
     * 设备唯一号
     */
    @ApiModelProperty(value = "设备唯一号")
    private String deviceUuid;


    @ApiModelProperty(value = "设备高度")
    private String screenHeight;

    @ApiModelProperty(value = "设备宽度")
    private String screenWidth;

    @ApiModelProperty(value = "访问密码")
    private String password;

    @ApiModelProperty(value = "其他属性json")
    private String otherPropertyJson;
    /**
     * 建立连接时间
     */
    @ApiModelProperty(value = "建立连接时间")
    @JsonFormat(shape =JsonFormat.Shape.STRING,pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime connectTime;


    /**
     * 最后一次心跳时间
     */
    @ApiModelProperty(value = "最后一次心跳时间")
    @JsonFormat(shape =JsonFormat.Shape.STRING,pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastHeartTime;


    @ApiModelProperty(value = "别名")
    private String aliasName;

    /**
     * 发送消息
     * @param message
     * @throws IOException
     */
    public void sendText(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }
}
