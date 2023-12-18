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
@ApiModel(value = "CopyFileInterfaceDTO", description = "手机端复制文件接口调用参数")
public class CopyFileInterfaceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "自身脚本名称 可选参数 设置后独立引擎脚本执行完成后自行销毁")
    private String selfScriptName;

    @ApiModelProperty(value = "同步文件UUID 可选参数 用于记录同步状态 完成后执行其他逻辑")
    private String syncFileUUID;

    @ApiModelProperty(value = "服务端地址 必选参数")
    private String serverUrl;

    @ApiModelProperty(value = "需要复制的文件路径")
    private List<String> sourcePathArr;

    @ApiModelProperty(value = "复制的目标路径 ")
    private String targetPath;

    @ApiModelProperty(value = "显示进度")
    private Boolean showProcess;

}
