import { Character, Animations } from './Character';
import { GameFight } from '../scenes/GameFight';

export enum CharacterAction {
	Win,
	Die,
	TimeOver,
	MoveRight,
	MoveLeft,
	Jump,
	Punch,
	GotHit,
	Stand
}

export class CharacterActions {
	private WalkSpeed = 35;
	private JumpSize = 250;
	private AfterAnimationEvent: any;
	private BlockAction = false;
	private AnimationsStop = [Animations.Die, Animations.Win, Animations.TimeOver];

	constructor(private player: Character, private fight: GameFight) {
		this.AfterAnimationEvent = this.AfterAnimation.bind(this);
	}

	public Reset(): void {
		this.player.removeEventListener("animationend", this.AfterAnimationEvent, false);
		this.BlockAction = false;
		this.ExecuteStand();
	}

	public Execute(action: CharacterAction): void {
		if (this.BlockAction && action !== CharacterAction.Die && action !== CharacterAction.Win) {
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
			case CharacterAction.TimeOver:
				this.ExecuteTimeOver();
				break;
			case CharacterAction.Win:
				this.ExecuteWin();
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
		let limit = this.player.Flip
			? this.player.manager.Canvas.width
			: this.player.manager.Canvas.width - this.player.getBounds().width;
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
		if (this.player.PlayingAnimation === Animations.Jump) {
			return;
		}

		this.player.gotoAndPlay(Animations.Jump);
		this.player.PlayingAnimation = Animations.Jump;
		
		let jumpX1 = (this.JumpSize / 2);
		let jumpX2 = this.JumpSize;

		if (this.player.Flip) {
			jumpX1 = jumpX1 * -1;
			jumpX2 = jumpX2 * -1;
		}

		createjs.Tween
			.get(this.player)
			.to({
				y: this.player.y - this.JumpSize,
				x: this.player.x + jumpX1
			}, 300)
			.to({
				y: this.player.Ground,
				x: this.player.x + jumpX2
			}, 300)
			.call(() => {
				this.CheckLimit();
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

	private ExecuteTimeOver(): void {
		if (this.player.PlayingAnimation !== Animations.TimeOver) {
			this.BlockAction = true;
			this.player.addEventListener("animationend", this.AfterAnimationEvent, false);
			this.player.gotoAndPlay(Animations.TimeOver);
			this.player.PlayingAnimation = Animations.TimeOver;
		}

		this.player.UpdateHitBorder();
	}

	private ExecuteWin(): void {
		if (this.player.PlayingAnimation !== Animations.Win) {
			this.BlockAction = true;
			this.player.addEventListener("animationend", this.AfterAnimationEvent, false);
			this.player.gotoAndPlay(Animations.Win);
			this.player.PlayingAnimation = Animations.Win;
		}

		this.player.UpdateHitBorder();
	}

	public AfterAnimation(e: any) {
		this.player.removeEventListener("animationend", this.AfterAnimationEvent, false);

		if (this.AnimationsStop.indexOf(this.player.PlayingAnimation) >= 0) {
			this.player.stop();
			return;
		}

		this.player.gotoAndPlay(Animations.Stand);
		this.player.PlayingAnimation = Animations.Stand;
		this.BlockAction = false;
		this.player.UpdateHitBorder();
	}

	private CheckLimit(): void {
		let limit = this.player.Flip
			? this.player.manager.Canvas.width
			: this.player.manager.Canvas.width - this.player.getBounds().width;

		if (this.player.x > limit) {
			this.player.x = limit;
		}
	}
}