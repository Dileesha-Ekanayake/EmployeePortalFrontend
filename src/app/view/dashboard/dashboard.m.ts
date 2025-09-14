import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent} from '@angular/material/card';
import {Subscription} from 'rxjs';
import {DataService} from '../../service/data.service';
import {ApiEndpoints} from '../../service/api-endpoint';
import {Dashboard} from '../../entity/Dashboard';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './dashboard.m.html',
  styleUrl: './dashboard.m.scss'
})
export class DashboardM implements OnInit, OnDestroy {

  dashboard! : Dashboard;

  dataSubscriber$ = new Subscription();

  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.initialize();
  }

  /**
   * Initializes the necessary components or data for the application.
   * This method is responsible for loading the initial dashboard data.
   *
   * @return {void} Does not return a value.
   */
  initialize(): void {
    this.loadDashboardData();
  }

  /**
   * Loads the dashboard data by subscribing to the data service and updating the dashboard with the received response.
   * Handles errors by logging an error message to the console.
   * @return {void} This method does not return a value.
   */
  loadDashboardData(): void {
    this.dataSubscriber$.add(
      this.dataService.getDataObject<Dashboard>(ApiEndpoints.paths.dashBoard).subscribe({
        next: (response) => {
          this.dashboard = response;
        },
        error: (error) => {
          console.error("Error fetching dashboard data:", error.message);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.dataSubscriber$.unsubscribe();
  }
}
