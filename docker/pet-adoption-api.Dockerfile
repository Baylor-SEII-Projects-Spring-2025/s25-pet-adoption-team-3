# Create a build of the project
FROM gradle:8.12.1-jdk23 AS build
WORKDIR /build
COPY . .

RUN ./gradlew build --no-daemon -p .

# Copy the build artifacts
FROM openjdk:23
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=dev


COPY --from=build /build/build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar

# Run the app
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar
