import { Injectable, signal } from '@angular/core';

export interface Match {
    id: string;
    name: string;
    format: 'Friendly' | 'League' | 'Knockout';
    overs: number;
    teamAId: string;
    teamBId: string;
    teamAPlayers: string[];
    teamBPlayers: string[];
    venue?: string;
    umpires?: string;
    status: 'upcoming' | 'live' | 'completed';
    toss?: {
        winnerId: string;
        decision: 'bat' | 'bowl';
    };
    result?: {
        winnerId?: string;
        margin: string;
        manOfTheMatchId?: string;
    };
    createdAt: number;
}

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private STORAGE_KEY = 'cb_matches';
    private matchesSignal = signal<Match[]>([]);

    matches = this.matchesSignal.asReadonly();

    constructor() {
        this.loadMatches();
    }

    private loadMatches() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.matchesSignal.set(JSON.parse(stored));
        }
    }

    private saveMatches() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.matchesSignal()));
    }

    addMatch(matchData: Omit<Match, 'id' | 'status' | 'createdAt'>): Match {
        const newMatch: Match = {
            ...matchData,
            id: Date.now().toString(),
            status: 'upcoming',
            createdAt: Date.now()
        };
        this.matchesSignal.update(m => [...m, newMatch]);
        this.saveMatches();
        return newMatch;
    }

    updateMatch(match: Match) {
        this.matchesSignal.update(m => m.map(item => item.id === match.id ? match : item));
        this.saveMatches();
    }

    getMatchById(id: string): Match | undefined {
        return this.matchesSignal().find(m => m.id === id);
    }

    deleteMatch(id: string) {
        this.matchesSignal.update(m => m.filter(item => item.id !== id));
        this.saveMatches();
    }
}
