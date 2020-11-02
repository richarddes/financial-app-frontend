# Frontend 
This project represents the frotnend for the entire financial app. All connections, accept real-time stock data, which gets' it's data from the *IEX Trading API*, goes to the localhost.

## Setup
To install all neccessary dependencies, run: 
```sh
npm install
```

Before the app can be run/build, an *IEX Cloud* token has to be set, so that chart data can be displayed for bought stocks. This isn't ideal but there's currently no way arround it. 
To set the api token, go to the file at **src/stocks/worker/ChartFetchWorker.ts** and change the **apiToken** variable to your *IEX Cloud* token.

To run the app in development mode, run:
```sh
npm run start
```

If you want to get a production build of the frontend to serve on a HTTP server, run:
```sh
npm run build
```

The resulting files should be in the /dist folder.

## Testing
After setup, the unit tests can be run with the following command:
```sh
npm run test
```
Some test that should work might fail because of networking issues. Simply rerunning the test (sometimes moce than once) should resolve the issue. I don't know why that happens so Pull request that solve that are welcome. 

## Contributing 
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License 
GNU GPLv3. Click [here](https://choosealicense.com/licenses/gpl-3.0/) or see the LICENSE file for details.