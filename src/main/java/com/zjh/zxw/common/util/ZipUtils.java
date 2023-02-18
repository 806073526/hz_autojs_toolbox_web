package com.zjh.zxw.common.util;


import com.baomidou.mybatisplus.core.toolkit.ArrayUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.core.util.FileUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 压缩工具类
 */
@Slf4j
public class ZipUtils {

    private static final String DEFAULT_CHARSET = "UTF-8";
    private static final int BUFFER_SIZE = 2 * 1024;

    /**
     * 压缩文件夹
     *
     * @param zipFileName  打包后文件的名称，含路径
     * @param sourceFolder 需要打包的文件夹或者文件的路径
     * @param zipPathName  打包目的文件夹名,为空则表示直接打包到根
     */
    public static void zip(String zipFileName, String sourceFolder, String zipPathName) throws Exception {
        ZipOutputStream out = null;
        try {
            File zipFile = new File(zipFileName);
            File parentFile = zipFile.getParentFile();
            if(!parentFile.exists()){
                parentFile.mkdirs();
            }
            FileOutputStream outputStream = new FileOutputStream(zipFile);
            out = new ZipOutputStream(outputStream);
            if (StringUtils.isNotBlank(zipPathName)) {
                zipPathName = FilenameUtils.normalizeNoEndSeparator(zipPathName, true) + "/";
            } else {
                zipPathName = "";
            }
            zip(out, sourceFolder, zipPathName);
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception(e);
        } finally {
            IOUtils.closeQuietly(out);
        }
    }

    /**
     * 压缩文件夹
     *
     * @param zipFile 打包后文件的名称，含路径
     * @param source  需要打包的文件夹或者文件的路径
     */
    public static void zip(String zipFile, String source) throws Exception {
        File file = new File(source);
        zip(zipFile, source, file.isFile() ? StringUtils.EMPTY : file.getName());
    }

    /**
     * 压缩文件夹
     *
     * @param zipFile a {@link java.io.File} object.
     * @param source  a {@link java.io.File} object.
     */
    public static void zip(File zipFile, File source) throws Exception {
        zip(zipFile.getAbsolutePath(), source.getAbsolutePath());
    }

    private static void zip(ZipOutputStream zos, String file, String pathName) throws IOException {
        File file2zip = new File(file);
        if (file2zip.isFile()) {
            zos.putNextEntry(new ZipEntry(pathName + file2zip.getName()));
            IOUtils.copy(new FileInputStream(file2zip.getAbsolutePath()), zos);
            zos.flush();
            zos.closeEntry();
        } else {
            File[] files = file2zip.listFiles();
            if (ArrayUtils.isNotEmpty(files)) {
                for (File f : files) {
                    if (f.isDirectory()) {
                        zip(zos, FilenameUtils.normalizeNoEndSeparator(f.getAbsolutePath(), true),
                                FilenameUtils.normalizeNoEndSeparator(pathName + f.getName(), true) + "/");
                    } else {
                        FileInputStream inputStream = new FileInputStream(f.getAbsolutePath());
                        zos.putNextEntry(new ZipEntry(pathName + f.getName()));
                        IOUtils.copy(inputStream, zos);
                        inputStream.close();
                        zos.flush();
                        zos.closeEntry();
                    }
                }
            } else {
                // 空文件夹的处理
                zos.putNextEntry(new ZipEntry(pathName + "/"));
                // 没有文件，不需要文件的copy
                zos.closeEntry();
            }
        }
    }

}