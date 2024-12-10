FROM openjdk:18-jdk-slim
copy ./target/ApiGateway-0.0.1-SNAPSHOT.jar ApiGateway.jar
EXPOSE 8080
CMD ["java","-jar","ApiGateway.jar"]