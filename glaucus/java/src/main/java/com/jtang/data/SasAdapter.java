package com.jtang.data;

import com.jtang.data.CsvAdapter;
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;


import com.opencsv.CSVWriter;

import com.epam.parso.SasFileProperties;
import com.epam.parso.SasFileReader;
import com.epam.parso.impl.SasFileReaderImpl;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Convert sas7bdat to csv
 * Created by lucas on 2016/10/10.
 */
@Slf4j
@Component
class SasAdapter {

    private final CsvAdapter csvAdapterLocal;

    @Autowired
    public SasAdapter(CsvAdapter csvAdapter) {
        this.csvAdapterLocal = csvAdapter;
    }

    String Sas2Parquet(String inFile, String outFile, String userId) throws Exception {
        try {
            String tmpPath = inFile.split("\\.")[0] + ".csv";
            Sas2Csv(inFile, tmpPath);
            return csvAdapterLocal.Csv2Parquet(tmpPath, outFile, userId);
        } catch (ArrayIndexOutOfBoundsException e) {
            e.printStackTrace();
            log.error("Filename illegal.");
            throw e;
        }
    }

    private void Sas2Csv(String inFile, String outFile) throws Exception {
        if (new File(outFile).exists()) {
            //If the file already exist
            log.info(outFile + " already exist.");
            return ;
        }
        try {
            FileInputStream fin = new FileInputStream(inFile);
            FileOutputStream fout = new FileOutputStream(outFile);
            Sas2Csv(fin, fout);
            //delete the exisiting sas file
            Files.deleteIfExists(Paths.get(inFile));
            fin.close();
            fout.close();
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Exception");
            throw e;
        }
    }

    private void Sas2Csv(InputStream in, OutputStream out) throws IOException {
        Date start = new Date();
        SasFileReader reader = new SasFileReaderImpl(in);
        CSVWriter writer = new CSVWriter(new OutputStreamWriter(out));
        Object[] data;
        SasFileProperties properties = reader.getSasFileProperties();
        log.info("Reading file " + properties.getName());
        log.info(properties.getRowCount() + " rows.");
        val columns = reader.getColumns();
        String[] outData = new String[columns.size()];
        // Writing column labels
        /*for(int i=0; i < columns.size(); i++) {
            outData[i] = columns.get(i).getLabel();
        }
        writer.writeNext(outData);*/
        // Writing column names
        for(int i=0; i < columns.size(); i++) {
            outData[i] = columns.get(i).getName();
        }
        writer.writeNext(outData);
        // Writing column format
        /*for(int i=0; i < columns.size(); i++) {
            outData[i] = columns.get(i).getFormat();
        }
        writer.writeNext(outData);*/

        try {
            log.info("Writing data...");
            long rowCount = 0;
            while((data = reader.readNext()) != null) {
                assert(columns.size() == data.length);
                for(int i=0; i < data.length; i++) {
                    outData[i] = data[i] == null ? "" : data[i].toString();
                }
                writer.writeNext(outData);
                rowCount++;
            }
            log.info("Done writing data.");
            log.info(rowCount + " rows written.");
            writer.flush();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
        Date end = new Date();
        log.info("Converting took {} seconds.", (end.getTime() - start.getTime())/1000);
    }
}
