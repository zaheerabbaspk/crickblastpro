import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TeamService, Team } from '../../core/services/team.service';
import { PlayerService } from '../../core/services/player.service';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
    searchOutline,
    addOutline,
    ellipsisVerticalOutline,
    shirtOutline,
    peopleOutline,
    createOutline,
    trashOutline,
    eyeOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-teams',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, UpperCasePipe],
    templateUrl: './teams.page.html'
})
export class TeamsPage {
    private teamService = inject(TeamService);
    teams = this.teamService.teams;

    constructor() {
        addIcons({ searchOutline, addOutline, ellipsisVerticalOutline, shirtOutline, peopleOutline, createOutline, trashOutline, eyeOutline });
    }

    deleteTeam(id: string) {
        if (confirm('Are you sure you want to delete this team?')) {
            this.teamService.deleteTeam(id);
        }
    }
}
