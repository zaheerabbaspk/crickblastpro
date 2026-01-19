import { Component, inject, computed, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TournamentService, Tournament, TournamentFixture } from '../../core/services/tournament.service';
import { TeamService } from '../../core/services/team.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline, trophyOutline, calendarOutline,
    locationOutline, peopleOutline, settingsOutline,
    statsChartOutline, playOutline, chevronForwardOutline,
    alertCircleOutline
} from 'ionicons/icons';

interface TeamStanding {
    teamId: string;
    name: string;
    shortName: string;
    played: number;
    won: number;
    lost: number;
    drawn: number;
    points: number;
    nrr: number;
}

@Component({
    selector: 'app-tournament-details',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, RouterLink],
    templateUrl: './tournament-info.page.html'
})
export class TournamentDetailsPage {
    private route = inject(ActivatedRoute);
    private tournamentService = inject(TournamentService);
    private teamService = inject(TeamService);

    tournamentId = this.route.snapshot.paramMap.get('id');
    tournament = computed(() => this.tournamentService.getTournamentById(this.tournamentId || ''));

    activeTab = signal<'fixtures' | 'standings' | 'stats'>('fixtures');

    standings = computed(() => {
        const t = this.tournament();
        if (!t) return [];

        const teams = t.selectedTeams.map(id => {
            const team = this.teamService.getTeamById(id);
            return {
                teamId: id,
                name: team?.name || 'Unknown',
                shortName: team?.shortName || '?',
                played: 0,
                won: 0,
                lost: 0,
                drawn: 0,
                points: 0,
                nrr: 0
            } as TeamStanding;
        });

        return teams.sort((a, b) => b.points - a.points || b.nrr - a.nrr);
    });

    constructor() {
        addIcons({
            arrowBackOutline, trophyOutline, calendarOutline,
            locationOutline, peopleOutline, settingsOutline,
            statsChartOutline, playOutline, chevronForwardOutline,
            alertCircleOutline
        });
    }

    getTeamName(teamId: string) {
        return this.teamService.getTeamById(teamId)?.name || 'Unknown Team';
    }

    getTeamShortName(teamId: string) {
        return this.teamService.getTeamById(teamId)?.shortName || '??';
    }

    getStatusColor(status: string) {
        switch (status) {
            case 'live': return 'text-green-500 bg-green-500/10';
            case 'completed': return 'text-brand-white/40 bg-brand-white/5';
            default: return 'text-amber-500 bg-amber-500/10';
        }
    }
}
