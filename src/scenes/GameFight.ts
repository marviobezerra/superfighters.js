import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';
import { Character } from '../characters/Character';

export class GameFight extends SceneBase {

	private KeyDownEvents: any;
	private BackGroundImage: createjs.Bitmap;
	private OponentList: Array<PlayerFight>;
	private TimerBox: createjs.Shape;
	private TimerText: createjs.Text;

	private PlayerOne: Character;
	private PlayerTwo: Character;

	private PlayerOnePower: createjs.Shape;
	private PlayerTwoPower: createjs.Shape;

	constructor(manager: IManager) {
		super(manager);

		// It is required to avoid scope references
		this.AddBackground();
		this.CreateTimer();
		this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
	}

	public Register(): void {
		document.addEventListener('keydown', this.KeyDownEvents, false);
		this.Start();
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyDownEvents, false);
		this.Stop();
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

	private CreateTimer(): void {
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
		border.x = (this.Manager.Canvas.width - size) / 2;
		border.y = 20;

		border.graphics.command = command;		
		this.TimerBox = border;

		let timer = new createjs.Text("90", "100px Haettenschweiler", "#FFF");
		timer.x = border.x + (timer.getBounds().width / 2);
		timer.y = 3;

		this.addChild(this.TimerBox, timer);
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
		border.x = playerOne ? 20 : timerSize + size - 20;
		border.y = 20;

		border.graphics.command = command;

		return border;
	}

	private Start(): void {
		if (this.PlayerOne) {
			this.removeChild(this.PlayerOne);
			this.removeChild(this.PlayerOnePower);
		}

		if (this.PlayerTwo) {
			this.removeChild(this.PlayerTwo);
			this.removeChild(this.PlayerTwoPower);
		}

		this.BuildOponentList();

		this.PlayerOne = new Character(this.Manager.AssetsManager.Load(this.Manager.CurrentCaracter), this.Manager.Canvas, true);
		this.PlayerOnePower = this.CreatePowerBar(true);

		this.PlayerTwo = new Character(this.Manager.AssetsManager.Load(this.GetNextOponent()), this.Manager.Canvas, false);
		this.PlayerTwoPower = this.CreatePowerBar(false);

		this.addChild(this.PlayerOne, this.PlayerOnePower, this.PlayerTwo, this.PlayerTwoPower);

		this.PlayerOne.Start();
		this.PlayerTwo.Start();
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				this.Manager.Load(SceneType.Menu);
				break;
		}
	}
}