import { Component, inject, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { PlayerService, Player } from '../../core/services/player.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, saveOutline, personOutline, shieldOutline, starOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-player-create',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, InputComponent, FormsModule],
    templateUrl: './player-create.page.html'
})
export class PlayerCreatePage {
    private playerService = inject(PlayerService);
    private router = inject(Router);

    playerData = {
        fullName: '',
        displayName: '',
        role: 'Batsman' as Player['role'],
        battingStyle: 'Right-handed' as Player['battingStyle'],
        bowlingStyle: 'None' as Player['bowlingStyle'],
        jerseyNumber: ''
    };

    roles: Player['role'][] = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];
    battingStyles: Player['battingStyle'][] = ['Right-handed', 'Left-handed'];
    bowlingStyles: Player['bowlingStyle'][] = ['Fast', 'Medium', 'Spin', 'None'];

    constructor() {
        addIcons({ arrowBackOutline, saveOutline, personOutline, shieldOutline, starOutline });
    }

    savePlayer() {
        if (!this.playerData.fullName || !this.playerData.displayName) {
            alert('Please fill in required fields');
            return;
        }
        this.playerService.addPlayer(this.playerData);
        this.router.navigate(['/players']);
    }
}
