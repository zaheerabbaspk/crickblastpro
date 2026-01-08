import { Injectable, signal, computed } from '@angular/core';

export interface Player {
    id: string;
    fullName: string;
    displayName: string;
    role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';
    battingStyle: 'Right-handed' | 'Left-handed';
    bowlingStyle: 'Fast' | 'Medium' | 'Spin' | 'None';
    jerseyNumber?: string;
    teams: string[]; // Team IDs
}

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private playersSignal = signal<Player[]>(this.loadPlayers());

    players = computed(() => this.playersSignal());

    constructor() { }

    private loadPlayers(): Player[] {
        const data = localStorage.getItem('cp_players');
        return data ? JSON.parse(data) : [];
    }

    private savePlayers(players: Player[]) {
        localStorage.setItem('cp_players', JSON.stringify(players));
        this.playersSignal.set(players);
    }

    addPlayer(player: Omit<Player, 'id' | 'teams'>) {
        const newPlayer: Player = {
            ...player,
            id: Math.random().toString(36).substring(2, 9),
            teams: []
        };
        const updated = [...this.playersSignal(), newPlayer];
        this.savePlayers(updated);
        return newPlayer;
    }

    updatePlayer(player: Player) {
        const updated = this.playersSignal().map(p => p.id === player.id ? player : p);
        this.savePlayers(updated);
    }

    deletePlayer(id: string) {
        const updated = this.playersSignal().filter(p => p.id !== id);
        this.savePlayers(updated);
    }

    getPlayerById(id: string) {
        return this.playersSignal().find(p => p.id === id);
    }
}
