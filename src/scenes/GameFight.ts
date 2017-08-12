import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';
import { Character } from '../characters/Character';
import { AiManager } from '../ai/AiManager';
import { GameFightElements } from './GameFightElements';

export class GameFight extends SceneBase {

	private KeyDownEvents: any;
	private TickEvent: any;

	private PlayerOne: Character;
	private PlayerTwo: Character;

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

	private Start(): void {
		if (this.PlayerOne) {
			this.removeChild(this.PlayerOne);
		}

		if (this.PlayerTwo) {
			this.removeChild(this.PlayerTwo);
		}

		this.Oponent = this.FightElements.OponentList[this.Battle];

		this.PlayerOne = new Character(this.Manager.AssetsManager.Load(this.Manager.CurrentCaracter), this.Manager, this, true);
		this.PlayerTwo = new Character(this.Manager.AssetsManager.Load(this.Oponent), this.Manager, this, false);


		this.addChild(this.PlayerOne, this.PlayerTwo);
		this.FightElements.UpdatePlayerInfo();

		this.PlayerOne.Start();
		this.PlayerTwo.Start();

		this.Timer = 90;
		this.Playing = true;
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
			oponent.GetHit();
			this.FightElements.UpdatePlaterDamageBar(player !== this.PlayerOne, oponent.Damage);
		}

		if (oponent.Damage >= 100) {
			oponent.Die();
			this.NewFight();
		}
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
					this.Manager.Load(SceneType.Continue);
					return;
				}

				this.TimerLoop();
			}
		}, 1000);
	}
}