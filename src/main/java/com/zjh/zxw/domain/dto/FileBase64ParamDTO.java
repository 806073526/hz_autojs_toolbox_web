package com.zjh.zxw.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author kj
 * @date 2023/03/10 11:56
 */
@Data
@NoArgsConstructor
@Accessors(chain = true)
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@ApiModel(value = "FileBase64ParamDTO", description = "base64文件字符串传参对象")
public class FileBase64ParamDTO {

    @ApiModelProperty(value = "base64文件字符串")
    private String base64Str;

    @ApiModelProperty(value = "文件名称")
    private String fileName;

    @ApiModelProperty(value = "文件后缀 .xls .xlsx等 文件夹就没值")
    private String fileSuffix;

    @ApiModelProperty(value = "是否是目录")
    private Boolean isCatalogue;

    @ApiModelProperty(value = "有值代表为文件夹,下面是文件")
    private List<FileBase64ParamDTO> children;


}
