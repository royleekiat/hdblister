import { Component, Inject, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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

export type SortColumn = keyof HDB | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

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

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting hdbs
    if (direction === '' || column === '') {
      //do nothing
    } else {
      this.hdbs = [...this.hdbs].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  
}

