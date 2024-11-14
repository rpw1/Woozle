import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { exhaustMap, filter, map, switchMap } from 'rxjs';
import { GameActions } from '../../../game/state/actions/game.actions';
import { SpotifyContentService } from '../../services/spotify-content.service';
import { ContentActions } from '../actions/content.actions';
import { Content } from '../models/content';
import { ContentType } from '../models/content-type';
import { selectGameContent } from '../selectors/content.selector';

@Injectable()
export class ContentEffects {
  private readonly action$ = inject(Actions);
  private readonly contentStore = inject(Store<Content>);
  private readonly spotifyContentService = inject(SpotifyContentService);

  readonly loadContent$ = createEffect(() =>
    this.action$.pipe(
      ofType(ContentActions.loadContent),
      exhaustMap(() => this.spotifyContentService.loadContent()),
      map((contents) =>
        ContentActions.loadContentSuccess({ availableContent: contents })
      )
    )
  );

  readonly loadPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(ContentActions.setGameContent),
      filter((x) => x.content.type === ContentType.Playlist),
      switchMap((props) =>
        this.spotifyContentService.loadPlaylistTracks(props.content.id)
      ),
      map((tracks) => ContentActions.setGameContentSuccess({ tracks: tracks }))
    )
  );

  readonly loadArtist$ = createEffect(() =>
    this.action$.pipe(
      ofType(ContentActions.setGameContent),
      filter((x) => x.content.type === ContentType.Artist),
      switchMap((props) =>
        this.spotifyContentService.loadArtistTracks(props.content.id)
      ),
      map((tracks) => ContentActions.setGameContentSuccess({ tracks: tracks }))
    )
  );

  readonly loadAlbum$ = createEffect(() =>
    this.action$.pipe(
      ofType(ContentActions.setGameContent),
      filter((x) => x.content.type === ContentType.Album),
      concatLatestFrom(() => this.contentStore.select(selectGameContent)),
      switchMap(async ([action, gameContent]) => {
        const randomIndex =
          Math.floor(Math.random() * gameContent.tracks.length) - 1;
        return GameActions.setGameSolution({
          track: gameContent.tracks[randomIndex],
        });
      })
    )
  );

  readonly resetGame$ = createEffect(() =>
    this.action$.pipe(
      ofType(GameActions.reset, ContentActions.setGameContentSuccess),
      concatLatestFrom(() => this.contentStore.select(selectGameContent)),
      switchMap(async ([action, gameContent]) => {
        const randomIndex =
          Math.floor(Math.random() * gameContent.tracks.length) - 1;
        return GameActions.setGameSolution({
          track: gameContent.tracks[randomIndex],
        });
      })
    )
  );
}