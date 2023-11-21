import { Component } from '@angular/core';
import { PlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private playerService: PlayerService){}

  startPlayer(): void {
    this.playerService.startPlayer();
  }
}
