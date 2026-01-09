import { Component, inject, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../core/services/match.service';
import { TeamService } from '../../core/services/team.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, trophyOutline, chevronForwardOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-history',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, CommonModule],
    template: `
<ion-content>
    <div class="max-w-4xl mx-auto space-y-8 pb-20 px-4">
        <header class="pt-12 flex items-center gap-4">
            <button routerLink="/dashboard" class="w-12 h-12 rounded-2xl bg-brand-accent/50 flex items-center justify-center text-brand-white">
                <ion-icon name="arrow-back-outline"></ion-icon>
            </button>
            <h1 class="text-4xl font-black italic text-brand-white uppercase">MATCH HISTORY</h1>
        </header>

        @if (completedMatches().length === 0) {
            <div class="bg-brand-accent/20 rounded-[40px] border border-brand-white/5 p-12 text-center space-y-4">
                <div class="w-20 h-20 bg-brand-white/5 rounded-[30px] flex items-center justify-center mx-auto text-brand-white/20 text-4xl">
                    <ion-icon name="calendar-outline"></ion-icon>
                </div>
                <h2 class="text-xl font-bold text-brand-white">No Matches Found</h2>
                <p class="text-brand-white/40">Complete a match to see it here!</p>
                <button routerLink="/match-create" class="bg-brand-red text-white px-8 h-14 rounded-2xl font-black uppercase tracking-widest mt-4">Start New Match</button>
            </div>
        } @else {
            <div class="grid grid-cols-1 gap-4">
                @for (match of completedMatches(); track match.id) {
                    <div class="bg-brand-accent/30 rounded-[35px] border border-brand-white/5 p-6 hover:bg-brand-accent/50 transition-all cursor-pointer group"
                         [routerLink]="['/match', match.id, 'result']">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-[10px] font-black text-brand-white/30 uppercase tracking-[0.2em]">{{ match.createdAt | date:'longDate' }}</span>
                            <div class="px-3 py-1 bg-brand-red/10 rounded-full">
                               <span class="text-[10px] font-black text-brand-red uppercase">COMPLETED</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-6 justify-between">
                            <div class="flex-1 text-right">
                                <p class="text-lg font-black text-brand-white">{{ teamService.getTeamById(match.teamAId)?.name }}</p>
                                <p class="text-brand-white/40 text-xs font-bold">{{ match.teamAPlayers.length }} Players</p>
                            </div>

                            <div class="w-12 h-12 bg-brand-white/5 rounded-2xl flex items-center justify-center text-brand-white/20 font-black italic">VS</div>

                            <div class="flex-1">
                                <p class="text-lg font-black text-brand-white">{{ teamService.getTeamById(match.teamBId)?.name }}</p>
                                <p class="text-brand-white/40 text-xs font-bold">{{ match.teamBPlayers.length }} Players</p>
                            </div>
                        </div>

                        <div class="mt-6 pt-6 border-t border-brand-white/5 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] font-black text-brand-white/30 uppercase mb-1">RESULT</p>
                                <p class="text-sm font-bold text-brand-red uppercase italic">
                                    {{ teamService.getTeamById(match.result?.winnerId || '')?.name }} {{ match.result?.margin }}
                                </p>
                            </div>
                            <div class="w-10 h-10 bg-brand-white/5 rounded-xl flex items-center justify-center text-brand-white/30 group-hover:bg-brand-red group-hover:text-white transition-all">
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }
    </div>
</ion-content>
`,
    styles: [`
        :host {
            --brand-red: #ff3b3b;
            --brand-dark: #0a0a0b;
            --brand-accent: #1c1c1e;
            --brand-white: #ffffff;
        }
    `]
})
export class MatchHistoryPage {
    private matchService = inject(MatchService);
    public teamService = inject(TeamService);

    completedMatches = computed(() =>
        this.matchService.matches()
            .filter(m => m.status === 'completed')
            .sort((a, b) => b.createdAt - a.createdAt)
    );

    constructor() {
        addIcons({ arrowBackOutline, calendarOutline, trophyOutline, chevronForwardOutline });
    }
}
