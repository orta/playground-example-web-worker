/// <reference lib="webworker" />


self.onmessage = function (msg) {
  console.log(msg.data)
  switch(msg.data.action) {
    case "start": {
      // Import the vscode loader into the runtime, but we don't actually use it
      this.importScripts(msg.data.loaderSrc)

      // Next grab TS
      // looks like "https://typescript.azureedge.net/cdn/3.9.2/monaco/dev/vs/language/typescript/lib/typescriptServices.js"
      const tsBase = msg.data.requireConfig.paths.vs 
      const ts = `${tsBase}/language/typescript/lib/typescriptServices.js`
      importScripts(ts)
      
      // Then grab a copy of TS VFS
      // http://localhost:8000/js/sandbox/vendor/typescript-vfs.js
      const tsvfsBase = msg.data.requireConfig.paths["typescript-sandbox"]
      const tsvfs = `${this.location.origin}/js/sandbox/vendor/typescript-vfs.js`
      
      console.log("loaded", self.ts)
      console.log("loaded", self.tsvfs)
      // const requireConfig = msg.data.requireConfig;
      self.require.config(msg.data.requireConfig)

      self.require(["sandbox/vendor/typescript-vfs"], async (main, tsWorker, sandbox, playground) => {
        console.log("OK", main, tsWorker)
      })
    }
  }
  console.log(msg)
  self.postMessage({ text: "// this came from the worker the new text" })
}
