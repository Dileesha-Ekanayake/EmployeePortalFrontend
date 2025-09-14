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

  /**
   * Retrieves the username stored in local storage.
   * If no username is found, an empty string is returned.
   *
   * @return {string} The username from local storage, or an empty string if unavailable.
   */
  getUsername(): string {
    // @ts-ignore
    return localStorage.getItem("userName") || '';
  }

  /**
   * Sets the username in the local storage.
   *
   * @param {string} value - The username to be stored.
   * @return {void} This method does not return a value.
   */
  setUsername(value: string): void {
    // @ts-ignore
    localStorage.setItem("userName" , value);
  }

  /**
   * Sets the user's role by storing it in the local storage.
   *
   * @param {string} value - The role of the user to be set.
   * @return {void} No return value.
   */
  setUserRole(value: string): void {
    // @ts-ignore
    localStorage.setItem("userRole", value);
  }

  /**
   * Retrieves the user's role from the local storage.
   *
   * @return {string} The user's role as a string. Returns an empty string if the role is not found.
   */
  getUserRole(): string {
    // @ts-ignore
    return localStorage.getItem("userRole") || '';
  }

  /**
   * Sets the unique identifier (UID) in the local storage.
   *
   * @param {string} value - The unique identifier to be set in local storage.
   * @return {void} Indicates that no value is returned from this method.
   */
  setUid(value: string): void {
    //@ts-ignore
    localStorage.setItem("uid", value);
  }

  /**
   * Retrieves the user ID (uid) from local storage.
   *
   * @return {string} The user ID if found in local storage, otherwise an empty string.
   */
  getUid(): string {
    return localStorage.getItem("uid") || '';
  }

  /**
   * Sets authentication details by storing the token in local storage, decoding
   * the token to extract user details, and setting user properties such as UID, username, and role.
   *
   * @param {any} token - The authentication token to be processed and stored.
   * @return {void} - This method does not return any value.
   */
  setAuthDetails(token: any) : void {
    localStorage.setItem('authToken', token);
    const authHeader = this.getToken();
    if (authHeader) {

      const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log("Decoded Token:", decodedToken);

          // Extract uid, name, and role from claim URIs
          const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
          const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          this.setUid(userId);
          this.setUsername(name);
          this.setUserRole(role);

        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    }
  }

  /**
   * Clears the user details stored in localStorage. Specifically, it removes the userName, userRole, and uid entries.
   * @return {void} No return value.
   */
  clearUserDetails(): void {
    // @ts-ignore
    localStorage.removeItem("userName");
    // @ts-ignore
    localStorage.removeItem("userRole");
    // @ts-ignore
    localStorage.removeItem("uid");
  }

  /**
   * Retrieves the authentication token from localStorage.
   *
   * @return {string | null} The authentication token if it exists, otherwise null.
   */
  getToken(): string | null {
    // @ts-ignore
    return localStorage.getItem('authToken');
  }

  /**
   * Clears the authentication token stored in local storage.
   *
   * @return {void} Doesn't return any value.
   */
  clearAuthToken(): void {
    // @ts-ignore
    localStorage.removeItem('authToken');
  }

  /**
   * Logs out the current user by clearing user details, removing the authentication token,
   * and navigating to the login page.
   *
   * @return {void} Does not return any value.
   */
  logout(): void {
    this.clearUserDetails();
    this.clearAuthToken();
    this.router.navigateByUrl("login");
  }

}
