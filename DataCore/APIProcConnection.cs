using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCore
{
    public class APIProcConnection : IDisposable
    {
        public bool AutoRollback { get; set; }
        public SqlConnection Connection { get; set; }
        public SqlTransaction Transaction { get; private set; }
        public APIProcConnection()
        {
            this.Connection = new SqlConnection("Server=tcp:x1uxd5ig2z.database.windows.net,1433;Database=Core3017_db;User ID=Core3017@x1uxd5ig2z;Password=Tomte123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

            this.Connection.Open();

            this.Transaction = this.Connection.BeginTransaction();
        }

        public void Dispose()
        {
            if (this.AutoRollback)
            {
                this.Transaction.Rollback();
            }
            else
            {
                this.Transaction.Commit();
            }
            this.Connection.Dispose();
        }
    }
}
