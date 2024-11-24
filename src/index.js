import "h5tiny";
import "h5tiny/plugins/sound";
import "h5tiny/plugins/three";

import { Game } from "./Game";
import { sdk } from "sdk";
import { locales } from "./locales";
import "./helpers/fixLoader";
import "./helpers/debug3d";
import "./helpers/howler";

sdk.setLocales(locales);
sdk.init(Game);

if (__DEV__) {
  (function () {
    const script = document.createElement("script");

    script.onload = function () {
      const stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };

    script.src = "https://mrdoob.github.io/stats.js/build/stats.min.js";
    document.head.appendChild(script);
  })();
}
