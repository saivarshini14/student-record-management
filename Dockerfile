# ==========================================
# Stage 1: Build the React.js Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the Java Spring Boot Backend
# ==========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend

# Cache dependencies
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy backend source
COPY backend/src ./src

# Copy built frontend assets into Spring Boot's static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Package application (skip test during container build for faster deploy)
RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 3: Minimal Production Runtime
# ==========================================
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Create a non-privileged system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create directory for persistent H2 database storage
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

USER appuser

# Copy executable jar from backend-builder
COPY --from=backend-builder /app/backend/target/student-record-management-*.jar ./app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

# Run JVM with memory limits suitable for containers
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
