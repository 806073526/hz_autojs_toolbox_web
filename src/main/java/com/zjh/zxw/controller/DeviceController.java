package com.zjh.zxw.controller;

import com.sun.org.apache.xpath.internal.operations.Bool;
import com.zjh.zxw.base.BaseController;
import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.exception.BusinessException;
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

    /**
     * 获取在线设备
     */
    @ApiOperation(value = "获取在线设备", notes = "获取在线设备")
    @PostMapping("/getOnlineDevice")
    public R<List<AutoJsSession>> getOnlineDevice() {
        try {
            List<AutoJsSession> autoJsSessionList = AutoJsWsServerEndpoint.getOnlineDevice();
            return success(autoJsSessionList);
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
    @ApiOperation(value = "管理员获取设备", notes = "管理员获取设备")
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
    }

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
