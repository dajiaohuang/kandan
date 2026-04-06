import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
      <div class="w-full max-w-md bg-[#0f1629] border border-white/10 rounded-2xl p-8">
        <h1 class="text-2xl font-bold text-white mb-2">Sign in to Kandan</h1>
        <p class="text-slate-400 text-sm mb-6">Your self-hosted team chat</p>

        @if (error) {
          <div class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{{ error }}</div>
        }

        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full bg-[#1a2240] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full bg-[#1a2240] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              placeholder="••••••••" />
          </div>
          <button type="submit" [disabled]="loading"
            class="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0e1a] font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
        <p class="text-sm text-slate-400 text-center mt-4">
          No account? <a routerLink="/register" class="text-amber-500 hover:text-amber-400">Register</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.error || 'Login failed';
        this.loading = false;
      },
    });
  }
}
