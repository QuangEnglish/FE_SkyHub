import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../../service/data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-detail-employee-managerment',
  templateUrl: './detail-employee-managerment.component.html',
  styleUrls: ['./detail-employee-managerment.component.less']
})
export class DetailEmployeeManagermentComponent implements OnInit {

  contactId!: number;

  contactName = 'Quay lại danh sách';

  isLoading = false;
  isPanelOpened = true;

  constructor(
    private service: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.contactId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit(): void {
  }

  refresh = () => {
    this.isLoading = true;
  };

  redirectToPreviousPage() {
    this.router.navigate(['/employee']);
  }
}
