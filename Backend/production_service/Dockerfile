FROM openjdk:18-jdk-slim
copy ./target/productionService-0.0.1-SNAPSHOT.jar productionService.jar
EXPOSE 8081
CMD ["java","-jar","productionService.jar"]
