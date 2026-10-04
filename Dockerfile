# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY WellPayPortal/*.csproj ./WellPayPortal/
RUN dotnet restore

# copy everything else and build app
COPY WellPayPortal/. ./WellPayPortal/
WORKDIR /source/WellPayPortal
RUN dotnet publish -c Release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
ENV ASPNETCORE_URLS=http://+:${PORT:-5000}
EXPOSE 5000
ENTRYPOINT ["dotnet", "WellPayPortal.dll"]
