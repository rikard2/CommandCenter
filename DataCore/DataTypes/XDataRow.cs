using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCore.DataTypes
{
    public class XDataRow
    {
        public Dictionary<string, XDataType> Columns { get; set; }

        public XDataRow()
        {
            Columns = new Dictionary<string, XDataType>(StringComparer.OrdinalIgnoreCase);
        }


        public T Cast<T>()
        {
            Type t = typeof(T);
            T instance = (T)Activator.CreateInstance(t);

            foreach (var p in t.GetProperties())
            {
                if (Columns.ContainsKey(p.Name))
                {
                    p.SetValue(instance, Columns[p.Name].Value);
                }
            }

            return instance;
        }
    }
}
