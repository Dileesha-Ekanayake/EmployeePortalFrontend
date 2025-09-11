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

  getDataObject<T>(endpoint: string, query?: string | number): Observable<T> {
    const url = query ? `${endpoint}/${query}` : endpoint;

    return this.http.get<T>(url).pipe(
      map(response => {
        if (!response) throw new Error('No data returned from server');
        return response;
      }),
      catchError((error) => {
        console.error(`Error fetching data from ${url}`, error);
        return of(null as any);
      })
    );
  }

  save<T>(endpoint: string, data: T | T[]): Observable<string> {
    return this.http.post<string>(endpoint, data).pipe(
      catchError((error) => {
        console.error(`Error saving data to ${endpoint}`, error);
        return of('Error');
      })
    );
  }

  update<T>(endpoint: string, data: T): Observable<string> {
    return this.http.put<string>(endpoint, data).pipe(
      catchError((error) => {
        console.error(`Error updating data at ${endpoint}`, error);
        return of('Error');
      })
    );
  }

  delete(endpoint: string, value: number | string): Observable<string> {
    return this.http.delete<string>(`${endpoint}/${value}`).pipe(
      catchError((error) => {
        console.error(`Error deleting data at ${endpoint}/${value}`, error);
        return of('Error');
      })
    );
  }
}
