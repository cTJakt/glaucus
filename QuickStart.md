# Quick Deployment
## The Part of Java & Scala  
In the Java, we use**JDK1.8** and **Scala 2.11.***. The installation of JDK can refer to [Official Tutorials](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), and it is related to [Spark，Hadoop cluster installation](http://nekomiao.me/2016/12/05/spark-install-distributed/) and [MongoDB installation](http://www.runoob.com/mongodb/mongodb-tutorial.html)。
### Step 1：Configuration of Related Environment（Example of IDEA）
- Open Idea Setting>Plugins, install sbt,scala and lombok plugins;

<div align=center>
<img src="./images/java/pic1.png" width=1000>
</div>

-  Open the project in Idea, enter the build.sbt file, and click `Refresh Project`(this step takes a long time);

<div align=center>
<img src="./images/java/pic2.png" width=1000>
</div>

- Open `/src/main/resources` and find `application.properties`, which is the following document;

<div align=center>
<img src="./images/java/pic5.png" width=1000>
</div>

Configure the following fields:
> `com.jtang.spark.serverAddr` - The address of Spark cluster

> `com.jtang.server.address` - The address of HDFS andMongoDB.

### Step 2: Import Base Library to the MongoDB
- Create Collection, the name is***cloudkits***(mandatory named), use the command`use cloudkits`;

<div align=center>
<img src="./images/java/pic7.png" width=1000>
</div>

- Find `/db`folder，import user and modelType files, use mongoimport commmand: `mongoimport -d cloudkits -c user /path/to/your/db/user.csv `, `mongoimport -d cloudkits -c modelType /path/to/your/db/modelType.csv `.

<div align=center>
<img src="./images/java/pic8.png" width=1000>
</div>


### Step 3: Start tomcat
- Enter `/src/main` , find Application.java, and click to run as following figure;

<div align=center>
<img src="./images/java/pic3.png" width=1000>
</div>

it will show the following log informantion after success:

<div align=center>
<img src="./images/java/pic4.png" width=1000>
</div>

- Test `http://localhost:8080/api/login?username=ccnt&password=123`.

## Python Part
In the Python part, we use the version of Python3.6, and the other versions of Python are not compatible.
### Step 1: Use VirtualEnv to Install the Runtime Enviroment
- After clone the project, enter`/glaucus/python` folder. After install the virtualenv, create virtual environment`venv`. (Attention: we use **`-p /your/location/to/python3`** here);

<div align=center>
<img src="./images/python/pic1.png" width=1000>
</div>

- Use pip3 to install all of the dependency packages, use the command: 
`pip3 install flask keras numpy scipy scikit-learn deap update-checker tqdm tpot pandas pymongo
`;

<div align=center>
<img src="./images/python/pic2.png" width=1000>
</div>

- There are three choices of the deep learning library in keras: Tensorflow, Theano and CNTK, we use Tensorflow in our project;

<div align=center>
<img src="./images/python/pic4.png" width=1000>
</div>

- If the server is not local, it needs the flask to cross domain, install flask-cors.

<div align=center>
<img src="./images/python/pic5.png" width=1000>
</div>

### Step 2: Set up the Project（PyCharm as a example）
- After import the project, `"Control+," or “Command+,”`, enter the configuration, and configure the Python compiler as the python3 in `venv/bin`;

<div align=center>
<img src="./images/python/pic3.png" width=1000>
</div>

- Configre the runtime enviroment, click “Edit Configuration”, choose the Python compiler, and set the `Script` as `/src/application.py`.

<div align=center>
<img src="./images/python/pic6.png" width=1000>
</div>

### Step 3: Build Pyspark
The current Pyspark version can't support pip install, and it will be supported in the **2.2.0** version.  

- Download pyspark 2.1.1(The only compatible version with python3.6);
- Add the following parameters to the Environment Variables in step 2.3: `PYTHONPATH: $SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.4-src.zip` and `SPARK_HOME: /your/pyspark/location`;

<div align=center>
<img src="./images/python/pic9.png" width=1000>
</div>

- Reenter the settings page（`"Control+," or “Command+,”`）, find `Project Structure`, click Add Content Root, add all the `.zip` packages in `$SPARK_HOME/python/lib`.

<div align=center>
<img src="./images/python/pic7.png" width=1000>
</div>

### Step 4: Start the Project
- We start it in WebStorm, visit`http://localhost:8088/`, it succeeds if shows ***Hello, DL!***.

<div align=center>
<img src="./images/python/pic8.png" width=1000>
</div>


## Web Part
We use ES6 standard Javascript in the Web side, the runtime environment is Chrome.
### Step 1: Install Node
- Download the latest [Node](http://nodejs.cn/download/);
- Double click the installation packege node-v8.1.2-x64.msi, the following interface will appear. The following configuration will be selected by default, and finally the installation will be completed;

<div align=center>
<img src="./images/web/pic1.png" width=300>
</div>

- Check the version of node and npm（node.js includes npm).

<div align=center>
<img src="./images/web/pic2.png" width=500>
</div>

### Step 2: Create the Project（WebStorm as the example）
- WebStrom is associated with node.js and npm: Open the settings page of WebStorm, choose Node.js and NPM, enter the installation path of node.js;

<div align=center>
<img src="./images/web/pic3.png" width=600>
</div>

- import all the contents in `/web` floder, the directory structure is showed in the following figure, find `package.json`;

<div align=center>
<img src="./images/web/pic4.png" width=400>
</div>

- Open the Terminal of WebStrom, run the command of "npm install", this will download all the packages required for the project (as specified in the package), which may require a long wait.

<div align=center>
<img src="./images/web/pic5.png" width=800>
</div>


### Step 3: Start the Project
- Start the project: We can use the "npm run start" command to start, or configure the Run/Debug Configurations;

<div align=center>
<img src="./images/web/pic6.png" width=600>
</div>

- Click add, select NPM, and then have the following configuration interface, select Scripts and node interpreter, and then click ok;
 
<div align=center>
<img src="./images/web/pic7.png" width=600>
</div>

- In this way, we can directly click the running button in the upper right corner and run the results as follows (visit localhost:3000/# /) .

<div align=center>
<img src="./images/web/pic8.png" width=1000>
</div>


