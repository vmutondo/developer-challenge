import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RestcountriesService } from '../_services/restcountries.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns1: string[] = ['name','capital', 'region', 'subregion', 'population', 'area', 'timezones', 'nativeName'];
  showLoading: boolean;
  view_data_details: any = {};

  constructor(private _rest: RestcountriesService) { }

  ngOnInit() {
    this.getAll()
  }

  getAll() {
    this.showLoading = true;
    this._rest.getAll().subscribe((data) => {
      console.log(data);
      
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showLoading = false;
    },
      error => {
        this.showLoading = false;
        console.log(error)
      })
  }

  viewDetailsData(row) {
    this.view_data_details = row;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}
