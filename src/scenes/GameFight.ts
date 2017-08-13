import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';
import { Character } from '../characters/Character';
import { AiManager } from '../ai/AiManager';
import { GameFightElements } from './GameFightElements';

enum FightInfo {
	Ready,
	Fight,
	Winner,
	Loser
}

export class GameFight extends SceneBase {

	private KeyDownEvents: any;
	private TickEvent: any;

	private PlayerOne: Character;
	private PlayerTwo: Character;

	private FightInfoText: createjs.Text;
	private FightElements: GameFightElements;

	public Oponent: PlayerFight;
	public Playing = false;
	public Timer: number;
	public Battle = 0;

	constructor(manager: IManager) {
		super(manager);

		this.FightElements = new GameFightElements(this);

		// It is required to avoid scope references
		this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
		this.TickEvent = this.Tick.bind(this);
	}

	public Register(): void {
		document.addEventListener('keydown', this.KeyDownEvents, false);
		createjs.Ticker.addEventListener("tick", this.TickEvent);
		this.Start();
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyDownEvents, false);
		createjs.Ticker.removeEventListener("tick", this.TickEvent);

		this.Playing = false;
		this.PlayerOne.Stop();
		this.PlayerTwo.Stop();
	}

	private Tick() {
		AiManager.AiCheck(this.PlayerOne, this.PlayerTwo, createjs.Ticker.getTicks());
	}

	private DiplayInfo(value: FightInfo) {
		let info = "Ready";

		switch (value) {
			case FightInfo.Fight:
				info = "Fight";
				break;
			case FightInfo.Ready:
				info = "Ready";
				break;
			case FightInfo.Loser:
				info = "You lose";
				break;
			case FightInfo.Winner:
				info = "You win";
				break;
			default:
				break;
		}

		if (this.FightInfoText) {
			this.removeChild(this.FightInfoText);
		}

		this.FightInfoText = new createjs.Text(info, "100px Haettenschweiler", "#FFF");

		this.addChild(this.FightInfoText);

		this.FightInfoText.x = this.Manager.Canvas.width / 2 - this.FightInfoText.getBounds().width / 2;
		this.FightInfoText.y = this.Manager.Canvas.height / 2 - this.FightInfoText.getBounds().height / 2;
		this.FightInfoText.regX = this.FightInfoText.getBounds().width / 2;
		this.FightInfoText.regY = this.FightInfoText.getBounds().height / 2;

		createjs.Tween.get(this.FightInfoText)
			.to({ scaleY: -2 })
			.to({ scaleX: 3, scaleY: 3 }, 200)
			.wait(1500)
			.to({ scaleX: 1, scaleY: 1 }, 200)
			.to({ visible: false })
			.call((c) => {
				if (value === FightInfo.Ready) {
					this.DiplayInfo(FightInfo.Fight);
					return;
				}

				if (value === FightInfo.Fight) {
					this.Begin();
					return;
				}

				if (value === FightInfo.Winner) {
					this.Battle++;
					this.Start();
					return;
				}

				if (value === FightInfo.Loser) {
					this.Manager.Load(SceneType.Continue);
					return;
				}
			});
	}

	private Start(): void {
		if (this.PlayerOne) {
			this.removeChild(this.PlayerOne.HitBorder);
			this.removeChild(this.PlayerOne);
		}

		if (this.PlayerTwo) {
			this.removeChild(this.PlayerTwo.HitBorder);
			this.removeChild(this.PlayerTwo);
		}

		this.Oponent = this.FightElements.OponentList[this.Battle];

		this.PlayerOne = new Character(this.Manager.AssetsManager.Load(this.Manager.CurrentCaracter), this.Manager, this, true);
		this.PlayerTwo = new Character(this.Manager.AssetsManager.Load(this.Oponent), this.Manager, this, false);
		this.PlayerOne.Damage = 0;
		this.PlayerTwo.Damage = 0;

		this.addChild(this.PlayerOne, this.PlayerTwo);
		this.FightElements.UpdatePlayerInfo();
		this.FightElements.UpdatePlayerDamageBar(true, this.PlayerOne.Damage);
		this.FightElements.UpdatePlayerDamageBar(false, this.PlayerTwo.Damage);
		this.Timer = 90;
		this.FightElements.CreateTimerText();
		this.FightElements.ResetDamageBar();

		this.DiplayInfo(FightInfo.Ready);
	}

	private Begin(): void {
		this.PlayerOne.Start();
		this.PlayerTwo.Start();

		this.Playing = true;

		let level = 30;

		switch (this.Battle) {
			case 1:
				level = 20;
				break;
			case 2:
				level = 5;
				break;
			case 3:
				level = 1;
				break;
			default:
				break;
		}


		AiManager.aiBehaviorChangeInterval = level;
		this.TimerLoop();
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				this.Manager.Load(SceneType.Menu);
				break;
		}
	}

	public PlayerHit(player: Character): void {

		let oponent = player !== this.PlayerOne
			? this.PlayerOne
			: this.PlayerTwo;

		let distance = Math.abs(player.x - oponent.x);

		if (distance < 300) {
			oponent.GetHit(this.Battle);
			this.FightElements.UpdatePlayerDamageBar(player !== this.PlayerOne, oponent.Damage);
		}

		if (oponent.Damage < 100 && player.Damage < 100) {
			return;
		}

		this.FigthEnds(false);
	}

	private FigthEnds(timeOver: boolean): void {
		this.Playing = false;
		let playerOneWins = this.PlayerOne.Damage < this.PlayerTwo.Damage;

		if (playerOneWins) {
			this.PlayerOne.Win();
			this.PlayerTwo.Die(timeOver);
		} else {
			this.PlayerOne.Die(timeOver);
			this.PlayerTwo.Win();
		}

		this.DiplayInfo(playerOneWins ? FightInfo.Winner : FightInfo.Loser);
	}

	public PlayerMove(): void {
		if (this.PlayerOne.Flip && this.PlayerOne.x < this.PlayerTwo.x) {
			this.PlayerOne.FlipDirection();
			this.PlayerTwo.FlipDirection();
		}

		if (!this.PlayerOne.Flip && this.PlayerOne.x > this.PlayerTwo.x) {
			this.PlayerOne.FlipDirection();
			this.PlayerTwo.FlipDirection();
		}
	}

	private NewFight(): void {
		this.Battle++;
		//this.Start();
	}

	private TimerLoop(): void {

		setTimeout(() => {
			if (this.Playing) {
				this.Timer--;
				this.FightElements.CreateTimerText();

				if (this.Timer <= 0) {
					this.FigthEnds(true);
					return;
				}

				this.TimerLoop();
			}
		}, 1000);
	}
}