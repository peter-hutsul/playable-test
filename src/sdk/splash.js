import icon from "assets/icon.png";

export class SplashScreen {
  static #element;
  static #delayReady = false;
  static #postrender = false;

  static init() {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => this.#show());
    } else {
      this.#show();
    }
  }

  static #show() {
    const element = (this.#element = document.createElement("div"));
    const style = element.style;

    style.position = "absolute";
    style.width = "104%";
    style.height = "104%";
    style.left = "-2%";
    style.top = "-2%";
    style.zIndex = "256";
    style.pointerEvents = "none";
    style.alignContent = "center";
    style.textAlign = "center";

    style.background = `url(${icon}) no-repeat center center`;
    style.backgroundSize = "180px";
    style.backgroundColor = "#d7d7d7";
    style.transition = "opacity 0.2s";

    const loading = document.createElement("div");
    loading.style.marginTop = "250px";
    loading.style.fontSize = "35px";
    loading.style.fontFamily = "sans-serif";
    loading.innerText = "Loading...";
    element.appendChild(loading);

    document.body.appendChild(element);

    setTimeout(() => {
      this.#delayReady = true;
      if (this.#postrender) this.hide();
    }, 1000);
  }

  static hide() {
    this.#postrender = true;
    if (this.#delayReady) this.#hide();
  }

  static #hide() {
    this.#element.style.opacity = 0;
    setTimeout(() => {
      this.#element.style.display = "none";
    }, 200);
  }
}
