package com.zjh.zxw.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

/**
 * <p>
 * 实体类
 * 批量文件处理参数
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
@ApiModel(value = "CommonExecScriptInterfaceDTO", description = "通用执行脚本接口调用参数")
public class CommonExecScriptInterfaceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "自身脚本名称 可选参数 设置后独立引擎脚本执行完成后自行销毁")
    private String selfScriptName;

    @ApiModelProperty(value = "同步文件UUID 可选参数 用于记录同步状态 完成后执行其他逻辑")
    private String syncFileUUID;

    @ApiModelProperty(value = "服务端地址 必选参数")
    private String serverUrl;

    @ApiModelProperty(value = "脚本内容")
    private String scriptContent;

    @ApiModelProperty(value = "是否开启独立引擎执行")
    private Boolean openIndependentEngine;

    @ApiModelProperty(value = "是否手动调用completeFun方法进行完成操作")
    private Boolean manualComplete;

}
