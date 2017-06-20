package com.jtang.controller;

import com.jtang.controller.response.ErrorRes;
import com.jtang.controller.response.NormalRes;
import com.jtang.controller.response.Response;
import com.jtang.data.CsvAdapter;
import com.jtang.services.FileService;
import com.jtang.services.pojo.HeaderInfoUpdatedPojo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * File uploader and transfer and so on API
 * Created by lucas on 2016/10/9.
 */
@Slf4j
@RestController
@RequestMapping("/api/file")
public class FileController {
    @Autowired private FileService fileService;
    @Autowired private CsvAdapter csvAdapter;
    /**
     *
     * @param file
     * @return fileId
     */
    @PostMapping(value = "/upload")
    public Response fileLoader(@RequestParam(value="userId", required = false) String userId,
                               @RequestParam(value="file", required = false) MultipartFile file,
                               @RequestParam(value="fileName") String filename) {
        try {
            String rsl = fileService.uploadFile(userId, file, filename);
            return rsl != null ? new NormalRes(rsl) : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }
    @GetMapping(value = "/upload/bigfile")
    public Response bigFileUploader(@RequestParam(value="userId", required = false) String userId,
                                    @RequestParam(value="fileLoc", required = false) String fileLoc,
                                    @RequestParam(value="fileName", required = false) String fileName) {

        try {
            String rsl = csvAdapter.Csv2Parquet(fileLoc, fileName, userId);
            return rsl != null ? new NormalRes(rsl) : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value = "/get/all")
    public Response getAll(@RequestParam(value="userId", required = false) String userId) {
        try {

            return new NormalRes(fileService.getAllFiles(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }
    @GetMapping(value = "/get/allfileandfunc")
    public Response getAllFileAndFunc(@RequestParam(value="userId", required = false)String userId){
        try {

            return new NormalRes(fileService.getAllFilesAndFunc(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }


    @GetMapping(value = "/get/detail")
    public Response getDetail(@RequestParam(value="fileId", required = false) String fileId){
        try{
            return new NormalRes(fileService.getFileDetailInfo(fileId));
        } catch (Exception e){
            e.printStackTrace();
            return new ErrorRes();
        }
    }
    @GetMapping(value = "/analysis")
    public Response analysis(@RequestParam(value="fileId", required = false) String fileId){
        try{
            fileService.analysis(fileId);
            return new NormalRes(fileService.getFileDetailInfo(fileId));
        } catch (Exception e){
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     * for test
     * @param fieldIds
     * @return
     */
    @GetMapping(value = "/analysis/fields1")
    public Response analysisOfFields(@RequestParam(value="fieldIds", required = false) String[] fieldIds){
        try{
            return new NormalRes(fileService.getFieldDistribution(fieldIds));
        } catch (Exception e){
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param fieldIds
     * @param funcId
     * @return
     */
    @GetMapping(value = "/analysis/fields")
    public Response analysisOfFields1(@RequestParam(value = "fieldIds", required = false) String[] fieldIds,
                                      @RequestParam(value = "funcId", required = false) String funcId){
        try{
            return new NormalRes(fileService.getFieldAnalysis(fieldIds, funcId));
        } catch (Exception e){
            e.printStackTrace();
            return new ErrorRes();
        }
    }


    /**
     *
     * @param nums
     * @return
     */
    @GetMapping(value = "/analysis/test")
    public Response analysis2(@RequestParam(value="nums", required = false) int nums){
        try{
            fileService.analysisTest(nums);
            return new NormalRes();
        } catch (Exception e){
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param fileId
     * @return
     */
    @GetMapping(value = "/delete")
    public Response delete(@RequestParam(value="fileId", required = false) String fileId){
        try{
            return new NormalRes(fileService.deleteFileById(fileId));
        } catch (Exception e){
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param headerInfoUpdatedPojo
     * @return
     */
    @PostMapping(value = "update")
    public Response updateFileInfo(
            @RequestBody HeaderInfoUpdatedPojo headerInfoUpdatedPojo
            ) {
        try {
            boolean rsl = fileService.updateAllHeaders(headerInfoUpdatedPojo.getHeaderInfo(),headerInfoUpdatedPojo.getHeaderNeedUpdate());
            return rsl? new NormalRes() : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }

    }
}
