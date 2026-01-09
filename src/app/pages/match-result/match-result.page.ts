import { Component, inject, signal, computed } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService, Match } from '../../core/services/match.service';
import { TeamService } from '../../core/services/team.service';
import { PlayerService, Player } from '../../core/services/player.service';
import { LiveMatchService, BallEvent } from '../../core/services/live-match.service';
import { addIcons } from 'ionicons';
import {
    arrowBackOutline,
    checkmarkCircleOutline,
    trophyOutline,
    shareSocialOutline,
    homeOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-result',
    standalone: true,
    imports: [IonContent, IonIcon, FormsModule, CommonModule],
    templateUrl: './match-result.page.html'
})
export class MatchResultPage {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private matchService = inject(MatchService);
    public teamService = inject(TeamService);
    public playerService = inject(PlayerService);
    public liveMatchService = inject(LiveMatchService);

    match = signal<Match | undefined>(undefined);
    inningsState = this.liveMatchService.inningsState;

    manOfTheMatchId = signal('');

    winner = computed(() => {
        const state = this.inningsState();
        const match = this.match();
        if (!state || !match) return undefined;

        if (state.inningsNum === 1) {
            // If only 1 innings played, current batting team is "winner" (placeholder)
            return this.teamService.getTeamById(state.battingTeamId);
        }

        const firstInningsRuns = state.firstInningsScore || 0;
        const secondInningsRuns = state.runs;

        if (secondInningsRuns > firstInningsRuns) {
            // Chasing team won
            return this.teamService.getTeamById(state.battingTeamId);
        } else if (secondInningsRuns < firstInningsRuns) {
            // Defending team won
            return this.teamService.getTeamById(state.bowlingTeamId);
        } else {
            // Tie (simplified)
            return undefined;
        }
    });

    resultMargin = computed(() => {
        const state = this.inningsState();
        if (!state) return '';
        if (state.inningsNum === 1) return `First innings: ${state.runs} runs`;

        const firstInningsRuns = state.firstInningsScore || 0;
        const secondInningsRuns = state.runs;

        if (secondInningsRuns > firstInningsRuns) {
            const wicketsLeft = this.getPlayersCount(state.battingTeamId) - state.wickets - 1;
            return `won by ${wicketsLeft > 0 ? wicketsLeft : 1} wickets`;
        } else if (secondInningsRuns < firstInningsRuns) {
            return `won by ${firstInningsRuns - secondInningsRuns} runs`;
        } else {
            return 'Match Tied';
        }
    });

    constructor() {
        addIcons({ arrowBackOutline, checkmarkCircleOutline, trophyOutline, shareSocialOutline, homeOutline });
        const matchId = this.route.snapshot.paramMap.get('id');
        if (matchId) {
            const m = this.matchService.getMatchById(matchId);
            this.match.set(m);
            if (m && m.status === 'live') {
                this.liveMatchService.loadState(matchId);
            }
        }
    }

    getPlayers(): Player[] {
        const match = this.match();
        if (!match) return [];
        const allIds = [...match.teamAPlayers, ...match.teamBPlayers];
        return allIds.map(id => this.playerService.getPlayerById(id)!).filter(p => !!p);
    }

    displayInnings1 = computed(() => {
        const m = this.match();
        const state = this.inningsState();

        if (m?.status === 'completed' && m.result?.inningsData?.[0]) {
            const data = m.result.inningsData[0];
            return {
                teamName: this.teamService.getTeamById(data.battingTeamId)?.name,
                runs: data.runs,
                wickets: data.wickets,
                balls: data.balls,
                batting: this.getBattingStats(data.battingTeamId, 1, m.result.events),
                bowling: this.getBowlingStats(data.bowlingTeamId, 1, m.result.events)
            };
        }

        if (state) {
            const isFirstInnings = state.inningsNum === 1;
            const batTeamId = isFirstInnings ? state.battingTeamId : state.bowlingTeamId;
            const bowlTeamId = isFirstInnings ? state.bowlingTeamId : state.battingTeamId;
            return {
                teamName: this.teamService.getTeamById(batTeamId)?.name,
                runs: state.inningsNum === 2 ? state.firstInningsScore : state.runs,
                wickets: state.inningsNum === 2 ? undefined : state.wickets, // We don't track 1st innings final wickets in state currently, would need matchEvents
                balls: state.inningsNum === 2 ? undefined : state.balls,
                batting: this.getBattingStats(batTeamId, 1),
                bowling: this.getBowlingStats(bowlTeamId, 1)
            };
        }
        return undefined;
    });

    displayInnings2 = computed(() => {
        const m = this.match();
        const state = this.inningsState();

        if (m?.status === 'completed' && m.result?.inningsData?.[1]) {
            const data = m.result.inningsData[1];
            return {
                teamName: this.teamService.getTeamById(data.battingTeamId)?.name,
                runs: data.runs,
                wickets: data.wickets,
                balls: data.balls,
                batting: this.getBattingStats(data.battingTeamId, 2, m.result.events),
                bowling: this.getBowlingStats(data.bowlingTeamId, 2, m.result.events)
            };
        }

        if (state && state.inningsNum === 2) {
            return {
                teamName: this.teamService.getTeamById(state.battingTeamId)?.name,
                runs: state.runs,
                wickets: state.wickets,
                balls: state.balls,
                batting: this.getBattingStats(state.battingTeamId, 2),
                bowling: this.getBowlingStats(state.bowlingTeamId, 2)
            };
        }
        return undefined;
    });

