import { Injectable, signal, computed, inject } from '@angular/core';
import { PlayerService, Player } from './player.service';

export interface Team {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    players: string[]; // Player IDs
    captainId?: string;
    wicketkeeperId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private playerService = inject(PlayerService);
    private teamsSignal = signal<Team[]>(this.loadTeams());

    teams = computed(() => this.teamsSignal());

    constructor() { }

    private loadTeams(): Team[] {
        const data = localStorage.getItem('cp_teams');
        return data ? JSON.parse(data) : [];
    }

    private saveTeams(teams: Team[]) {
        localStorage.setItem('cp_teams', JSON.stringify(teams));
        this.teamsSignal.set(teams);
    }

    addTeam(team: Omit<Team, 'id'>) {
        const newTeam: Team = {
            ...team,
            id: Math.random().toString(36).substring(2, 9)
        };
        const updated = [...this.teamsSignal(), newTeam];
        this.saveTeams(updated);

        // Update players' team lists
        newTeam.players.forEach(pid => {
            const player = this.playerService.getPlayerById(pid);
            if (player && !player.teams.includes(newTeam.id)) {
                this.playerService.updatePlayer({
                    ...player,
                    teams: [...player.teams, newTeam.id]
                });
            }
        });

        return newTeam;
    }

    deleteTeam(id: string) {
        const team = this.teamsSignal().find(t => t.id === id);
        if (team) {
            // Remove team reference from players
            team.players.forEach(pid => {
                const player = this.playerService.getPlayerById(pid);
                if (player) {
                    this.playerService.updatePlayer({
                        ...player,
                        teams: player.teams.filter(tid => tid !== id)
                    });
                }
            });
        }
        const updated = this.teamsSignal().filter(t => t.id !== id);
        this.saveTeams(updated);
    }

    getTeamById(id: string): Team | undefined {
        return this.teamsSignal().find(t => t.id === id);
    }
}
