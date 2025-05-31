import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/core/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(),RouterModule ,provideRouter(routes),{ provide:HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  ]
});
