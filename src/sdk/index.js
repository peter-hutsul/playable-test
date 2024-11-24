import { getBrowserLanguage, getScale, isLandscape } from "utils";
import { SplashScreen } from "./splash";

const languagePack = {};

window.lang = function (label) {
  return languagePack[label] || label;
};

export class sdk {
  static landscape = isLandscape();

  static app;

  static onResize() {
    const width = Math.floor(window.innerWidth);
    const height = Math.floor(window.innerHeight);
    this.landscape = width > height;

    if (this.app) {
      this.app.resize(width, height, getScale(width, height));
    }
  }

  static boot(AppClass) {
    window.app = this.app = new AppClass(Math.floor(window.innerWidth), Math.floor(window.innerHeight));
  }

  static init(AppClass) {
    SplashScreen.init();
    window.addEventListener("load", () => this.boot(AppClass));
    window.addEventListener("resize", () => this.onResize(), false);
  }

  static create() {
    this.onResize();
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
