package com.jtang.services;

import com.jtang.analysis.FileAnalysis;
import com.jtang.dao.*;
import com.jtang.data.CsvAdapter;
import com.jtang.data.CsvLoader;
import com.jtang.data.SasLoader;
import com.jtang.entity.Config;
import com.jtang.entity.FileInfo;
import com.jtang.entity.HeaderInfo;
import com.jtang.entity.Model;
import com.jtang.services.pojo.*;
import com.jtang.util.FileHelper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * File-related service
 * Created by lucas on 2016/11/14.
 */
@Slf4j
@Component
@Data
public class FileService {
    @Autowired private SasLoader sasLoader;
    @Autowired private CsvLoader csvLoader;
    @Autowired private CsvAdapter csvAdapter;
    @Autowired private HdfsDao hdfsDao;

    @Autowired private FileInfoDao fileInfoDao;

    @Autowired private ConfigDao configDao;

    @Autowired private HeaderInfoDao headerInfoDao;
    @Autowired private FileAnalysis fileAnalysis;

    @Autowired private ModelDao modelDao;

    @Autowired private FuncInfoDao funcInfoDao;

    /**
     *
     * @param userId
     * @param inFile
     * @param filename
     * @return
     * @throws Exception
     */
    public String uploadFile(String userId, MultipartFile inFile, String filename) throws Exception {
        log.info("file uploading: filename = " + filename + ", userId = " + userId);
        String fileType = FileHelper.getFileType(filename);
        File file = FileHelper.multipartToFile(inFile);
        log.info("server file location: " + file.getAbsolutePath());
        String rsl = fileType.equals("csv")? csvLoader.loadCsv(file.getAbsolutePath(), userId):
                    sasLoader.loadSas(file.getAbsolutePath(), userId);

        file.delete();
        return rsl;
    }
    public void deleteFile(String fileId) throws Exception {
        String fileLoc = fileInfoDao.findById(fileId).getLocation();
        fileInfoDao.delete(fileId);
        hdfsDao.deleteFileInHdfs(fileLoc, true);
    }
    public TestFileValuePojo uploadTestFile(String userId, MultipartFile inFile, String filename) throws Exception {
        String fileId = uploadFile(userId, inFile, filename);
        String fileLoc = fileInfoDao.findById(fileId).getLocation();
        List<Map<String, String>> values = csvAdapter.parquetFileReader(fileLoc);
        log.error("Test File values: ", values);
        //deleteFile(fileId);
        return new TestFileValuePojo(fileId, values);
    }

    /**
     *
     * @param userId
     * @return
     * @throws Exception
     */
    public List<FileNamePojo> getAllFiles(String userId) throws Exception{
        val files = fileInfoDao.findByUserId(userId);
        val rsl = files.stream().map((file) -> new FileNamePojo(file.getId(), file.getFilename()))
                .collect(Collectors.toList());
        return rsl;
    }

    /**
     *
     * @param userId
     * @return
     * @throws Exception
     */
    public FileAndFuncInfoPojo getAllFilesAndFunc(String userId) throws Exception{
        return new FileAndFuncInfoPojo(getAllFiles(userId),funcInfoDao.findAll());
    }

    /**
     *
     * @param fileId
     * @return
     * @throws Exception
     */
    public FileDetailPojo getFileDetailInfo(String fileId) throws Exception{
        val fileInfo = fileInfoDao.findById(fileId);
        val headerInfos = headerInfoDao.findByFileInfoId(fileId);
        return new FileDetailPojo(fileInfo.getFilename(), fileInfo.getUploadTime(), fileInfo.getFileStrucInfo(), headerInfos);
    }

    /**
     *
     * @param fileId
     * @throws Exception
     */
    public void analysis(String fileId) throws Exception {

        try {
            fileAnalysis.fileAnalysis(fileId, (float) 0.01);
        } catch (Exception e) {
            log.error("file analysis error");
            throw e;
        }
    }

