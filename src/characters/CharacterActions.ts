import { Character, Animations } from './Character';
import { GameFight } from '../scenes/GameFight';

export enum CharacterAction {
	Die,
	MoveRight,
	MoveLeft,
	Jump,
	Punch,
	GotHit,
	Stand
}

export class CharacterActions {
	private WalkSpeed = 35;
	private JumpSize = 200;
	private AfterAnimationEvent: any;
	private BlockAction = false;

	constructor(private player: Character, private fight: GameFight) {
		this.AfterAnimationEvent = this.AfterAnimation.bind(this);
	}

	public Reset(): void {
		this.player.removeEventListener("animationend", this.AfterAnimationEvent, false);
		this.BlockAction = false;
		this.ExecuteStand();
	}

	public Execute(action: CharacterAction): void {
		if (this.BlockAction && action != CharacterAction.Die) {
			return;
		}

		switch (action) {
			case CharacterAction.GotHit:
				this.ExecuteGetHit();
				break;
			case CharacterAction.Punch:
				this.ExecutePunch();
				break;
			case CharacterAction.Jump:
				this.ExecuteJump();
				break;
			case CharacterAction.MoveLeft:
				this.ExecuteMoveLeft();
				break;
			case CharacterAction.MoveRight:
				this.ExecuteMoveRight();
				break;
			case CharacterAction.Stand:
				this.ExecuteStand();
				break;
			case CharacterAction.Die:
				this.ExecuteDie();
				break;
			default:
				break;
		}
	}

	private ExecuteMoveRight(): void {
		if (this.player.PlayingAnimation !== Animations.WalkingBackwards) {
			this.player.gotoAndPlay(Animations.WalkingBackwards);
			this.player.PlayingAnimation = Animations.WalkingBackwards;
		}

		let newPos = this.player.x + this.WalkSpeed;
		let limit = this.player.manager.Canvas.width - this.player.getBounds().width;
		this.player.x = newPos > limit ? limit : newPos;

		this.player.UpdateHitBorder();
		this.fight.PlayerMove();
	}

	private ExecuteMoveLeft(): void {
		if (this.player.PlayingAnimation !== Animations.Walking) {
			this.player.gotoAndPlay(Animations.Walking);
			this.player.PlayingAnimation = Animations.Walking;
		}

		let newPos = this.player.x - this.WalkSpeed;
		this.player.x = newPos < 0 ? 0 : newPos;

		this.player.UpdateHitBorder();
		this.fight.PlayerMove();

	}

	private ExecuteJump(): void {
		if (this.player.PlayingAnimation !== Animations.Jump) {
			this.player.gotoAndPlay(Animations.Jump);
			this.player.PlayingAnimation = Animations.Jump;
		}

		let newPos = this.player.y;

		createjs.Tween
			.get(this)
			.to({
				y: newPos - this.JumpSize,
				x: this.player.x + (this.JumpSize / 2)
			}, 300)
			.to({
				y: newPos,
				x: this.player.x + this.JumpSize
			}, 300)
			.call(() => {
				this.player.gotoAndPlay(Animations.Stand);
				this.player.PlayingAnimation = Animations.Stand;
				this.player.UpdateHitBorder();
				this.fight.PlayerMove();
			});
	}

	private ExecutePunch(): void {
		if (this.player.PlayingAnimation !== Animations.Punch) {
			this.player.addEventListener("animationend", this.AfterAnimationEvent, false);
			this.player.gotoAndPlay(Animations.Punch);
			this.player.PlayingAnimation = Animations.Punch;
		}

		this.player.UpdateHitBorder();
		this.fight.PlayerHit(this.player);
	}

	private ExecuteGetHit(): void {
		if (this.player.PlayingAnimation !== Animations.GotHit) {
			this.BlockAction = true;
			this.player.addEventListener("animationend", this.AfterAnimationEvent, false);
			this.player.gotoAndPlay(Animations.GotHit);
			this.player.PlayingAnimation = Animations.GotHit;
		}

		this.player.UpdateHitBorder();
	}

	private ExecuteStand(): any {
		this.player.gotoAndPlay(Animations.Stand);
		this.player.PlayingAnimation = Animations.Stand;
	}

	private ExecuteDie(): void {
		if (this.player.PlayingAnimation !== Animations.Die) {
			this.BlockAction = true;
			this.player.addEventListener("animationend", this.AfterAnimationEvent, false);
			this.player.gotoAndPlay(Animations.Die);
			this.player.PlayingAnimation = Animations.Die;
		}

		this.player.UpdateHitBorder();
	}

	public AfterAnimation(e: any) {
		this.player.removeEventListener("animationend", this.AfterAnimationEvent, false);

		if (this.player.PlayingAnimation !== Animations.Die) {

			this.player.gotoAndPlay(Animations.Stand);
			this.player.PlayingAnimation = Animations.Stand;
			this.BlockAction = false;
			this.player.UpdateHitBorder();
			return;
		}

		this.player.stop();
	}
}