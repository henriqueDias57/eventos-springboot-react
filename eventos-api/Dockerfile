# ============================================================================
# DOCKERFILE - EVENTOS API (SPRING BOOT 3 + JAVA 17)
# Multi-stage build otimizado para deploy em nuvem
# ============================================================================

# Estágio 1: Build da aplicação
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Imagem final leve para execução
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/eventos-api-1.0.0.jar app.jar

# Variáveis padrão
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
