import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [
    MatToolbarModule, 
    MatIconModule
  ],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor (
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer  
  ) {
    this.iconRegistry.addSvgIcon(
      'facebook',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
    );
    this.iconRegistry.addSvgIcon(
      'instagram',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg')
    );
    this.iconRegistry.addSvgIcon(
      'youtube',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/youtube.svg')
    );
  }
}
