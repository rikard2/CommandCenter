using Core.Models;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Http;
using DataCore;
using DataCore.DataTypes;
using DataCore.Models;
using DataCore.Helpers;
using Newtonsoft.Json;
namespace Core.Controllers
{
    public class StoredProcedureController : ApiController
    {
        /*
        [HttpPost]
        public ResultModel Search(string schema, string proc)
        {
            StoredProcedureResultModel result = new StoredProcedureResultModel();

            string storedProcedureName = string.Format("{0}_{1}_search", schema, proc);

            
            List<StoredProcedureParameter> parameters = StoredProcedureHelpers.GetParameters(storedProcedureName);
            StoredProcedure sp = new StoredProcedure(null, storedProcedureName, parameters);

            foreach (string key in HttpContext.Current.Request.Form.AllKeys)
            {
                object value = HttpContext.Current.Request.Form[key];
                sp.AddParameter(key, value);
            }

            var ret = sp.ExecuteDT();

            return new ResultModel
            {
                Success = ret.Success,
                ErrorMessage = ret.ErrorMessage,
                Result = ret.Result
            };
        }

        [HttpPost]
        public ResultModel Set(string schema)
        {
            StoredProcedureResultModel result = new StoredProcedureResultModel();

            string storedProcedureName = string.Format("API.{0}_set", schema);

            List<StoredProcedureParameter> parameters = StoredProcedureHelpers.GetParameters(string.Format("{0}_set", schema));
            StoredProcedure sp = new StoredProcedure(null, storedProcedureName, parameters);
            
            string postData = new System.IO.StreamReader(HttpContext.Current.Request.InputStream).ReadToEnd();
            Newtonsoft.Json.Linq.JObject obj = JsonConvert.DeserializeObject(postData) as Newtonsoft.Json.Linq.JObject;

            foreach (var o in obj)
            {
                string key = o.Key;
                if (key[0] == '_')
                    continue;

                object value = o.Value.ToString();
                sp.AddParameter(key, value);
            }

            var ret = sp.ExecuteDT();

            return new ResultModel
            {
                Success = ret.Success,
                ErrorMessage = ret.ErrorMessage,
                Result = ret.Result
            };
        }

        [HttpPost]
        public ResultModel Get(string schema)
        {
            StoredProcedureResultModel result = new StoredProcedureResultModel();

            string storedProcedureName = string.Format("API.{0}_get", schema);

            StoredProcedure sp = new StoredProcedure(null, storedProcedureName, null);
            List<StoredProcedureParameter> parameters = StoredProcedureHelpers.GetParameters(storedProcedureName);
            string postData = new System.IO.StreamReader(HttpContext.Current.Request.InputStream).ReadToEnd();
            Newtonsoft.Json.Linq.JObject obj = JsonConvert.DeserializeObject(postData) as Newtonsoft.Json.Linq.JObject;

            foreach (var o in obj)
            {
                string key = o.Key;
                object value = o.Value.ToString();
                sp.AddParameter(key, value);
            }

            var ret = sp.ExecuteDT();

            return new ResultModel
            {
                Success = ret.Success,
                ErrorMessage = ret.ErrorMessage,
                Result = ret.Result
            };
        }
         * */
    }
}