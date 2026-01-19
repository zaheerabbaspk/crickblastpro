import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { timerOutline, locationOutline, eyeOutline } from 'ionicons/icons';

export interface ScorecardInfo {
    id?: string;
    teamA: { name: string, shortName: string, logo?: string, score?: string, overs?: string, wickets?: number };
    teamB: { name: string, shortName: string, logo?: string, score?: string, overs?: string, wickets?: number };
    matchName: string;
    venue?: string;
    status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
    battingTeam?: 'A' | 'B';
    currentBatters?: { name: string, runs: number, balls: number }[];
    currentBowler?: { name: string, wickets: number, runs: number, overs: string };
    isOfficial?: boolean;
    views?: string;
}

@Component({
    selector: 'app-scorecard',
    standalone: true,
    imports: [CommonModule, IonIcon, RouterLink],
    template: `
    <div [routerLink]="data().id ? ['/public-match', data().id] : null" 
         [class.cursor-pointer]="data().id"
         class="bg-brand-accent rounded-[32px] border border-brand-white/5 overflow-hidden group hover:border-brand-red/30 transition-all duration-300 shadow-xl shadow-black/20">
        <!-- Status Header -->
        <div class="px-6 py-3 flex justify-between items-center bg-brand-white/2">
            <div class="flex items-center gap-2">
                @if (data().status === 'LIVE') {
                    <span class="flex h-2 w-2 relative">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                    </span>
                }
                <span [class]="data().status === 'LIVE' ? 'text-brand-red' : 'text-brand-white/40'" class="text-[10px] font-black uppercase tracking-[0.2em]">
                    {{ data().status }}
                </span>
                
                @if (data().views) {
                    <span class="flex items-center gap-1 text-[8px] text-brand-white/20 font-black uppercase ml-2">
                        <ion-icon name="eye-outline" class="text-[10px]"></ion-icon>
                        {{ data().views }} Views
                    </span>
                }
            </div>
            @if (data().isOfficial) {
                <span class="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded-full uppercase tracking-widest">OFFICIAL</span>
            }
        </div>

        <div class="p-6 space-y-6">
            <!-- Teams Section -->
            <div class="flex items-center justify-between gap-4">
                <!-- Team A -->
                <div class="flex-1 flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center text-2xl font-black text-brand-red border border-brand-white/5 overflow-hidden shadow-inner">
                        @if (data().teamA.logo) {
                            <img [src]="data().teamA.logo" class="w-full h-full object-cover">
                        } @else {
                            {{ data().teamA.shortName }}
                        }
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-sm truncate w-24">{{ data().teamA.name }}</p>
                        @if (data().teamA.score) {
                            <p class="text-lg font-black mt-1">{{ data().teamA.score }}</p>
                            <p class="text-[10px] text-brand-white/30">{{ data().teamA.overs }} ov</p>
                        }
                    </div>
                </div>

                <div class="flex flex-col items-center gap-1">
                    <span class="text-2xl font-black italic text-brand-white/5 opacity-50">VS</span>
                </div>

                <!-- Team B -->
                <div class="flex-1 flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center text-2xl font-black text-brand-white border border-brand-white/5 overflow-hidden shadow-inner">
                        @if (data().teamB.logo) {
                            <img [src]="data().teamB.logo" class="w-full h-full object-cover">
                        } @else {
                            {{ data().teamB.shortName }}
                        }
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-sm truncate w-24">{{ data().teamB.name }}</p>
                        @if (data().teamB.score) {
                            <p class="text-lg font-black mt-1">{{ data().teamB.score }}</p>
                            <p class="text-[10px] text-brand-white/30">{{ data().teamB.overs }} ov</p>
                        }
                    </div>
                </div>
            </div>

            <!-- Live Stats Row (Optional) -->
            @if (data().status === 'LIVE' && (data().currentBatters || data().currentBowler)) {
                <div class="pt-4 border-t border-brand-white/5 grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        @for (batter of data().currentBatters; track batter.name) {
                            <div class="flex items-center justify-between text-[10px]">
                                <span class="text-brand-white/50 truncate w-20">{{ batter.name }}*</span>
                                <span class="font-bold">{{ batter.runs }}({{ batter.balls }})</span>
                            </div>
                        }
                    </div>
                    <div class="space-y-1 text-right">
                        @if (data().currentBowler; as bowler) {
                            <div class="text-[10px]">
                                <p class="text-brand-white/50 truncate">{{ bowler.name }}</p>
                                <p class="font-bold">{{ bowler.wickets }}-{{ bowler.runs }} ({{ bowler.overs }})</p>
                            </div>
                        }
                    </div>
                </div>
            }

            <!-- Bottom Info -->
            <div class="flex items-center justify-between pt-2">
                <div class="flex flex-col gap-1">
                    <h4 class="text-xs font-bold text-brand-white/80 line-clamp-1">{{ data().matchName }}</h4>
                    @if (data().venue) {
                        <div class="flex items-center gap-1 text-[9px] text-brand-white/30 uppercase font-black tracking-wider">
                            <ion-icon name="location-outline"></ion-icon>
                            <span>{{ data().venue }}</span>
                        </div>
                    }
                </div>
                <button class="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all shadow-lg hover:scale-110">
                    <ion-icon name="eye-outline"></ion-icon>
                </button>
            </div>
        </div>
    </div>
    `
})
export class ScorecardComponent {
    data = input.required<ScorecardInfo>();

    constructor() {
        addIcons({ timerOutline, locationOutline, eyeOutline });
    }
}
