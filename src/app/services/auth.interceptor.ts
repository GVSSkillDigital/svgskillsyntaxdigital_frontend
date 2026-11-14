import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).getAccessToken();
  const isPublicAuthRequest =
    request.url === 'http://localhost:8080/api/auth/login' ||
    request.url === 'http://localhost:8080/api/auth/register';
  if (!token || isPublicAuthRequest || !request.url.startsWith('http://localhost:8080/api/')) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
