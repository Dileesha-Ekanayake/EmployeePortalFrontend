import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ApiEndpoints} from '../service/api-endpoint';

/**
 * Service responsible for handling authentication-related operations.
 */
@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {

  constructor(private http: HttpClient) {
  }

  /**
   * Authenticates a user by sending their credentials to the server.
   *
   * @param {string} username - The username of the user attempting to authenticate.
   * @param {string} password - The password of the user attempting to authenticate.
   * @return {Observable<any>} An observable that emits the server response containing the authentication token.
   */
  authenticate(username: string, password: string) : Observable<any>{
    return this.http.post<{ token: string }>(ApiEndpoints.paths.login,
      {username, password},
      {observe: 'response'});
  }

}
