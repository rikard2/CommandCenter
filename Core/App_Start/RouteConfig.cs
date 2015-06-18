using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Core
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "WebAPI",
                url: "service/{action}/{id}",
                defaults: new { controller = "service", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapPageRoute("Default", "{*anything}", "~/index.html");
        }
    }
}
