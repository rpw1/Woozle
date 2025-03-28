import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Content } from '../../content/state/models/content';
import { selectGameContent } from '../../content/state/selectors/content.selector';
import { GameActions } from '../../state/actions/game.actions';
import { Game } from '../../state/models/game.model';
import { selectIsPlayingMusic } from '../../state/selectors/game.selector';
import { GuessListComponent } from '../guess-list/guess-list.component';
import { GuessComponent } from '../guess/guess.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-game',
  imports: [
    GuessListComponent,
    GuessComponent,
    ProgressBarComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly gameStore = inject(Store<Game>);
  private readonly contentStore = inject(Store<Content>);
  readonly isPlayingMusic$ = this.gameStore.select(selectIsPlayingMusic);
  readonly content$ = this.contentStore.select(selectGameContent);

  ngOnInit(): void {
    this.gameStore.dispatch(GameActions.reset());
  }

  ngOnDestroy(): void {
    this.gameStore.dispatch(GameActions.togglePlayerOff());
  }

  togglePlayerOn(): void {
    this.gameStore.dispatch(GameActions.togglePlayerOn());
  }

  togglePlayerOff(): void {
    this.gameStore.dispatch(GameActions.togglePlayerOff());
  }
}
