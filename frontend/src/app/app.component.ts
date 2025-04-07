import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Aether Mind';
  showNavbar: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.urlAfterRedirects);
      }
    });
  }

  updateNavbarVisibility(url: string) {
    // Define routes where you want to show the navbar
    const showOnRoutes = ['/dashboard', '/article'];

    // Check if the current URL starts with any of these routes
    this.showNavbar = showOnRoutes.some(route => url.startsWith(route));
  }
}
