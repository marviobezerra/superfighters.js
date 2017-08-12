import { AssetsManager } from "../assets/assets-manager";
import { IManager } from '../scenes/SceneManager';
import { GameFight } from '../scenes/GameFight';
import { CharacterActions, CharacterAction } from './CharacterActions';

export enum Animations {
	Punch = "punch",
	Jump = "jump_1",
	Walking = "walk_forward",
	Win = "taunt",
	WalkingBackwards = "walk_backwards",
	Die = "die",
	TimeOver = "time_lose",
	Stand = "stand",
	GotHit = "got_hit"
}

export class Character extends createjs.Sprite {

	private Ground = 450;
	private KeyDownEvents: any;
	private KeyUpEvents: any;
	public PlayingAnimation: Animations;
	public HitBorder: createjs.Shape;
	public Actions: CharacterActions;
	public Flip: boolean;
	public Damage = 0;

	constructor(data: Object, public manager: IManager, private fight: GameFight, private playerOne: boolean) {
		super(new createjs.SpriteSheet(data), "stand");

		this.Actions = new CharacterActions(this, fight);
		this.Ground = (manager.Canvas.height * .95) - this.getBounds().height;
		this.PlayingAnimation = Animations.Stand;

		if (playerOne) {
			this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
			this.KeyUpEvents = this.RegisterKeyUpEvents.bind(this);
		}

		this.StartPosition();
	}

	public Start(): void {
		this.Actions.Reset();
		this.Damage = 0;

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

	private StartPosition(): void {
		this.x = this.playerOne ? this.manager.Canvas.width * .2 : this.manager.Canvas.width * .8;
		this.y = this.Ground;

		if (!this.playerOne) {
			this.Flip = true;
			this.scaleX *= -1;
		}
	}

	public GetHit(): void {
		this.Actions.Execute(CharacterAction.GotHit);
		this.Damage += 10;
	}

	public Die(timeOver: boolean = false): void {
		this.Actions.Execute(timeOver ? CharacterAction.TimeOver : CharacterAction.Die);
		this.y = this.Ground + this.getBounds().height;
	}

	public Win(): void {
		this.Actions.Execute(CharacterAction.Win);
	}

	public UpdateHitBorder(): void {
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

	private RegisterKeyDownEvents(event: KeyboardEvent): void {

		let newPos = 0;

		switch (event.key) {
			case ' ':
				this.Actions.Execute(CharacterAction.Punch);
				break;
			case 'ArrowUp':
				this.Actions.Execute(CharacterAction.Jump);
				break;
			case 'ArrowLeft':
				this.Actions.Execute(CharacterAction.MoveLeft);
				break;
			case 'ArrowRight':
				this.Actions.Execute(CharacterAction.MoveRight);
				break;
		}
	}

	private RegisterKeyUpEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowLeft':
				this.Actions.Execute(CharacterAction.Stand);
				break;
			case 'ArrowRight':
				this.Actions.Execute(CharacterAction.Stand);
				break;
		}
	}
}