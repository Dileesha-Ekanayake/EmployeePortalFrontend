import {Injectable, OnDestroy} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationManagerService {

  constructor(
    private router: Router
  ) { }

  getUsername(): string {
    // @ts-ignore
    return localStorage.getItem("userName") || '';
  }

  setUsername(value: string): void {
    // @ts-ignore
    localStorage.setItem("userName" , value);
  }

  setUserRole(value: string): void {
    // @ts-ignore
    localStorage.setItem("userRole", value);
  }

  getUserRole(): string {
    // @ts-ignore
    return localStorage.getItem("userRole") || '';
  }

  setLoggedUserDetails() : void {
    const authHeader = this.getToken();
    if (authHeader) {

      const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log("Decoded Token:", decodedToken);

          // Extract name and role from claim URIs
          const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
          const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          console.log("Name:", name, "Role:", role);
          this.setUsername(name);
          this.setUserRole(role);

        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    }
  }

  clearUserDetails(): void {
    // @ts-ignore
    localStorage.removeItem("userName");
    // @ts-ignore
    localStorage.removeItem("userRole");
  }

  /**
   * Retrieves the authentication token stored in local storage.
   *
   * @return {string | null} The authentication token if available, otherwise null.
   */
  getToken(): string | null {
    // @ts-ignore
    return localStorage.getItem('authToken');
  }

  logout(): void {
    this.clearUserDetails();
    this.router.navigateByUrl("login");
  }

}
