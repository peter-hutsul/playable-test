import { TopBar } from "./TopBar";
import { InstallButton } from "./InstallButton";
import { Balance } from "./Balance";
import { Opaque } from "./Opaque2D";
import { Endcard } from "./Endcard";
import { ChoiceBar } from "./ChoiceBar";

export class UI extends Tiny.Object2D {
  constructor(parentStage) {
    super();
    parentStage.add(this);
  }

  preload() {}

  create() {
    this.hud = new Tiny.Object2D();
    this.add(this.hud);

    this.topBar = new TopBar(this.hud);
    this.choiceBar = new ChoiceBar(this.hud);
    this.balance = new Balance(this.topBar);
    this.game.opaque = this.opaque = new Opaque(this.hud);
    this.installBtn = new InstallButton(this.hud);
    this.endcard = new Endcard(this);

    this.skipDay = new Tiny.Sprite("skip_day");
    this.skipDay.anchor.set(0.5);
    this.skipDay.scale.set(0.6);
    this.game.input.add(this.skipDay);
    this.skipDay.input.on("down", () => this.game.scene.nextDay());

    this.hud.add(this.skipDay);
  }

  showEndcard() {
    this.opaque.dark(200, function () {});
    this.endcard.show();
  }

  resize(width, height, scale) {
    this.x = width / 2;
    this.y = height / 2;

    this.scale.set(scale);

    this.scaledWidth = width / scale;
    this.scaledHeight = height / scale;

    this.topBar.resize();
    this.choiceBar.resize();

    this.installBtn.y = this.topBar.y;
    this.installBtn.x = 150;
    this.balance.x = -200;

    this.skipDay.x = -this.scaledWidth / 2 + 100;
    this.skipDay.y = -this.game.ui.scaledHeight / 2 + 220;

    this.opaque.resize();
    this.endcard.resize();
  }

  update() {}
}
