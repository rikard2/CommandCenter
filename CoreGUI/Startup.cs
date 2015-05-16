using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CoreGUI.Startup))]
namespace CoreGUI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
