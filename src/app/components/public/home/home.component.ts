import { Component } from '@angular/core';
import { CardComponent } from "../produto/card/card.component";

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
}
