package com.zjh.zxw.common.util;

import com.zjh.zxw.common.util.exception.BusinessException;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class FileUtil {

    /**
     * 创建文件夹
     *
     * @param folderPath
     */
    public static void createFolder(String folderPath) {
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }

    /**
     * 创建新文件
     *
     * @param filePath
     * @return
     * @throws IOException
     */
    public static File createFile(String filePath) throws IOException {
        if (StringUtils.isNotBlank(filePath)) {
            File file = new File(filePath);
            if (file.exists()) {
                return file;
            }
            createFolder(file.getParent());
            file.createNewFile();
            return file;
        }
        return null;
    }

    /**
     * 移动物理文件
     *
     * @param sourcePath
     * @param targetPath
     * @throws IOException
     */
    public static void moveFile(String sourcePath, String targetPath) throws IOException {
        createFile(targetPath);
        Files.move(Paths.get(sourcePath), Paths.get(targetPath), StandardCopyOption.ATOMIC_MOVE);
    }

    /**
     * 复制文件
     * @param sourcePath
     * @param targetPath
     * @throws IOException
     */
    public static void copyFile(String sourcePath,String targetPath) throws IOException{
        createFile(targetPath);
        Files.copy(Paths.get(sourcePath), Paths.get(targetPath),StandardCopyOption.REPLACE_EXISTING);
    }

    /**
     * 删除物理文件
     *
     * @param filePath
     */
    public static void delete(String filePath) throws IOException {
        if (StringUtils.isBlank(filePath)) {
            return;
        }
        delete0(new File(filePath));
    }

    /**
     * 递归删除文件
     *
     * @param file
     * @throws IOException
     */
    private static void delete0(File file) throws IOException {
        if (!file.exists()) {
            return;
        }
        if (file.isDirectory()) {
            final File[] files = file.listFiles();
            if (files != null && files.length > 0) {
                for (int i = 0; i < files.length; i++) {
                    delete0(files[i]);
                }
            }
            Files.delete(file.toPath());
        } else {
            Files.delete(file.toPath());
        }
    }

}
