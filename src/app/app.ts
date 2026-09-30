import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SessionTimeoutService } from '@pure-tools/babetka';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<router-outlet />`,
  styles: [`:host { display: block; }`],
})
export class App {
  private auth = inject(AuthService);
  private sessionTimeout = inject(SessionTimeoutService);

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.sessionTimeout.start();
      } else {
        this.sessionTimeout.stop();
      }
    });
  }
}
