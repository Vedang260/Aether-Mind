import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { CategoriesComponent } from './components/categories/categories.component';
// import { ArticlesComponent } from './components/articles/articles.component';
// import { AnalyticsComponent } from './components/analytics/analytics.component';
// import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
//   { path: 'categories', component: CategoriesComponent },
//   { path: 'articles', component: ArticlesComponent },
//   { path: 'analytics', component: AnalyticsComponent },
//   { path: 'users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }