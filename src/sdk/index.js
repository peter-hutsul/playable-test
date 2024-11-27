import { getBrowserLanguage, getScale, isLandscape } from "utils";
import { SplashScreen } from "./splash";

const languagePack = {};

window.lang = function (label) {
  return languagePack[label] || label;
};

export class sdk {
  static landscape = isLandscape();

  static app;

  static #onResize() {
    const width = Math.floor(window.innerWidth);
    const height = Math.floor(window.innerHeight);
    this.landscape = width > height;

    if (this.app) {
      this.app.resize(width, height, getScale(width, height));
    }
  }

  static #onPause() {
    const app = this.app;
    if (typeof app.volume == "function") app.volume(0);
    if (typeof app.pause == "function") app.pause();
  }

  static #onResume() {
    const app = this.app;
    if (typeof app.volume == "function") app.volume(1);
    if (typeof app.resume == "function") app.resume();
  }

  static boot(AppClass) {
    window.app = this.app = new AppClass(Math.floor(window.innerWidth), Math.floor(window.innerHeight));

    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, () => {
      if (document[hidden]) this.#onPause();
      else this.#onResume();
    });
  }

  static init(AppClass) {
    SplashScreen.init();
    window.addEventListener("load", () => this.boot(AppClass));
  }

  static create() {
    window.addEventListener("resize", () => this.#onResize(), false);
    this.#onResize();
    SplashScreen.hide();
  }

  static install() {
    alert("Install");
  }

  static finish() {
    console.log("Finished!");
  }

  static setLocales(pack) {
    var userLang = getBrowserLanguage(true);

    for (let key in pack) {
      languagePack[key] = pack[key][userLang] || pack[key]["en"];
    }
  }
}
