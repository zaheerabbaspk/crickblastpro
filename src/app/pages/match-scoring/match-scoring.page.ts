import { Component, inject, signal, computed, effect } from '@angular/core';
import { IonContent, IonIcon, IonModal } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService, Match } from '../../core/services/match.service';
import { TeamService, Team } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { LiveMatchService, BallEvent, InningsState } from '../../core/services/live-match.service';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    arrowUndoOutline,
    checkmarkCircleOutline,
    statsChartOutline,
    refreshOutline,
    alertCircleOutline,
    shirtOutline,
    personOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-scoring',
    standalone: true,
    imports: [IonContent, IonIcon, IonModal, FormsModule, CommonModule],
    templateUrl: './match-scoring.page.html'
})
export class MatchScoringPage {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private matchService = inject(MatchService);
    private teamService = inject(TeamService);
    public playerService = inject(PlayerService);
    public liveMatchService = inject(LiveMatchService);

    match = signal<Match | undefined>(undefined);

    // UI states
    showWicketModal = signal(false);
    wicketData = {
        type: 'bowled' as 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'others',
        playerDismissedId: '',
        fielderId: ''
    };

    showNextBatsmanModal = signal(false);
    nextBatsmanId = signal('');

    showEndInningsModal = signal(false);

    // Computed data
    inningsState = this.liveMatchService.inningsState;
    battingTeam = computed(() => this.teamService.getTeamById(this.inningsState()?.battingTeamId || ''));
    bowlingTeam = computed(() => this.teamService.getTeamById(this.inningsState()?.bowlingTeamId || ''));

    striker = computed(() => this.playerService.getPlayerById(this.inningsState()?.strikerId || ''));
    nonStriker = computed(() => this.playerService.getPlayerById(this.inningsState()?.nonStrikerId || ''));
    currentBowler = computed(() => this.playerService.getPlayerById(this.inningsState()?.currentBowlerId || ''));

    currentInningsEvents = computed(() => {
        const state = this.inningsState();
        if (!state) return [];
        return this.liveMatchService.matchEvents()
            .filter(e => e.innings === state.inningsNum)
            .slice()
            .reverse();
    });

    // In-match calculations
    target = computed(() => {
        const state = this.inningsState();
        if (state?.inningsNum === 2 && state.firstInningsScore !== undefined) {
            return state.firstInningsScore + 1;
        }
        return undefined;
    });

    runsNeeded = computed(() => {
        const state = this.inningsState();
        const t = this.target();
        if (state && t !== undefined) {
            return Math.max(0, t - state.runs);
        }
        return undefined;
    });

    // Second innings setup state
    showInningsSetupModal = signal(false);
    newStrikerId = signal('');
    newNonStrikerId = signal('');
    newBowlerId = signal('');

    constructor() {
        addIcons({
            arrowBackOutline, arrowUndoOutline, checkmarkCircleOutline,
            statsChartOutline, refreshOutline, alertCircleOutline,
            shirtOutline, personOutline
        });

        const matchId = this.route.snapshot.paramMap.get('id');
        if (matchId) {
            this.match.set(this.matchService.getMatchById(matchId));
            this.liveMatchService.loadState(matchId);
        }
    }

    recordRuns(runs: number, isExtra: boolean = false, extraType: BallEvent['extras']['type'] = 'none') {
        const state = this.inningsState();
        if (!state) return;

        this.liveMatchService.recordBall({
            innings: state.inningsNum,
            over: Math.floor(state.balls / 6),
            ball: (state.balls % 6) + 1,
            strikerId: state.strikerId,
            nonStrikerId: state.nonStrikerId,
            bowlerId: state.currentBowlerId,
            runs: isExtra ? 0 : runs,
            isValidBall: ['wide', 'no-ball'].indexOf(extraType) === -1,
            extras: {
                type: extraType,
                runs: isExtra ? runs : 0
            }
        });

        this.checkMatchEnd();
    }

    openWicketModal() {
        this.wicketData.playerDismissedId = this.inningsState()?.strikerId || '';
        this.showWicketModal.set(true);
    }

    confirmWicket() {
        const state = this.inningsState();
        if (!state) return;

        this.liveMatchService.recordBall({
            innings: 1,
            over: Math.floor(state.balls / 6),
            ball: (state.balls % 6) + 1,
            strikerId: state.strikerId,
            nonStrikerId: state.nonStrikerId,
            bowlerId: state.currentBowlerId,
            runs: 0,
            isValidBall: true,
            extras: { type: 'none', runs: 0 },
            wicket: {
                type: this.wicketData.type,
                playerDismissedId: this.wicketData.playerDismissedId,
                fielderId: this.wicketData.fielderId
            }
        });

        this.showWicketModal.set(false);

        // Check if innings ended or need new batsman
        if (state.wickets + 1 >= (this.getBattingTeamPlayersCount() - 1)) {
            this.endInnings();
        } else {
            this.showNextBatsmanModal.set(true);
        }
    }

