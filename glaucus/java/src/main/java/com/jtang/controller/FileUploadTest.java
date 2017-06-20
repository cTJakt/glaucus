package com.jtang.controller;

import com.jtang.controller.response.ErrorRes;
import com.jtang.controller.response.NormalRes;
import com.jtang.controller.response.Response;
import com.jtang.services.PictureService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * File uploader and transfer and so on API
 */
@Slf4j
@Controller
public class FileUploadTest {

    @Autowired private PictureService pictureService;


    /**
     *
     * @param
     * @return fileId
     */
    //访问路径为：http://127.0.0.1:8080/file
    @RequestMapping("/indexx")
    public String file() throws Exception{

        return"/indexx";
    }


    @RequestMapping(value = "/upload")
    @ResponseBody
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

}
