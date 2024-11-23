import { Routes } from "@angular/router";
import { ForbiddenComponent } from "./user/components/forbidden/forbidden.component";
import { authGuard } from "./user/guards/auth.guard";
import { authCallbackResolver } from "./user/resolvers/auth-callback.resolver";

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  },
  {
    path: 'game',
    canActivateChild: [ authGuard ],
    loadChildren: () => import('./game/game-routes').then(x => x.gameRoutes)
  },
  {
    path: 'contents',
    canActivateChild: [ authGuard ],
    loadChildren: () => import('./content/content-routes').then(x => x.contentRoutes)
  },
  {
    path: 'user',
    canActivateChild: [ authGuard ],
    loadChildren: () => import('./user/user-routes').then(x => x.userRoutes)
  },
  {
    path: 'auth/callback',
    resolve: { data: authCallbackResolver },
    loadComponent: () => ForbiddenComponent
  },
  {
    path: 'forbidden',
    loadComponent: () => ForbiddenComponent
  }
]
