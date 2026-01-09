import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonFooter, IonTabs, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  peopleOutline,
  shirtOutline,
  trophyOutline,
  timeOutline,
  settingsOutline,
  addCircleOutline,
  videocamOutline,
  listOutline
} from 'ionicons/icons';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, IonItem,
    IonIcon, IonLabel, IonMenuToggle, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonButton, IonFooter, IonTabs, IonTabBar, IonTabButton,
    RouterLink, RouterLinkActive
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'grid' },
    { title: 'Live Matches', url: '/live-matches', icon: 'videocam' },
    { title: 'Players', url: '/players', icon: 'people' },
    { title: 'Teams', url: '/teams', icon: 'shirt' },
    { title: 'Tournaments', url: '/tournaments', icon: 'trophy' },
    { title: 'Match History', url: '/match-history', icon: 'time' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];

  constructor() {
    addIcons({
      gridOutline,
      peopleOutline,
      shirtOutline,
      trophyOutline,
      timeOutline,
      settingsOutline,
      addCircleOutline,
      videocamOutline,
      grid: gridOutline,
      people: peopleOutline,
      shirt: shirtOutline,
      trophy: trophyOutline,
      time: timeOutline,
      settings: settingsOutline,
      videocam: videocamOutline,
      addCircle: addCircleOutline,
      list: listOutline
    });
  }
}
