import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, map, Observable, of} from "rxjs";

/**
 * DataService is an Angular service that allows HTTP communication with a backend server.
 * It provides methods for CRUD operations as well as data retrieval with optional query parameters.
 *
 * This service is injectable globally using the `providedIn: 'root'` configuration.
 */
@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) {
  }

  /**
   * Fetches data from the specified endpoint and returns an observable of an array of type T.
   *
   * @param {string} endpoint The base URL or API endpoint for the request.
   * @param {string | number} [query] Optional parameter that can be a query string, path parameter, or query parameter.
   * @return {Observable<Array<T>>} An Observable emitting an array of data of type T.
   */
  getData<T>(endpoint: string, query?: string | number): Observable<Array<T>> {

    let url = endpoint;

    // Handle path parameter
    if (query && typeof query === 'string') {
      // Check if the parameter is a query string (starts with '?')
      if (query.startsWith('?')) {
        url = `${endpoint}${query}`; // Append query string directly
      } else if (query.includes('=')) {
        url = `${endpoint}?${query}`; // Treat as a query parameter
      } else {
        url = `${endpoint}/${query}`; // Treat as path parameter
      }
    }

    return this.http.get<Array<T>>(url).pipe(
      map(response => response || []),
      catchError(() => {
        console.error(`Error fetching data`);
        return of([]);
      })
    );
  }

  /**
   * Fetches data from the specified API endpoint and optionally includes a query parameter.
   *
   * @param {string} endpoint - The API endpoint to call.
   * @param {string | number} [query] - Optional query parameter to append to the endpoint.
   * @return {Observable<T>} An Observable containing the data retrieved from the API.
   */
  getDataObject<T>(endpoint: string, query?: string | number): Observable<T> {
    return this.http.get<T>(query ? `${endpoint}/${query}` : endpoint).pipe(
      map(response => {
        if (!response) throw new Error('No data returned from server');
        return response;
      })
    );
  }

  /**
   * Sends a POST request to save the provided data to the specified endpoint.
   *
   * @param {string} endpoint - The API endpoint to which the data is sent.
   * @param {T | T[]} data - The data to be sent to the server, can be a single object or an array of objects.
   * @return {Observable<T>} An observable emitting the saved data or an error if the request fails.
   */
  save<T>(endpoint: string, data: T | T[]): Observable<T> {
    return this.http.post<T>(endpoint, data).pipe(
      catchError((error) => {
        console.error(`Error saving data to ${endpoint}`, error);
        throw error;
      })
    );
  }


  /**
   * Sends an HTTP PUT request to update data at the specified endpoint.
   *
   * @param {string} endpoint The API endpoint where the data will be updated.
   * @param {T} data The data object to be sent for the update.
   * @return {Observable<T>} An Observable that emits the updated data or an error if the update fails.
   */
  update<T>(endpoint: string, data: T): Observable<T> {
    return this.http.put<T>(endpoint, data).pipe(
      catchError((error) => {
        console.error(`Error updating data at ${endpoint}`, error);
        throw error;
      })
    );
  }

  /**
   * Deletes a resource at the specified endpoint combined with the provided value.
   *
   * @param {string} endpoint The API endpoint to send the delete request to.
   * @param {number|string} value The identifier for the resource to delete. Can be a number or a string.
   * @return {Observable<string>} An Observable which emits the server's response as a string.
   */
  delete(endpoint: string, value: number | string): Observable<string> {
    return this.http.delete<string>(`${endpoint}/${value}`).pipe(
      catchError((error) => {
        console.error(`Error deleting data at ${endpoint}/${value}`, error);
        throw error;
      })
    );
  }
}
