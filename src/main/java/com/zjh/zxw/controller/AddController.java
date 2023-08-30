package com.zjh.zxw.controller;

import com.zjh.zxw.base.R;
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.websocket.IPUtil;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;

import static com.zjh.commonUtils.executeBatScript;
import static com.zjh.zxw.SpringbootApplication.isWindowsSystem;
import static com.zjh.zxw.base.R.success;

@Slf4j
@Validated
@RestController
@RequestMapping("addController")
public class AddController {

    @ApiOperation(value = "控件节点信息记录到系统剪切板", notes = "控件节点信息记录到系统剪切板")
    @RequestMapping("/recordeControlInfo")
    public R<Boolean> nodeDivCommon(String message){
        System.out.println(message);
        try {
            String command = "echo "+message+" | clip";
            System.out.println(command);
            if(isWindowsSystem()){
                executeBatScript(command);
            }
            // Runtime.getRuntime().exec(command);//可以指定自己的路径
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return success();
    }
}
