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
 * 打包项目DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Builder
@ApiModel(value = "PackageProjectDTO", description = "打包项目DTO")
public class PackageProjectDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * web端项目根路径
     */
    @ApiModelProperty(value = "web端项目根路径")
    private String webProjectRootPath;

    /**
     * web端项目名称
     */
    @ApiModelProperty(value = "web端项目名称")
    private String webProjectName;

    /**
     * 项目配置-应用名称
     */
    @ApiModelProperty(value = "项目配置-应用名称")
    private String appName;

    /**
     * 项目配置-应用包名
     */
    @ApiModelProperty(value = "项目配置-应用包名")
    private String packageName;

    /**
     * 项目配置-版本名称
     */
    @ApiModelProperty(value = "项目配置-版本名称")
    private String versionName;

    /**
     * 项目配置-版本号
     */
    @ApiModelProperty(value = "项目配置-版本号")
    private String versionCode;

    /**
     * 项目配置-应用图标路径
     */
    @ApiModelProperty(value = "项目配置-应用图标路径")
    private String appIcon;

    /**
     * 项目配置-开启nodejs支持
     */
    @ApiModelProperty(value = "项目配置-开启nodejs支持")
    private Boolean openNodeJs;

    /**
     * 项目配置-开启图色模块支持
     */
    @ApiModelProperty(value = "项目配置-开启图色模块支持")
    private Boolean openImageModule;

    /**
     * 项目配置-开机自启动
     */
    @ApiModelProperty(value = "项目配置-开机自启动")
    private Boolean autoOpen;

    /**
     * 项目配置-插件列表多个使用,分隔
     */
    @ApiModelProperty(value = "项目配置-插件列表多个使用,分隔")
    private String plugins;

    /**
     * 项目配置-CPU架构多个使用,分隔
     */
    @ApiModelProperty(value = "项目配置-CPU架构多个使用,分隔")
    private String abis;

    /**
     * 项目配置-隐藏日志
     */
    @ApiModelProperty(value = "项目配置-隐藏日志")
    private Boolean hideLogs;

    /**
     * 项目配置-启动界面文本
     */
    @ApiModelProperty(value = "项目配置-启动界面文本")
    private String splashText;

    /**
     * 项目配置-启动界面图标路径
     */
    @ApiModelProperty(value = "项目配置-启动界面图标路径")
    private String splashIcon;

    /**
     * 项目配置-自定义签名别名
     */
    @ApiModelProperty(value = "项目配置-自定义签名别名")
    private String customSignAlias;

    /**
     * 开启混淆
     */
    @ApiModelProperty(value = "开启混淆")
    private Boolean openObfuscator;

    /**
     * 混淆排除路径
     */
    @ApiModelProperty(value = "混淆排除路径")
    private String obfuscatorIncludePaths;
}
