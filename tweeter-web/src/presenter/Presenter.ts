export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage(message: string, duration?: number): string;
  deleteMessage(id: string): void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  public get view() {
    return this._view;
  }
  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    }
  }
}