    selectNextBatsman() {
        if (!this.nextBatsmanId()) return;

        this.inningsState.update(s => s ? ({ ...s, strikerId: this.nextBatsmanId() }) : null);
        this.showNextBatsmanModal.set(false);
        this.nextBatsmanId.set('');
    }

    undoLastBall() {
        // Need to implement undo in service
        alert('Undo feature coming soon!');
    }

    checkMatchEnd() {
        const state = this.inningsState();
        const match = this.match();
        if (!state || !match) return;

        // Condition for 2nd innings win
        if (state.inningsNum === 2 && state.firstInningsScore !== undefined) {
            if (state.runs > state.firstInningsScore) {
                this.endInnings();
                return;
            }
        }

        // Overs completed
        if (state.balls >= match.overs * 6) {
            this.endInnings();
        }
    }

    endInnings() {
        this.showEndInningsModal.set(true);
    }

    proceedToNextInnings() {
        const state = this.inningsState();
        if (state?.inningsNum === 1) {
            this.showEndInningsModal.set(false);
            this.showInningsSetupModal.set(true);
        } else {
            const match = this.match();
            if (match) {
                this.router.navigate(['/match', match.id, 'result']);
            }
        }
    }

    startSecondInnings() {
        if (!this.newStrikerId() || !this.newNonStrikerId() || !this.newBowlerId()) {
            alert('Please select all opening players');
            return;
        }

        this.liveMatchService.switchInnings(
            this.newStrikerId(),
            this.newNonStrikerId(),
            this.newBowlerId()
        );

        this.showInningsSetupModal.set(false);
        this.newStrikerId.set('');
        this.newNonStrikerId.set('');
        this.newBowlerId.set('');
    }

    getBattingTeamPlayersCount(): number {
        const state = this.inningsState();
        const match = this.match();
        if (!state || !match) return 11;

        return state.battingTeamId === match.teamAId ? match.teamAPlayers.length : match.teamBPlayers.length;
    }

    getBowlerTeamPlayers(): Player[] {
        const match = this.match();
        if (!match) return [];
        const state = this.inningsState();
        const teamId = state?.bowlingTeamId || '';
        const playerIds = teamId === match.teamAId ? match.teamAPlayers : match.teamBPlayers;
        return playerIds.map(id => this.playerService.getPlayerById(id)!).filter(p => !!p);
    }

    getBattingTeamPlayers(): Player[] {
        const state = this.inningsState();
        if (!state) return [];
        const match = this.match();
        if (!match) return [];

        const playerIds = state.battingTeamId === match.teamAId ? match.teamAPlayers : match.teamBPlayers;
        const outPlayerIds = state.fallOfWickets.map(f => f.playerId);

        return playerIds
            .filter(id => id !== state.strikerId && id !== state.nonStrikerId && !outPlayerIds.includes(id))
            .map(id => this.playerService.getPlayerById(id)!)
            .filter(p => !!p);
    }

    getPlayersByTeamId(teamId: string): Player[] {
        const match = this.match();
        if (!match) return [];

        const playerIds = teamId === match.teamAId ? match.teamAPlayers : match.teamBPlayers;
        return playerIds.map(id => this.playerService.getPlayerById(id)!).filter(p => !!p);
    }

    getPlayerStats(playerId: string) {
        const events = this.liveMatchService.matchEvents().filter(e => e.strikerId === playerId && e.isValidBall);
        const runs = events.reduce((sum, e) => sum + e.runs, 0);
        const balls = events.length;
        const fours = events.filter(e => e.runs === 4).length;
        const sixes = events.filter(e => e.runs === 6).length;
        return { runs, balls, fours, sixes };
    }

    getBowlerStats(playerId: string) {
        const events = this.liveMatchService.matchEvents().filter(e => e.bowlerId === playerId);
        const validBalls = events.filter(e => e.isValidBall).length;
        const runs = events.reduce((sum, e) => sum + e.runs + e.extras.runs, 0);
        const wickets = events.filter(e => e.wicket).length;
        return {
            overs: this.liveMatchService.getBallsFormatted(validBalls),
            runs,
            wickets
        };
    }
}
