import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription, filter, timer } from 'rxjs';
import { Constants } from '../../models/constants';
import { GameConstants } from '../../models/game-constants';
import { WoozleTask } from '../../../queue/models/woozle-task';
import { WoozleTaskState } from '../../../queue/models/woozle-task-state';
import { WoozleTaskType } from '../../../queue/models/woozle-task-type';
import { GameCalculationService } from '../../services/game-calculation/game-calculation.service';
import { GuessService } from '../../services/guess/guess.service';
import { PlayerService } from '../../services/player/player.service';
import { QueueService } from '../../../queue/services/queue.service';
import { CommonModule } from '@angular/common';
import { GuessType } from '../../models/guess-type';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  readonly TIMER_INTERVAL = 10;
  activeIndex: number = 0;
  private intervalPlayer!: Subscription;
  private subscriptions: Subscription[] = []; 
  guessPercentArray: number[] = [];
  @ViewChildren('playerProgressBar') progressBarSegments!: QueryList<ElementRef<HTMLDivElement>>;

  constructor(private gameCalculationService: GameCalculationService
    ,private playerService: PlayerService
    ,private queueService: QueueService
    ,private guessService: GuessService) {
      this.guessPercentArray = this.gameCalculationService.getGamePercentageArray();
    }

  ngOnInit(): void {
    this.subscriptions.push(this.playerService.player$.subscribe(() => {
      if (!this.queueService.hasRunningTask()) {
        this.queueService.queueTask(WoozleTaskType.RUN_PROGRESS_SEGMENT_QUEUE, this.activeIndex);
      } else {
        this.intervalPlayer?.unsubscribe();
        this.queueService.clearAllTasks(WoozleTaskType.RUN_PROGRESS_SEGMENT_QUEUE);
        this.resetAllSegments();
      }
    }));

    this.subscriptions.push(this.queueService.taskScheduler$.subscribe((task: WoozleTask) => {
      if (task.taskType === WoozleTaskType.RUN_PROGRESS_SEGMENT_QUEUE) {
        this.handleQueuedTask(task);
      }
    }));

    this.subscriptions.push(this.guessService.guesses$
      .pipe(
        filter(x => x.some(y => y.type !== GuessType.UNKNOWN))
      ).subscribe(() => {
      this.activeIndex = this.activeIndex >= GameConstants.TOTAL_GUESSES ? 0 : this.activeIndex + 1;
      this.queueService.queueTask(WoozleTaskType.RUN_PROGRESS_SEGMENT_QUEUE, this.activeIndex);
    }));
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private runSegmentQueue(currentTask: WoozleTask): void {
    const index = currentTask.index ?? 0;
    let currentSegment = this.progressBarSegments?.get(index)?.nativeElement.firstElementChild as HTMLDivElement;
    if (currentSegment) {
      let currentWidth = 0
      this.intervalPlayer = timer(0, this.TIMER_INTERVAL).subscribe((interval: number) => {
        currentWidth += this.TIMER_INTERVAL / (GameConstants.SECONDS_ARRAY[index] * 10);
        currentSegment.style.width = currentWidth + '%';
        if (currentWidth >= Constants.PERCENTAGE_CONVERSION) {
          this.intervalPlayer.unsubscribe();
          this.queueService.endTask(currentTask);
        }
      });
    }
  }

  private resetAllSegments(): void {
    this.progressBarSegments?.forEach((element: ElementRef<HTMLDivElement>) => {
      (element.nativeElement.firstElementChild as HTMLDivElement).style.width = 0 + '%';
    });
  }

  private handleQueuedTask(task: WoozleTask) {
    if (task.taskState === WoozleTaskState.QUEUED && !this.queueService.hasRunningTask()) {
      if (task.index != 0) {
        this.queueService.clearAllTasks(WoozleTaskType.RUN_PROGRESS_SEGMENT_QUEUE);
        this.resetAllSegments();
        for (let i = 0; i <= this.activeIndex; i++) {
          this.queueService.queueTask(WoozleTaskType.RUN_PROGRESS_SEGMENT_QUEUE, i);
        }
      }
    } else if (task.taskState === WoozleTaskState.STARTED) {
      this.runSegmentQueue(task);
    } else if (task.taskState === WoozleTaskState.ENDED && !this.queueService.hasRunningTask()) {
      this.resetAllSegments();
    }
  }
}