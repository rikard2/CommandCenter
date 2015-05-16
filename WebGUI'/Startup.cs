using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebGUI_.Startup))]
namespace WebGUI_
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
