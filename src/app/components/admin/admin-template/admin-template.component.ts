import { MatSidenavModule } from '@angular/material/sidenav';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeadComponent } from "../head/head.component";
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-admin-template',
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent,
    HeadComponent,
    MatSidenavModule,
  ],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {
  opened = true;
}
