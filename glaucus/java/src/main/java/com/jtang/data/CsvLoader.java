package com.jtang.data;

import com.jtang.data.CsvAdapter;
import com.jtang.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Provide external API to load csv
 * Created by lucas on 2016/10/10.
 */
@Component
public class CsvLoader {

    private final CsvAdapter csvAdapter;

    @Autowired
    public CsvLoader(CsvAdapter csvAdapter) {
        this.csvAdapter = csvAdapter;
    }

    public String loadCsv(String filepath, String userId) throws Exception {
        try {
            String fileName = FileHelper.getFileName(filepath);
            if (fileName != null) return csvAdapter.Csv2Parquet(filepath, fileName, userId);
            else throw new NullPointerException();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
