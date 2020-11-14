import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { RestcountriesService } from '../_services/restcountries.service';
// import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  // =========== Doughnut ====================
  public doughnutChartLabels: any[] = [];
  public doughnutChartData: any = [0, 0, 0, 0, 0, 0, 0];
  public doughnutChartType: ChartType = 'doughnut';
  showLoading: boolean = false;
  restcountries: any[] = [];
  regions: any[] = [];
  countriesNumberByRegion: any[] = [];

  constructor(private _rest: RestcountriesService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.showLoading = true;
    this._rest.getAll().subscribe((data) => {
      console.log(data);
      this.showLoading = false;
      this.restcountries = data;

      // GET ALL REGIONS
      this.restcountries.forEach((element, index) => {
        let main_element = element;
        if (!this.regions.some(element => element === main_element.region)) {
          this.regions.push(main_element.region)
          this.doughnutChartLabels.push(main_element.region) // LABELS
        }
      });

      // number of countries by regions
      this.regions.forEach(element => {
        let count = 0;
        count = this.restcountries.reduce((acc, cur) => cur.region === element ? ++acc : acc, 0);
        this.countriesNumberByRegion.push(count)
      });
      this.doughnutChartData = this.countriesNumberByRegion; // VALUES

    },
      error => {
        this.showLoading = false;
        console.log(error)
      })
  }



}
