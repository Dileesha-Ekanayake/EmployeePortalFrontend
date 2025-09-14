import {Injectable} from '@angular/core';
import {AvNotificationService} from '@avoraui/av-notifications';

@Injectable({
  providedIn: 'root'
})
export class SimpleResponseHandler {

  constructor(
    private notificationService: AvNotificationService
  ) {
  }

  handleSuccessResponse(type: string): void {
    this.notificationService.showSuccess(`Successfully created ${type}`, {
      theme: "light"
    });
  }

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
