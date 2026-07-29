import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideResponsive } from '@pure-tools/mobilka';
import { provideTheme, BUILT_IN_THEMES } from '@pure-tools/paletka';
import { providePayments } from '@pure-tools/monetka';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideResponsive({ strategy: 'combination' }),
    provideTheme({ themes: BUILT_IN_THEMES, mode: 'persist', persistKey: 'garden-theme' }),
    providePayments({
      provider: 'lemon-squeezy',
      publicKey: environment.lsStoreSlug,
      productId: environment.lsProductId,
      variantId: environment.lsVariantId,
    }),
  ],
};
