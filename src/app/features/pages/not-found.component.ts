import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['../ressources.component.scss']
})
export class NotFoundComponent {
  constructor(private router: Router) {}
    goToDashboard() {
      this.router.navigate(['/app/dashboard']);
    }
}
