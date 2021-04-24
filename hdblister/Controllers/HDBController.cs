using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace hdblister.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HDBController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<string>> Get()
        {
            string url = "https://data.gov.sg/api/action/datastore_search?resource_id=42ff9cfe-abe5-4b54-beda-c88f9bb438ee"; // sample url
            using (HttpClient client = new HttpClient())
            {
                return await client.GetStringAsync(url);
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<HDB> HDBs()
        {
            string hdbstring = this.Get().Result.Value;
            JObject json = JObject.Parse(hdbstring);
            List<HDB> hdblist = new List<HDB>();

            foreach (var record in json["result"]["records"])
            {
                hdblist.Add(new HDB
                {
                    Town = record["town"].ToString(),
                    Flat_type = record["flat_type"].ToString(),
                    Flat_model = record["flat_model"].ToString(),
                    Floor_area_sqm = record["floor_area_sqm"].ToObject<int>(),
                    Street_name = record["street_name"].ToString(),
                    Resale_price = record["resale_price"].ToObject<int>(),
                    Month = record["month"].ToString(),
                    Remaining_lease = record["remaining_lease"].ToString(),
                    Lease_commence_date = record["lease_commence_date"].ToObject<int>(),
                    Storey_range = record["storey_range"].ToString(),
                    Id = record["_id"].ToObject<int>(),
                    Block = record["block"].ToString()
                });
            }

            return hdblist;

        }


        public class HDB
        {
            public string Town { get; set; }
            public string Flat_type { get; set; }
            public string Flat_model { get; set; }
            public int Floor_area_sqm { get; set; }
            public string Street_name { get; set; }
            public int Resale_price { get; set; }
            public string Month { get; set; }
            public string Remaining_lease { get; set; }
            public  int Lease_commence_date { get; set; }
            public string Storey_range { get; set; }
            public int Id { get; set; }
            public string Block { get; set; }


        }

    }
}


