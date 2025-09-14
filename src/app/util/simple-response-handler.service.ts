import {Injectable} from '@angular/core';
import {AvNotificationService} from '@avoraui/av-notifications';

/**
 * A service class designed to handle responses from API calls and provide user notifications
 * for both successful and failed operations.
 */
@Injectable({
  providedIn: 'root'
})
export class SimpleResponseHandlerService {

  constructor(
    private notificationService: AvNotificationService
  ) {
  }

  /**
   * Handles the logic for displaying a success notification when a successful response is received.
   *
   * @param {string} type - The type of entity or operation that was successfully created or completed.
   * @return {void} This method does not return a value.
   */
  handleSuccessResponse(type: string): void {
    this.notificationService.showSuccess(`Successfully created ${type}`, {
      theme: "light"
    });
  }

  /**
   * Handles an error response and displays an appropriate notification
   * based on the error status.
   *
   * @param {any} error - The error object to handle. If no error is provided,
   *                      a default error message will be shown.
   * @return {void} This method does not return a value.
   */
  handleErrorResponse(error: any): void {
    if (!error) {
      this.notificationService.showFailure("An unexpected error occurred", {theme: "light"});
      return;
    }
    const status = error.status;

    switch (status) {
      case 400:
        this.notificationService.showFailure("Invalid input", {theme: "light"});
        break;
      case 401:
        this.notificationService.showFailure("Unauthorized", {theme: "light"});
        break;
      case 403:
        this.notificationService.showFailure("Forbidden", {theme: "light"});
        break;
      case 404:
        this.notificationService.showFailure("Not found", {theme: "light"});
        break;
      case 500:
        this.notificationService.showFailure("Internal server error", {theme: "light"});
        break;
      default:
        this.notificationService.showFailure("An unexpected error occurred", {theme: "light"});
    }
  }

}
