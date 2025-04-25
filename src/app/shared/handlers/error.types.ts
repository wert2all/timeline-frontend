export type MessageType = 'success' | 'error' | 'warning';

export class ErrorMessage {
  constructor(
    readonly message: string,
    readonly notify = false,
    readonly log = false,
    readonly type: MessageType = 'warning',
    readonly additional: Record<string, unknown> = {}
  ) {}

  notified(): ErrorMessage {
    return new ErrorMessage(
      this.message,
      true,
      this.log,
      this.type,
      this.additional
    );
  }

  loggable() {
    return new ErrorMessage(
      this.message,
      this.notify,
      true,
      this.type,
      this.additional
    );
  }

  error(): ErrorMessage {
    return new ErrorMessage(
      this.message,
      this.notify,
      this.log,
      'error',
      this.additional
    );
  }
}
