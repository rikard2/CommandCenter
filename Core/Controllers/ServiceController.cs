using System.Linq;
using System.Web;
using System.Web.Http;
using DataCore;
using DataCore.DataTypes;
using DataCore.Models;
using DataCore.Helpers;
using Newtonsoft.Json;
using Core.Models;
using System.Collections.Generic;
using System;
using Core.Helpers;


namespace Core.Controllers
{
    public class ServiceController : ApiController
    {
        [HttpPost]
        public GetResultModel Get(string entity)
        {
            var apiProc = new APIProc(string.Format("{0}_Get", entity), JsonHelper.GetArgsFromJsonRequest());

            APIProcResult apiProcResult = apiProc.ExecuteDT();
            
            if (apiProcResult.ResultSets.Count != 1)
            {
                throw new Exception("Too many resultsets!");
            }

            if (apiProcResult.ResultSets[0].Rows.Count > 1)
            {
                throw new Exception("Resultset can only have one row!");
            }

            if (apiProcResult.ResultSets[0].Rows.Count == 0)
            {
                return new GetResultModel { Success = false, ErrorType = ErrorType.Deleted, ErrorMessage = "Posten har tagits bort." };
            }

            return new GetResultModel()
            {
                ErrorMessage = apiProcResult.ErrorMessage,
                Data = apiProcResult.ResultSets[0].Rows[0],
                Success = apiProcResult.IsSuccess
            };
        }

        [HttpPost]
        public GetResultModel Set(string entity)
        {
            var json = JsonHelper.ObjectFromJsonRequest();
            List<ProcArg> args = new List<ProcArg>();

            foreach (string key in json.Keys)
            {
                args.Add(new ProcArg
                {
                    Name = key,
                    Value = json[key]
                });
            }
            var apiProc = new APIProc(string.Format("{0}_Set", entity), args);

            APIProcResult apiProcResult = apiProc.ExecuteDT();

            if (apiProcResult.ResultSets != null)
            {
                if (apiProcResult.ResultSets.Count > 0)
                {
                    if (apiProcResult.ResultSets[0].Rows.Count > 0)
                    {
                        throw new Exception("Too many resultsets!");
                    }
                }
            }

            return new GetResultModel()
            {
                ErrorMessage = apiProcResult.ErrorMessage,
                Success = apiProcResult.IsSuccess
            };
        }

        [HttpPost]
        public SelectResultModel Select(string entity)
        {
            bool showInactivated = JsonHelper.GetJsonRequestValueBool("_showInactivated");
            var apiProc = new APIProc(string.Format("{0}_Select", entity), JsonHelper.GetArgsFromJsonRequest());

            APIProcResult apiProcResult = apiProc.ExecuteDT();

            if (apiProcResult.ResultSets.Count != 1)
            {
                throw new Exception("Too many resultsets!");
            }

            List<Dictionary<string, object>> data = apiProcResult.ResultSets[0].Rows;
            List<Dictionary<string, object>> newData = new List<Dictionary<string, object>>();

            foreach (var d in data)
            {
                bool b = false;
                foreach (var key in d.Keys)
                {
                    b = false;
                    if (d[key] != null && key.ToLower() == "datetimeinactivated" || !showInactivated)
                    {
                        
                    }
                    else
                    {
                        b = true;
                    }
                }

                if (b)
                {
                    newData.Add(d);
                }
            }

            return new SelectResultModel()
            {
                ErrorMessage = apiProcResult.ErrorMessage,
                Data = newData,
                Success = apiProcResult.IsSuccess
            };
        }
    }
}