import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  stats = [
    { icon: 'article', title: 'Total Articles', value: '1,248', color: 'linear-gradient(135deg, #6e8efb, #a777e3)' },
    { icon: 'category', title: 'Total Categories', value: '12', color: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { icon: 'people', title: 'Total Users', value: '5,672', color: 'linear-gradient(135deg, #FF9800, #FFC107)' },
    { icon: 'comment', title: 'Total Comments', value: '8,341', color: 'linear-gradient(135deg, #9C27B0, #E91E63)' },
    { icon: 'visibility', title: 'Total Views', value: '124,856', color: 'linear-gradient(135deg, #00BCD4, #03A9F4)' }
  ];
}