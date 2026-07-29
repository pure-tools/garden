import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '@pure-tools/monetka';
import { AuthService } from '../../services/auth.service';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-paywall',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <div class="card">
        <div class="icon">🌳</div>
        <h1>My Tree Garden</h1>
        <p class="tagline">Your personal tree map — plant, track, and remember every tree in your garden.</p>

        <ul class="features">
          <li>✓ Unlimited trees per garden</li>
          <li>✓ Track age, size, fruit type &amp; notes</li>
          <li>✓ Cloud sync — access from any device</li>
          <li>✓ Beautiful themes</li>
          <li>✓ One-time purchase, no subscription</li>
        </ul>

        <div class="price">
          <span class="amount">$4.99</span>
          <span class="once">one time</span>
        </div>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <button class="buy-btn" (click)="buy()" [disabled]="loading()">
          {{ loading() ? 'Opening checkout…' : 'Buy Now' }}
        </button>

        <button class="signout-btn" (click)="signOut()">Sign out</button>
      </div>
    </div>
  `,
  styles: [`
    .wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pt-bg, #fafafa);
      padding: 24px;
    }
    .card {
      background: var(--pt-surface, #fff);
      border: 1px solid var(--pt-border, #e0e0e0);
      box-shadow: 0 4px 24px var(--pt-shadow, rgba(0,0,0,0.06));
      padding: 40px 36px;
      max-width: 420px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 2.5rem; margin-bottom: 8px; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; font-weight: 700; color: var(--pt-text, #333); }
    .tagline { color: var(--pt-text-muted, #888); font-size: 0.9rem; margin: 0 0 24px; }
    .features {
      list-style: none;
      padding: 0;
      margin: 0 0 28px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .features li { font-size: 0.9rem; color: var(--pt-text, #444); }
    .price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
      margin-bottom: 20px;
    }
    .amount { font-size: 2.4rem; font-weight: 700; color: var(--pt-text, #333); }
    .once { font-size: 0.85rem; color: var(--pt-text-muted, #888); }
    .buy-btn {
      width: 100%;
      padding: 14px;
      background: var(--pt-accent, #555);
      color: var(--pt-accent-fg, #fff);
      border: none;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.15s;
      margin-bottom: 12px;
    }
    .buy-btn:disabled { opacity: 0.6; cursor: default; }
    .buy-btn:not(:disabled):hover { opacity: 0.85; }
    .signout-btn {
      background: none;
      border: none;
      color: var(--pt-text-muted, #aaa);
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: underline;
    }
    .error { color: #e53e3e; font-size: 0.85rem; margin-bottom: 12px; }
  `],
})
export class PaywallComponent {
  private payment = inject(PaymentService);
  private auth = inject(AuthService);
  private purchase = inject(PurchaseService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  async buy() {
    const user = this.auth.user();
    if (!user) return;

    this.loading.set(true);
    this.error.set('');
    try {
      const result = await this.payment.openCheckout({
        email: user.email,
        userId: user.id,
        metadata: { userId: user.id },
        successUrl: `${window.location.origin}/garden`,
        cancelUrl: `${window.location.origin}/paywall`,
      });

      if (result.sessionId) {
        const ok = await this.purchase.completePurchase(result.sessionId);
        if (ok) {
          this.router.navigate(['/garden']);
          return;
        }
      }
      // If no sessionId (overlay closed without purchase), just wait
    } catch {
      this.error.set('Checkout failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
