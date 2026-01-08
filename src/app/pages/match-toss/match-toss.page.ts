import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService, Match } from '../../core/services/match.service';
import { TeamService } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { LiveMatchService } from '../../core/services/live-match.service';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    checkmarkCircleOutline,
    syncOutline,
    shirtOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

import { ActionSheetController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
    selector: 'app-match-toss',
    standalone: true,
    imports: [IonContent, IonIcon, FormsModule],
    templateUrl: './match-toss.page.html',
    styles: [`
    .coin {
      perspective: 1000px;
      width: 150px;
      height: 150px;
      position: relative;
      transition: transform 3s ease-in-out;
      transform-style: preserve-3d;
    }
    .coin-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 900;
      border: 6px solid #e6b800;
      background: linear-gradient(45deg, #ffd700, #ffcc33);
      color: #7a5c00;
      box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    }
    .tails {
      transform: rotateY(180deg);
    }
    .flipping {
      animation: flip 3s ease-in-out forwards;
    }
    @keyframes flip {
      0% { transform: rotateY(0); }
      100% { transform: rotateY(var(--flip-to)); }
    }
  `]
})
export class MatchTossPage {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private matchService = inject(MatchService);
    private teamService = inject(TeamService);
    public playerService = inject(PlayerService);
    public liveMatchService = inject(LiveMatchService);
    public location = inject(Location);

    match = signal<Match | undefined>(undefined);

    isFlipping = signal(false);
    tossResult = signal<'heads' | 'tails' | null>(null);
    flipRotation = signal(0);

    tossWinnerId = signal<string | null>(null);
    decision = signal<'bat' | 'bowl' | null>(null);

    // Opening players selection
    strikerId = signal('');
    nonStrikerId = signal('');
    bowlerId = signal('');

    teamA = computed(() => this.teamService.getTeamById(this.match()?.teamAId || ''));
    teamB = computed(() => this.teamService.getTeamById(this.match()?.teamBId || ''));

    constructor() {
        addIcons({ arrowBackOutline, checkmarkCircleOutline, syncOutline, shirtOutline });
        const matchId = this.route.snapshot.paramMap.get('id');
        if (matchId) {
            this.match.set(this.matchService.getMatchById(matchId));
        }
    }

    flipCoin() {
        if (this.isFlipping()) return;

        this.isFlipping.set(true);
        this.tossResult.set(null);

        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        const rotations = 10 + (result === 'heads' ? 0 : 0.5);
        this.flipRotation.set(rotations * 360);

        setTimeout(() => {
            this.isFlipping.set(false);
            this.tossResult.set(result);
        }, 3000);
    }

    getTeamPlayers(teamId: string): Player[] {
        const match = this.match();
        if (!match) return [];
        const playerIds = teamId === match.teamAId ? match.teamAPlayers : match.teamBPlayers;
        return playerIds.map(id => this.playerService.getPlayerById(id)!).filter(p => !!p);
    }

    startMatch() {
        const match = this.match();
        if (!match || !this.tossWinnerId() || !this.decision() || !this.strikerId() || !this.nonStrikerId() || !this.bowlerId()) {
            alert('Please complete all selections');
            return;
        }

        const updatedMatch: Match = {
            ...match,
            status: 'live',
            toss: {
                winnerId: this.tossWinnerId()!,
                decision: this.decision()!
            }
        };
        this.matchService.updateMatch(updatedMatch);

        const battingTeamId = this.decision() === 'bat' ? this.tossWinnerId()! : (this.tossWinnerId() === match.teamAId ? match.teamBId : match.teamAId);
        const bowlingTeamId = battingTeamId === match.teamAId ? match.teamBId : match.teamAId;

        this.liveMatchService.startInnings(
            match.id,
            battingTeamId,
            bowlingTeamId,
            this.strikerId(),
            this.nonStrikerId(),
            this.bowlerId()
        );

        this.router.navigate(['/match', match.id, 'scoring']);
    }
}
