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
    public struct APIProcResult
    {
        public bool IsSuccess;
        public string ErrorMessage;
        public List<Resultset> ResultSets;
        public Dictionary<string, object> OutputParameters;
    }
}
