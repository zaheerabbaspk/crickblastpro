import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TeamService, Team } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { MatchService } from '../../core/services/match.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    arrowForwardOutline,
    saveOutline,
    shirtOutline,
    peopleOutline,
    settingsOutline,
    locationOutline,
    checkmarkCircleOutline,
    trophyOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-match-create',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, InputComponent, FormsModule],
    templateUrl: './match-create.page.html'
})
export class MatchCreatePage {
    private teamService = inject(TeamService);
    private playerService = inject(PlayerService);
    private matchService = inject(MatchService);
    private router = inject(Router);

    currentStep = signal(1);
    teams = this.teamService.teams;

    matchData = {
        name: '',
        format: 'Friendly' as 'Friendly' | 'League' | 'Knockout',
        overs: 20,
        teamAId: '',
        teamBId: '',
        teamAPlayers: [] as string[],
        teamBPlayers: [] as string[],
        venue: '',
        umpires: ''
    };

    getTeamPlayers(teamId: string): Player[] {
        const team = this.teams().find(t => t.id === teamId);
        if (!team) return [];
        return team.players.map(pid => this.playerService.getPlayerById(pid)!).filter(p => !!p);
    }

    getTeamShortName(teamId: string): string {
        const team = this.teams().find(t => t.id === teamId);
        return team ? team.shortName : '';
    }

    getTeamName(teamId: string): string {
        const team = this.teams().find(t => t.id === teamId);
        return team ? team.name : '';
    }

    constructor() {
        addIcons({
            arrowBackOutline, arrowForwardOutline, saveOutline, shirtOutline,
            peopleOutline, settingsOutline, locationOutline, checkmarkCircleOutline, trophyOutline
        });
    }

    nextStep() {
        if (this.currentStep() === 1 && !this.matchData.name) {
            alert('Please enter match name');
            return;
        }
        if (this.currentStep() === 2 && (!this.matchData.teamAId || !this.matchData.teamBId)) {
            alert('Please select both teams');
            return;
        }
        if (this.currentStep() === 2 && this.matchData.teamAId === this.matchData.teamBId) {
            alert('Teams must be different');
            return;
        }
        this.currentStep.update(s => s + 1);
    }

    prevStep() {
        this.currentStep.update(s => s - 1);
    }

    togglePlayer(team: 'A' | 'B', playerId: string) {
        const list = team === 'A' ? this.matchData.teamAPlayers : this.matchData.teamBPlayers;
        const index = list.indexOf(playerId);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(playerId);
        }
    }

    createMatch() {
        if (!this.matchData.name || !this.matchData.teamAId || !this.matchData.teamBId) return;

        const match = this.matchService.addMatch({
            name: this.matchData.name,
            format: this.matchData.format,
            overs: this.matchData.overs,
            teamAId: this.matchData.teamAId,
            teamBId: this.matchData.teamBId,
            teamAPlayers: this.matchData.teamAPlayers,
            teamBPlayers: this.matchData.teamBPlayers,
            venue: this.matchData.venue,
            umpires: this.matchData.umpires
        });

        alert('Match created! Let\'s go to the toss.');
        this.router.navigate(['/match', match.id, 'toss']);
    }
}
