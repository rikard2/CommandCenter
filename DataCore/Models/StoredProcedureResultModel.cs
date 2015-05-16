using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCore.Models
{
    public class StoredProcedureResultModel
    {
        public bool Success { get; set; }

        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<List<Dictionary<string, object>>> Result { get; set; }

        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ErrorMessage { get; set; }
    }
}
