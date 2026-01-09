import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'players',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/players/players.page').then(m => m.PlayersPage)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/players/player-create.page').then(m => m.PlayerCreatePage)
      }
    ]
  },
  {
    path: 'teams',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/teams/teams.page').then(m => m.TeamsPage)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/teams/team-create.page').then(m => m.TeamCreatePage)
      }
    ]
  },
  {
    path: 'match-create',
    loadComponent: () => import('./pages/match-create/match-create.page').then(m => m.MatchCreatePage)
  },
  {
    path: 'match/:id',
    children: [
      {
        path: 'toss',
        loadComponent: () => import('./pages/match-toss/match-toss.page').then(m => m.MatchTossPage)
      },
      {
        path: 'scoring',
        loadComponent: () => import('./pages/match-scoring/match-scoring.page').then(m => m.MatchScoringPage)
      },
      {
        path: 'result',
        loadComponent: () => import('./pages/match-result/match-result.page').then(m => m.MatchResultPage)
      }
    ]
  },
  {
    path: 'match-history',
    loadComponent: () => import('./pages/match-history/match-history.page').then(m => m.MatchHistoryPage)
  },
  {
    path: 'tournament-create',
    loadComponent: () => import('./pages/tournament-create/tournament-create.page').then(m => m.TournamentCreatePage)
  }
];
