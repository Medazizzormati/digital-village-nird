# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from build stage (Spring Boot creates a JAR with the artifact name)
COPY --from=build /app/target/digital-village-api-1.0.0.jar app.jar

# Expose port (Render will set PORT env variable)
EXPOSE 10000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

