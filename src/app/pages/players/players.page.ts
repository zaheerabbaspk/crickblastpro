import { Component, inject, signal, HostListener, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { PlayerService, Player } from '../../core/services/player.service';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
    searchOutline,
    addOutline,
    ellipsisVerticalOutline,
    personOutline,
    shirtOutline,
    createOutline,
    trashOutline,
    eyeOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-players',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, UpperCasePipe],
    templateUrl: './players.page.html'
})
export class PlayersPage {
    private playerService = inject(PlayerService);
    players = this.playerService.players;
    searchTerm = signal('');

    filteredPlayers = computed(() => {
        const term = this.searchTerm().toLowerCase();
        if (!term) return this.players();
        return this.players().filter(p =>
            p.fullName.toLowerCase().includes(term) ||
            p.displayName.toLowerCase().includes(term)
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
        addIcons({ searchOutline, addOutline, ellipsisVerticalOutline, personOutline, shirtOutline, createOutline, trashOutline, eyeOutline });
    }

    deletePlayer(id: string) {
        if (confirm('Are you sure you want to delete this player?')) {
            this.playerService.deletePlayer(id);
        }
    }
}
