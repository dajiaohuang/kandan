import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'channel/:id',
        loadComponent: () => import('./pages/channel/channel.component').then(m => m.ChannelComponent),
      },
      { path: '', redirectTo: 'channel/general', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
