import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  stagger, 
  query,
  keyframes
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms ease-out', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', 
          style({ opacity: 1 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  features = [
    {
      icon: 'search',
      title: 'Intelligent Search',
      description: 'Find exactly what you need with our AI-powered search technology.'
    },
    {
      icon: 'group',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time editing and comments.'
    },
    {
      icon: 'category',
      title: 'Smart Organization',
      description: 'Automatically categorize and tag content for easy discovery.'
    },
    {
      icon: 'insights',
      title: 'Powerful Analytics',
      description: 'Gain insights into how your knowledge is being used.'
    },
    {
      icon: 'security',
      title: 'Enterprise Security',
      description: 'Bank-grade security to protect your valuable knowledge.'
    },
    {
      icon: 'api',
      title: 'Seamless Integration',
      description: 'Connect with your favorite tools and workflows.'
    }
  ];

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/register']);
  }
}