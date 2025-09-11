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

  authenticate(username: string, password: string) : Observable<any>{
    return this.http.post<[]>(ApiEndpoints.paths.login,
      {username, password},
      {observe: 'response'});
  }

}
