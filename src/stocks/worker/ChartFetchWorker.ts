/* eslint-disable */

const ctx: Worker = self as any;
const apiToken = "your-token-here";

ctx.onmessage = (event) => {
  event.data.forEach((symbol: string) => {
    fetch(
      `https://sandbox.iexapis.com/stable/stock/${symbol}/chart/5d?token=${apiToken}&chartCloseOnly=true`
    )
      .then((res) => res.json())
      .then((data) => ctx.postMessage({ [symbol]: data }));
  });
};

export default null as any;
