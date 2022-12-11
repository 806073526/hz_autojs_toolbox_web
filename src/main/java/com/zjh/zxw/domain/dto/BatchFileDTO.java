package com.zjh.zxw.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
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
@ApiModel(value = "BatchFileDTO", description = "批量文件处理参数")
public class BatchFileDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 源文件路径列表
     */
    @ApiModelProperty(value = "源文件路径列表")
    private List<String> sourcePathList;

    /**
     * 目标文件夹路径
     */
    @ApiModelProperty(value = "目标文件夹路径")
    private String targetFolderPath;
}
