import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-wrap">
      <div class="login-card">
        <div class="icon">🌳</div>
        <h1>My Tree Garden</h1>
        <p class="subtitle">Track your trees — plant, grow, remember.</p>

        @if (sent()) {
          <div class="success">
            <p>Magic link sent to <strong>{{ email() }}</strong>.</p>
            <p class="hint">Check your inbox and click the link.</p>
          </div>
        } @else {
          <form (ngSubmit)="submit()" class="form">
            <label for="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
            />
            <button type="submit" [disabled]="loading()">
              {{ loading() ? 'Sending…' : 'Send Magic Link' }}
            </button>
          </form>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .login-wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pt-bg, #fafafa);
      padding: 24px;
    }
    .login-card {
      background: var(--pt-surface, #fff);
      border: 1px solid var(--pt-border, #e0e0e0);
      box-shadow: 0 4px 24px var(--pt-shadow, rgba(0,0,0,0.06));
      padding: 40px 36px;
      max-width: 380px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 2.5rem; margin-bottom: 8px; }
    h1 {
      margin: 0 0 6px;
      font-size: 1.4rem;
      color: var(--pt-text, #333);
      font-weight: 700;
    }
    .subtitle {
      color: var(--pt-text-muted, #888);
      font-size: 0.9rem;
      margin: 0 0 28px;
    }
    .form { display: flex; flex-direction: column; gap: 10px; text-align: left; }
    label { font-size: 0.75rem; font-weight: 600; color: var(--pt-text-muted, #888); text-transform: uppercase; letter-spacing: 0.04em; }
    input {
      padding: 10px 12px;
      border: 1px solid var(--pt-border, #ccc);
      font-size: 0.95rem;
      background: var(--pt-bg, #fff);
      color: var(--pt-text, #333);
      outline: none;
      transition: border-color 0.15s;
    }
    input:focus { border-color: var(--pt-accent, #555); }
    button {
      padding: 11px;
      background: var(--pt-accent, #555);
      color: var(--pt-accent-fg, #fff);
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    button:disabled { opacity: 0.6; cursor: default; }
    button:not(:disabled):hover { opacity: 0.85; }
    .success { background: var(--pt-bg-alt, #f5f5f5); padding: 16px; font-size: 0.9rem; color: var(--pt-text, #333); }
    .success .hint { color: var(--pt-text-muted, #888); margin: 4px 0 0; font-size: 0.82rem; }
    .error { color: #e53e3e; font-size: 0.85rem; margin-top: 8px; }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  loading = signal(false);
  sent = signal(false);
  error = signal('');

  async submit() {
    const e = this.email();
    if (!e) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signIn(e);
      this.sent.set(true);
    } catch {
      this.error.set('Failed to send link. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
