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
@ApiModel(value = "SyncFileParamDTO", description = "同步文件处理参数")
public class SyncFileParamDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     */
    @ApiModelProperty(value = "相对路径列表")
    private List<String> relativeFilePathList;

    @ApiModelProperty(value = "忽略文件路径")
    private List<String> ignorePathList;

    @ApiModelProperty(value = "是否仅查询目录")
    private Boolean onlyQueryFolder;
}
