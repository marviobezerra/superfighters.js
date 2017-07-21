import { AssertsManager } from "../asserts/asserts-manager";

export class Caracter extends createjs.Sprite {

	private Ground = 450;

	constructor(data: Object, playerOne: boolean) {
		super(new createjs.SpriteSheet(data), "stand");

		this.x = playerOne ? 100 : 800 - this.getBounds().width;
		this.y = this.Ground - this.getBounds().height;

		if (!playerOne) {
			this.scaleX *= -1;
		}
	}
}