/*
*  Protractor support is deprecated in Angular.
*  Protractor is used in this example for compatibility with Angular documentation tools.
*/
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Routes, provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProgressBarQueueEffects } from './app/game/state/effects/progress-bar-queue.effects';

const routes: Routes = [
  {path: '**', redirectTo: 'AppComponent' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideEffects([ProgressBarQueueEffects])
]
}).catch(e => console.error(e));