using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DataCore;
using DataCore.Models;
using System.Data.SqlClient;
using System.Data;
using System.ComponentModel;
using static ConsoleApplication1.LetsGo;

namespace ConsoleApplication1
{
    class Program
    {
        static string GetFileString(string filename)
        {
            using (var sr = new StreamReader(filename))
            {
                return sr.ReadToEnd();
            }
        }

        static void AddCompany(string ticker, string csv)
        {
            List<ProcArg> args = new List<ProcArg>();
            
            args.Add(new ProcArg
            {
                Name = "Ticker",
                Value = ticker
            });
            args.Add(new ProcArg
            {
                Name = "Csv",
                Value = csv
            });
            Proc proc = new Proc("dbo", "AddCompany", args);
            proc.ExecuteDT();
        }
        
        static void Main(string[] args)
        {
            
            string s = GetFileString("nasdaqlisted.txt");
            List<Row> allRows = new List<Row>();
            int i = 0;
            foreach (string line in s.Split(new char[] { '\r' }))
            {
                var parts = line.Trim().Split(new char[] { '|' });

                string ticker = parts[0];

                string fileName = string.Format("{0}.txt", ticker);

                string file = GetFileString(fileName);
                

                var rows = LetsGo.GetRows(ticker, file);
                allRows.AddRange(rows);
                i++;

                if (i == 100)
                {
                    i = 0;
                    //LetsGo.Go(allRows);
                    allRows.Clear();
                }

            }
                /*
                string s = GetFileString("nasdaqlisted.txt");

                foreach (string line in s.Split(new char[] { '\r' }))
                {
                    var parts = line.Trim().Split(new char[] { '|' });

                    string ticker = parts[0];

                    string fileName = string.Format("{0}.txt", ticker);

                    if (File.Exists(fileName))
                        continue;

                    string url = string.Format("http://ichart.finance.yahoo.com/table.csv?s={0}&d=0&e=28&f=2016&g=d&a=3&b=12&c=1996&ignore=.csv", ticker);
                    WebClient webClient = new WebClient();
                    try
                    {
                        webClient.DownloadFile(url, fileName);
                    }
                    catch (Exception ex)
                    {
                        using (System.IO.StreamWriter file = new System.IO.StreamWriter(fileName))
                        {
                            file.Write(ex.ToString());
                            file.Close();
                        }

                    }
                }
                */
            }
        }
}
