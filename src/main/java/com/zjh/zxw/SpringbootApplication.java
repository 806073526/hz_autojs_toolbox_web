package com.zjh.zxw;

import com.zjh.zxw.common.util.spring.UploadPathHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.*;


/**
 * @SpringBootApplication其实就是以下三个注解的总和
 * @Configuration： 用于定义一个配置类
 * @EnableAutoConfiguration ：Spring Boot会自动根据你jar包的依赖来自动配置项目。
 * @ComponentScan： 告诉Spring 哪个packages 的用注解标识的类 会被spring自动扫描并且装入bean容器
 * @ServletComponentScan 开启过滤器扫描  过滤器注解配置方式需要开启该注解
 * @EnableTransactionManagement 开启注解事务管理，等同于xml配置方式的 <tx:annotation-driven />
 * @MapperScan 指定mapper的路径, 如果不设置, 需要每个mapper上面添加@mapper注解
 */
@SpringBootApplication(scanBasePackages = {"com.zjh.zxw.swagger2", "com.zjh.zxw.redis", "com.zjh.zxw", "com.zjh.zxw.websocket"})
@ServletComponentScan
@EnableTransactionManagement
@Slf4j
public class SpringbootApplication {

    private static String tempPath = isWindowsSystem() ? "C:"+File.separator+"temp" : File.separator + "temp";
    public static boolean isWindowsSystem(){
        String osName = System.getProperty("os.name");
        return osName.startsWith("Windows");
    }

    public static String executeBatScript(String batScript) {
        StringBuilder stringBuilder = new StringBuilder();
        FileWriter fw = null;
        String location = "";
        try {
            tempPath = UploadPathHelper.getUploadPath(tempPath);
            location = tempPath+ File.separator + (isWindowsSystem() ? "start.bat" : "start.sh");
            File fileStart = new File(location);
            if(!fileStart.exists()){
                fileStart.createNewFile();
            }
            //生成bat文件
            fw = new FileWriter(location);
            fw.write(batScript);
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        Process process;
        try {
            process = Runtime.getRuntime().exec(location);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "GBK"));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line).append(" ");
            }
            return stringBuilder.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringbootApplication.class, args);
        try {
            String command = "for /f \"tokens=16\" %%i in ('ipconfig ^|find /i \"ipv4\"') do (\n" +
                    "set myip=%%i\n" +
                    "goto out\n" +
                    ")\n" +
                    ":out\n" +
                    "cmd /c start http://%myip%:9998";
            if(isWindowsSystem()){
                executeBatScript(command);
            }
            // Runtime.getRuntime().exec(command);//可以指定自己的路径
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
