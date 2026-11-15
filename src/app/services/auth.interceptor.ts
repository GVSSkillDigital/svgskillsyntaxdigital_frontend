import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).getAccessToken();
  const isPublicAuthRequest =
    //request.url === 'http://localhost:8080/api/auth/login' ||
    //request.url === 'http://localhost:8080/api/auth/register';

    request.url === '/api/auth/login' ||
    request.url === '/api/auth/register' ||
    request.url === '/api/auth/verify-email-id' ||
    request.url === '/api/auth/passwordreset' ||
    request.url === '/api/auth/confirmcode';
//  if (!token || isPublicAuthRequest || !request.url.startsWith('http://localhost:8080/api/')) {
if (!token || isPublicAuthRequest || !request.url.startsWith('/api/')) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
