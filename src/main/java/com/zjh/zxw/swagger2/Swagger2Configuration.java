package com.zjh.zxw.swagger2;

import com.github.xiaoymin.swaggerbootstrapui.configuration.SwaggerBootstrapUIConfiguration;
import com.github.xiaoymin.swaggerbootstrapui.filter.ProductionSecurityFilter;
import com.github.xiaoymin.swaggerbootstrapui.filter.SecurityBasicAuthFilter;
import io.swagger.models.MarkdownFiles;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Swagger2 启动类
 * 启动条件：
 * 1，配置文件中zxw.swagger.enabled=true
 * 2，配置文件中不存在：zxw.swagger.enabled 值
 *
 */
@Configuration
@ConditionalOnProperty(name = "zxw.swagger.enabled", havingValue = "true", matchIfMissing = true)
@EnableSwagger2
/*@EnableSwaggerBootstrapUI*/
@Import({BeanValidatorPluginsConfiguration.class, SwaggerBootstrapUIConfiguration.class, Swagger2Configuration.ZxwSecurityConfiguration.class})
public class Swagger2Configuration implements WebMvcConfigurer {
    /**
     * 这个地方要重新注入一下资源文件，不然不会注入资源的，也没有注入requestHandlerMappping,相当于xml配置的
     * <!--swagger资源配置-->
     * <mvc:resources location="classpath:/META-INF/resources/" mapping="swagger-ui.html"/>
     * <mvc:resources location="classpath:/META-INF/resources/webjars/" mapping="/webjars/**"/>
     * 不知道为什么，这也是spring boot的一个缺点（菜鸟觉得的）
     *
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");

    }

    @Slf4j
    public static class ZxwSecurityConfiguration {

        @Bean
        @ConditionalOnMissingBean
        @ConditionalOnProperty(name = "zxw.swagger.production", havingValue = "true")
        public ProductionSecurityFilter productionSecurityFilter(SwaggerProperties swaggerProperties) {
            return new ProductionSecurityFilter(swaggerProperties.getProduction());
        }

        @Bean
        @ConditionalOnMissingBean
        @ConditionalOnProperty(name = "zxw.swagger.basic.enable", havingValue = "true")
        public SecurityBasicAuthFilter securityBasicAuthFilter(SwaggerProperties swaggerProperties) {
            SwaggerProperties.Basic basic = swaggerProperties.getBasic();
            return new SecurityBasicAuthFilter(basic.getEnable(), basic.getUsername(), basic.getPassword());
        }

        @Bean(initMethod = "init")
        @ConditionalOnMissingBean
        @ConditionalOnProperty(name = "zxw.swagger.markdown.enable", havingValue = "true")
        public MarkdownFiles markdownFiles(SwaggerProperties swaggerProperties) {
            return new MarkdownFiles(swaggerProperties.getMarkdown().getBasePath());
        }

    }

}
