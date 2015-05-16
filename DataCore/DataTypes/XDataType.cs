using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCore.DataTypes
{
    public class XDataType
    {
        private object _object;

        internal static XDataType CreateFromDataReader(System.Data.SqlClient.SqlDataReader reader, int fieldOrdinal)
        {
            XDataType ret = new XDataType(reader.GetFieldValue<object>(fieldOrdinal))
            {
                IsNull = reader.IsDBNull(fieldOrdinal)
            };

            Type t = reader.GetFieldType(fieldOrdinal);

            return ret;
        }

        public XDataType (object o)
        {
            _object = o;
        }

        public bool IsNull
        {
            get;
            private set;
        }

        public object Value
        {
            get
            {
                return _object;
            }
        }

        public override string ToString()
        {
            return _object.ToString();
        }
    }
}
