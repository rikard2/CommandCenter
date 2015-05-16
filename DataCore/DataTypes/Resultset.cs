using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCore.DataTypes
{
    public struct Column
    {
        public string Name;
        //public System.Data.SqlDbType DataType;
        public Type Type;
        public int Size;
    }

    public struct Resultset
    {
        public List<Column> Columns { get; set; }
        public List<Dictionary<string, object>> Rows { get; set; }
    }

    public struct Result
    {
        public List<Resultset> ResultSets { get; set; }
        public Dictionary<string, object> OutputParameters { get; set; }
        public int ReturnValue { get; set; }
    }
}
