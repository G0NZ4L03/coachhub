# Compilamos el proyecto con Maven y Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Imagen solo con el JAR ya compilado
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

//Esperamos 10s a que MySQL este listo antes de iniciar Spring Boot
ENTRYPOINT ["sh", "-c", "sleep 10 && java -jar app.jar"]
