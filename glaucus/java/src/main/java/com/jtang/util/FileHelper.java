package com.jtang.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * File dealing function kit
 * Created by lucas on 2016/10/17.
 */
public class FileHelper {
    //Get the file with postfix
    public static String getFile(String path) {
        Path p = Paths.get(path);
        try {
            return p.getFileName().toString();
        } catch (Exception e) {
            return null;
        }
    }
    //Get the file without postfix
    public static String getFileName(String path) {
        try {
            return getFile(path).split("\\.")[0];
        } catch (Exception e) {
            //null value or Array out of Index.
            return null;
        }
    }
    public static String getFileType(String path) {
        try {
            String[] strs =  getFile(path).split("\\.");
            return strs[strs.length - 1];
        } catch (Exception e) {
            return null;
        }
    }
    public static File multipartToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
    /*public static void main(String[] args) {
        System.out.println(getFileType("/Users/lucas/Projects/Data/pubsaf1509/tx_in.csv"));
    }*/
}
