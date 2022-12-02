package com.zjh.zxw.domain.dto;

import io.swagger.annotations.ApiModel;
import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Builder
@ApiModel(value = "EmailConfig", description = "EmailConfig")
@Component
public class EmailConfig implements Serializable {

    @Value("${com.zjh.receiveEmail}")
    private String receiveEmail;

    @Value("${com.zjh.receiveSpaceMinute}")
    private Integer receiveSpaceMinute;
}
