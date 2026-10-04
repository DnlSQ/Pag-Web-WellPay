# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder
WORKDIR /src
COPY ["WellPayPortal/WellPayPortal.csproj", "WellPayPortal/"]
RUN dotnet restore "WellPayPortal/WellPayPortal.csproj"
COPY . .
RUN dotnet publish -c Release -o /app/publish "WellPayPortal/WellPayPortal.csproj"

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=builder /app/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "WellPayPortal.dll"]
