import { Component, inject, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { PlayerService, Player } from '../../core/services/player.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, saveOutline, personOutline, shieldOutline, starOutline, cameraOutline } from 'ionicons/icons';
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
    private route = inject(ActivatedRoute);

    isEditMode = false;
    playerId: string | null = null;

    playerData: any = {
        fullName: '',
        displayName: '',
        role: 'Batsman' as Player['role'],
        battingStyle: 'Right-handed' as Player['battingStyle'],
        bowlingStyle: 'None' as Player['bowlingStyle'],
        jerseyNumber: '',
        photo: ''
    };

    roles: Player['role'][] = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];
    battingStyles: Player['battingStyle'][] = ['Right-handed', 'Left-handed'];
    bowlingStyles: Player['bowlingStyle'][] = ['Fast', 'Medium', 'Spin', 'None'];

    constructor() {
        addIcons({ arrowBackOutline, saveOutline, personOutline, shieldOutline, starOutline, cameraOutline });
        this.playerId = this.route.snapshot.paramMap.get('id');
        if (this.playerId) {
            this.isEditMode = true;
            const player = this.playerService.getPlayerById(this.playerId);
            if (player) {
                this.playerData = { ...player };
            }
        }
    }

    handlePhotoChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.playerData.photo = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    savePlayer() {
        if (!this.playerData.fullName || !this.playerData.displayName) {
            alert('Please fill in required fields');
            return;
        }

        if (this.isEditMode && this.playerId) {
            this.playerService.updatePlayer({
                ...this.playerData,
                id: this.playerId
            } as Player);
        } else {
            this.playerService.addPlayer(this.playerData);
        }

        this.router.navigate(['/players']);
    }
}
