import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { timer, asyncScheduler } from 'rxjs';
import {
  concatAll,
  map,
  finalize,
  takeUntil,
  scan,
  mergeAll,
  concatMap,
  concat,
} from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  obsQueue = new Subject<Observable<any>>();
  obsQueueCount = 1;

  funcObsQueue = new Subject<() => Observable<any>>();
  funcObsQueueCount = 1;

  public ngOnInit() {
    this.process();
  }

  public add() {
    this.enqueue();
  }

  public addFuncObs() {
    const currentCount = this.funcObsQueueCount;

    console.log('[QUEUING]', currentCount);

    const subject = timer(1000).pipe(map((x) => currentCount));

    this.funcObsQueue.next(() => {
      console.log('executing func');
      return subject;
    });

    this.funcObsQueueCount++;
  }

  private enqueue() {
    const currentCount = this.obsQueueCount;

    console.log('[QUEUING]', currentCount);
    const subject = timer(1000).pipe(map((x) => currentCount));
    this.obsQueue.next(subject);

    this.obsQueueCount++;
  }

  private process() {
    console.log('PROCESSING QUEUE...');

    this.obsQueue
      .pipe(
        finalize(() => console.log('stopped processing queue')),
        concatMap((x) => x)
      )
      .subscribe((x) => {
        console.log('[PROCESSED]', x);
      });

    this.funcObsQueue
      .pipe(
        finalize(() => console.log('stopped processing queue')),
        concatMap((x) => x())
      )
      .subscribe((x) => {
        console.log('[PROCESSED]', x);
      });
  }
}
