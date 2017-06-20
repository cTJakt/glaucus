package com.jtang.controller;


import com.jtang.controller.response.ErrorRes;
import com.jtang.controller.response.NormalRes;
import com.jtang.controller.response.Response;
import com.jtang.entity.DLModel;
import com.jtang.entity.Model;
import com.jtang.services.FileService;
import com.jtang.services.ModelService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Model-related controller
 * Created by twenbo on 2016/11/21.
 */
@Slf4j
@RestController
@RequestMapping("/api/model")
public class ModelController {

    @Autowired
    private ModelService modelService;
    @Autowired
    private FileService fileService;


    /**
     *
     * @param model
     * @return
     */
    @PostMapping(value = "/add")
    public Response addModel(@RequestBody Model model){
        try {
            String rsl = modelService.addModel(model);
            return rsl != null? new NormalRes(rsl) : new ErrorRes(40002, "Server error.");
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
    @GetMapping(value = "/get/all")
    public Response getAllModel(@RequestParam(value="userId", required = false) String userId) {
        try{
            return new NormalRes(modelService.getAllModelByUserId(userId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param userId
     * @return
     */
    @GetMapping(value = "/get/all/dl")
    public Response getAllDLModel(@RequestParam(value="userId", required = false) String userId) {
        try{
            return new NormalRes(modelService.getAllGeneralModelByUserId(userId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value = "/get/detail/dl")
    public Response getDLDetailModel(@RequestParam(value="modelId", required = false) String modelId) {
        try{
            return new NormalRes(modelService.getDLModelDetailById(modelId));
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    /**
     *
     * @param model
     * @return
     */
    @PostMapping(value = "/add/dl")
    public Response addDLModel(@RequestBody DLModel model){
        try {
            String rsl = modelService.addDlModel(model);
            return rsl != null? new NormalRes(rsl) : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }


    /**
     *
     * @param modelId
     * @param modelName
     * @param modelTypeId
     * @return
     */
    @GetMapping(value = "/change")
    public Response changeModel(@RequestParam(value="modelId", required = false) String modelId,
                                 @RequestParam(value="modelName") String modelName,
                                 @RequestParam(value="modelTypeId") String modelTypeId) {
        try{
            boolean rsl = modelService.changeModel(modelId, modelName, modelTypeId);
            return rsl? new NormalRes() : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value = "/get/models")
    public Response getModelType(@RequestParam(value="modelTypeName", required = false) String modelTypeName) {
        try {
            return new NormalRes(modelService.getModelTypeByModelTypeName(modelTypeName));
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value="/train")
    public Response trainModel(@RequestParam(value="modelId", required = false) String modelId) {
        try {
            return new NormalRes(modelService.trainTheModel(modelId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @GetMapping(value="/delete")
    public Response deleteModelByModelId(@RequestParam(value="modelId", required = false) String modelId){
        try {
            return new NormalRes(modelService.deleteModel(modelId));
        }catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }

    @PostMapping(value="/use/upload")
    public Response uploadTestFile(@RequestParam(value="userId", required = false) String userId,
                                   @RequestParam(value="file", required = false) MultipartFile file,
                                   @RequestParam(value="fileName") String filename) {
        try {
            val rsl = fileService.uploadTestFile(userId, file, filename);
            return rsl != null ? new NormalRes(rsl) : new ErrorRes(40002, "Server error.");
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }
    @GetMapping(value="/use")
    public Response useModel(@RequestParam(value = "fileId", required = false) String fileId,
                             @RequestParam(value = "modelId", required = false) String modelId) {
        try {
                return new NormalRes(modelService.useModel(fileId, modelId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ErrorRes();
        }
    }


}
