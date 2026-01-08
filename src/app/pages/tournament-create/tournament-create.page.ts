import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TeamService, Team } from '../../core/services/team.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    saveOutline,
    trophyOutline,
    shirtOutline,
    checkmarkCircleOutline,
    addOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-create',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, InputComponent, FormsModule],
    templateUrl: './tournament-create.page.html'
})
export class TournamentCreatePage {
    private teamService = inject(TeamService);
    private router = inject(Router);

    teams = this.teamService.teams;

    tournamentData = {
        name: '',
        format: 'League' as 'League' | 'Knockout',
        selectedTeams: [] as string[],
        pointsPerWin: 2,
        pointsPerDraw: 1
    };

    constructor() {
        addIcons({
            arrowBackOutline, saveOutline, trophyOutline,
            shirtOutline, checkmarkCircleOutline, addOutline
        });
    }

    toggleTeam(teamId: string) {
        const index = this.tournamentData.selectedTeams.indexOf(teamId);
        if (index > -1) {
            this.tournamentData.selectedTeams.splice(index, 1);
        } else {
            this.tournamentData.selectedTeams.push(teamId);
        }
    }

    createTournament() {
        if (!this.tournamentData.name || this.tournamentData.selectedTeams.length < 2) {
            alert('Please enter name and select at least 2 teams');
            return;
        }
        alert('Tournament created successfully!');
        this.router.navigate(['/dashboard']);
    }
}
