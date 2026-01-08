import { Component, inject } from '@angular/core';
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

    constructor() {
        addIcons({ searchOutline, addOutline, ellipsisVerticalOutline, personOutline, shirtOutline, createOutline, trashOutline, eyeOutline });
    }

    deletePlayer(id: string) {
        if (confirm('Are you sure you want to delete this player?')) {
            this.playerService.deletePlayer(id);
        }
    }
}
