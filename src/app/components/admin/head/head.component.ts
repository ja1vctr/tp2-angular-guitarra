import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css',
})
export class HeadComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  @Output() menuToggle = new EventEmitter<void>();

  clickMenu(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    this.authService.logout();
    location.reload();
  }
}
