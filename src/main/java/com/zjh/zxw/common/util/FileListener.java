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

    // 设备uuid
    private String deviceUUID;

    // web端监听路径
    private String webDirPath;

    // 手机端 待同步根目录
    private String phoneDirPath;

    // web端服务地址
    private String serverUrl;

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

            // 本地下载路径
            String localFileUrl = this.phoneDirPath + filePath.replace(webDirPath,"").replaceAll("\\\\","/");
            List<String> localFileUrlArr = new ArrayList<String>();
            localFileUrlArr.add(localFileUrl);

            SyncFileInterfaceDTO syncFileInterfaceDTO = new SyncFileInterfaceDTO();
            syncFileInterfaceDTO.setShowProcess(false);
            syncFileInterfaceDTO.setServerUrl(this.serverUrl);
            syncFileInterfaceDTO.setDownloadFileUrlArr(downloadFileUrlArr);
            syncFileInterfaceDTO.setLocalFileUrlArr(localFileUrlArr);

            AutoJsWsServerEndpoint.execSyncFileScript(this.deviceUUID, syncFileInterfaceDTO,()->{});
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
        log.info("[Create Directory] : {}",directory.getAbsolutePath());
        String filePath = directory.getAbsolutePath();
        // 本地路径
        String localFileUrl = "/sdcard/"+this.phoneDirPath + filePath.replace(webDirPath,"").replaceAll("\\\\","/" + "/") + "/";
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
        log.info("[Changed Directory] : {}",directory.getAbsolutePath());
    }

    /**
     * Directory deleted Event.
     *
     * @param directory The directory deleted (ignored)
     */
    @Override
    public void onDirectoryDelete(File directory) {
        log.info("[Delete Directory] : {}",directory.getAbsolutePath());
        String filePath = directory.getAbsolutePath();
        // 本地路径
        String localFileUrl = "/sdcard/"+this.phoneDirPath + filePath.replace(webDirPath,"").replaceAll("\\\\","/" + "/");
        try {
            // 删除目录
            AutoJsWsServerEndpoint.execRemoteScript(this.deviceUUID,"files.remove(\""+localFileUrl+"\")",false,"","");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * File created Event.
     *
     * @param file The file created (ignored)
     */
    @Override
    public void onFileCreate(File file) {
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
        log.info("[Deleted File] : {}",file.getAbsolutePath());
        String filePath = file.getAbsolutePath();
        // 本地路径
        String localFileUrl = "/sdcard/"+this.phoneDirPath + filePath.replace(webDirPath,"").replaceAll("\\\\","/");
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