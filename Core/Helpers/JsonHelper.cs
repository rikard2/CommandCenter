using DataCore.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Core.Helpers
{
    public static class JsonHelper
    {
        public static Dictionary<string, string> ObjectFromJsonRequest()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();

            string postData = new System.IO.StreamReader(HttpContext.Current.Request.InputStream).ReadToEnd();

            if (string.IsNullOrEmpty(postData))
            {
                return new Dictionary<string, string>();
            }

            Newtonsoft.Json.Linq.JObject obj = JsonConvert.DeserializeObject(postData) as Newtonsoft.Json.Linq.JObject;

            foreach (var o in obj)
            {
                result.Add(o.Key, o.Value.ToString());
            }

            return result;
        }

        public static bool GetJsonRequestValueBool(string name)
        {
            var x = GetJsonRequestValue(name);

            if (x == null)
                return false;

            return bool.Parse(x);
        }

        public static string GetJsonRequestValue(string name)
        {
            Dictionary<string, string> json = ObjectFromJsonRequest();
            if (json.ContainsKey(name))
            {
                return json[name];
            }

            return null;
        }

        public static List<ProcArg> GetArgsFromJsonRequest()
        {
            List<ProcArg> args = new List<ProcArg>();
            var json = ObjectFromJsonRequest();
            foreach (string key in json.Keys)
            {
                object val = json[key];

                if (key.Substring(0, 1) == "_")
                    continue;

                if (val.ToString().Trim().Length == 0)
                    val = null;

                args.Add(new ProcArg
                {
                    Name = key,
                    Value = val
                });
            }

            return args;
        }
    }
}