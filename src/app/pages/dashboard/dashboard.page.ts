import { Component, inject, computed, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../core/services/match.service';
import { addIcons } from 'ionicons';
import {
    playOutline,
    personAddOutline,
    shieldOutline,
    trophyOutline,
    videocamOutline,
    calendarOutline,
    chevronForwardOutline,
    trendingUpOutline,
    flashOutline,
    globeOutline,
    starOutline,
    timerOutline
} from 'ionicons/icons';
import { ScorecardComponent, ScorecardInfo } from '../../shared/components/scorecard/scorecard.component';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

register();

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink, ScorecardComponent],
    templateUrl: './dashboard.page.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPage {
    private matchService = inject(MatchService);
    liveMatches = computed(() => this.matchService.matches().filter(m => m.status === 'live'));

    trendingPublicMatches = signal<ScorecardInfo[]>([
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
            id: 'pub_3',
            matchName: 'Corporate League - Tech vs Sales',
            teamA: { name: 'Tech Giants', shortName: 'TGI', score: '98/10', overs: '15.2', wickets: 10 },
            teamB: { name: 'Sales Sharks', shortName: 'SSH', score: '102/2', overs: '11.0', wickets: 2 },
            status: 'COMPLETED',
            venue: 'Corporate Turf',
            views: '5.1K'
        }
    ]);

    officialMatches = signal<ScorecardInfo[]>([
        {
            matchName: 'ICC World Cup Final',
            teamA: { name: 'Australia', shortName: 'AUS', score: '241/4', overs: '43.0', wickets: 4 },
            teamB: { name: 'India', shortName: 'IND', score: '240/10', overs: '50.0', wickets: 10 },
            status: 'COMPLETED',
            venue: 'Narendra Modi Stadium',
            isOfficial: true
        },
        {
            matchName: 'U19 World Cup Final',
            teamA: { name: 'Australia U19', shortName: 'AUS', score: '253/7', overs: '50.0', wickets: 7 },
            teamB: { name: 'India U19', shortName: 'IND', score: '174/10', overs: '43.5', wickets: 10 },
            status: 'COMPLETED',
            venue: 'Willowmoore Park',
            isOfficial: true
        }
    ]);

    userLiveMatches = computed(() => {
        return this.matchService.matches()
            .filter(m => m.status === 'live')
            .map(m => ({
                matchName: m.name,
                teamA: { name: 'Team A', shortName: 'TMA' },
                teamB: { name: 'Team B', shortName: 'TMB' },
                status: 'LIVE' as const,
                venue: m.venue
            }));
    });

    highlights = [
        { title: 'Maxwell\'s 201*', description: 'Unbelievable knock against AFG', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80', views: '2.4M', duration: '12:45' },
        { title: 'Shami\'s 7-Wicket Haul', description: 'Semi-final demolition', thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80', views: '1.2M', duration: '08:20' },
        { title: 'Kohli\'s 50th ODI Ton', description: 'Surpassing the legend', thumbnail: 'https://images.unsplash.com/photo-1624526173428-0ac834f37805?w=800&q=80', views: '5.1M', duration: '15:10' },
    ];

    constructor() {
        addIcons({
            playOutline, personAddOutline, shieldOutline, trophyOutline,
            videocamOutline, calendarOutline, chevronForwardOutline, trendingUpOutline,
            flashOutline, globeOutline, starOutline, timerOutline
        });
    }
}
