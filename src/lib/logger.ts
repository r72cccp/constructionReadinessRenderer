export class Logger {
  private static exists: boolean;
  private static instance;
  private stdout: HTMLElement;
  private paused: boolean;
  private disabled: boolean;
  private MAX_MESSAGE_COUNT = 100;
  private pauseButton: HTMLElement;

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
    this.pauseButton = document.createElement('div');
    this.pauseButton.className = 'logger--pause-button';
    this.pauseButton.textContent = 'Pause';
    this.pauseButton.onclick = () => {
      this.toggleLogger();
    };
    loggerWrapper.appendChild(loggerContainer);
    loggerWrapper.appendChild(this.pauseButton);
    this.stdout = loggerContainer;
  };

  private toggleLogger() {
    this.paused = !this.paused;
    if (this.paused) {
      this.pauseButton.textContent = 'Continue';
    } else {
      this.pauseButton.textContent = 'Pause';
    };
  };

  private pushToStdOut(element: HTMLElement): void {
    this.stdout.appendChild(element);
    this.stdout.scrollTop = this.stdout.scrollHeight;
  };

  public log(...messages: Array<any>): void {
    if (this.paused || this.disabled) return;
    messages.forEach((message: any) => {
      const messageItem = document.createElement('div');
      messageItem.className = 'logger--container--item';
      if (typeof message === 'string') {
        messageItem.textContent = message;
      } else if (typeof message === 'object') {
        messageItem.innerHTML = JSON.stringify(message, undefined, 2).replace(/^\s+/mg, (match) => {
          return '&nbsp;'.repeat(match.length);
        }).replace(/\n/g, '<br />');
      };
      if (this.stdout.childNodes.length > this.MAX_MESSAGE_COUNT) {
        this.stdout.removeChild(this.stdout.childNodes[0]);
      };
      this.pushToStdOut(messageItem);
    });
  };
};
