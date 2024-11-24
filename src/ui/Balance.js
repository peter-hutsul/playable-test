import { numToStr } from "utils";

export class Balance extends Tiny.Object2D {
  constructor(parent) {
    super();
    parent.add(this);

    var money = new Tiny.Sprite("money");
    money.anchor.set(0.5);
    money.scale.set(0.5);
    money.x = -20;
    this.add(money);

    var balanceText = new Tiny.Text(numToStr(100), {
      font: "bold 40pt Arial",
      fill: "#ffffff"
    });
    balanceText.anchor.set(0, 0.5);
    balanceText.x = 32;
    balanceText.y = 3;

    this.add(balanceText);
  }
}
