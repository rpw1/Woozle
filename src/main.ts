import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { ContentReducer } from './app/content/state/reducers/content.reducer';
import { GameEffects } from './app/game/state/effects/game.effects';
import { ProgressBarQueueEffects } from './app/game/state/effects/progress-bar-queue.effects';
import { GameReducer } from './app/game/state/reducers/game.reducer';
import { QueueStateReducer } from './app/game/state/reducers/progress-bar-queue.reducer';
import { initApp, SettingsService } from './app/shared/services/settings.service';
import { environment } from './environments/environment';
import { ContentEffects } from './app/content/state/effects/content.effects';
import { spotifyAuthInterceptor } from './app/shared/interceptors/spotify-auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore({
      content: ContentReducer,
      game: GameReducer,
      progressBarQueue: QueueStateReducer
    }),
    provideEffects([
      ContentEffects,
      GameEffects,
      ProgressBarQueueEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: false,
      trace: true,
      traceLimit: 75,
      connectInZone: true
    }),
    provideHttpClient(
      withInterceptors([spotifyAuthInterceptor])
    ),
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SettingsService],
      multi: true
    }
]
}).catch(e => console.error(e));
