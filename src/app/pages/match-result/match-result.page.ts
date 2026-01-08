import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService, Match } from '../../core/services/match.service';
import { TeamService } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { LiveMatchService } from '../../core/services/live-match.service';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    checkmarkCircleOutline,
    trophyOutline,
    shareSocialOutline,
    homeOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-result',
    standalone: true,
    imports: [IonContent, IonIcon, FormsModule, CommonModule],
    templateUrl: './match-result.page.html'
})
export class MatchResultPage {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private matchService = inject(MatchService);
    private teamService = inject(TeamService);
    public playerService = inject(PlayerService);
    public liveMatchService = inject(LiveMatchService);

    match = signal<Match | undefined>(undefined);
    inningsState = this.liveMatchService.inningsState;

    manOfTheMatchId = signal('');

    winner = computed(() => {
        const state = this.inningsState();
        if (!state) return undefined;
        return this.teamService.getTeamById(state.battingTeamId);
    });

    constructor() {
        addIcons({ arrowBackOutline, checkmarkCircleOutline, trophyOutline, shareSocialOutline, homeOutline });
        const matchId = this.route.snapshot.paramMap.get('id');
        if (matchId) {
            const m = this.matchService.getMatchById(matchId);
            this.match.set(m);
            if (m && m.status === 'live') {
                this.liveMatchService.loadState(matchId);
            }
        }
    }

    getPlayers(): Player[] {
        const match = this.match();
        if (!match) return [];
        const allIds = [...match.teamAPlayers, ...match.teamBPlayers];
        return allIds.map(id => this.playerService.getPlayerById(id)!).filter(p => !!p);
    }

    finalizeMatch() {
        const match = this.match();
        if (!match) return;

        const updatedMatch: Match = {
            ...match,
            status: 'completed',
            result: {
                winnerId: this.winner()?.id,
                margin: `${this.inningsState()?.runs} runs`,
                manOfTheMatchId: this.manOfTheMatchId()
            }
        };

        this.matchService.updateMatch(updatedMatch);
        alert('Match history updated!');
        this.router.navigate(['/dashboard']);
    }
}
