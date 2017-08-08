import { AssetsManager } from "../assets/assets-manager";
import { IManager } from '../scenes/SceneManager';
import { GameFight } from '../scenes/GameFight';

export enum Animations {
	Punch = "punch",
	Jump = "jump",
	Walking = "walking",
	Win = "win",
	WalkingBackwards = "walking_backwards",
	Die = "die",
	Stand = "stand"
}

export enum Directions {
	Right = 0,
	Left = 1
}

export class Character extends createjs.Sprite {

	private Ground = 450;
	private KeyDownEvents: any;
	private KeyUpEvents: any;
	private PlayingAnimation: Animations;
	public HitBorder: createjs.Shape;
	public Flip: boolean;

	constructor(data: Object, private manager: IManager, private fight: GameFight, private playerOne: boolean) {
		super(new createjs.SpriteSheet(data), "stand");

		this.Ground = manager.Canvas.height * 0.85;

		if (playerOne) {
			this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
			this.KeyUpEvents = this.RegisterKeyUpEvents.bind(this);
		}

	}

	public Move(direction: Directions, force: number) {
		switch (direction) {
			case Directions.Right:
				this.x += force;
				break;
			case Directions.Left:
				this.x -= force;
			default:
				break;
		}
	}

	public Punch() {
		if (this.PlayingAnimation !== Animations.Punch) {
			this.addEventListener("animationend", this.AfterPunch.bind(this), false);
			this.gotoAndPlay(Animations.Punch);
			this.PlayingAnimation = Animations.Punch;
		}
	}

	public Start(): void {
		let sizeX = this.manager.Canvas.height * 0.25;
		let sizeY = this.manager.Canvas.width * 0.25;

		this.x = this.playerOne ? this.manager.Canvas.width * .2 : this.manager.Canvas.width * .8;
		this.y = this.Ground - sizeY;

		if (!this.playerOne) {
			this.Flip = true;
			this.scaleX *= -1;
		}

		if (this.playerOne) {
			document.addEventListener('keydown', this.KeyDownEvents, false);
			document.addEventListener('keyup', this.KeyUpEvents, false);
		}

		this.CreateHitBorder();
	}

	public Stop(): void {
		if (this.playerOne) {
			document.removeEventListener('keydown', this.KeyDownEvents, false);
			document.removeEventListener('keyup', this.KeyUpEvents, false);
		}

		this.fight.removeChild(this.HitBorder);
		this.HitBorder = null;
	}

	public FlipDirection(): void {
		this.Flip = !this.Flip;
		this.scaleX *= -1;

		if (this.Flip) {
			this.x += this.getBounds().width;
		}

		if (!this.Flip) {
			this.x -= this.getBounds().width;
		}

		this.UpdateHitBorder();
	}

	private UpdateHitBorder(): void {
		if (this.HitBorder) {

			let bounds = this.getBounds();
			this.HitBorder.x = this.x + ((bounds.width / 2) - 50) - (this.Flip ? bounds.width : 0);
			this.HitBorder.y = this.y;
		}
	}

	private CreateHitBorder(): void {

		if (this.HitBorder) {
			this.fight.removeChild(this.HitBorder);
		}

		let border = new createjs.Shape();
		let command = border.graphics
			.beginStroke("#2223f3")
			.setStrokeStyle(2)
			.command;

		let bounds = this.getBounds();

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, 100, 240);
		border.setBounds(this.x, this.y, bounds.width, bounds.height);
		border.x = this.x - (this.Flip ? 100 : 0);
		border.y = this.y;

		border.graphics.command = command;
		this.HitBorder = border;

		this.fight.addChild(this.HitBorder);
	}

	public AfterPunch(e: any) {
		this.removeEventListener("animationend", this.AfterPunch.bind(this), false);
		this.gotoAndPlay(Animations.Stand);
		this.PlayingAnimation = Animations.Stand;
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {

		let newPos = 0;

		switch (event.key) {
			case ' ':
				if (this.PlayingAnimation !== Animations.Punch) {
					this.addEventListener("animationend", this.AfterPunch.bind(this), false);
					this.gotoAndPlay(Animations.Punch);
					this.PlayingAnimation = Animations.Punch;
				}
				break;

			case 'ArrowUp':
				if (this.PlayingAnimation !== Animations.Jump) {
					this.gotoAndPlay(Animations.Jump);
					this.PlayingAnimation = Animations.Jump;
				}

				newPos = this.y;
				let jumpSize = 200;

				createjs.Tween
					.get(this)
					.to({
						y: newPos - jumpSize,
						x: this.x + (jumpSize / 2)
					}, 300)
					.to({
						y: newPos,
						x: this.x + jumpSize
					}, 300)
					.call(() => {
						this.gotoAndPlay(Animations.Stand);
						this.PlayingAnimation = Animations.Stand;
						this.UpdateHitBorder();
						this.fight.PlayerMove();
					});


				break;
			case 'ArrowLeft':
				if (this.PlayingAnimation !== Animations.Walking) {
					this.gotoAndPlay(Animations.Walking);
					this.PlayingAnimation = Animations.Walking;
				}

				newPos = this.x - 20;
				this.x = newPos < 0 ? 0 : newPos;
				this.fight.PlayerMove();

				break;
			case 'ArrowRight':
				if (this.PlayingAnimation !== Animations.WalkingBackwards) {
					this.gotoAndPlay(Animations.WalkingBackwards);
					this.PlayingAnimation = Animations.WalkingBackwards;
				}

				newPos = this.x + 20;
				let limit = this.manager.Canvas.width - this.getBounds().width;
				this.x = newPos > limit ? limit : newPos;
				this.fight.PlayerMove();

				break;
		}

		this.UpdateHitBorder();
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

		this.UpdateHitBorder();
	}
}