## TypeScript Playground Plugin

An example plugin which uses TypeScript (and soon tsvfs) on a background web-worker thread.

## Running this plugin

You're  probably not that interested in running it, more reading and understanding the code.

#### Add the rollup plugin:
```sh
yarn add rollup-plugin-web-worker-loader --dev
```

#### Edit the config: [`./rollup.config.js`](./rollup.config.js)

```diff
+ import webWorkerLoader from 'rollup-plugin-web-worker-loader';

- plugins: [typescript({ tsconfig: 'tsconfig.json' }), commonjs(), node(), json()],
+ plugins: [typescript({ tsconfig: 'tsconfig.json' }), commonjs(), node(), json(), webWorkerLoader()],
```

#### Setup your plugin to talk to a worker in [`./src/index.ts`](./src/index.ts):

```ts
import Worker from 'web-worker:./main.worker.js';

const makePlugin = (utils: PluginUtils) => {
  const customPlugin: PlaygroundPlugin = {
    id: "example",
    displayName: "Dev Example",
    didMount: (sandbox, container) => {
      const worker = new Worker();
      // @ts-ignore
      worker.postMessage({ action: "start", loaderSrc: window.loaderSrc, requireConfig: window.requireConfig });
      // ... normal plugin stuff
```

This will give the web worker info about the URLs needed to load TS, and tell rollup where to find the worker.

#### Create a [`main.worker.js`](./src/main.worker.js):

```js
/// <reference lib="webworker" />

self.onmessage = function (msg) {
  switch(msg.data.action) {
    case "start": {
      // Import the vscode loader into the runtime, but we don't actually use it
      this.importScripts(msg.data.loaderSrc)

      // Next grab TS
      // looks like "https://typescript.azureedge.net/cdn/3.9.2/monaco/dev/vs/language/typescript/lib/typescriptServices.js"
      const tsBase = msg.data.requireConfig.paths.vs 
      const ts = `${tsBase}/language/typescript/lib/typescriptServices.js`
      importScripts(ts)

      //  Now you have access to ts which is the same as require("typescript")
      console.log(self.ts)
      
      self.postMessage({ action: "ready" })
    }
  }
  // ... other actions
}

```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full details, however, TLDR:

```sh
git clone ...
yarn install
yarn start
```

Then tick the box for starting plugin development inside the TypeScript Playground.