    /**
     *
     * @param nums
     * @throws Exception
     */
    //temporary
    public void analysisTest(int nums) throws Exception {
        String[] fileIds = {"58762b7b5fb95b1e8179fc4e", "58762f8a5fb95b1e8179fd4c",
        "587635475fb95b1e8179fe4a", "58771c565fb95b2f231eaadd",
        "5877260e5fb95b2f231eabdb"
        /*"586f4e3b5fb95b26fce31b2b"*/};
        for (String fileId: fileIds) {
            long start = System.currentTimeMillis();
            analysis(fileId);
            long finish = System.currentTimeMillis();
            val fileInfo = fileInfoDao.findById(fileId);
            val fileStruct = fileInfo.getFileStrucInfo();
            fileStruct.put("analysisTime" + nums, String.valueOf((finish-start)));
            fileInfoDao.save(fileInfo);
        }
    }


    /**
     *
     * @param fileId
     * @return
     */
    public boolean deleteFileById(String fileId){
        FileInfo fileInfo = fileInfoDao.findById(fileId);
        if(fileInfo == null)
            return false;
        List<Config> configList = configDao.findByFileInfoId(fileId);
        if(configList!=null){
            for(Config config:configList) {
                List<Model> modelList = modelDao.findByConfigId(config.getId());
                if(modelList!=null){
                    for(Model model:modelList) {
                        modelDao.delete(model);
                    }
                }
                configDao.delete(config.getId());
            }
        }
        fileInfoDao.delete(fileInfo);
        return true;
    }

    /**
     *
     * @param headerId
     * @param aliasName
     * @param fieldDes
     * @return
     */
    public boolean updateHeaderInfo(String headerId, String aliasName, String fieldDes){


        HeaderInfo headerInfo = headerInfoDao.findById(headerId);
        if(headerInfo == null){
            return false;
        }
        headerInfo.setFieldDes(fieldDes);
        headerInfo.setAliasName(aliasName);
        val headerInfo_get = headerInfoDao.save(headerInfo);
        return headerInfo_get != null;

    }

    /**
     *
     * @param innerHeaderInfos
     * @param headerToUpdate
     * @return
     */
    public boolean updateAllHeaders(List<InnerHeaderInfo> innerHeaderInfos, List<Integer> headerToUpdate){

        if(innerHeaderInfos==null || headerToUpdate==null){
            return false;
        }
        int currLen = headerToUpdate.size();
        System.out.println("headerInfos = [" + innerHeaderInfos + "], headerToUpdate = [" + headerToUpdate + "]");
        System.out.println(currLen);
        for(int i=0;i<currLen;i++){
            int index = headerToUpdate.get(i);
            InnerHeaderInfo innerheaderInfo = innerHeaderInfos.get(index);
            if(updateHeaderInfo(innerheaderInfo.getId(), innerheaderInfo.getAliasName(),
                    innerheaderInfo.getFieldDes())==false){
                return false;
            };

        }
        return true;
    }

    /**
     * @param fieldIds
     * @return
     * @throws Exception
     */
    public HashMap<String, HashMap<String, Object>> getFieldDistribution(String[] fieldIds) throws Exception{
        try{
            val res = fileAnalysis.getFieldDistribution(fieldIds);
            return res;
        }catch (Exception e){
            log.error("file analysis error");
            throw e;
        }
    }

    /**
     *
     * @param fieldIds
     * @param funcId
     * @return
     * @throws Exception
     */
    public Object getFieldAnalysis(String[] fieldIds, String funcId) throws Exception{
        try{

            if(fieldIds==null || fieldIds.length<0 || funcId==null)
                return null;
            String funcName = funcInfoDao.findById(funcId).getFuncName();
            if(funcName == null)
                return null;
            switch (funcName){
                case "数据分布":
                    val res_1 = fileAnalysis.getFieldDistribution(fieldIds);
                    return res_1;
                case "散点图":
                    val res_2 = fileAnalysis.getFieldScatterDiagram(fieldIds);
                    return res_2;
                case "数据统计":
                    val res_3 = fileAnalysis.getFieldDescription(fieldIds);
                    return res_3;
                case "偏度-峰度":
                    val res_4 = fileAnalysis.getFieldSkewnessAndKurtosis(fieldIds);
                    return res_4;
                case "皮尔森相关系数":
                    val res_5 = fileAnalysis.getFieldCorr(fieldIds);
                    return res_5;
                default:
                    break;
            }
            return null;
        }catch (Exception e){
            log.error("file analysis error");
            throw e;
        }
    }


}