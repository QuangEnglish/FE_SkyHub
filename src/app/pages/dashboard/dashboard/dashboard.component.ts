import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../service/data.service";
import {Sales, SalesOrOpportunitiesByCategory} from "../../components/ticker-card/ticker-card.component";
import {formatDate} from "@angular/common";
import {SalesByState} from "../../components/timeoff-analysis-card/timeoff-analysis-card.component";
import {SalesByStateAndCity} from "../../components/contract-analysis-card/contract-analysis-card.component";

export type PanelItem = { text: string, value: string, key: number };
export type Dates = { startDate: string, endDate: string};
export const analyticsPanelItems: Array<PanelItem> = [
  {
    text: 'Week',
    value: '2020-01-24/2020-01-31',
    key: 1,
  }, {
    text: 'Month',
    value: '2020-01-01/2020-02-01',
    key: 3,
  }, {
    text: 'Year',
    value: '2020-01-01/2021-01-01',
    key: 4,
  }];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  analyticsPanelItems = analyticsPanelItems;
  salesByCategory!: SalesOrOpportunitiesByCategory;
  lstContractType!: SalesOrOpportunitiesByCategory;
  salesByState!: SalesByState;

  @Input() data!: SalesOrOpportunitiesByCategory;
  @Input() data2!: Sales;

  isLoading: boolean = true;

  constructor() {}

  selectionChange(dates: Dates) {
    this.loadData(dates.startDate, dates.endDate);
  }

  loadData = (startDate: string, endDate: string) => {
    // this.isLoading = true;
    // const tasks: Observable<object>[] = [
    //   ['opportunities', this.service.getOpportunitiesByCategory],
    //   ['sales', this.service.getSales],
    //   ['salesByCategory', this.service.getSalesByCategory],
    //   ['salesByState', (startDate: string, endDate: string) => this.service.getSalesByStateAndCity(startDate, endDate).pipe(
    //       map((data) => this.service.getSalesByState(data))
    //   )
    //   ]
    // ].map(([dataName, loader]: [string, DataLoader]) => {
    //   const loaderObservable = loader(startDate, endDate).pipe(share());
    //
    //   loaderObservable.subscribe((result: DashboardData) => {
    //     this[dataName] = result;
    //   });
    //
    //   return loaderObservable;
    // });
    //
    // forkJoin(tasks).subscribe(() => {
    //   this.isLoading = false;
    // });
  };

  ngOnInit(): void {
    // this.loadData(startDate, endDate);
    const currentDate = new Date();
    // this.onRangeChanged({ value: [currentDate] })
    this.salesByCategory = [
      {
        name: "Phòng java",
        value: 20,
      },
      {
        name: "Phòng vv",
        value: 25,
      },
      {
        name: "Phòng jađsadva",
        value: 50,
      },
      {
        name: "Phòng dfd",
        value: 60,
      },
    ];

    this.salesByState = [
      {
        stateName: "Phòng java",
        stateCoords: "vvvv",
        total: 50,
        percentage: 0.1,
      },
      {
        stateName: "Phòng kỹ thuật",
        stateCoords: "vvvv",
        total: 70,
        percentage: 0.2,
      },
      {
        stateName: "Phòng Kinh Doanh",
        stateCoords: "ccc",
        total: 20,
        percentage: 0.5,
      },
      {
        stateName: "Phòng Nhân Sự",
        stateCoords: "bbv",
        total: 30,
        percentage: 0.1,
      },
      {
        stateName: "Phòng Nhân Sự",
        stateCoords: "bbv",
        total: 30,
        percentage: 0.1,
      },
      {
        stateName: "Phòng Nhân Sự",
        stateCoords: "bbv",
        total: 30,
        percentage: 0.1,
      },
    ];

    this.lstContractType = [
      {
        name: "Phòng java",
        value: 20,
      },
      {
        name: "Phòng vv",
        value: 25,
      },
      {
        name: "Phòng jađsadva",
        value: 50,
      },
      {
        name: "Phòng dfd",
        value: 60,
      },
    ];
  }

  // onRangeChanged = ({ value: dates }: { value: Date[] }) => {
  //   const [startDate, endDate] = dates.map((date: any) => formatDate(date, 'YYYY-MM-dd', 'en'));
  //
  //   this.isLoading = true;
  //
  //   this.service.getSalesByCategory(startDate, endDate)
  //       .subscribe((result) => {
  //         this.salesByCategory = result;
  //         this.isLoading = false;
  //       });
  // };

}
