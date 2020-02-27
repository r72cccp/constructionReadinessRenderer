export class Logger {
  private static exists: boolean;
  private static instance;
  private stdout: HTMLElement;
  private paused: boolean;
  private disabled: boolean;
  private MAX_MESSAGE_COUNT = 100;

  constructor(elementId = 'logger', maxMessageCount?: number) {
    if (Logger.exists) {
      return Logger.instance;
    };
    Logger.instance = this;
    Logger.exists = true;
    if (maxMessageCount && maxMessageCount > 0 && maxMessageCount !== this.MAX_MESSAGE_COUNT) {
      this.MAX_MESSAGE_COUNT = maxMessageCount;
    };
    this.initializeStdOut(elementId);
    this.paused = false;
    this.log('Logger initialized.');
  };

  private initializeStdOut(elementId: string): void {
    let loggerWrapper = document.getElementById(elementId);
    if (!loggerWrapper) {
      this.disabled = true;
      return;
    };
    loggerWrapper.className = 'logger';
    const loggerContainer = document.createElement('div');
    loggerContainer.className = 'logger--container';
    const pauseButton = document.createElement('div');
    pauseButton.className = 'logger--pause-button';
    pauseButton.textContent = 'pause';
    pauseButton.onclick = () => {
      this.toggleLogger();
    };
    loggerWrapper.appendChild(loggerContainer);
    loggerWrapper.appendChild(pauseButton);
    this.stdout = loggerContainer;
  };

  private toggleLogger() {
    this.paused = !this.paused;
  }

  private pushToStdOut(element: HTMLElement): void {
    this.stdout.appendChild(element);
    this.stdout.scrollTop = this.stdout.scrollHeight;
  };

  public log(message: string): void {
    if (this.paused || this.disabled) return;
    const messageItem = document.createElement('div');
    messageItem.className = 'logger--container--item';
    messageItem.textContent = message;
    if (this.stdout.childNodes.length > this.MAX_MESSAGE_COUNT) {
      this.stdout.removeChild(this.stdout.childNodes[0]);
    };
    this.pushToStdOut(messageItem);
  };
};
