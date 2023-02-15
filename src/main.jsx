import { render } from "preact";
import { App } from "./app";
import "./index.css";
import Handsfree from "handsfree";
import "handsfree/build/lib/assets/handsfree.css";

window.handsfree = new Handsfree({
  hands: true,
  showDebug: false,
  gesture: { enabled: true },
});

render(<App />, document.getElementById("app"));
