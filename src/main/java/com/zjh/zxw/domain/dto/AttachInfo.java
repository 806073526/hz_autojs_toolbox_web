package com.zjh.zxw.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Builder
@ApiModel(value = "AttachInfo", description = "附件对象")
public class AttachInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "文件id")
    private String fileId;

    @ApiModelProperty(value = "文件名")
    private String fileName; // 文件名

    @ApiModelProperty(value = "是否是一个目录")
    private Boolean isDirectory;

    @ApiModelProperty(value = "文件长度")
    private Long fileSize;

    @ApiModelProperty(value = "文件路径")
    private String pathName; // 文件路径

    @ApiModelProperty(value = "父级文件路径")
    private String parentPathName;

    @ApiModelProperty(value = "文件绝对路径")
    private String absolutePathName;

    @ApiModelProperty(value = "文件类型")
    private String fileType; // 文件类型  doc, xls,apk,wgt等

    @ApiModelProperty(value = "最后修改日期")
    @JsonFormat(shape =JsonFormat.Shape.STRING,pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdateTime;
}
