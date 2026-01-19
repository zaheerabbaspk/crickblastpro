import { Component, inject, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline, trophyOutline, locationOutline, calendarOutline, shirtOutline, personOutline, starOutline } from 'ionicons/icons';

@Component({
    selector: 'app-public-match-details',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, RouterLink],
    templateUrl: './public-match-details.page.html'
})
export class PublicMatchDetailsPage {
    private route = inject(ActivatedRoute);
    matchId = signal<string | null>(null);

    // Mock detailed data
    matchDetails = signal({
        name: 'Local Derby: Titans vs Warriors',
        status: 'LIVE',
        venue: 'Gaddafi Stadium (Local)',
        date: '20 Jan 2026',
        views: '12.5K',
        format: 'T20',
        teamA: {
            name: 'Titans CC',
            shortName: 'TTC',
            score: '156/3',
            overs: '12.4',
            players: [
                { name: 'Zaheer Abbas', role: 'Batter', runs: 45, balls: 30, out: false },
                { name: 'Shayan Ahmed', role: 'All-rounder', runs: 62, balls: 35, out: false },
                { name: 'Babar Azam', role: 'Batter', runs: 24, balls: 15, out: true },
                { name: 'Mohammad Rizwan', role: 'Wicket-keeper', runs: 12, balls: 10, out: true },
                { name: 'Shaheen Afridi', role: 'Bowler', runs: 5, balls: 4, out: true },
                { name: 'Naseem Shah', role: 'Bowler', runs: 0, balls: 0, out: false },
                { name: 'Haris Rauf', role: 'Bowler', runs: 0, balls: 0, out: false },
                { name: 'Shadab Khan', role: 'All-rounder', runs: 0, balls: 0, out: false },
                { name: 'Iftikhar Ahmed', role: 'Batter', runs: 0, balls: 0, out: false },
                { name: 'Fakhar Zaman', role: 'Batter', runs: 0, balls: 0, out: false },
                { name: 'Saim Ayub', role: 'Batter', runs: 0, balls: 0, out: false },
            ]
        },
        teamB: {
            name: 'Warriors',
            shortName: 'WAR',
            score: 'yet to bat',
            overs: '0.0',
            players: [
                { name: 'Virat Kohli', role: 'Batter' },
                { name: 'Rohit Sharma', role: 'Batter' },
                { name: 'Hardik Pandya', role: 'All-rounder' },
                { name: 'Jasprit Bumrah', role: 'Bowler' },
                { name: 'Ravindra Jadeja', role: 'All-rounder' },
                { name: 'KL Rahul', role: 'Wicket-keeper' },
                { name: 'Shubman Gill', role: 'Batter' },
                { name: 'Mohammed Shami', role: 'Bowler' },
                { name: 'Kuldeep Yadav', role: 'Bowler' },
                { name: 'Suryakumar Yadav', role: 'Batter' },
                { name: 'Rishabh Pant', role: 'Wicket-keeper' },
            ]
        }
    });

    constructor() {
        addIcons({
            arrowBackOutline, eyeOutline, trophyOutline, locationOutline,
            calendarOutline, shirtOutline, personOutline, starOutline
        });
        this.matchId.set(this.route.snapshot.paramMap.get('id'));
    }
}
