# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["VehicleCatalogService.csproj", "./"]
RUN dotnet restore

# Copy the rest of the code and build
COPY . .
RUN dotnet publish -c Release -o /app

# 2. Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Port 8080 is the default for .NET 8
EXPOSE 8080

ENTRYPOINT ["dotnet", "VehicleCatalogService.dll"]
