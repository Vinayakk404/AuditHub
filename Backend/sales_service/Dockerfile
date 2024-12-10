FROM openjdk:18-jdk-slim
copy ./target/salesService-0.0.1-SNAPSHOT.jar salesService.jar
EXPOSE 8084
CMD ["java","-jar","salesService.jar"]
