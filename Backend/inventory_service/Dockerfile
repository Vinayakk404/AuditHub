FROM openjdk:18-jdk-slim
copy ./target/inventoryService-0.0.1-SNAPSHOT.jar inventoryService.jar
EXPOSE 8083
CMD ["java","-jar","inventoryService.jar"]
