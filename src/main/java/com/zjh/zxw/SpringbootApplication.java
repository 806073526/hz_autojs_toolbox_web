package com.zjh.zxw;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;


/**
 * @SpringBootApplication其实就是以下三个注解的总和
 * @Configuration： 用于定义一个配置类
 * @EnableAutoConfiguration ：Spring Boot会自动根据你jar包的依赖来自动配置项目。
 * @ComponentScan： 告诉Spring 哪个packages 的用注解标识的类 会被spring自动扫描并且装入bean容器
 * @ServletComponentScan 开启过滤器扫描  过滤器注解配置方式需要开启该注解
 * @EnableTransactionManagement 开启注解事务管理，等同于xml配置方式的 <tx:annotation-driven />
 * @MapperScan 指定mapper的路径, 如果不设置, 需要每个mapper上面添加@mapper注解
 */
@SpringBootApplication(scanBasePackages = {"com.zjh.zxw.swagger2", "com.zjh.zxw.redis",  "com.zjh.zxw","com.zjh.zxw.websocket"})
@ServletComponentScan
@EnableTransactionManagement
@Slf4j
public class SpringbootApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootApplication.class, args);
    }

}
