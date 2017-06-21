# Glaucus

<div align=center>
<img src="./images/logo.png" width="180" height="180"/>
</div>

## Glaucus是什么
**Glaucus**是一个 *基于数据流* 的机器学习套件，结合了**自动化机器学习管道**，对繁杂机器学习**算法的简化流程**以及优秀**分布式处理引擎**的应用，面向跨领域的**非数据科学专业人士**，使得在最简化机器学习前沿成果的同时却能享受强大的功能。  

我们的平台集成了众多优秀的数据引擎包括**Spark**，**Tensorflow**，**Scikit-learn**，并且在这之上建立了设计了一套简单易用的流程，用户只需上传数据，进行简单配置，选择算法，自动或手动调参就可以进行训练，对训练后的模型，平台也提供丰富的评估指标，让非专业人士能够最大程度上发挥机器学习的作用，整个平台功能结构如下图所示，其主要功能点在于：  

<div align=center>
<img src="./images/funcs.png"/>
</div>

- 接收**多源数据集**，包括结构化，文档数据和图像数据；
- 提供丰富的**数理统计函数**，图形化界面能让用户轻松掌握数据情况；
- 在自动模式下，从预处理到特征工程再到机器学习算法实现**全管道自动化**；
- 在手动模式下，大幅度**简化机器学习管道流程**，提供包括自动化数据清洗，半自动化特征选择以及深度学习套件；

## Glaucus的技术架构
系统采用了MVC框架，大致分为React前端，Spring Boot+Flask业务层以及Spark+Scikitlearn+Keras数据引擎层，具体为下图架构图所示，系统共分为4个部分：
  
<div align=center>
<img src="./images/arch.png"/>
</div>
  
- 前端使用了**React+Redux**的框架，设计部分使用了Ant Design，图表部分使用了Ant Design。
- 业务层主要使用了**Spring Boot(Java)和Flask(Python)**做为RESTful接口的提供。
- 数据处理框架部分主要以分布式框架**Spark**为基础，向上扩展了以HDFS和MongoDB做为数据持久层的存储模式，向下扩展了以Docker和Linux虚拟机为基础的运行环境，并且进行了Shuffle算子等的优化，分布式服务器部分主要是展示了Spark，Hadoop和MongoDB的部署情况。
- 数据引擎部分主要使用了分布式机器学习库**Spark ML和Tensorflow为基础的Keras框架**，自动化机器学习主要使用了基于SMAC**贝叶斯优化器管道调优**auto-sklearn以及基于Deap**遗传算法超参调优**TPOT。

## 搭建Glaucus
Pull我们的工程，进入`/glaucus`，分别有`/java`, `/python`, `/web`三个文件夹，依照[QuckStart.md](https://github.com/ccnt-glaucus/glaucus/blob/master/QuickStart.md)的步骤进行部署，就可以成功运行我们的项目。

## 使用Glaucus
下面以两个例子演示手动模式和自动模式下，Glaucus平台的使用情况。
> 待续...

