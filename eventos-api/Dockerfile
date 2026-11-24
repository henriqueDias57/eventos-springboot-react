# ============================================================================
# DOCKERFILE MULTI-STAGE - EVENTOS API (SPRING BOOT 3 + JAVA 17)
# ============================================================================

# Estágio 1: Build da aplicação com Maven + JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Imagem final enxuta com JRE 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/eventos-api-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
