import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';
import { Character } from '../characters/Character';
import { AiManager } from '../ai/AiManager';

export class GameFight extends SceneBase {

	private KeyDownEvents: any;
	private TickEvent: any;

	private BackGroundImage: createjs.Bitmap;
	private OponentList: Array<PlayerFight>;
	private TimerBox: createjs.Shape;
	private TimerText: createjs.Text;
	private Timer: number;
	private Playing = false;
	private Oponent: PlayerFight;

	private PlayerOne: Character;
	private PlayerTwo: Character;

	private PlayerOneText: createjs.Text;
	private PlayerTwoText: createjs.Text;

	private PlayerOnePowerBar: createjs.Shape;
	private PlayerTwoPowerBar: createjs.Shape;

	constructor(manager: IManager) {
		super(manager);

		// It is required to avoid scope references
		this.AddBackground();
		this.CreateTimerBorder();
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
		
		this.Stop();
	}

	private Tick(){		
		AiManager.AiCheck(this.PlayerOne, this.PlayerTwo, createjs.Ticker.getTicks());
	}

	private AddBackground(): void {
		this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.PlayerSelect));
		this.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.Manager.Canvas.width / this.BackGroundImage.getBounds().width;
		this.BackGroundImage.scaleY = this.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
	}

	private BuildOponentList(): void {

		this.OponentList = [];

		for (let item in PlayerFight) {

			let value = <PlayerFight>PlayerFight[item];

			if (value !== this.Manager.CurrentCaracter) {
				this.OponentList.push(value);
			}
		}
	}

	private GetNextOponent(): PlayerFight {
		let result = this.OponentList[0];
		this.OponentList.slice(0, 1);
		return result;
	}

	private Stop(): void {
		this.PlayerOne.Stop();
		this.PlayerTwo.Stop();
	}

	private CreateTimerText(): void {

		if (this.TimerText) {
			this.removeChild(this.TimerText);
		}

		let timerText = new createjs.Text(this.Timer.toString(), "70px Haettenschweiler", "#FFF");
		timerText.x = this.TimerBox.x + 25 + (timerText.getBounds().width / 2);

		let b = this.TimerBox.getBounds();

		timerText.set({
			textAlign: "center",
			textBaseline: "middle",
			x: (b.width / 2) + b.x,
			y: (b.height / 2) + b.y - 3
		})


		this.TimerText = timerText;
		this.addChild(this.TimerText);
	}

	private TimerLoop(): void {

		setTimeout(() => {
			if (this.Playing) {
				this.Timer--;
				this.CreateTimerText();

				if (this.Timer <= 0) {
					this.Manager.Load(SceneType.Continue);
					return;
				}

				this.TimerLoop();
			}
		}, 1000);
	}

	private CreateTimerBorder(): void {
		let border = new createjs.Shape();
		let command = border.graphics
			.beginStroke("#000")
			.setStrokeStyle(2)
			.beginFill("#222")
			.command;

		let size = 150;

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, size, 80);
		border.setBounds((this.Manager.Canvas.width - size) / 2, 20, size, 80);
		border.x = (this.Manager.Canvas.width - size) / 2;
		border.y = 20;

		border.graphics.command = command;
		this.TimerBox = border;

		this.addChild(this.TimerBox);
	}

	private CreatePowerBar(playerOne: boolean): createjs.Shape {

		let border = new createjs.Shape();
		let command = border.graphics
			.beginStroke("#000")
			.setStrokeStyle(2)
			.beginFill("#222F23")
			.command;

		let timerSize = 200;
		let size = (this.Manager.Canvas.width - timerSize) / 2;

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, size, 40);
		border.setBounds(0, 0, size, 40);
		border.x = playerOne ? 20 : timerSize + size - 20;
		border.y = 20;

		return border;
	}

	private CreatePlayerText(playerOne: boolean): createjs.Text {

		let text = playerOne
			? this.Manager.CurrentCaracter.toString()
			: this.Oponent.toString();

		text = text.replace("-Fight", "");
		let result = new createjs.Text(text, "20px Haettenschweiler", "#FFF");

		result.x = playerOne
			? this.PlayerOnePowerBar.x + 15
			: this.PlayerTwoPowerBar.x + this.PlayerTwoPowerBar.getBounds().width - result.getBounds().width - 15;

		result.y = 65;

		return result;
	}

	private Start(): void {
		if (this.PlayerOne) {
			this.removeChild(this.PlayerOne);
			this.removeChild(this.PlayerOnePowerBar);
			this.removeChild(this.PlayerOneText);
		}

		if (this.PlayerTwo) {
			this.removeChild(this.PlayerTwo);
			this.removeChild(this.PlayerTwoPowerBar);
			this.removeChild(this.PlayerTwoText);
			
		}

		this.BuildOponentList();
		this.Oponent = this.GetNextOponent();

		this.PlayerOne = new Character(this.Manager.AssetsManager.Load(this.Manager.CurrentCaracter), this.Manager, this, true);
		this.PlayerOnePowerBar = this.CreatePowerBar(true);
		this.PlayerOneText = this.CreatePlayerText(true);

		this.PlayerTwo = new Character(this.Manager.AssetsManager.Load(this.Oponent), this.Manager, this, false);
		this.PlayerTwoPowerBar = this.CreatePowerBar(false);
		this.PlayerTwoText = this.CreatePlayerText(false);


		this.addChild(this.PlayerOne, this.PlayerOnePowerBar, this.PlayerOneText, this.PlayerTwo, this.PlayerTwoPowerBar, this.PlayerTwoText);

		this.PlayerOne.Start();
		this.PlayerTwo.Start();

		this.Timer = 10;
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

	public PlayerMove() : void {
		if (this.PlayerOne.Flip && this.PlayerOne.x < this.PlayerTwo.x) {
			this.PlayerOne.FlipDirection();
			this.PlayerTwo.FlipDirection();
		}

		if (!this.PlayerOne.Flip && this.PlayerOne.x > this.PlayerTwo.x) {
			this.PlayerOne.FlipDirection();
			this.PlayerTwo.FlipDirection();
		}
	}


}