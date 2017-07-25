import { AssertsManager } from "../asserts/asserts-manager";



export class Caracter extends createjs.Sprite {

	private readonly Ground = 450;
	private readonly KEYCODE_LEFT = 37;
	private readonly KEYCODE_RIGHT = 39;
	private readonly KEYCODE_UP = 38;
	private readonly KEYCODE_DOWN = 40;

	private readonly Punch = "punch";
	private readonly Jump = "jump";
	private readonly Walking = "walking";
	private readonly Win = "win";
	private readonly WalkingBackwards = "walking_backwards";
	private readonly Die = "die";
	private readonly Stand = "stand";

	constructor(data: Object, playerOne: boolean) {
		super(new createjs.SpriteSheet(data), "stand");

		this.x = playerOne ? 100 : 800 - this.getBounds().width;
		this.y = this.Ground - this.getBounds().height;

		if (!playerOne) {
			this.scaleX *= -1;
		}

		if (playerOne) {
			document.onkeydown = this.KeyPressed.bind(this);
		}
	}

	private KeyPressed(event: KeyboardEvent): void {
		console.log(event.keyCode);
		switch (event.keyCode) {
			case this.KEYCODE_LEFT:
				this.gotoAndPlay(this.Walking);
				break;
			case this.KEYCODE_RIGHT:
				this.gotoAndPlay(this.WalkingBackwards);
				break;
			case this.KEYCODE_UP:
				this.gotoAndPlay(this.Jump);
				break;
			case this.KEYCODE_DOWN:

				break;
		}
	}
}