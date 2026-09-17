# WellPayPortal

Portal web informativo/afiliación de Well-Pay (ASP.NET Core 8 MVC).

## Envío de correo (formularios de Afiliación y Postulación)

Los formularios de **"Solicitar afiliación"** y **"Postulación"** envían un correo real
usando MailKit vía SMTP (Gmail). La configuración vive en `EmailSettings`
(`appsettings.json` + `dotnet user-secrets`).

> ⚠️ **Estado actual: funciona únicamente en `localhost` (entorno de desarrollo).**
>
> ASP.NET Core solo carga los `user-secrets` cuando el entorno es `Development`
> (que es como corre por defecto con `dotnet run` / `dotnet watch run` en cada
> máquina de desarrollo). **En un servidor de producción real, esta función NO
> enviará correos hasta que se configuren las credenciales ahí** (ver más abajo).
> No hay ningún .csproj ni configuración pendiente para esto — es el
> comportamiento esperado de `user-secrets`, documentado acá para que no genere
> confusión el día que se publique el sitio.

### Configurar el envío en tu máquina (desarrollo)

Parado en `WellPayPortal/WellPayPortal` (donde está el `.csproj`):

```powershell
dotnet user-secrets init   # opcional si el .csproj ya trae <UserSecretsId>
dotnet user-secrets set "EmailSettings:SenderEmail" "tu-correo@gmail.com"
dotnet user-secrets set "EmailSettings:SenderPassword" "tu-contraseña-de-aplicación-de-16-caracteres"
```

- La contraseña debe ser una **"Contraseña de aplicación"** de Google (16 caracteres),
  no la contraseña normal de la cuenta. Se genera en
  `myaccount.google.com/apppasswords`, después de activar la verificación en 2 pasos.
- Pegarla **sin espacios** (Google la muestra en 4 grupos de 4 solo para que se lea
  más fácil, pero no son parte del valor real).
- Cada persona que clone el repo necesita correr estos comandos con **sus propias
  credenciales** — los `user-secrets` no se comparten vía Git, viven en el perfil
  de Windows/usuario de cada máquina.

Los correos de destino (`AfiliacionDestino` / `PostulacionDestino`) sí están en
`appsettings.json` porque no son sensibles — cámbialos ahí directamente cuando se
tengan los correos definitivos de la empresa.

### Cuando se pase a producción

Los `user-secrets` **no aplican** fuera de desarrollo. Hay que configurar las
mismas claves como variables de entorno en el hosting real (Azure App Service,
IIS, VPS, etc.), usando doble guion bajo en vez de dos puntos:

```
EmailSettings__SenderEmail
EmailSettings__SenderPassword
```

Sin esto, el servidor de producción intentará enviar con la contraseña vacía de
`appsettings.json` y el envío fallará (Gmail responde `535 5.7.8 Username and
Password not accepted`).
