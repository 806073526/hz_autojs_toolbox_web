package com.zjh.zxw.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 实体类
 * autoJs注册码表
 * </p>
 *
 * @author zhengjianhua
 * @since 2022-07-16
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Builder
@ApiModel(value = "AjMessageDTO", description = "autoJs消息对象")
public class AjMessageDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 设备唯一id
     */
    @ApiModelProperty(value = "设备唯一id")
    private String deviceUuid;

    /**
     * 消息指令
     */
    @ApiModelProperty(value = "消息指令")
    private String action;

    /**
     * 消息内容
     */
    @ApiModelProperty(value = "消息内容")
    private String message;

    /**
     * 消息时间
     */
    @ApiModelProperty(value = "消息时间")
    @JsonFormat(shape =JsonFormat.Shape.STRING,pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime messageDateTime;

}
