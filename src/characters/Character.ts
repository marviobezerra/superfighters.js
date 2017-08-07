import { AssetsManager } from "../assets/assets-manager";

export enum Animations {
	Punch = "punch",
	Jump = "jump",
	Walking = "walking",
	Win = "win",
	WalkingBackwards = "walking_backwards",
	Die = "die",
	Stand = "stand"
}

export class Character extends createjs.Sprite {

	private Ground = 450;
	private KeyDownEvents: any;
	private KeyUpEvents: any;
	private PlayingAnimation: Animations;

	constructor(data: Object, private canvas: HTMLCanvasElement, private playerOne: boolean) {
		super(new createjs.SpriteSheet(data), "stand");

		this.Ground = canvas.height * 0.85;

		if (playerOne) {
			this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
			this.KeyUpEvents = this.RegisterKeyUpEvents.bind(this);
		}

	}

	public Start(): void {
		let sizeX = this.canvas.height * 0.25;
		let sizeY = this.canvas.width * 0.25;

		this.x = this.playerOne ? this.canvas.width * .2 : this.canvas.width * .8;
		this.y = this.Ground - sizeY;

		// this.scaleX = sizeX / this.getBounds().width;
		// this.scaleY = sizeY / this.getBounds().height;

		if (!this.playerOne) {
			this.scaleX *= -1;
		}

		if (this.playerOne) {
			document.addEventListener('keydown', this.KeyDownEvents, false);
			document.addEventListener('keyup', this.KeyUpEvents, false);
		}
	}

	public Stop(): void {
		if (this.playerOne) {
			document.removeEventListener('keydown', this.KeyDownEvents, false);
			document.removeEventListener('keyup', this.KeyUpEvents, false);
		}
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowLeft':
				if (this.PlayingAnimation !== Animations.Walking) {
					this.gotoAndPlay(Animations.Walking);
					this.PlayingAnimation = Animations.Walking;
				}


				break;
			case 'ArrowRight':
				if (this.PlayingAnimation !== Animations.WalkingBackwards) {
					this.gotoAndPlay(Animations.WalkingBackwards);
					this.PlayingAnimation = Animations.WalkingBackwards;
				}
				break;
		}
	}

	private RegisterKeyUpEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowLeft':
				this.gotoAndPlay(Animations.Stand);
				this.PlayingAnimation = Animations.Stand;
				break;
			case 'ArrowRight':
				this.gotoAndPlay(Animations.Stand);
				this.PlayingAnimation = Animations.Stand;
				break;
		}
	}
}