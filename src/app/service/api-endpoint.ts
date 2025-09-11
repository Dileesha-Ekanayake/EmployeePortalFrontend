/**
 * An object containing endpoint URLs for API operations.
 * `ApiEndpoints` provides a structured and constant set of paths used for constructing API requests in the application.
 *
 * Properties:
 * - `baseUrl`: The base URL shared by all API endpoints.
 * - `paths`: An object containing specific endpoint paths categorized by their usage.
 *
 * The `paths` object includes various keys representing API routes related to functionalities like employees, users, suppliers, accommodations, location details, transfer contracts, and generic services.
 *
 * Keys within the `paths` object contain predefined endpoint paths for accessing different functionalities and resources in the API.
 */

const baseUrl = 'http://localhost:5050';

export const ApiEndpoints = {
  baseUrl,
  paths: {

  }
} as const;
