@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MVN_CMD=mvn") ELSE (SET "MVN_CMD=%__MVNW_ARG0_NAME__%")
@SET MAVEN_WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar
@SET MAVEN_WRAPPER_PROPERTIES=%~dp0.mvn\wrapper\maven-wrapper.properties
@SET MVNW_VERBOSE=false
@IF "%MVNW_VERBOSE%"=="true" (
  @ECHO JAVA_HOME=%JAVA_HOME%
  @ECHO MAVEN_WRAPPER_JAR=%MAVEN_WRAPPER_JAR%
  @ECHO MAVEN_WRAPPER_PROPERTIES=%MAVEN_WRAPPER_PROPERTIES%
)
@java -Dmaven.multiModuleProjectDirectory="%~dp0" -cp "%MAVEN_WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