    finalizeMatch() {
        const match = this.match();
        const state = this.inningsState();
        if (!match || !state) return;

        // Construct innings data for both
        const inningsData: any[] = [];
        if (state.inningsNum === 2) {
            // we need to reconstruct 1st innings final state from events or use the saved firstInningsScore
            // For now, let's just save the current states we have
            inningsData.push({
                inningsNum: 1,
                battingTeamId: state.bowlingTeamId,
                bowlingTeamId: state.battingTeamId,
                runs: state.firstInningsScore,
                // vacancies here for wickets/balls if not tracked, but we can calculate from events later
            });
            inningsData.push({ ...state });
        } else {
            inningsData.push({ ...state });
        }

        const updatedMatch: Match = {
            ...match,
            status: 'completed',
            result: {
                winnerId: this.winner()?.id,
                margin: this.resultMargin(),
                manOfTheMatchId: this.manOfTheMatchId(),
                events: this.liveMatchService.matchEvents(),
                inningsData
            }
        };

        this.matchService.updateMatch(updatedMatch);
        alert('Match history updated!');
        this.router.navigate(['/dashboard']);
    }

    getBattingStats(teamId: string, inningsNum: 1 | 2, matchEvents?: BallEvent[]) {
        const events = (matchEvents || this.liveMatchService.matchEvents()).filter(e => e.innings === inningsNum);
        const match = this.match();
        if (!match) return [];

        const playerIds = teamId === match.teamAId ? match.teamAPlayers : match.teamBPlayers;

        return playerIds.map(playerId => {
            const player = this.playerService.getPlayerById(playerId);
            const playerEvents = events.filter(e => e.strikerId === playerId);
            const runs = playerEvents.reduce((sum, e) => sum + e.runs, 0);
            const balls = playerEvents.filter(e => e.isValidBall || (!e.isValidBall && e.extras.type === 'no-ball')).length;
            const fours = playerEvents.filter(e => e.runs === 4).length;
            const sixes = playerEvents.filter(e => e.runs === 6).length;

            const wicketEvent = events.find(e => e.wicket?.playerDismissedId === playerId);
            let howOut = 'not out';
            if (wicketEvent) {
                howOut = wicketEvent.wicket?.type === 'bowled' ? 'b ' :
                    wicketEvent.wicket?.type === 'caught' ? 'c ' :
                        wicketEvent.wicket?.type === 'lbw' ? 'lbw ' :
                            wicketEvent.wicket?.type === 'run-out' ? 'run out ' :
                                wicketEvent.wicket?.type === 'stumped' ? 'stumped ' : 'out ';

                if (wicketEvent.wicket?.fielderId) {
                    howOut += this.playerService.getPlayerById(wicketEvent.wicket.fielderId)?.displayName + ' ';
                }
                if (wicketEvent.wicket?.type !== 'run-out') {
                    howOut += 'b ' + this.playerService.getPlayerById(wicketEvent.bowlerId)?.displayName;
                }
            }

            return {
                name: player?.displayName || 'Unknown',
                runs,
                balls,
                fours,
                sixes,
                howOut,
                strikeRate: balls > 0 ? (runs / balls * 100).toFixed(2) : '0.00'
            };
        }).filter(s => s.balls > 0 || s.howOut !== 'not out');
    }

    getBowlingStats(teamId: string, inningsNum: 1 | 2, matchEvents?: BallEvent[]) {
        const events = (matchEvents || this.liveMatchService.matchEvents()).filter(e => e.innings === inningsNum);
        const match = this.match();
        if (!match) return [];

        const playerIds = teamId === match.teamAId ? match.teamAPlayers : match.teamBPlayers;

        return playerIds.map(playerId => {
            const player = this.playerService.getPlayerById(playerId);
            const bowlerEvents = events.filter(e => e.bowlerId === playerId);
            if (bowlerEvents.length === 0) return null;

            const validBalls = bowlerEvents.filter(e => e.isValidBall).length;
            const runs = bowlerEvents.reduce((sum, e) => sum + e.runs + e.extras.runs, 0);
            const wickets = bowlerEvents.filter(e => e.wicket && e.wicket.type !== 'run-out').length;

            return {
                name: player?.displayName || 'Unknown',
                overs: this.liveMatchService.getBallsFormatted(validBalls),
                runs,
                wickets,
                economy: validBalls > 0 ? (runs / (validBalls / 6)).toFixed(2) : '0.00'
            };
        }).filter(s => s !== null);
    }

    getPlayersCount(teamId: string): number {
        const match = this.match();
        if (!match) return 11;
        return teamId === match.teamAId ? match.teamAPlayers.length : match.teamBPlayers.length;
    }
}
