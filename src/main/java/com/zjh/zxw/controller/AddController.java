package com.zjh.zxw.controller;

import com.zjh.zxw.base.R;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import com.zjh.zxw.domain.dto.AjMessageDTO;
import com.zjh.zxw.websocket.IPUtil;
import io.swagger.annotations.ApiOperation;
import javafx.scene.input.Clipboard;
import javafx.scene.input.ClipboardContent;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import javax.swing.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

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


    @ApiOperation(value = "复制文本到剪切板中", notes = "复制文本到剪切板中")
    @GetMapping("/copyTextToClipboard")
    public R<Boolean> copyTextToClipboard(@RequestParam("text") String text){
        CopyText(text);
        return success(true);
    }

    private static void CopyText(String text){
        String tempFileName = "copy_"+UUID.randomUUID().toString()+".txt";
        StringBuilder stringBuilder = new StringBuilder();
        FileWriter fw = null;
        String location = "";
        String tempPath = "C:"+File.separator+"temp";
        try {
            tempPath = UploadPathHelper.getUploadPath(tempPath);
            location = tempPath+ File.separator + tempFileName;
            File fileStart = new File(location);
            if(!fileStart.exists()){
                fileStart.createNewFile();
            }
            FileOutputStream fos = new FileOutputStream(location);
            OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
            osw.write(text);
            osw.close();

            String command = "clip < "+ tempPath + File.separator + tempFileName;
            if(isWindowsSystem()){
                String result = executeBatScript(command);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            File fileStart = new File( tempPath + File.separator + tempFileName);
            if(fileStart.exists()){
                fileStart.delete();
            }
        }
    }


    @ApiOperation(value = "从剪切板中读取文本", notes = "从剪切板中读取文本")
    @GetMapping("/readTextFromClipboard")
    public R<String> readTextFromClipboard(){
        generatePasteVbs();
        String content = "";
        if(isWindowsSystem()){
           content = directExecCommand("cscript //nologo c:/temp/paste.vbs");
        }
        content = content.replaceAll("\\\\r\\\\n","\r\n");
        return success(content);
    }

    /**
     * 直接执行命令
     * @param command
     * @return
     */
    public static String directExecCommand(String command) {
        StringBuilder stringBuilderSuccessMsg = new StringBuilder();
        StringBuilder stringBuilderErrorMsg = new StringBuilder();
        FileWriter fw = null;
        Process process;
        try {
            process = Runtime.getRuntime().exec(new String(command.getBytes(), "GBK"));
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "GBK"));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilderSuccessMsg.append(line).append(" ");
            }
            BufferedReader errorBufferedReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "GBK"));
            String errorLine;
            while ((errorLine = errorBufferedReader.readLine()) != null) {
                stringBuilderErrorMsg.append(errorLine).append(" ");
            }
            if(StringUtils.isNotBlank(stringBuilderErrorMsg.toString())){
                stringBuilderErrorMsg.append("【命令执行有错误】");
                return stringBuilderErrorMsg.toString();
            }
            return stringBuilderSuccessMsg.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static void generatePasteVbs(){
        StringBuilder stringBuilder = new StringBuilder();
        FileWriter fw = null;
        String location = "";
        try {
            String tempPath = "C:"+File.separator+"temp";
            tempPath = UploadPathHelper.getUploadPath(tempPath);
            location = tempPath+ File.separator + "paste.vbs";
            File fileStart = new File(location);
            if(!fileStart.exists()){
                fileStart.createNewFile();
            }
            // 生成vbs文件
            FileOutputStream fos = new FileOutputStream(location);
            OutputStreamWriter osw = new OutputStreamWriter(fos, "GBK");
            osw.write("Set objHTML = CreateObject(\"htmlfile\")\n" +
                    "GetClipboardText = objHTML.ParentWindow.ClipboardData.GetData(\"text\")\n" +
                    "lines = Split(GetClipboardText, vbCrLf)\n" +
                    "For Each line In lines\n" +
                    "    WScript.Echo line & \"\\r\\n\"\n" +
                    "Next");
            osw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
