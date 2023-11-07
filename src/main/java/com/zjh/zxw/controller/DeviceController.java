package com.zjh.zxw.controller;

import cn.hutool.core.util.RuntimeUtil;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.xpath.internal.operations.Bool;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.exception.BusinessException;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.service.AttachmentInfoService;
import com.zjh.zxw.websocket.AutoJsSession;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.zjh.zxw.base.R.SERVICE_ERROR;


/**
 * <p>
 * 前端控制器
 * 附件表
 * </p>
 *
 * @author zhengjianhua
 * @date 2021-06-05
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/device")
@Api(value = "DeviceController", tags = "设备控制")
public class DeviceController extends BaseController {

    @Value("${com.zjh.pageAccessPassword}")
    private String pageAccessPassword;

    @Value("${com.zjh.uploadPath}")
    private String uploadPath;


    @ApiOperation(value = "检查页面访问限制", notes = "检查页面访问限制")
    @GetMapping("/checkPageAccessLimit")
    public R<Boolean> checkPageAccessLimit(){
        return success(StringUtils.isNotBlank(pageAccessPassword));
    }


    @ApiOperation(value = "校验页面访问密码", notes = "校验页面访问密码")
    @GetMapping("/validatePageAccessPassword")
    public R<Boolean> validatePageAccessPassword(@RequestParam("inputVal") String inputVal){
        return success(StrHelper.getObjectValue(pageAccessPassword).equals(inputVal));
    }

    private List<AutoJsSession> getOnlineDeviceFun() throws IOException {
        List<AutoJsSession> autoJsSessionList = AutoJsWsServerEndpoint.getOnlineDevice();
        String filePath = UploadPathHelper.getUploadPath(uploadPath) +  "autoJsTools" + File.separator + "webCommonPath" + File.separator;
        File fileParent = new File(filePath);
        if(!fileParent.exists()){
            fileParent.mkdirs();
        }
        JSONObject jsonObject = new JSONObject();
        // 原始json
        String sourceJsonStr = "";
        filePath  += "deviceAliasName.json";
        File file = new File(filePath);
        if(file.exists()){
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8));
            StringBuilder jsonString = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonString.append(line);
            }
            reader.close();
            String jsonStr = jsonString.toString();
            sourceJsonStr = jsonStr;
            if(StringUtils.isNotBlank(jsonStr)){
                jsonObject = JSONObject.parseObject(jsonStr);
            }
        }
        for (AutoJsSession autoJsSession : autoJsSessionList) {
            String deviceUuid = autoJsSession.getDeviceUuid();
            String aliasName = jsonObject.containsKey(deviceUuid) ? jsonObject.getString(deviceUuid) :"";

            autoJsSession.setAliasName(aliasName);
            jsonObject.put(deviceUuid,aliasName);
        }

        String newJsonStr = jsonObject.toJSONString();
        if(!sourceJsonStr.equals(newJsonStr)){
            FileOutputStream fos = new FileOutputStream(filePath);
            OutputStreamWriter osw = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
            osw.write(newJsonStr);
            osw.close();
        }
        return autoJsSessionList;
    }

    /**
     * 检查exe配置文件
     */
    @ApiOperation(value = "检查exe配置文件", notes = "检查exe配置文件")
    @GetMapping("/checkExeOptions")
    public R<Boolean> checkExeOptions() {
        try {
            File file = new File("zxw-aj-tools.vmoptions");
            return success(file.exists());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("检查exe配置文件失败！请联系管理员");
        }
    }



    /**
     * 获取最新版本
     */
    @ApiOperation(value = "获取最新版本", notes = "获取最新版本")
    @GetMapping("/getNewVersion")
    public R<String> getNewVersion() {
        try {
            URL url = new URL("https://gitee.com/zjh336/zjh336_limit/raw/master/gjx/newVersion/newVersion.txt?t="+(new Date().getTime()));
            // 打开连接
            URLConnection connection = url.openConnection();
            // 设置连接超时时间（可选）
            connection.setConnectTimeout(5000);
            // 建立实际连接
            connection.connect();
            // 读取页面内容
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
            String line;
            StringBuilder content = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
            reader.close();
            return success(content.toString());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取最新版本失败！请联系管理员");
        }
    }


    /**
     * 获取公告信息
     */
    @ApiOperation(value = "获取公告信息", notes = "获取公告信息")
    @GetMapping("/getNoticeMessage")
    public R<String> getNoticeMessage() {
        try {
            URL url = new URL("https://gitee.com/zjh336/zjh336_limit/raw/master/gjx/newVersion/noticeMessage.txt?t="+(new Date().getTime()));
            // 打开连接
            URLConnection connection = url.openConnection();
            // 设置连接超时时间（可选）
            connection.setConnectTimeout(5000);
            // 建立实际连接
            connection.connect();
            // 读取页面内容
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
            String line;
            StringBuilder content = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
            reader.close();
            return success(content.toString());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取公告信息失败！请联系管理员");
        }
    }




    /**
     * 执行在线更新
     */
    @ApiOperation(value = "执行在线更新", notes = "执行在线更新")
    @GetMapping("/onlineUpdateVersion")
    public R<Boolean> onlineUpdateVersion() {
        try {
            String step1 = RuntimeUtil.execForStr("curl -o \"4、在线更新版本.bat\" \"https://gitee.com/zjh336/zjh336_limit/raw/master/gjx/newVersion/4%E3%80%81%E5%9C%A8%E7%BA%BF%E6%9B%B4%E6%96%B0%E7%89%88%E6%9C%AC.bat\"");
            System.out.println(step1);
            String step3 = RuntimeUtil.execForStr("4、在线更新版本.bat");
            System.out.println(step3);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("执行在线更新失败！请联系管理员");
        }
    }

    /**
     * 获取在线设备
     */
    @ApiOperation(value = "获取在线设备", notes = "获取在线设备")
    @PostMapping("/getOnlineDevice")
    public R<List<AutoJsSession>> getOnlineDevice() {
        try {
            return success(getOnlineDeviceFun());
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取在线设备失败！请联系管理员");
        }
    }

    /**
     * 管理员获取设备
     */
   /* @ApiOperation(value = "管理员获取设备", notes = "管理员获取设备")
    @PostMapping("/getDeviceByAdmin")
    public R<AutoJsSession> getDeviceByAdmin(@RequestParam("deviceUUID") String deviceUUID,@RequestParam("token") String token) {
        try {
            if(!"www.zjh336.cn".equals(token)){
                return null;
            }
            AutoJsSession autoJsSession = AutoJsWsServerEndpoint.getDeviceByAdmin(deviceUUID);
            return success(autoJsSession);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("管理员获取设备失败！请联系管理员");
        }
    }*/

    /**
     * 获取设备是否需要访问密码
     */
    @ApiOperation(value = "获取设备是否需要访问密码", notes = "获取设备是否需要访问密码")
    @GetMapping("/isNeedPassword")
    public R<Boolean> isNeedPassword(@RequestParam("deviceUUID") String deviceUUID) {
        try {
            return success(AutoJsWsServerEndpoint.isNeedPassword(deviceUUID));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取设备是否需要访问密码失败！请联系管理员");
        }
    }

    /**
     * 验证访问密码
     */
    @ApiOperation(value = "验证访问密码", notes = "验证访问密码")
    @GetMapping("/validPassword")
    public R<Boolean> validPassword(@RequestParam("deviceUUID") String deviceUUID,@RequestParam("password") String password) {
        try {
            return success(AutoJsWsServerEndpoint.validPassword(deviceUUID,password));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("验证访问密码失败！请联系管理员");
        }
    }

    /**
     * 获取其他属性
     */
    @ApiOperation(value = "获取其他属性", notes = "获取其他属性")
    @GetMapping("/getOtherPropertyJson")
    public R<String> getOtherPropertyJson(@RequestParam("deviceUUID") String deviceUUID) {
        try {
            return success(AutoJsWsServerEndpoint.getOtherPropertyJson(deviceUUID));
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("获取其他属性失败！请联系管理员");
        }
    }

    /**
     * 发送指令到客户端
     */
    @ApiOperation(value = "发送指令到客户端", notes = "发送指令到客户端")
    @PostMapping("/sendMessageToClient")
    public R<Boolean> sendMessageToClient(@RequestBody AjMessageDTO messageDTO) {
        try {
            AutoJsWsServerEndpoint.sendMessageToClient(messageDTO);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("发送指令失败！请联系管理员");
        }
    }

    /**
     * 发送指令到多个客户端
     */
    @ApiOperation(value = "发送指令到多个客户端", notes = "发送指令到多个客户端")
    @PostMapping("/sendMessageToMultipleClient")
    public R<Boolean> sendMessageToMultipleClient(@RequestBody AjMessageDTO messageDTO) {
        try {
            AutoJsWsServerEndpoint.sendMessageToMultipleClient(messageDTO);
            return success(true);
        } catch (BusinessException e) {
            return fail(SERVICE_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return fail("发送指令失败！请联系管理员");
        }
    }



}
