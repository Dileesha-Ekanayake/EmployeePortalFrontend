import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, Observable, throwError} from "rxjs";
import {ApiEndpoints} from '../service/api-endpoint';

/**
 * Service responsible for handling user authentication.
 *
 * This service provides methods to allow users to authenticate by interacting
 * with the backend API.
 */
@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {

  constructor(private http: HttpClient) {
  }

  /**
   * Authenticates a user using their username and password credentials.
   *
   * @param {string} username The username of the user attempting to authenticate.
   * @param {string} password The password of the user attempting to authenticate.
   * @return {Observable<HttpResponse<{ token: string }>>} An observable that emits the HTTP response containing the authentication token on successful authentication.
   */
  authenticate(username: string, password: string): Observable<HttpResponse<{ token: string }>> {
    return this.http.post<{ token: string }>(
      ApiEndpoints.paths.login,
      { username, password },
      { observe: 'response' }
    ).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
