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
@ApiModel(value = "SyncFileInterfaceDTO", description = "同步文件接口调用参数")
public class SyncFileInterfaceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "服务端地址")
    private String serverUrl;

    @ApiModelProperty(value = "需要同步的web目录数组 (主要用于文件夹同步) 例如  [\"fb375905dd112762/system\"] 设备uuid拼接web指定目录  请注意前后不能带斜杠")
    private List<String> webPathArr;

    @ApiModelProperty(value = "手机端同步路径 例如 appSync/test  表示同步到sdcard/appSync/test目录  请注意前后不能带斜杠")
    private String phoneTargetPath;

    @ApiModelProperty(value = "额外的下载路径 (主要用于文件同步)")
    private List<String> downloadFileUrlArr;

    @ApiModelProperty(value = "额外的手机端本地路径")
    private List<String> localFileUrlArr;

    @ApiModelProperty(value = "显示进度")
    private Boolean showProcess;

    @ApiModelProperty(value = "完成后的日志输出")
    private String completeMsg;

}
