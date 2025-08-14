import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['../ressources.component.scss']
})
export class ServerErrorComponent {
  constructor(private router: Router) {}
    goToDashboard() {
      this.router.navigate(['/app/dashboard']);
    }
}
