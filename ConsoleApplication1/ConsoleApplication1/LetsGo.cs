using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    public static class LetsGo
    {
        public class Row
        {
            public string Ticker { get; set; }
            public DateTime Date { get; set; }
            public decimal open { get; set; }
            public decimal high { get; set; }
            public decimal low { get; set; }
            public decimal close { get; set; }
            public decimal volume { get; set; }
            public decimal adjclose { get; set; }
        }

        public static List<Row> GetRows(string ticker, string file)
        {
            List<Row> rows = new List<Row>();

            string[] lines = file.Split(new char[] { '\r', '\n' });
            foreach (string l in lines)
            {
                string[] parts = l.Split(new char[] { ',' });
                if (parts.Length == 7)
                {
                    DateTime dt;
                    if (DateTime.TryParse(parts[0], out dt))
                    {
                        
                    }
                    
                    rows.Add(new Row
                    {
                        Date = DateTime.Parse(parts[0]),
                        open = decimal.Parse(parts[1]),
                        high = decimal.Parse(parts[2]),
                        low = decimal.Parse(parts[3]),
                        close = decimal.Parse(parts[4]),
                        volume = decimal.Parse(parts[5]),
                        adjclose = decimal.Parse(parts[6])
                    });
                }
            }
            return rows;
        }
        public static void Go(List<Row> rows)
        {
            using (var bulkCopy = new SqlBulkCopy(@"Server=tcp:x1uxd5ig2z.database.windows.net,1433;Database=Core3017_db;User ID=Core3017@x1uxd5ig2z;Password=Tomte123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;", SqlBulkCopyOptions.TableLock))
            {
                bulkCopy.BatchSize = 500;
                bulkCopy.DestinationTableName = "dbo.StockBulk";
                bulkCopy.WriteToServer(rows.AsDataTable());
               
            }
        }
        public static DataTable AsDataTable<T>(this IEnumerable<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            var table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            foreach (T item in data)
            {
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            }
            return table;
        }
    }
}
