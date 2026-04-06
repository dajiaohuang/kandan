import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel',
  imports: [],
  template: `
    <div class="flex-1 flex flex-col h-full">
      <!-- Channel header -->
      <div class="h-14 border-b border-white/7 flex items-center px-4 bg-[#0f1629]">
        <span class="text-slate-400 mr-1">#</span>
        <span class="font-semibold">{{ channelId }}</span>
      </div>

      <!-- Messages area placeholder -->
      <div class="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <div class="text-center text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
          </svg>
          <p class="text-sm">Messages coming in #455</p>
        </div>
      </div>

      <!-- Input placeholder -->
      <div class="border-t border-white/7 p-4">
        <div class="bg-[#1a2240] border border-white/10 rounded-lg px-4 py-3 text-slate-500 text-sm">
          Chat input coming in #459...
        </div>
      </div>
    </div>
  `,
})
export class ChannelComponent {
  channelId = '';
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(p => this.channelId = p['id']);
  }
}
