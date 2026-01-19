import { Component, inject, computed, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../core/services/match.service';
import { ScorecardComponent, ScorecardInfo } from '../../shared/components/scorecard/scorecard.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { videocamOutline, trendingUpOutline, flashOutline, globeOutline, searchOutline, filterOutline } from 'ionicons/icons';

@Component({
    selector: 'app-live-matches',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, RouterLink, ScorecardComponent],
    templateUrl: './live-matches.page.html'
})
export class LiveMatchesPage {
    private matchService = inject(MatchService);
    searchTerm = signal('');

    // Personal live matches from service
    personalLiveMatches = computed(() => {
        return this.matchService.matches()
            .filter(m => m.status === 'live')
            .map(m => ({
                id: m.id,
                matchName: m.name,
                teamA: { name: 'Team A', shortName: 'TMA' },
                teamB: { name: 'Team B', shortName: 'TMB' },
                status: 'LIVE' as const,
                venue: m.venue
            }));
    });

    // Public trending matches (mocked)
    publicLiveMatches = signal<ScorecardInfo[]>([
        {
            id: 'pub_1',
            matchName: 'Local Derby: Titans vs Warriors',
            teamA: { name: 'Titans CC', shortName: 'TTC', logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&q=80', score: '156/3', overs: '12.4', wickets: 3 },
            teamB: { name: 'Warriors', shortName: 'WAR', score: 'yet to bat', overs: '0.0', wickets: 0 },
            status: 'LIVE',
            venue: 'Gaddafi Stadium (Local)',
            views: '12.5K',
            battingTeam: 'A'
        },
        {
            id: 'pub_2',
            matchName: 'Sunday Amateur Cup 2026',
            teamA: { name: 'Blue Jays', shortName: 'BJY', score: '210/8', overs: '20.0', wickets: 8 },
            teamB: { name: 'Red Scorpions', shortName: 'RSC', score: '188/9', overs: '19.2', wickets: 9 },
            status: 'LIVE',
            venue: 'Street Ground 4',
            views: '8.2K',
            battingTeam: 'B'
        },
        {
            id: 'pub_4',
            matchName: 'Premier League: Tigers vs Eagles',
            teamA: { name: 'Dhaka Tigers', shortName: 'TGR', score: '45/1', overs: '5.2', wickets: 1 },
            teamB: { name: 'Chittagong Eagles', shortName: 'EGL', score: 'yet to bat', overs: '0.0', wickets: 0 },
            status: 'LIVE',
            venue: 'Sher-e-Bangla Stadium',
            views: '25.4K',
            battingTeam: 'A'
        }
    ]);

    filteredPublicMatches = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.publicLiveMatches().filter(m =>
            m.matchName.toLowerCase().includes(term) ||
            m.teamA.name.toLowerCase().includes(term) ||
            m.teamB.name.toLowerCase().includes(term)
        );
    });

    constructor() {
        addIcons({
            videocamOutline, trendingUpOutline, flashOutline,
            globeOutline, searchOutline, filterOutline
        });
    }
}
