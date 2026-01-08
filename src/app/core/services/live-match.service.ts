import { Injectable, signal, computed } from '@angular/core';
import { Match } from './match.service';

export interface BallEvent {
    id: string;
    matchId: string;
    innings: 1 | 2;
    over: number;
    ball: number;
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    runs: number;
    isValidBall: boolean;
    extras: {
        type: 'none' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
        runs: number;
    };
    wicket?: {
        type: 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'others';
        playerDismissedId: string;
        fielderId?: string;
    };
    timestamp: number;
}

export interface InningsState {
    battingTeamId: string;
    bowlingTeamId: string;
    runs: number;
    wickets: number;
    balls: number; // total valid balls
    currentOverBalls: BallEvent[];
    strikerId: string;
    nonStrikerId: string;
    currentBowlerId: string;
    fallOfWickets: { score: number, over: string, playerId: string }[];
}

@Injectable({
    providedIn: 'root'
})
export class LiveMatchService {
    private STORAGE_KEY_PREFIX = 'cb_live_match_';

    currentMatchId = signal<string | null>(null);
    inningsState = signal<InningsState | null>(null);
    matchEvents = signal<BallEvent[]>([]);

    // Helper methods for calculations
    getBallsFormatted(totalBalls: number): string {
        const overs = Math.floor(totalBalls / 6);
        const balls = totalBalls % 6;
        return `${overs}.${balls}`;
    }

    startInnings(matchId: string, battingTeamId: string, bowlingTeamId: string, strikerId: string, nonStrikerId: string, bowlerId: string) {
        this.currentMatchId.set(matchId);
        const newState: InningsState = {
            battingTeamId,
            bowlingTeamId,
            runs: 0,
            wickets: 0,
            balls: 0,
            currentOverBalls: [],
            strikerId,
            nonStrikerId,
            currentBowlerId: bowlerId,
            fallOfWickets: []
        };
        this.inningsState.set(newState);
        this.matchEvents.set([]);
        this.saveState();
    }

    recordBall(ball: Omit<BallEvent, 'id' | 'matchId' | 'timestamp'>) {
        const state = this.inningsState();
        if (!state) return;

        const event: BallEvent = {
            ...ball,
            id: Date.now().toString(),
            matchId: this.currentMatchId()!,
            timestamp: Date.now()
        };

        this.matchEvents.update(events => [...events, event]);

        // Update state
        const updatedState = { ...state };
        updatedState.runs += event.runs + event.extras.runs;
        if (event.isValidBall) {
            updatedState.balls += 1;
        }
        if (event.wicket) {
            updatedState.wickets += 1;
            updatedState.fallOfWickets.push({
                score: updatedState.runs,
                over: this.getBallsFormatted(updatedState.balls),
                playerId: event.wicket.playerDismissedId
            });
        }

        updatedState.currentOverBalls.push(event);

        // Handle over completion (simplified)
        if (event.isValidBall && updatedState.balls % 6 === 0 && updatedState.balls > 0) {
            // End of over logic would go here
            updatedState.currentOverBalls = [];
            // Switch roles
            const temp = updatedState.strikerId;
            updatedState.strikerId = updatedState.nonStrikerId;
            updatedState.nonStrikerId = temp;
        } else if (event.isValidBall && (event.runs % 2 !== 0)) {
            // Switch strikers on odd runs
            const temp = updatedState.strikerId;
            updatedState.strikerId = updatedState.nonStrikerId;
            updatedState.nonStrikerId = temp;
        }

        this.inningsState.set(updatedState);
        this.saveState();
    }

    private saveState() {
        if (!this.currentMatchId()) return;
        localStorage.setItem(`${this.STORAGE_KEY_PREFIX}${this.currentMatchId()}`, JSON.stringify({
            state: this.inningsState(),
            events: this.matchEvents()
        }));
    }

    loadState(matchId: string) {
        const stored = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}${matchId}`);
        if (stored) {
            const data = JSON.parse(stored);
            this.currentMatchId.set(matchId);
            this.inningsState.set(data.state);
            this.matchEvents.set(data.events);
        }
    }
}
