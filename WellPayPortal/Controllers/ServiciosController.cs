using Microsoft.AspNetCore.Mvc;

namespace WellPayPortal.Controllers
{
    public class ServiciosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
