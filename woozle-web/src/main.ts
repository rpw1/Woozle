import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, isDevMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { ContentEffects } from './app/game/content/state/effects/content.effects';
import { ContentReducer } from './app/game/content/state/reducers/content.reducer';
import { GameEffects } from './app/game/state/effects/game.effects';
import { ProgressBarQueueEffects } from './app/game/state/effects/progress-bar-queue.effects';
import { GameReducer } from './app/game/state/reducers/game.reducer';
import { QueueStateReducer } from './app/game/state/reducers/progress-bar-queue.reducer';
import { spotifyAuthInterceptor } from './app/shared/interceptors/spotify-auth.interceptor';
import { initApp, SettingsService } from './app/shared/services/settings.service';
import { environment } from './environments/environment';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
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
    provideAppInitializer(() => {
      const initializerFn = (initApp)(inject(SettingsService));
      return initializerFn();
    }), 
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
]
}).catch(e => console.error(e));
