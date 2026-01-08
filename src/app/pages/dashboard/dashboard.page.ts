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
    trendingUpOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [IonContent, IonIcon, RouterLink],
    templateUrl: './dashboard.page.html'
})
export class DashboardPage {
    private matchService = inject(MatchService);
    liveMatches = computed(() => this.matchService.matches().filter(m => m.status === 'live'));

    quickActions = [
        { title: 'Start Match', subtitle: 'Live Scoring', icon: 'play-outline', color: 'bg-brand-red', url: '/match-create' },
        { title: 'Add Player', subtitle: 'Manage Squad', icon: 'person-add-outline', color: 'bg-indigo-500', url: '/players/create' },
        { title: 'New Team', subtitle: 'Club Setup', icon: 'shield-outline', color: 'bg-emerald-500', url: '/teams/create' },
        { title: 'Tournament', subtitle: 'League/K.O', icon: 'trophy-outline', color: 'bg-amber-500', url: '/tournament-create' },
    ];

    constructor() {
        addIcons({
            playOutline, personAddOutline, shieldOutline, trophyOutline,
            videocamOutline, calendarOutline, chevronForwardOutline, trendingUpOutline
        });
    }
}
