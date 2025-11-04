import { MatSidenavModule } from '@angular/material/sidenav';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
// import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-public-template',
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
  ],
  templateUrl: './public-template.component.html',
  styleUrl: './public-template.component.scss'
})
export class PublicTemplateComponent {
  opened = true;
}
