using Microsoft.AspNetCore.Mvc;

namespace WellPayPortal.Controllers
{
    public class NosotrosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
