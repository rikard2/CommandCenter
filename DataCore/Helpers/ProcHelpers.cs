using DataCore.DataTypes;
using DataCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCore.Helpers
{
    public class ProcHelpers
    {
        public static object CleanDBValue(object o)
        {
            if (o.GetType() == DBNull.Value.GetType())
            {
                return null;
            }

            return o;
        }
    }
}
