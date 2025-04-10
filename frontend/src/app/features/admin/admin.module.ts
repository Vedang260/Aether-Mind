import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { CategoriesComponent } from './components/categories/categories.component';
// import { ArticlesComponent } from './components/articles/articles.component';
// import { AnalyticsComponent } from './components/analytics/analytics.component';
// import { UsersComponent } from './components/users/users.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { QuillModule } from 'ngx-quill';
import { CategoriesComponent } from './components/categories/categories.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { NewArticleComponent } from '../../components/article/new-article.component';
import { ArticleAnalyticsComponent } from './components/article-analytics/article-analytics.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    QuillModule.forRoot(),
    DashboardComponent,
    CategoriesComponent,
    ArticlesComponent,
    AnalyticsComponent,
    NewArticleComponent,
    // UsersComponent,
    ArticleAnalyticsComponent
  ]
})
export class AdminModule { }