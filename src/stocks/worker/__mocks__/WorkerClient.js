class MockWorker {
  postMessage = msg => {}
  onmessage = () => {}
  terminate = () => {}
}

export default class WorkerClient {
  constructor() {
    this.priceWorker = new MockWorker();
  }

  get worker() {
    return this.priceWorker;
  }
}
