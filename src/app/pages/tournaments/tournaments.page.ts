import { Component, inject, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TournamentService, Tournament } from '../../core/services/tournament.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addOutline, trophyOutline, calendarOutline, locationOutline, chevronForwardOutline, peopleOutline } from 'ionicons/icons';

@Component({
    selector: 'app-tournaments',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, RouterLink],
    templateUrl: './tournaments.page.html'
})
export class TournamentsPage {
    private tournamentService = inject(TournamentService);
    tournaments = this.tournamentService.tournaments;

    constructor() {
        addIcons({
            addOutline, trophyOutline, calendarOutline,
            locationOutline, chevronForwardOutline, peopleOutline
        });
    }

    getStatusColor(status: string) {
        switch (status) {
            case 'live': return 'text-green-500 bg-green-500/10';
            case 'completed': return 'text-brand-white/40 bg-brand-white/5';
            default: return 'text-amber-500 bg-amber-500/10';
        }
    }
}
