import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService, Player } from '../../core/services/player.service';
import { TeamService } from '../../core/services/team.service';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    createOutline,
    personOutline,
    shirtOutline,
    starOutline,
    statsChartOutline,
    trophyOutline,
    chevronForwardOutline
} from 'ionicons/icons';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-player-details',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, UpperCasePipe, CommonModule],
    template: `
<ion-content>
    <div class="max-w-4xl mx-auto space-y-8 pb-20 mt-8">
        @if (player(); as p) {
            <!-- Header -->
            <div class="flex items-center justify-between px-4">
                <div class="flex items-center gap-4">
                    <a [routerLink]="['/players']"
                        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-accent text-brand-white hover:bg-brand-accent/80 transition-all">
                        <ion-icon name="arrow-back-outline" class="text-2xl"></ion-icon>
                    </a>
                    <h1 class="text-2xl font-bold">Player Profile</h1>
                </div>

                <a [routerLink]="['/players', p.id, 'edit']"
                    class="bg-brand-red text-white h-12 px-6 rounded-2xl flex items-center gap-2 font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20">
                    <ion-icon name="create-outline" class="text-xl"></ion-icon>
                    <span>Edit Profile</span>
                </a>
            </div>

            <!-- Hero Section -->
            <section class="relative">
                <div class="h-48 bg-gradient-to-r from-brand-red to-brand-red/50 rounded-[40px] opacity-20 mx-4"></div>
                <div class="absolute inset-x-0 -bottom-12 flex flex-col items-center">
                    <div class="w-32 h-32 rounded-[40px] bg-brand-dark border-4 border-brand-accent overflow-hidden shadow-2xl flex items-center justify-center text-brand-red text-4xl font-black">
                        @if (p.photo) {
                            <img [src]="p.photo" class="w-full h-full object-cover">
                        } @else {
                            {{ p.displayName[0] | uppercase }}
                        }
                    </div>
                </div>
            </section>

            <div class="pt-16 text-center space-y-2">
                <h2 class="text-3xl font-black uppercase tracking-tight">{{ p.fullName }}</h2>
                <div class="flex items-center justify-center gap-3">
                    <span class="px-3 py-1 bg-brand-red/10 text-brand-red rounded-lg text-xs font-bold uppercase tracking-widest">{{ p.role }}</span>
                    @if (p.jerseyNumber) {
                        <span class="text-brand-white/30 font-bold">#{{ p.jerseyNumber }}</span>
                    }
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-4">
                <!-- Info Grid -->
                <div class="md:col-span-2 space-y-6">
                    <!-- Specialization -->
                    <div class="bg-brand-accent/30 p-8 rounded-[40px] border border-brand-white/5 space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                                <ion-icon name="star-outline" class="text-xl"></ion-icon>
                            </div>
                            <h3 class="text-lg font-bold">Skills & Style</h3>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 bg-brand-dark/50 rounded-2xl border border-brand-white/5">
                                <p class="text-[10px] text-brand-white/30 uppercase font-black tracking-widest mb-1">Batting</p>
                                <p class="font-bold">{{ p.battingStyle }}</p>
                            </div>
                            <div class="p-4 bg-brand-dark/50 rounded-2xl border border-brand-white/5">
                                <p class="text-[10px] text-brand-white/30 uppercase font-black tracking-widest mb-1">Bowling</p>
                                <p class="font-bold">{{ p.bowlingStyle }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Teams -->
                    <div class="bg-brand-accent/30 p-8 rounded-[40px] border border-brand-white/5 space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                                <ion-icon name="shirt-outline" class="text-xl"></ion-icon>
                            </div>
                            <h3 class="text-lg font-bold">Teams</h3>
                        </div>

                        <div class="grid grid-cols-1 gap-3">
                            @for (tid of p.teams; track tid) {
                                @if (teamService.getTeamById(tid); as team) {
                                    <div class="flex items-center gap-4 p-4 bg-brand-dark/50 rounded-2xl border border-brand-white/5">
                                        <div class="w-12 h-12 rounded-xl bg-brand-accent flex items-center justify-center overflow-hidden border border-brand-white/10">
                                            @if (team.logo) {
                                                <img [src]="team.logo" class="w-full h-full object-cover">
                                            } @else {
                                                <span class="text-brand-red font-bold">{{ team.shortName }}</span>
                                            }
                                        </div>
                                        <div class="flex-1">
                                            <p class="font-bold">{{ team.name }}</p>
                                            <p class="text-[10px] text-brand-white/30 uppercase tracking-widest">{{ team.shortName }}</p>
                                        </div>
                                        <ion-icon name="chevron-forward-outline" class="text-brand-white/10"></ion-icon>
                                    </div>
                                }
                            } @empty {
                                <div class="text-center py-8 opacity-30 italic text-sm">No teams assigned yet</div>
                            }
                        </div>
                    </div>
                </div>

                <!-- Sidebar Stats -->
                <div class="space-y-6">
                    <div class="bg-brand-red p-8 rounded-[40px] text-white space-y-4">
                        <div class="flex items-center gap-3 opacity-70">
                            <ion-icon name="trophy-outline" class="text-xl"></ion-icon>
                            <h3 class="text-sm font-bold uppercase tracking-widest">Achievements</h3>
                        </div>
                        <div class="pt-4 space-y-4">
                            <div>
                                <p class="text-3xl font-black">0</p>
                                <p class="text-[10px] uppercase font-bold opacity-60">Matches Played</p>
                            </div>
                            <div>
                                <p class="text-3xl font-black">0</p>
                                <p class="text-[10px] uppercase font-bold opacity-60">Player of match</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } @else {
            <div class="h-screen flex items-center justify-center">
                <p class="text-brand-white/30 italic">Player not found</p>
            </div>
        }
    </div>
</ion-content>
`
})
export class PlayerDetailsPage {
    private route = inject(ActivatedRoute);
    private playerService = inject(PlayerService);
    public teamService = inject(TeamService);

    player = signal<Player | undefined>(undefined);

    constructor() {
        addIcons({
            arrowBackOutline,
            createOutline,
            personOutline,
            shirtOutline,
            starOutline,
            statsChartOutline,
            trophyOutline,
            chevronForwardOutline
        });

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.player.set(this.playerService.getPlayerById(id));
        }
    }
}
