import type { PlaygroundPlugin, PluginUtils } from "./vendor/playground"
// @ts-ignore
import Worker from 'web-worker:./main.worker.js';
 
const makePlugin = (utils: PluginUtils) => {
  const customPlugin: PlaygroundPlugin = {
    id: "example",
    displayName: "Dev Example",
    didMount: (sandbox, container) => {
      const ds = utils.createDesignSystem(container)
      
      ds.title("Example Plugin")
      ds.p("This plugin has a button which changes the text in the editor, click below to test it")
      
      const startButton = document.createElement("input")
      startButton.type = "button"
      startButton.value = "Change the code in the editor"
      container.appendChild(startButton)
      
      const worker = new Worker();
      // @ts-ignore
      worker.postMessage({ action: "start", loaderSrc: window.loaderSrc, requireConfig: window.requireConfig });

      worker.addEventListener('message', (msg: any) => {
        console.log(msg)
        sandbox.setText(msg.data.text)
      });

      startButton.onclick = () => {
        worker.postMessage('Hello World!');
      }
    }
  }

  return customPlugin
}

export default makePlugin
