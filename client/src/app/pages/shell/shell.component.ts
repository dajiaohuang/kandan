import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex h-screen bg-[#0a0e1a] text-slate-100 overflow-hidden">

      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 bg-[#0f1629] border-r border-white/7 flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-white/7">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="font-bold text-lg tracking-tight"><span class="text-amber-500">Kan</span>dan</span>
          </div>
        </div>

        <!-- Channels placeholder -->
        <div class="flex-1 overflow-y-auto p-3">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Channels</div>
          <div class="text-slate-500 text-sm px-2">Loading channels...</div>
        </div>

        <!-- User footer -->
        <div class="p-3 border-t border-white/7 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-[#0a0e1a] text-xs font-bold">
              {{ userInitial }}
            </div>
            <span class="text-sm text-slate-300">{{ userName }}</span>
          </div>
          <button (click)="logout()" class="text-slate-500 hover:text-red-400 transition-colors" title="Sign out">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 flex flex-col min-w-0">
        <router-outlet />
      </main>

    </div>
  `,
})
export class ShellComponent {
  constructor(private auth: AuthService) {}

  get userName() { return this.auth.currentUser()?.displayName || 'User'; }
  get userInitial() { return this.userName.charAt(0).toUpperCase(); }
  logout() { this.auth.logout(); }
}
