import {HttpClient, HttpParams} from "@angular/common/http";
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
   * Sends data to the specified endpoint using an HTTP POST request.
   *
   * @param {string} endpoint - The URL to which the data will be sent.
   * @param {T | T[]} data - The data to be sent, which can be a single object or an array of objects.
   * @return {Observable<string>} An observable that emits a success message or an error string in case of failure.
   */
  save<T>(endpoint: string, data: T | T[]): Observable<string> {
    return this.http.post<string>(endpoint, data).pipe(
      catchError((error) => {
        console.error(`Error saving data to ${endpoint}`, error);
        return of('Error');
      })
    );
  }

  /**
   * Updates data at the specified endpoint with the provided data.
   *
   * @param {string} endpoint The API endpoint where the data will be updated.
   * @param {T} data The data to be updated at the specified endpoint.
   * @return {Observable<string>} An observable that emits a string indicating the success or failure of the update operation.
   */
  update<T>(endpoint: string, data: T): Observable<string> {
    return this.http.put<string>(endpoint, data).pipe(
      catchError((error) => {
        console.error(`Error updating data at ${endpoint}`, error);
        return of('Error');
      })
    );
  }

  /**
   * Deletes a resource at the specified endpoint with the provided identifier.
   *
   * @param {string} endpoint - The API endpoint to make the delete request.
   * @param {number|string} value - The identifier of the resource to delete.
   * @return {Observable<string>} An observable that emits the result of the delete operation or an error message.
   */
  delete(endpoint: string, value: number | string): Observable<string> {
    return this.http.delete<string>(`${endpoint}/${value}`).pipe(
      catchError((error) => {
        console.error(`Error deleting data at ${endpoint}/${value}`, error);
        return of('Error');
      })
    );
  }
}
