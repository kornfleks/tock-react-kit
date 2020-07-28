export namespace Sse {
  let sseIsEnabled = false;
  let eventSource: EventSource;

  export function init(tockEndPoint: string, userId: string, handleBotResponse: (botResponse: any) => void) : Promise<void> {
    return new Promise<void>((nextAction: () => void): void => {
      if (typeof (EventSource) !== "undefined" && tockEndPoint && !eventSource) {
        eventSource = new EventSource(tockEndPoint + '/sse?userid=' + userId);
        eventSource.addEventListener('message', (e: MessageEvent) => {
          handleBotResponse(JSON.parse(e.data))
        }, false);
        eventSource.addEventListener('open', (e: Event) => {
          sseIsEnabled = true;
          nextAction();
        }, false);
        eventSource.addEventListener('error', (e: Event) => {
          // @ts-ignore
          if (e.readyState == EventSource.CLOSED) {
            sseIsEnabled = false;
          }
          nextAction()
        }, false);
      }
    });
  }

  export function isEnable(): boolean {
    return sseIsEnabled
  }
}