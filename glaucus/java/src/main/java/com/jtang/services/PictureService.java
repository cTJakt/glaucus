package com.jtang.services;

import com.jtang.analysis.FileAnalysis;
import com.jtang.config.AppConfig;
import com.jtang.dao.*;
import com.jtang.data.CsvAdapter;
import com.jtang.data.CsvLoader;
import com.jtang.entity.PicCategory;
import com.jtang.entity.PicFile;
import com.jtang.entity.PicInfo;
import com.jtang.services.pojo.PicCategoryPojo;
import com.jtang.services.pojo.PicFilePojo;
import com.jtang.services.pojo.PicInfoPojo;
import com.jtang.util.FileHelper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Picture-related service
 */
@Slf4j
@Component
@Data
public class PictureService {
    @Autowired private CsvLoader csvLoader;
    @Autowired private CsvAdapter csvAdapter;
    @Autowired private HdfsDao hdfsDao;

    @Autowired private PictureInfoDao pictureInfoDao;

    @Autowired private ConfigDao configDao;

    @Autowired private HeaderInfoDao headerInfoDao;
    @Autowired private FileAnalysis fileAnalysis;

    @Autowired private ModelDao modelDao;

    @Autowired private FuncInfoDao funcInfoDao;

    @Autowired private PictureCategoryDao pictureCategoryDao;

    @Autowired private PictureFileDao pictureFileDao;

    @Autowired private AppConfig appConfig;
    /**
     *
     * @param userId
     * @param inFile
     * @param filename
     * @return
     * @throws Exception
     */
    public boolean uploadPic(String userId, MultipartFile inFile, String filename) throws Exception {

        String picAbsolutePath = appConfig.getAbsolutePath();
        log.info("file uploading: filename = " + filename + ", userId = " + userId);
        File file = FileHelper.multipartToFile(inFile);
        log.info("server file location: " + file.getAbsolutePath());
        if(!inFile.isEmpty()){
            try {
                BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(new File(inFile.getOriginalFilename())));
                out.write(inFile.getBytes());
                out.flush();
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
            System.out.println(1233);
            new Thread(new MyThread(file.getAbsolutePath(), userId, picAbsolutePath)).start();
            //if(parseZipFile(file.getAbsolutePath(), userId, picAbsolutePath))
                //return true;
            System.out.println(222);

            return true;
        }else{
            return false;
        }

    }



    public boolean parseZipFile(String filename, String userId, String descDir) throws IOException{
        long startTime=System.currentTimeMillis();

        if(!filename.endsWith(".zip"))
            return false;
        File pathFile = new File(descDir);
        if(!pathFile.exists()){
            pathFile.mkdirs();
        }
        File zipFile = new File(filename);
        ZipFile zip = new ZipFile(zipFile);

        String picFile = null;
        int countNum = 0;
        Set<String> hs = new HashSet<>();
        PicCategory picCategory = null;
        PicFile picFileId = null;
        List<PicInfo> picInfos = new ArrayList<>();


        for(Enumeration enumeration = zip.entries(); enumeration.hasMoreElements();){
            ZipEntry entry = (ZipEntry)enumeration.nextElement();
            String zipEntryName = entry.getName();
            InputStream in = zip.getInputStream(entry);
            String outPath = (descDir + zipEntryName).replaceAll("\\*", "/");
            //判断路径是否存在,不存在则创建文件路径
            File file = new File(outPath.substring(0, outPath.lastIndexOf('/')));
            if(!file.exists()){
                file.mkdirs();
            }
            //判断文件全路径是否为文件夹,如果是上面已经上传,不需要解压
            if(new File(outPath).isDirectory()){
                continue;
            }
            //输出文件路径信息
            String[] paths = outPath.split("/");
            int pathLen = paths.length;

            if(picFile==null){
                picFile = paths[pathLen - 3];
                picFileId = pictureFileDao.save(new PicFile(userId, paths[pathLen - 3], outPath));
            }

            System.out.println("12"+picFileId.getId());
            if(!hs.contains(paths[pathLen-2])){
                hs.add(paths[pathLen - 2]);
                picCategory = pictureCategoryDao.save(new PicCategory(paths[pathLen - 2], picFileId.getId()));
                System.out.println(picCategory.getCategoryName());
            }
            //String location, String picname, String tag, String categoryId
            picInfos.add(new PicInfo(outPath,paths[pathLen-1], paths[pathLen-2], picCategory.getId()));

            OutputStream out = new FileOutputStream(outPath);
            byte[] buf1 = new byte[1024];
            int len;
            while((len=in.read(buf1))>0){
                out.write(buf1,0,len);
            }
            in.close();
            out.close();
        }
        pictureInfoDao.save(picInfos);
        //("******************解压完毕********************");
        long endTime=System.currentTimeMillis();
        System.out.println(endTime - startTime);
        return true;
    }

    public List<PicFilePojo> getAllProj(String userId){
        List<PicFilePojo> res = new ArrayList<>();
        List<PicFile> picFiles = pictureFileDao.findByUserId(userId);
        res = picFiles.stream().map((picInfo) -> new PicFilePojo(picInfo.getId(), picInfo.getFileName()))
                .collect(Collectors.toList());
        return res;
    }

    public List<PicCategoryPojo> getOneProj(String picFileId){
        List<PicCategoryPojo> res = new ArrayList<>();
        List<PicCategory> picCategorys = pictureCategoryDao.findByPicFileId(picFileId);
        res = picCategorys.stream().map((picInfo) -> new PicCategoryPojo(picInfo.getId(), picInfo.getCategoryName()))
                .collect(Collectors.toList());
        return res;

    }

    public List<PicInfoPojo> getAllPicAddr(String picTag){
        List<PicInfoPojo> res = new ArrayList<>();
        List<PicInfo> picInfos = pictureInfoDao.findByCategoryId(picTag);


        res = picInfos.stream().map((picInfo) -> new PicInfoPojo(picInfo.getId(), picInfo.getPicname(),picInfo.getLocation()))
                .collect(Collectors.toList());
        return res;
    }


    public boolean updatePicInfo(String picId, String picCategoryId, String picTag ){
        PicInfo picInfo =  pictureInfoDao.findById(picId);
        //T.B.D.
        //modelOfGet.setModel(model);
        picInfo.setCategoryId(picCategoryId);
        picInfo.setTag(picTag);
        val pic = pictureInfoDao.save(picInfo);
        if(pic != null)
            return true;
        return false;
    }

    public class MyThread implements Runnable{

        private String fileAbsolutePath;
        private String userId;
        private String picAbsolutePath;
        public MyThread(String fileAbsolutePath, String userId, String picAbsolutePath){
            this.fileAbsolutePath = fileAbsolutePath;
            this.userId = userId;
            this.picAbsolutePath = picAbsolutePath;


        }
        @Override
        public void run(){
            try {
                parseZipFile(fileAbsolutePath, userId, picAbsolutePath);
            }catch (IOException e){
                e.printStackTrace();
            }
        }
    }
/*
*List<PicInfo> picInfos11 = new ArrayList<>();
        picInfos11.add(new PicInfo("abc","abc","abc","abc"));
        //picInfos11.add(new PicInfo("abc","abc","abc","abc"));
        List<PicInfo> picInfos1 = pictureInfoDao.save(picInfos11);
        for(PicInfo picInfo:picInfos1){
            System.out.println(picInfo.getId());
        }
 */

}