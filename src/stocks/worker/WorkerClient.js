// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./PriceFetchWorker";

export default class WorkerClient {
  constructor() {
    this.priceWorker = new Worker();
  }
  
  get worker() {
    return this.priceWorker;
  }
}
