package com.zjh.zxw;

import com.alibaba.fastjson.JSONArray;
import com.zjh.commonUtils;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import com.zjh.zxw.websocket.IPUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Timer;
import java.util.TimerTask;


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


    public static String port;

    public static int openBrowser = 1;

    @Value("${server.port:9998}")
    public void setPort(String portParam){
        port = portParam;
    }

    @Value("${openBrowser:1}")
    public void setOpenBrowser(int openBrowserParam){
        openBrowser = openBrowserParam;
    }

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
            String command = "cmd /c start http://"+ IPUtil.getRealIP() +":"+port;
            if(isWindowsSystem() && openBrowser==1){
                executeBatScript(command);
            }
            // Runtime.getRuntime().exec(command);//可以指定自己的路径


            Timer timer = new Timer();
            TimerTask task = new TimerTask() {
                @Override
                public void run() {
                    try {
                        String systemType = "windows";
                        if(!commonUtils.isWindowsSystem()){
                            systemType = commonUtils.isMacSystem() ? "mac" : "linux";
                        }
                        String curVersion = AutoJsWsServerEndpoint.getCurVersion();
                        String interfaceUrl = "http://tool.zjh336.cn/device/recordOnlineStatus?machineCode="+commonUtils.getMachineCode()+ "&systemType="+systemType + "&curVersion="+ StrHelper.encode(curVersion);
                        URL url = new URL(interfaceUrl);
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                        connection.setRequestMethod("GET");
                        // 设置连接超时时间（可选）
                        connection.setConnectTimeout(5000);
                        // 建立实际连接
                        connection.connect();

                        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                        String inputLine;
                        StringBuffer response = new StringBuffer();
                        while ((inputLine = in.readLine()) != null) {
                            response.append(inputLine);
                        }
                        in.close();
                    } catch (Exception e) {
                       // e.printStackTrace();
                    }
                }
            };
            timer.schedule(task, 0, 1000 * 60 * 5);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
