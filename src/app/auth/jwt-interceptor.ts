import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {catchError, throwError} from "rxjs";
import {AuthorizationManagerService} from './authorization-manager.service';

/**
 * JwtInterceptor is an HttpInterceptor function that intercepts HTTP requests to add a JWT
 * token to the Authorization header if it exists in local storage.
 * This helps in authorizing requests made to the server.
 *
 * Behavior:
 * - Retrieves the JWT token stored in the browser's local storage under the key 'authToken'.
 * - If a token is found:
 *   - Clones the outgoing HTTP request and appends the token to the Authorization header.
 * - If no token is found:
 *   - Proceeds with the original request and logs a warning indicating the user is not authenticated.
 *
 * Error Handling:
 * - Catches errors for unauthorized requests (HTTP status code 401).
 * - Logs a warning message for unauthorized requests indicating that the user might need to log out.
 *
 * Returns the intercepted HTTP request with the Authorization header added, or the original
 * request if no token is present.
 *
 * Dependencies:
 * - Requires localStorage to retrieve the JWT token.
 * - Uses RxJS operators for error handling.
 *
 * Intended Usage: To automatically include a JWT token in HTTP requests for protected API endpoints.
 */
export const JwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthorizationManagerService);
  // @ts-ignore
  const jwtToken = localStorage.getItem('authToken');

  if (jwtToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
  } else {
    console.warn("User not authenticated. Logging out...");
    authService.logout();
    return next(request);
  }

  return next(request).pipe(
    catchError(err => {
      if (err.status === 401) {
        authService.logout();
        console.warn("Unauthorized request. Logging out...");
      }
      return throwError(() => err);
    })
  );
};
