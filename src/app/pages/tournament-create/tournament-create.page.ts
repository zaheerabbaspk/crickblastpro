import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TeamService, Team } from '../../core/services/team.service';
import { TournamentService } from '../../core/services/tournament.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    saveOutline,
    trophyOutline,
    shirtOutline,
    checkmarkCircleOutline,
    addOutline,
    calendarOutline,
    timeOutline,
    checkmark,
    alertCircleOutline,
    closeOutline,
    listOutline,
    chevronDownOutline
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
    private tournamentService = inject(TournamentService);
    private router = inject(Router);

    teams = this.teamService.teams;

    tournamentData = {
        name: '',
        format: 'League' as 'League' | 'Knockout' | 'League + Knockout',
        overs: 20,
        selectedTeams: [] as string[],
        pointsPerWin: 2,
        pointsPerDraw: 1,
        pointsPerLoss: 0,
        bonusPoints: false,
        venue: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        fixtures: [] as any[]
    };

    fixtureInput = {
        teamAId: '',
        teamBId: '',
        venue: '',
        date: new Date().toISOString().split('T')[0],
        time: '14:00'
    };

    constructor() {
        addIcons({
            arrowBackOutline, saveOutline, trophyOutline,
            shirtOutline, checkmarkCircleOutline, addOutline,
            calendarOutline, timeOutline, checkmark, alertCircleOutline,
            closeOutline, listOutline, chevronDownOutline
        });
    }

    toggleTeam(teamId: string) {
        const index = this.tournamentData.selectedTeams.indexOf(teamId);
        if (index > -1) {
            this.tournamentData.selectedTeams.splice(index, 1);
            // Also remove any fixtures involving this team
            this.tournamentData.fixtures = this.tournamentData.fixtures.filter(
                f => f.teamAId !== teamId && f.teamBId !== teamId
            );
        } else {
            this.tournamentData.selectedTeams.push(teamId);
        }
    }

    addFixture() {
        const { teamAId, teamBId, venue, date, time } = this.fixtureInput;
        if (!teamAId || !teamBId || teamAId === teamBId) {
            alert('Please select two different teams');
            return;
        }

        this.tournamentData.fixtures.push({
            id: Date.now().toString(),
            teamAId,
            teamBId,
            venue: venue || this.tournamentData.venue,
            date,
            time,
            status: 'upcoming'
        });

        // Reset inputs partially
        this.fixtureInput.teamAId = '';
        this.fixtureInput.teamBId = '';
    }

    removeFixture(id: string) {
        this.tournamentData.fixtures = this.tournamentData.fixtures.filter(f => f.id !== id);
    }

    getTeamName(teamId: string) {
        return this.teams().find(t => t.id === teamId)?.name || 'Unknown Team';
    }

    getSelectedTeams() {
        return this.teams().filter(t => this.tournamentData.selectedTeams.includes(t.id));
    }

    createTournament() {
        if (!this.tournamentData.name || this.tournamentData.selectedTeams.length < 2) {
            alert('Please enter name and select at least 2 teams');
            return;
        }

        this.tournamentService.addTournament({
            name: this.tournamentData.name,
            format: this.tournamentData.format,
            overs: this.tournamentData.overs,
            selectedTeams: this.tournamentData.selectedTeams,
            fixtures: this.tournamentData.fixtures,
            pointsPerWin: this.tournamentData.pointsPerWin,
            pointsPerDraw: this.tournamentData.pointsPerDraw,
            pointsPerLoss: this.tournamentData.pointsPerLoss,
            bonusPoints: this.tournamentData.bonusPoints,
            venue: this.tournamentData.venue,
            startDate: this.tournamentData.startDate,
            endDate: this.tournamentData.endDate
        });

        alert('Tournament created successfully!');
        this.router.navigate(['/dashboard']);
    }
}
