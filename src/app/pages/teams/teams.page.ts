import { Component, inject, signal, HostListener, computed } from '@angular/core';
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
    searchTerm = signal('');

    filteredTeams = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) return this.teams();
        return this.teams().filter(t =>
            t.name.toLowerCase().includes(term) ||
            t.shortName.toLowerCase().includes(term)
        );
    });

    activeMenuId = signal<string | null>(null);

    @HostListener('document:click')
    closeMenu() {
        this.activeMenuId.set(null);
    }

    toggleMenu(event: Event, id: string) {
        event.stopPropagation();
        this.activeMenuId.set(this.activeMenuId() === id ? null : id);
    }

    constructor() {
        addIcons({ searchOutline, addOutline, ellipsisVerticalOutline, shirtOutline, peopleOutline, createOutline, trashOutline, eyeOutline });
    }

    deleteTeam(id: string) {
        if (confirm('Are you sure you want to delete this team?')) {
            this.teamService.deleteTeam(id);
        }
    }
}
