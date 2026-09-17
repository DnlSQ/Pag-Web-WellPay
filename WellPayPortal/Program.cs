var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configuración y servicio de correo (formularios de Afiliación y Postulación)
// La contraseña real (EmailSettings:SenderPassword) viene de "dotnet user-secrets"
// en desarrollo. En producción no se carga sola: hay que configurarla como
// variable de entorno del servidor (EmailSettings__SenderPassword). Ver README.md.
builder.Services.Configure<WellPayPortal.Models.EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<WellPayPortal.Services.IEmailService, WellPayPortal.Services.EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
