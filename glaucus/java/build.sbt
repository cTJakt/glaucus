name := "cloudkits"

version := "1.0"

assemblyOption in assembly := (assemblyOption in assembly).value.copy(includeScala = false)

scalaVersion := "2.11.8"

resolvers += "Cloudera Repository" at "https://repository.cloudera.com/artifactory/cloudera-repos/"

enablePlugins(TomcatPlugin)
enablePlugins(WebappPlugin)
containerMain := "webapp.runner.launch.Main"


webappWebInfClasses := true

libraryDependencies ++= Seq(
  "com.fasterxml.jackson.module" % "jackson-module-paranamer" % "2.8.3",
  "com.fasterxml.jackson.module" % "jackson-module-scala_2.11" % "2.8.3"
)
libraryDependencies ++= Seq(

  /* Spark Series */
  "org.apache.spark" %% "spark-core" % "2.1.0",
  "org.apache.spark" %% "spark-sql" % "2.1.0",
  "org.apache.spark" %% "spark-mllib" % "2.1.0",
  /* Spring Boot Frameworks */

  "org.projectlombok" % "lombok" % "1.16.10",
  "org.springframework.boot" % "spring-boot" % "1.4.1.RELEASE",
  "org.springframework.boot" % "spring-boot-starter-web" % "1.4.1.RELEASE",
  "org.springframework.boot" % "spring-boot-starter-data-mongodb" % "1.4.1.RELEASE",
  "org.springframework.boot" % "spring-boot-starter-thymeleaf" % "1.2.1.RELEASE",
  "org.springframework.boot" % "spring-boot-maven-plugin" % "1.4.1.RELEASE" % "provided",
  /* Parso and OpenCsv */
  "com.epam" % "parso" % "2.0",
  "com.opencsv" % "opencsv" % "3.7"
).map(_.exclude("org.slf4j","slf4j-log4j12")).map(_.exclude("com.fasterxml.jackson.module", "jackson-module-scala_2.11"))