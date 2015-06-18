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
using Npgsql;


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
        public SetResultModel Set(string entity)
        {
            var json = JsonHelper.ObjectFromJsonRequest();
            List<ProcArg> args = new List<ProcArg>();

            foreach (string key in json.Keys)
            {
                object val = json[key];
                if (val.ToString().Trim().Length == 0)
                    val = null;

                args.Add(new ProcArg
                {
                    Name = key,
                    Value = val
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

            var resultModel = new SetResultModel()
            {
                ErrorMessage = apiProcResult.ErrorMessage,
                Success = apiProcResult.IsSuccess,
                Merge = new Dictionary<string,object>()
            };

            if (apiProcResult.IsSuccess)
            {
                foreach (var o in apiProcResult.OutputParameters)
                {
                    resultModel.Merge.Add(o.Key, o.Value);
                }
            }

            return resultModel;
        }

        [HttpPost]
        public string abo()
        {
            string connstring = String.Format("Server={0};Port={1};" +
                    "User Id={2};Password={3};Database={4};",
                    "core1337.ckpqsf4ulmrw.eu-west-1.rds.amazonaws.com", 5432, "core1337",
                    "tomte123", "core");
            // Making connection with Npgsql provider
            NpgsqlConnection conn = new NpgsqlConnection(connstring);
            conn.Open();

            conn.Notice += conn_Notice;
            conn.Notification += conn_Notification;

            conn.Close();

            return "hello";
        }

        void conn_Notification(object sender, NpgsqlNotificationEventArgs e)
        {
            
        }

        void conn_Notice(object sender, NpgsqlNoticeEventArgs e)
        {
            
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
                    if (d[key] != null && key.ToLower() == "datetimeinactivated" )
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