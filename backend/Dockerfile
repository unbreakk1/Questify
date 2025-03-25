FROM --platform=linux/amd64 openjdk:21
EXPOSE 8080
COPY backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]