package com.zjh.zxw;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class CorsConfig extends WebMvcConfigurationSupport {


    @Value("${com.zjh.allowCorsOrigins:''}")
    private String allowCorsOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if(StringUtils.isNotBlank(allowCorsOrigins)){
            //设置允许跨域的路径
            registry.addMapping("*")
                    //设置允许跨域请求的域名
                    .allowedOrigins(allowCorsOrigins)
                    //这里：是否允许证书 不再默认开启
                    .allowCredentials(true)
                    //设置允许的方法
                    .allowedMethods("*")
                    //跨域允许时间
                    .maxAge(3600);
        }
    }
}