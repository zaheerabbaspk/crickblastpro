import { Injectable, signal } from '@angular/core';

export interface TournamentFixture {
    id: string;
    teamAId: string;
    teamBId: string;
    venue: string;
    date: string;
    time: string;
    status: 'upcoming' | 'live' | 'completed';
    matchId?: string;
}

export interface Tournament {
    id: string;
    name: string;
    format: 'League' | 'Knockout' | 'League + Knockout';
    overs: number;
    selectedTeams: string[];
    fixtures: TournamentFixture[];
    pointsPerWin: number;
    pointsPerDraw: number;
    pointsPerLoss: number;
    bonusPoints?: boolean;
    venue?: string;
    startDate?: string;
    endDate?: string;
    status: 'upcoming' | 'live' | 'completed';
    createdAt: number;
}

@Injectable({
    providedIn: 'root'
})
export class TournamentService {
    private STORAGE_KEY = 'cb_tournaments';
    private tournamentsSignal = signal<Tournament[]>([]);

    tournaments = this.tournamentsSignal.asReadonly();

    constructor() {
        this.loadTournaments();
    }

    private loadTournaments() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.tournamentsSignal.set(JSON.parse(stored));
        }
    }

    private saveTournaments() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tournamentsSignal()));
    }

    addTournament(tournamentData: Omit<Tournament, 'id' | 'status' | 'createdAt'>): Tournament {
        const newTournament: Tournament = {
            ...tournamentData,
            id: Date.now().toString(),
            status: 'upcoming',
            createdAt: Date.now()
        };
        this.tournamentsSignal.update(t => [...t, newTournament]);
        this.saveTournaments();
        return newTournament;
    }

    updateTournament(tournament: Tournament) {
        this.tournamentsSignal.update(t => t.map(item => item.id === tournament.id ? tournament : item));
        this.saveTournaments();
    }

    getTournamentById(id: string): Tournament | undefined {
        return this.tournamentsSignal().find(t => t.id === id);
    }

    deleteTournament(id: string) {
        this.tournamentsSignal.update(t => t.filter(item => item.id !== id));
        this.saveTournaments();
    }
}
