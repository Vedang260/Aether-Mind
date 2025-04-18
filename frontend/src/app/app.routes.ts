import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)},
    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'article/:id', loadComponent: () => import('./features/article/article.component').then (m => m.ArticleComponent)},
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
    // Lazy load admin module
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
];
