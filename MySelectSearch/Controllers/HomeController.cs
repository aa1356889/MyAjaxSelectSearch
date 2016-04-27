using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MySelectSearch.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        List<Users> Datas = new List<Users>();

        public HomeController() {
            string[] names = new[] { "张三", "李强", "大李强", "周杰伦" };
            Random rd = new Random();
            for(int i=0;i<50;i++){
            Datas.Add(new Users() {Id=i.ToString(),Name=names[rd.Next(0,4)]+i });
            }
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetDatas(string keword, int start, int end)
        {
            List<Users> users = null;
            List<Users> datas = new List<Users>();
            if (!string.IsNullOrEmpty(keword))
            {
                users = Datas.Where(c => c.Name.IndexOf(keword) !=-1).ToList<Users>();
            }
            else
            {
                users = Datas;
            }
            if (end > users.Count)
            {
                end = users.Count;
            }
            for (int i = start; i < end; i++)
            {
                datas.Add(users[i]);
            }
            var list=datas.Select(c=>new{Text=c.Name,RecordId=c.Id});
            return Json(new { Data = list });
        }

        

    }
}
