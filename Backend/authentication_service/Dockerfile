FROM openjdk:18-jdk-slim
copy ./target/AuthenticationService-0.0.1-SNAPSHOT.jar AuthenticationService.jar
EXPOSE 9898
CMD ["java","-jar","AuthenticationService.jar"]