package com.jtang.controller;

import com.jtang.controller.response.ErrorRes;
import com.jtang.controller.response.NormalRes;
import com.jtang.controller.response.Response;
import com.jtang.services.PictureService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * File uploader and transfer and so on API
 */
@Slf4j
@RestController
@RequestMapping("/api/picture")
public class PicController {
    @Autowired private PictureService pictureService;
    /**
     *
     * @param file
     * @return fileId
     */

    @PostMapping(value = "/upload")
    public Response fileLoader(@RequestParam(value="userId", required = false) String userId,
                               @RequestParam(value="file", required = false) MultipartFile file,
                               @RequestParam(value="fileName") String filename
                               ) {
        try {
            boolean rsl = pictureService.uploadPic(userId, file, filename);
            return rsl? new NormalRes() : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param userId
     * @return
     */
    @GetMapping(value = "/get/all/proj")
    public Response getAllProj(@RequestParam(value="userId", required = false) String userId){
        try{
            return new NormalRes(pictureService.getAllProj(userId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param picFileId
     * @return
     */
    @GetMapping(value = "/get/one/proj")
    public Response getOneProj(
                               @RequestParam(value="picFileId", required = false) String picFileId){
        try{
            return new NormalRes(pictureService.getOneProj(picFileId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param picTag
     * @return
     */
    @GetMapping(value = "/get/pics")
    public Response getPicInfos(
                               @RequestParam(value="picTag", required = false) String picTag){
        try{
            return new NormalRes(pictureService.getAllPicAddr(picTag));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value = "/update/picinfo")
    public Response updateFileInfo(
            @RequestParam(value="picId", required = false) String picId,
            @RequestParam(value="picCategory", required = false) String picCategory,
            @RequestParam(value="picTag", required = false) String picTag){
        try {
            boolean rsl = pictureService.updatePicInfo(picId, picCategory, picTag);
            return rsl? new NormalRes() : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }

    }

}
