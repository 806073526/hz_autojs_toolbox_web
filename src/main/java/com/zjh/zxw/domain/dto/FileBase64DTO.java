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
@ApiModel(value = "FileBase64DTO", description = "base64文件字符串传参对象")
public class FileBase64DTO {

    @ApiModelProperty(value = "导出数据")
    private List<FileBase64ParamDTO> data;

    @ApiModelProperty(value = "压缩包名称")
    private String zipName;

}
