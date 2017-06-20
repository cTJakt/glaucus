package com.jtang.entity.inner;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * Created by lucas on 2016/12/8.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelArgument {
    private boolean isDiscrete;
    private String defaultValue;
    private String type;
    private String[] valueDes;
    private String description;
}
