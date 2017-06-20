package com.jtang.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

/**
 * Created by twb on 2017/6/6.
 */
@Data
public class PicCategory {

    @Id
    private String id;

    private String picFileId;

    private String categoryName;

    public PicCategory(String categoryName, String picFileId) {
        this.picFileId = picFileId;
        this.categoryName = categoryName;

    }

}
