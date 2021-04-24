import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hdb-list',
  templateUrl: './hdb-list.component.html'
})
export class HdbListComponent {
  public hdbs: HDB[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<HDB[]>(baseUrl + 'api/HDB/HDBs').subscribe(result => {
      this.hdbs = result;
    }, error => console.error(error));
  }
}

interface HDB {
  town: string;
  flat_type: string;
  flat_model: string;
  floor_area_sqm: number;
  street_name: string;
  resale_price: number;
  month: string;
  remaining_lease: string;
  lease_commence_date: number;
  storey_range: string;
  id: number;
  block: string;
}
