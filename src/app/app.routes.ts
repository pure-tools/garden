import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { paidGuard } from './guards/paid.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'paywall',
    canActivate: [authGuard],
    loadComponent: () => import('./components/paywall/paywall.component').then(m => m.PaywallComponent),
  },
  {
    path: 'garden',
    canActivate: [authGuard, paidGuard],
    loadComponent: () => import('./components/garden-grid/garden-grid.component').then(m => m.GardenGridComponent),
  },
  { path: '', redirectTo: 'garden', pathMatch: 'full' },
  { path: '**', redirectTo: 'garden' },
];
