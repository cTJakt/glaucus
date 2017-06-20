package com.jtang;

import com.jtang.analysis.FileAnalysis;
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

    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);

    }

    @Override
    public void run(String... args) throws Exception {

        //System.out.println("asdasda"+configService.getAllConfigs("582468b2f995e5ce9ed99007"));
//        configService.deleteConfigById("584a61c303c1c339abe7b013");
        //csvAdapter.Csv2Parquet("G:\\菜鸟分类\\菜鸟分仓第一赛季数据\\CAINIAO data p1_20160408\\config3.csv","111","2333");
        //modelService.trainTheModel("584522fe03c1c3e43f4f878c");
        //fileAnalysis.fileAnalysis("584fa45003c1c3808a198faa",0.01);
        //fileAnalysis.fileAnalysis("111");
        //modelService.trainTheModel("58d3ad02e081aa176c435abd");
        /*val dtModel = dtClassification.dtTraining("123",5,(float)0.5);
        val dtResult = dtClassification.dtResult(dtModel);
        System.out.println(dtResult);
        val rfModel = gdbtClassification.dtTraining("123",5,(float)0.5);
        val rfRes = gdbtClassification.dtResult(rfModel);
        System.out.println(rfRes);*/
        /*
        * private boolean isDiscrete;  //是否为离散值
    private String defaultValue; //参数的默认值
    private String type;         //模型参数取值为Float|Int|...
    private String[] valueDes;   //取值范围或者离散值则为取值量
    private String description;  //对取值或者参数的说明
        *
        * */
        /*ModelArgument argument1 = new ModelArgument(false, "128", "Int",
                new String[]{"64", "1024"}, "梯度下降算法中寻求最优解的mini-batch的大小");
        ModelArgument argument2 = new ModelArgument(false, "10", "Int",
                new String[]{"0", "100"}, "总共分类的类别数");
        ModelArgument argument3 = new ModelArgument(false, "6", "Int",
                new String[]{"1", "20"}, "数据轮回次数");
        HashMap<String, ModelArgument> arg1 = new HashMap<>();
        arg1.put("batchSize", argument1);
        arg1.put("classes", argument2);
        arg1.put("epochs", argument3);
        ModelType modelType = new ModelType("dl", "CNN", arg1,
                "卷积神经网络（Convolutional Neural Network,CNN）是一种前馈神经网络，它的人工神经元可以响应一部分覆盖范围内的周围单元，对于大型图像处理有出色表现。",
                "深度学习的概念源于人工神经网络的研究。含多隐层的多层感知器就是一种深度学习结构。深度学习通过组合低层特征形成更加抽象的高层表示属性类别或特征，以发现数据的分布式特征表示。");
        ModelType modelType1 = new ModelType("dl", "hRNN", arg1,
                "多层反馈RNN（Recurrent neural Network、循环神经网络）神经网络是一种节点定向连接成环的人工神经网络。这种网络的内部状态可以展示动态时序行为。",
                "深度学习的概念源于人工神经网络的研究。含多隐层的多层感知器就是一种深度学习结构。深度学习通过组合低层特征形成更加抽象的高层表示属性类别或特征，以发现数据的分布式特征表示。");

        modelTypeDao.save(modelType);
        modelTypeDao.save(modelType1);
        ModelType modelType2 = new ModelType("dl", "MLP", arg1,
                "MLP，多层感知器 (Multi-layer Perceptron，MLP)是一种前向结构的人工神经网络，映射一组输入向量到一组输出向量。",
                "深度学习的概念源于人工神经网络的研究。含多隐层的多层感知器就是一种深度学习结构。深度学习通过组合低层特征形成更加抽象的高层表示属性类别或特征，以发现数据的分布式特征表示。");
        modelTypeDao.save(modelType2);*/
    }
}