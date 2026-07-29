import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PurchaseService } from '../services/purchase.service';

export const paidGuard: CanActivateFn = async () => {
  const purchase = inject(PurchaseService);
  const router = inject(Router);
  const paid = await purchase.hasPurchased();
  if (!paid) return router.createUrlTree(['/paywall']);
  return true;
};
