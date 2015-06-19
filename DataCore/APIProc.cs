using DataCore.DataTypes;
using DataCore.Helpers;
using DataCore.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DataCore
{
    public class APIProc
    {
        private APIProcConnection _connection;
        private Proc _proc;

        public APIProc(APIProcConnection connection, string name, List<ProcArg> args)
        {
            _connection = connection;
            var args2 = new List<ProcArg>();
            foreach (var procArg in args)
            {
                if (procArg.Name.Substring(0, 1) == "_") throw new Exception("Javla tomte!");
                
                args2.Add(procArg);
            }

            args2.Add(new ProcArg {Name = "_UserId", Value = 1});
            args2.Add(new ProcArg {Name = "_ErrorMessage", Value = null});

            _proc = new Proc(connection, "APIDEBUG", name, args2);
        }

        public APIProcResult ExecuteDT()
        {
            Result result = _proc.ExecuteDT();
            
            object errorMessage;
            result.OutputParameters.TryGetValue("_ErrorMessage", out errorMessage);

            APIProcResult apiResult;
            apiResult.ErrorMessage = (errorMessage != null) ? errorMessage.ToString() : null;

            if (result.ReturnValue == 0)
            {
                apiResult.IsSuccess = true;
                if (!string.IsNullOrEmpty(apiResult.ErrorMessage)) throw new Exception("Errormessage should be null on success.");
                apiResult.ResultSets = result.ResultSets;
                apiResult.OutputParameters = result.OutputParameters.Where(x => x.Key.Substring(0, 1) != "_").ToDictionary(d => d.Key, d => d.Value);
            }
            else
            {
                apiResult.IsSuccess = false;
                if (apiResult.ErrorMessage == null) throw new Exception("Tomte 2");
                apiResult.ResultSets = null;
                apiResult.OutputParameters = null;
            }

            return apiResult;
        }
    }
}
