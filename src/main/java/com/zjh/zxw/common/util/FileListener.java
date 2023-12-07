package com.zjh.zxw.common.util;

import com.zjh.zxw.domain.dto.SyncFileInterfaceDTO;
import com.zjh.zxw.websocket.AutoJsWsServerEndpoint;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.monitor.FileAlterationListenerAdaptor;
import org.apache.commons.io.monitor.FileAlterationObserver;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class FileListener extends FileAlterationListenerAdaptor {

    // 同步忽略目录
    private List<String> ignorePathArr;

    // 设备uuid
    private String deviceUUID;

    // web端监听路径
    private String webDirPath;

    // 手机端 待同步根目录
    private String phoneDirPath;

    // web端服务地址
    private String serverUrl;

    // 检测变化自动重启
    private Boolean checkChangeAutoRestart=false;

    public List<String> getIgnorePathArr() {
        return ignorePathArr;
    }

    public void setIgnorePathArr(List<String> ignorePathArr) {
        this.ignorePathArr = ignorePathArr;
    }

    public void setCheckChangeAutoRestart(Boolean checkChangeAutoRestart) {
        this.checkChangeAutoRestart = checkChangeAutoRestart;
    }

    public Boolean getCheckChangeAutoRestart() {
        return checkChangeAutoRestart;
    }

    public String getWebDirPath() {
        return webDirPath;
    }

    public void setWebDirPath(String webDirPath) {
        this.webDirPath = webDirPath;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public void setPhoneDirPath(String phoneDirPath) {
        this.phoneDirPath = phoneDirPath;
    }

    public String getPhoneDirPath() {
        return phoneDirPath;
    }

    public void setDeviceUUID(String deviceUUID) {
        this.deviceUUID = deviceUUID;
    }

    public String getDeviceUUID() {
        return deviceUUID;
    }

    private void syncSingleFile(String filePath)  {
        try {
            String path = filePath.substring(filePath.indexOf(this.deviceUUID),filePath.length()).replaceAll("\\\\","/");
            // 下载路径
            String downLoadUrl = this.serverUrl + "/uploadPath/autoJsTools/" + path;
            List<String> downloadFileUrlArr = new ArrayList<String>();
            downloadFileUrlArr.add(downLoadUrl);

            // 转换后的web目录
            String webDirPathConvert = webDirPath.substring(webDirPath.lastIndexOf(File.separator),webDirPath.length()).replaceAll("\\\\","/");

            // 项目名称
            String projectName = webDirPathConvert.substring(webDirPathConvert.lastIndexOf("/"),webDirPathConvert.length());

            // 文件路径
            String scriptFilePath = filePath.replace(webDirPath,"").replaceAll("\\\\","/");

            // 本地下载路径
            String localFileUrl = this.phoneDirPath + projectName + scriptFilePath;
            List<String> localFileUrlArr = new ArrayList<String>();
            localFileUrlArr.add(localFileUrl);

            SyncFileInterfaceDTO syncFileInterfaceDTO = new SyncFileInterfaceDTO();
            syncFileInterfaceDTO.setShowProcess(false);
            syncFileInterfaceDTO.setServerUrl(this.serverUrl);
            syncFileInterfaceDTO.setDownloadFileUrlArr(downloadFileUrlArr);
            syncFileInterfaceDTO.setLocalFileUrlArr(localFileUrlArr);
            syncFileInterfaceDTO.setIgnorePathArr(ignorePathArr);

            AutoJsWsServerEndpoint.execSyncFileScript(this.deviceUUID, syncFileInterfaceDTO,()->{
                // 如果开启了自动重启
                if(checkChangeAutoRestart){
                    String remoteScript =  "let notCloseSourceArr = ['/data/user/0/com.zjh336.cn.tools/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools/files/project/main.js','/data/user/0/com.zjh336.cn.tools8822/files/project/runScript.js', '/data/user/0/com.zjh336.cn.tools8822/files/project/main.js','main.js']\n" +
                            "const all = engines.all()\n" +
                            "all.forEach(item => {\n" +
                            "if (notCloseSourceArr.indexOf(String(item.source))===-1) {\n" +
                            "item.forceStop()\n" +
                            "}\n" +
                            "});\n";
                    try {
                        String webScriptDirPath = this.webDirPath.replaceAll("\\\\","/");
                        webScriptDirPath = webScriptDirPath.substring(webScriptDirPath.indexOf(this.deviceUUID),webScriptDirPath.length());
                        AutoJsWsServerEndpoint.execStartProjectByWeb(this.deviceUUID,this.serverUrl,webScriptDirPath,this.phoneDirPath,false,remoteScript);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

            });
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
    }


    /**
     * File system observer started checking event.
     *
     * @param observer The file system observer (ignored)
     */
    @Override
    public void onStart(FileAlterationObserver observer) {
        super.onStart(observer);
    }

    /**
     * Directory created Event.
     *
     * @param directory The directory created (ignored)
     */
    @Override
    public void onDirectoryCreate(File directory) {
        if(checkIsIgnore(directory.getAbsolutePath())){
            return;
        }
        log.info("[Create Directory] : {}",directory.getAbsolutePath());
        String filePath = directory.getAbsolutePath();

        // 转换后的web目录
        String webDirPathConvert = webDirPath.substring(webDirPath.lastIndexOf(File.separator),webDirPath.length()).replaceAll("\\\\","/");

        // 项目名称
        String projectName = webDirPathConvert.substring(webDirPathConvert.lastIndexOf("/"),webDirPathConvert.length());


        // 本地路径
        String localFileUrl = "/sdcard/"+this.phoneDirPath + "/" + projectName + filePath.replace(webDirPath,"").replaceAll("\\\\","/" + "/") + "/";
        try {
            // 删除目录
            AutoJsWsServerEndpoint.execRemoteScript(this.deviceUUID,"files.createWithDirs(\""+localFileUrl+"\")",false,"","");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Directory changed Event.
     *
     * @param directory The directory changed (ignored)
     */
    @Override
    public void onDirectoryChange(File directory) {
        if(checkIsIgnore(directory.getAbsolutePath())){
            return;
        }
        log.info("[Changed Directory] : {}",directory.getAbsolutePath());
    }

    /**
     * Directory deleted Event.
     *
     * @param directory The directory deleted (ignored)
     */
    @Override
    public void onDirectoryDelete(File directory) {
        if(checkIsIgnore(directory.getAbsolutePath())){
            return;
        }
        log.info("[Delete Directory] : {}",directory.getAbsolutePath());
        String filePath = directory.getAbsolutePath();

        // 转换后的web目录
        String webDirPathConvert = webDirPath.substring(webDirPath.lastIndexOf(File.separator),webDirPath.length()).replaceAll("\\\\","/");

        // 项目名称
        String projectName = webDirPathConvert.substring(webDirPathConvert.lastIndexOf("/"),webDirPathConvert.length());

        // 本地路径
        String localFileUrl = "/sdcard/"+this.phoneDirPath + "/" + projectName +  filePath.replace(webDirPath,"").replaceAll("\\\\","/" + "/");
        try {
            // 删除目录
            AutoJsWsServerEndpoint.execRemoteScript(this.deviceUUID,"files.remove(\""+localFileUrl+"\")",false,"","");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 返回是否忽略
     * @param filePath
     * @return
     */
    private boolean checkIsIgnore(String filePath){
        if(!ignorePathArr.contains("start.bat")){
            ignorePathArr.add("start.bat");
        }
        if(!ignorePathArr.contains("start.sh")){
            ignorePathArr.add("start.sh");
        }
        if(!ignorePathArr.contains("stop.bat")){
            ignorePathArr.add("stop.bat");
        }
        if(!ignorePathArr.contains("stop.sh")){
            ignorePathArr.add("stop.sh");
        }
        // 满足忽略条件
        long count = ignorePathArr.stream().filter(ignorePath->{
            return StrHelper.replaceSystemSeparator(filePath).startsWith(webDirPath + File.separator + StrHelper.replaceSystemSeparator(ignorePath));
        }).count();
        return count > 0;
    }

    /**
     * File created Event.
     *
     * @param file The file created (ignored)
     */
    @Override
    public void onFileCreate(File file) {
        if(checkIsIgnore(file.getAbsolutePath())){
            return;
        }
        log.info("[Created File] : {}",file.getAbsolutePath());
        syncSingleFile(file.getAbsolutePath());
    }

    /**
     * File changed Event.
     *
     * @param file The file changed (ignored)
     */
    @Override
    public void onFileChange(File file) {
        if(checkIsIgnore(file.getAbsolutePath())){
            return;
        }
        log.info("[MODIFY File] : {}",file.getAbsolutePath());
        syncSingleFile(file.getAbsolutePath());
    }

    /**
     * File deleted Event.
     *
     * @param file The file deleted (ignored)
     */
    @Override
    public void onFileDelete(File file) {
        if(checkIsIgnore(file.getAbsolutePath())){
           return;
        }
        log.info("[Deleted File] : {}",file.getAbsolutePath());
        String filePath = file.getAbsolutePath();

        // 转换后的web目录
        String webDirPathConvert = webDirPath.substring(webDirPath.lastIndexOf(File.separator),webDirPath.length()).replaceAll("\\\\","/");

        // 项目名称
        String projectName = webDirPathConvert.substring(webDirPathConvert.lastIndexOf("/"),webDirPathConvert.length());

        // 本地路径
        String localFileUrl = "/sdcard/"+this.phoneDirPath + "/" + projectName + filePath.replace(webDirPath,"").replaceAll("\\\\","/");
        try {
            // 删除文件
            AutoJsWsServerEndpoint.execRemoteScript(this.deviceUUID,"files.remove(\""+localFileUrl+"\")",false,"","");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * File system observer finished checking event.
     *
     * @param observer The file system observer (ignored)
     */
    @Override
    public void onStop(FileAlterationObserver observer) {
        super.onStop(observer);
    }

}