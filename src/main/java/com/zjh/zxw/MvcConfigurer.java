/**
 * <p>项目名称：zxw-admin
 * <p>Package名称：com.zjh.zxw.manager
 * 文件名称：MvcConfigurer.java
 * 版本：1.00
 * 创建日期：2020年1月20日
 */
package com.zjh.zxw;

import com.zjh.zxw.common.util.spring.UploadPathHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.io.File;
import java.nio.charset.Charset;
import java.util.List;

/**
 * <p>类说明：MVC配置类
 *
 * @version 1.00
 * @author：zhengjianhua
 */
@Configuration
public class MvcConfigurer extends WebMvcConfigurationSupport {

    /**
     * 上传路径 比如J:\\zxwUpload\\
     */
    @Value("${com.zjh.uploadPath}")
    private String uploadPath;

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

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        uploadPath = UploadPathHelper.getUploadPath(uploadPath);
        //静态资源访问路径配置
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
        //本地资源访问路径配置
        registry.addResourceHandler("/uploadPath/**").addResourceLocations("file:" + uploadPath);
        registry.addResourceHandler("/statics/**").addResourceLocations("classpath:/statics/");
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

    /**
     * 编码设置
     * (non-Javadoc)
     *
     * @see WebMvcConfigurationSupport#extendMessageConverters(List)
     */
    @Override
    protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.forEach(converter -> {
            if (converter instanceof StringHttpMessageConverter) {
                ((StringHttpMessageConverter) converter).setDefaultCharset(Charset.forName("UTF-8"));
            }
        });
    }


    @Override
    protected void addViewControllers(ViewControllerRegistry registry) {
        // 默认跳转index页面
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }

}
