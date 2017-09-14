package com.jtang;

import com.jtang.analysis.FileAnalysis;
import com.jtang.config.JwtFilter;
import com.jtang.dao.ModelDao;
import com.jtang.dao.ModelTypeDao;
import com.jtang.dao.UserDao;
import com.jtang.data.CsvAdapter;
import com.jtang.data.LibsvmAdapter;
import com.jtang.model.classification.DTClassification;
import com.jtang.model.classification.GDBTClassification;
import com.jtang.model.classification.RFClassification;
import com.jtang.services.ConfigService;
import com.jtang.services.LoginService;
import com.jtang.services.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class Application implements CommandLineRunner {

    private final UserDao dao;
    private final CsvAdapter csvAdapter;
    private final LibsvmAdapter libsvmAdapter;

    @Autowired
    private LoginService loginService;
    @Autowired private ConfigService configService;
    @Autowired private ModelService modelService;
    @Autowired private ModelTypeDao modelTypeDao;
    @Autowired private ModelDao modelDao;
    @Autowired private FileAnalysis fileAnalysis;
    @Autowired
    private DTClassification dtClassification;
    @Autowired
    private RFClassification rfClassification;
    @Autowired
    private GDBTClassification gdbtClassification;
    public Application(UserDao repository, CsvAdapter csvAdapter, LibsvmAdapter libsvmAdapter) {
        this.dao = repository;
        this.csvAdapter = csvAdapter;
        this.libsvmAdapter = libsvmAdapter;
    }
    @Bean
    public FilterRegistrationBean jwtFilter(){      //改变默认的url拦截器，对api开头的api进行过滤，查看是否有合法token
        final FilterRegistrationBean registrationBean=new FilterRegistrationBean();
        registrationBean.setFilter(new JwtFilter());
        registrationBean.addUrlPatterns("/api/*");

        return registrationBean;
    }
    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);

    }

    @Override
    public void run(String... args) throws Exception {

    }
}