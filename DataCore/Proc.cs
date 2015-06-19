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
    public class Proc
    {
        private SqlCommand _cmd;
        private List<ProcArg> _args;
        private string _schema;
        private string _name;
        private string _spName;
        APIProcConnection _connection;

        public Proc(APIProcConnection connection, string schema, string name, List<ProcArg> args)
        {
            _connection = connection;
            _schema = schema;
            _name = name;
            _spName = string.Format("[{0}].[{1}]", schema, name);

            _args = args;
            _cmd = new SqlCommand(_spName);
            _cmd.Connection = connection.Connection;
            _cmd.Transaction = _connection.Transaction;
            _cmd.CommandType = System.Data.CommandType.StoredProcedure;
        }

        Dictionary<string, ProcParameterInfo> GetParameters()
        {
            using (var cmd = new SqlCommand("[CORE].[GetStoredProcedureParameters]", _connection.Connection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("Name", _name);
                cmd.Transaction = _connection.Transaction;

                var parameters = new Dictionary<string, ProcParameterInfo>(StringComparer.OrdinalIgnoreCase);
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        string name = dr["ParameterName"] as string;
                        bool isOutput = bool.Parse(dr["IsOutput"].ToString());
                        parameters.Add(name, new ProcParameterInfo { IsOutput = isOutput });
                    }
                }
                return parameters;
            }
        }

        public Result ExecuteDT()
        {
            Result result = new Result();
            result.ResultSets = new List<Resultset>();
            result.OutputParameters = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
            
            var parameters = GetParameters();
                
            foreach (ProcArg arg in _args)
            {
                if (arg.Name.Substring(0, 1) == "$")
                    continue;

                if (arg.Name.Substring(0, 1) == "_" && !parameters.ContainsKey(arg.Name))
                    continue;

                SqlParameter param = _cmd.Parameters.AddWithValue(arg.Name, arg.Value ?? DBNull.Value);

                if (!parameters.ContainsKey(arg.Name))
                {
                    throw new Exception("Parameter @" + arg.Name + " is not part of stored procedure!");
                }
                bool isOutput = parameters[arg.Name].IsOutput;
                if (isOutput)
                {
                    param.Direction = ParameterDirection.InputOutput;
                    param.Size = -1;
                }
            }

            var returnParam = _cmd.Parameters.Add("ReturnValue_", 0);
            returnParam.Direction = ParameterDirection.ReturnValue;

            SqlDataReader reader = _cmd.ExecuteReader();

            do
            {

                List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();

                List<Column> columns = new List<Column>();

                // Fieldcount
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    columns.Add(new Column
                    {
                        Name = reader.GetName(i),
                        Type = reader.GetFieldType(i)
                    });

                }
                    
                while (reader.Read())
                {
                    Dictionary<string, object> values = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        string colName = reader.GetName(i);
                        values.Add(colName, ProcHelpers.CleanDBValue(reader[i]));
                    }

                    rows.Add(values);
                }

                result.ResultSets.Add(new Resultset
                {
                    Rows = rows,
                    Columns = columns
                });

            }
            while (reader.NextResult());
            reader.Close();

            //
            foreach (SqlParameter p in _cmd.Parameters)
            {
                if (p.Direction == ParameterDirection.InputOutput || p.Direction == ParameterDirection.Output)
                {
                    object val = p.Value;
                    result.OutputParameters.Add(p.ParameterName, ProcHelpers.CleanDBValue(p.Value));
                }
            }


            int? returnParamValue = returnParam.Value as int?;

            result.ReturnValue = returnParamValue.Value;

            return result;
        }
        public List<XDataRow> Execute()
        {
            List<XDataRow> result = new List<XDataRow>();

            using (SqlConnection conn = new SqlConnection("Server=tcp:x1uxd5ig2z.database.windows.net,1433;Database=Core3017_db;User ID=Core3017@x1uxd5ig2z;Password=Tomte123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"))
            {
                conn.Open();
                _cmd.Connection = conn;

                SqlDataReader reader = _cmd.ExecuteReader();

                while (reader.Read())
                {
                    XDataRow dataRow = new XDataRow();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        dataRow.Columns.Add(reader.GetName(i).ToLower(), XDataType.CreateFromDataReader(reader, i));
                    }

                    result.Add(dataRow);
                }

                conn.Close();
            }
            

            return result;
        }
    }
}
