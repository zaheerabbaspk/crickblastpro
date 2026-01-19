import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService, Team } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    createOutline,
    shirtOutline,
    peopleOutline,
    personOutline,
    trophyOutline,
    checkmarkCircleOutline,
    chevronForwardOutline
} from 'ionicons/icons';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-team-details',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, UpperCasePipe, CommonModule],
    template: `
<ion-content>
    <div class="max-w-4xl mx-auto space-y-8 pb-20 mt-8">
        @if (team(); as t) {
            <!-- Header -->
            <div class="flex items-center justify-between px-4">
                <div class="flex items-center gap-4">
                    <a [routerLink]="['/teams']"
                        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-accent text-brand-white hover:bg-brand-accent/80 transition-all">
                        <ion-icon name="arrow-back-outline" class="text-2xl"></ion-icon>
                    </a>
                    <h1 class="text-2xl font-bold">Team Profile</h1>
                </div>

                <a [routerLink]="['/teams', t.id, 'edit']"
                    class="bg-brand-red text-white h-12 px-6 rounded-2xl flex items-center gap-2 font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20">
                    <ion-icon name="create-outline" class="text-xl"></ion-icon>
                    <span>Edit Team</span>
                </a>
            </div>

            <!-- Hero Section -->
            <section class="relative">
                <div class="h-48 bg-gradient-to-r from-brand-red to-brand-red/50 rounded-[40px] opacity-20 mx-4"></div>
                <div class="absolute inset-x-0 -bottom-12 flex flex-col items-center">
                    <div class="w-32 h-32 rounded-[40px] bg-brand-dark border-4 border-brand-accent overflow-hidden shadow-2xl flex items-center justify-center text-brand-red text-4xl font-black">
                        @if (t.logo) {
                            <img [src]="t.logo" class="w-full h-full object-cover">
                        } @else {
                            {{ t.shortName | uppercase }}
                        }
                    </div>
                </div>
            </section>

            <div class="pt-16 text-center space-y-2 px-4">
                <h2 class="text-3xl font-black uppercase tracking-tight">{{ t.name }}</h2>
                <p class="text-[10px] text-brand-white/40 uppercase font-bold tracking-[0.4em]">{{ t.shortName }} • {{ t.players.length }} PLAYERS</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-4">
                <!-- Main Info -->
                <div class="md:col-span-2 space-y-6">
                    <!-- Squad -->
                    <div class="bg-brand-accent/30 p-8 rounded-[40px] border border-brand-white/5 space-y-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                                    <ion-icon name="people-outline" class="text-xl"></ion-icon>
                                </div>
                                <h3 class="text-lg font-bold">Playing Squad</h3>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            @for (pid of t.players; track pid) {
                                @if (playerService.getPlayerById(pid); as p) {
                                    <div class="flex items-center gap-3 p-3 bg-brand-dark/50 rounded-2xl border border-brand-white/5 hover:border-brand-red/30 transition-all cursor-pointer group"
                                         [routerLink]="['/players', p.id]">
                                        <div class="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center overflow-hidden border border-brand-white/10">
                                            @if (p.photo) {
                                                <img [src]="p.photo" class="w-full h-full object-cover">
                                            } @else {
                                                <span class="text-brand-red font-bold text-xs">{{ p.displayName[0] | uppercase }}</span>
                                            }
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold group-hover:text-brand-red transition-colors">{{ p.fullName }}</p>
                                            <p class="text-[8px] text-brand-white/30 uppercase font-black tracking-widest">{{ p.role }}</p>
                                        </div>
                                        @if (pid === t.captainId) {
                                            <div class="w-6 h-6 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center text-[10px] font-black" title="Captain">C</div>
                                        }
                                        @if (pid === t.wicketkeeperId) {
                                            <div class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-black" title="Wicketkeeper">WK</div>
                                        }
                                    </div>
                                }
                            }
                        </div>
                    </div>
                </div>

                <!-- Sidebar Roles -->
                <div class="space-y-6">
                    <div class="bg-brand-accent p-8 rounded-[40px] border border-brand-white/5 space-y-6">
                        <h3 class="text-sm font-black uppercase text-brand-white/20 tracking-widest">Key Roles</h3>
                        
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-brand-white/5 flex items-center justify-center text-brand-red font-black">C</div>
                                <div>
                                    <p class="text-[10px] text-brand-white/30 uppercase font-bold mb-1">Captain</p>
                                    <p class="font-bold">{{ getPlayerName(t.captainId) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-brand-white/5 flex items-center justify-center text-blue-500 font-black">WK</div>
                                <div>
                                    <p class="text-[10px] text-brand-white/30 uppercase font-bold mb-1">Wicketkeeper</p>
                                    <p class="font-bold">{{ getPlayerName(t.wicketkeeperId) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-brand-red/10 p-8 rounded-[40px] border border-brand-red/20 text-center">
                        <ion-icon name="trophy-outline" class="text-3xl text-brand-red mb-2"></ion-icon>
                        <p class="text-[10px] uppercase font-bold text-brand-red tracking-widest">Team Wins</p>
                        <p class="text-3xl font-black text-brand-red">0</p>
                    </div>
                </div>
            </div>
        } @else {
            <div class="h-screen flex items-center justify-center">
                <p class="text-brand-white/30 italic">Team not found</p>
            </div>
        }
    </div>
</ion-content>
`
})
export class TeamDetailsPage {
    private route = inject(ActivatedRoute);
    private teamService = inject(TeamService);
    public playerService = inject(PlayerService);

    team = signal<Team | undefined>(undefined);

    constructor() {
        addIcons({
            arrowBackOutline,
            createOutline,
            shirtOutline,
            peopleOutline,
            personOutline,
            trophyOutline,
            checkmarkCircleOutline,
            chevronForwardOutline
        });

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.team.set(this.teamService.getTeamById(id));
        }
    }

    getPlayerName(id?: string): string {
        if (!id) return 'Not Assigned';
        return this.playerService.getPlayerById(id)?.fullName || 'Not Assigned';
    }
}
