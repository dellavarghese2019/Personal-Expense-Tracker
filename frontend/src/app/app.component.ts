import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InactivityService } from './services/inactive.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private inactivityService: InactivityService) {}
}
