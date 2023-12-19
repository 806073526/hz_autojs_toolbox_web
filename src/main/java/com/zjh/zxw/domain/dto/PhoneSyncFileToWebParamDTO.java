package com.zjh.zxw.domain.dto;

import io.swagger.annotations.Api;
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
@ApiModel(value = "PhoneSyncFileToWebParamDTO", description = "手机端同步文件到WEB的参数")
public class PhoneSyncFileToWebParamDTO implements Serializable {

    private static final long serialVersionUID = 1L;


    @ApiModelProperty(value = "文件名")
    private String fileName;

    @ApiModelProperty(value = "文件类型")
    private String fileType;

    @ApiModelProperty(value = "相对路径  deviceUuid+webSyncPath")
    private String relativePath;

    @ApiModelProperty(value = "文件字节数组")
    private byte[] fileBytes;

    @ApiModelProperty(value = "是否是目录")
    private Boolean isDir;

    @ApiModelProperty(value = "子文件夹")
    private List<PhoneSyncFileToWebParamDTO> children;

}
