import "h5tiny";
import "h5tiny/plugins/sound";
import "h5tiny/plugins/three";
import { Game } from "./Game";
import "./helpers/fixLoader";
import "./helpers/debug3d";
import "./helpers/howler";
import sdk from "@smoud/playable-sdk";
import { SplashScreen } from "SplashScreen";

sdk.init((width, height) => {
  SplashScreen.init();

  const game = new Game(width, height);
  window.app = game;

  sdk.on("resize", game.resize, game);
  sdk.on("pause", game.pause, game);
  sdk.on("resume", game.resume, game);
  sdk.on("resume", game.resume, game);
  sdk.on("finish", game.finish, game);
});

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
