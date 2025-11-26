import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-pagina404',
  imports: [MatIcon, RouterLink],
  templateUrl: './pagina404.component.html',
  styleUrl: './pagina404.component.scss'
})
export class Pagina404Component {
  link = '/admin/home';
}
