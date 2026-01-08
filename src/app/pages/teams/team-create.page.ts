import { Component, inject, signal, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TeamService, Team } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    saveOutline,
    shirtOutline,
    peopleOutline,
    addOutline,
    closeOutline,
    checkmarkCircleOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-team-create',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, InputComponent, FormsModule, UpperCasePipe],
    templateUrl: './team-create.page.html'
})
export class TeamCreatePage {
    private teamService = inject(TeamService);
    private playerService = inject(PlayerService);
    private router = inject(Router);

    allPlayers = this.playerService.players;

    teamData = {
        name: '',
        shortName: '',
        players: [] as string[],
        captainId: '',
        wicketkeeperId: ''
    };

    // Inline Player Creation State
    showInlinePlayerForm = signal(false);
    newPlayerData = {
        fullName: '',
        displayName: '',
        role: 'Batsman' as Player['role'],
        battingStyle: 'Right-handed' as Player['battingStyle'],
        bowlingStyle: 'None' as Player['bowlingStyle']
    };

    searchTerm = signal('');
    filteredPlayers = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.allPlayers().filter(p =>
            p.fullName.toLowerCase().includes(term) ||
            p.displayName.toLowerCase().includes(term)
        );
    });

    getPlayerDisplayName(id: string): string {
        return this.allPlayers().find(p => p.id === id)?.displayName || '';
    }

    constructor() {
        addIcons({
            arrowBackOutline, saveOutline, shirtOutline, peopleOutline,
            addOutline, closeOutline, checkmarkCircleOutline
        });
    }

    togglePlayerSelection(playerId: string) {
        const index = this.teamData.players.indexOf(playerId);
        if (index > -1) {
            this.teamData.players.splice(index, 1);
            if (this.teamData.captainId === playerId) this.teamData.captainId = '';
            if (this.teamData.wicketkeeperId === playerId) this.teamData.wicketkeeperId = '';
        } else {
            this.teamData.players.push(playerId);
        }
    }

    isPlayerSelected(playerId: string): boolean {
        return this.teamData.players.includes(playerId);
    }

    createPlayerInline() {
        if (!this.newPlayerData.fullName || !this.newPlayerData.displayName) return;
        const addedPlayer = this.playerService.addPlayer({
            fullName: this.newPlayerData.fullName,
            displayName: this.newPlayerData.displayName,
            role: this.newPlayerData.role,
            battingStyle: this.newPlayerData.battingStyle,
            bowlingStyle: this.newPlayerData.bowlingStyle
        });
        this.togglePlayerSelection(addedPlayer.id);
        this.resetInlineForm();
    }

    resetInlineForm() {
        this.showInlinePlayerForm.set(false);
        this.newPlayerData = {
            fullName: '',
            displayName: '',
            role: 'Batsman',
            battingStyle: 'Right-handed',
            bowlingStyle: 'None'
        };
    }

    saveTeam() {
        if (!this.teamData.name || !this.teamData.shortName) {
            alert('Please fill in team name and short name');
            return;
        }
        if (this.teamData.players.length === 0) {
            alert('Please add at least one player to the team');
            return;
        }
        this.teamService.addTeam(this.teamData);
        this.router.navigate(['/teams']);
    }
}
