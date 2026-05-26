import { Component, inject } from '@angular/core';
import { ThemeService } from '../../styles/theme.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear: number = new Date().getFullYear();


   animating = false;

     constructor(public theme: ThemeService) {}

     ngOnInit(): void {
       this.theme.init();
     }

     toggleTheme(): void {
       this.animating = true;
       this.theme.toggle();
       setTimeout(() => (this.animating = false), 200);
     }
}
