# 快速部署
## Java&Scala部分  
Java部分使用了**JDK1.8**（唯一支持版本），以及**Scala 2.11.***，JDK的安装请参照[官方教程](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)进行，并且这个部分的安装还依赖[Spark，Hadoop集群搭建](http://nekomiao.me/2016/12/05/spark-install-distributed/)以及[MongoDB的安装](http://www.runoob.com/mongodb/mongodb-tutorial.html)。
### 第一步：配置相关环境（以IDEA为例）
- 打开Idea Setting>Plugins，安装sbt,scala和lombok插件；

<div align=center>
<img src="./images/java/pic1.png" width=1000>
</div>

- 在Idea中打开工程，进入build.sbt文件，点击`Refresh Project`（这个步骤耗时较长）；

<div align=center>
<img src="./images/java/pic2.png" width=1000>
</div>

- 打开`/src/main/resources`，找到`application.properties`，对应如下文件：

<div align=center>
<img src="./images/java/pic5.png" width=1000>
</div>

其中需要配置的是
> `com.jtang.spark.serverAddr` - Spark集群的地址

> `com.jtang.server.address` - HDFS和MongoDB的地址

### 第二步：MongoDB中导入基础库
- 建立Collection，名为***cloudkits***(强制命名)，使用命令`use cloudkits`

<div align=center>
<img src="./images/java/pic7.png" width=1000>
</div>

- 找到`/db`文件夹，导入user和modelType文件，使用mongoimport命令，分别为：`mongoimport -d cloudkits -c user /path/to/your/db/user.csv `, `mongoimport -d cloudkits -c modelType /path/to/your/db/modelType.csv `；

<div align=center>
<img src="./images/java/pic8.png" width=1000>
</div>


### 第三步：运行tomcat
- 进入`/src/main`，找到Application.java，点击运行如下图；

<div align=center>
<img src="./images/java/pic3.png" width=1000>
</div>

运行成功后会显示如下Log：

<div align=center>
<img src="./images/java/pic4.png" width=1000>
</div>

- 测试`http://localhost:8080/api/login?username=ccnt&password=123`

## Python部分
Python部分使用的为Python3.6，其他版本Python不适配。
### 第一步：使用VirtualEnv安装运行环境
- 将项目Clone下来后，进入`/glaucus/python`文件夹中，安装virtualenv后，建立虚拟环境`venv`，注意此时使用**`-p /your/location/to/python3`**;

<div align=center>
<img src="./images/python/pic1.png" width=1000>
</div>

- 使用pip3安装所有依赖包，使用命令
`pip3 install flask keras numpy scipy scikit-learn deap update-checker tqdm tpot pandas pymongo
`；

<div align=center>
<img src="./images/python/pic2.png" width=1000>
</div>

- 此时还能选择keras的底层深度学习库，可以使用Tensorflow，Theano或是CNTK，此例使用Tensorflow；

<div align=center>
<img src="./images/python/pic4.png" width=1000>
</div>

- 如果服务器在本地，需要使用flask跨域，安装flask-cors

<div align=center>
<img src="./images/python/pic5.png" width=1000>
</div>

### 第二步：搭建项目（以PyCharm为例）
- 导入工程后，`"Control+，"或是“Command+，”`进入设置，配置Python编译器为`venv/bin`下的
的python3，如下图；

<div align=center>
<img src="./images/python/pic3.png" width=1000>
</div>

- 配置运行环境，点击“Edit Configuration”进入配置后，选择刚才配置好的Python编译器，并且选择`Script`为`/src/application.py`；

<div align=center>
<img src="./images/python/pic6.png" width=1000>
</div>

### 第三步 搭建Pyspark
目前版本的Pyspark还不支持pip install，在**2.2.0**中会支持pip install  

- 首先下载pyspark 2.1.1(适配python3.6的唯一版本)
- 在2.3步骤中的Environment Variables中添加如下参数, `PYTHONPATH: $SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.4-src.zip` 以及`SPARK_HOME: /your/pyspark/location`

<div align=center>
<img src="./images/python/pic9.png" width=1000>
</div>

- 再次进入settings界面（`"Control+，"或是“Command+，”`进入设置），找到`Project Structure`，点击Add Content Root，添加`$SPARK_HOME/python/lib`下面的所有`.zip`包，大功告成；

<div align=center>
<img src="./images/python/pic7.png" width=1000>
</div>

### 第四步：运行项目
- 直接在WebStorm中运行，访问`http://localhost:8088/`打印出***Hello, DL!***表示成功；

<div align=center>
<img src="./images/python/pic8.png" width=1000>
</div>


## Web部分
Web端使用的是ES6标准的Javascript，运行环境为Chrome浏览器，其他浏览器不作适配。
### 第一步：安装Node
- 下载最新版[Node](http://nodejs.cn/download/)；
- 双击下载的安装包 node-v8.1.2-x64.msi ，将出现如下界面，点击运行,下面的配置选择默认即可，最后安装完成；

<div align=center>
<img src="./images/web/pic1.png" width=300>
</div>

- 查看node和npm（node.js包含npm）的版本；

<div align=center>
<img src="./images/web/pic2.png" width=500>
</div>

### 第二步：搭建项目（以WebStorm为例）
- WebStrom关联node.js和npm: 打开WebStorm的设置（settings）界面，选择Node.js and NPM，输入node.js安装路径；

<div align=center>
<img src="./images/web/pic3.png" width=600>
</div>

- import `/web`文件夹所有内容，目录结构下图所示，找到`package.json`；

<div align=center>
<img src="./images/web/pic4.png" width=400>
</div>

- 打开WebStrom的Terminal（默认在左下角有），运行npm install，这样就会下载项目所需要的所有包（在package中规定）,这个步骤可能需要等待较长时间；

<div align=center>
<img src="./images/web/pic5.png" width=800>
</div>


### 第三步：运行项目  
- 运行项目：可以直接在Terminal输入npm run start运行；也可以配置一下：

<div align=center>
<img src="./images/web/pic6.png" width=600>
</div>

- 点击添加，选择npm，然后出现如下的配置界面，选择Scripts和node解释器即可，然后点击ok；
 
<div align=center>
<img src="./images/web/pic7.png" width=600>
</div>

- 这样我们就可以直接点击右上角的运行按钮进行运行，运行结果如下（访问localhost:3000/#/）：

<div align=center>
<img src="./images/web/pic8.png" width=1000>
</div>


