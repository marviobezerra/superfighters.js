import { GameFight } from './GameFight';
import { IManager, SceneType } from './SceneManager';
import { AssetsManager, GameAssets, PlayerFight, PlayerSelect } from '../assets/assets-manager';

export class GameFightElements {

	private PlayerOneText: createjs.Text;
	private PlayerTwoText: createjs.Text;

	private PlayerOnePowerBar: createjs.Shape;
	private PlayerTwoPowerBar: createjs.Shape;

	private PlayerOneDamageBar: createjs.Shape;
	private PlayerTwoDamageBar: createjs.Shape;

	private PlayerOneImageBorder: createjs.Shape;
	private PlayerTwoImageBorder: createjs.Shape

	private PlayerOneImage: createjs.Bitmap;
	private PlayerTwoImage: createjs.Bitmap;

	private BackGroundImage: createjs.Bitmap;
	private BackGround: Array<GameAssets>;

	private TimerBox: createjs.Shape;
	private TimerText: createjs.Text;

	public OponentList: Array<PlayerFight>;

	constructor(private fight: GameFight) {

		this.BuildLists();
		this.AddBackground();

		this.CreateTimerBorder();

		this.CreatePowerBar(true);
		this.CreatePowerBar(false);

		this.CreateDamageBar(true);
		this.CreateDamageBar(false);
	}

	private AddBackground(): void {
		this.BackGroundImage = new createjs.Bitmap(this.fight.Manager.AssetsManager.Load(this.BackGround[this.fight.Battle]));
		this.fight.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.fight.Manager.Canvas.width / this.BackGroundImage.getBounds().width;
		this.BackGroundImage.scaleY = this.fight.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
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
		border.setBounds((this.fight.Manager.Canvas.width - size) / 2, 20, size, 80);
		border.x = (this.fight.Manager.Canvas.width - size) / 2;
		border.y = 20;

		border.graphics.command = command;
		this.TimerBox = border;

		this.fight.addChild(this.TimerBox);
	}

	private CreatePlayerImage(playerOne: boolean): void {
		if (playerOne && this.PlayerOneImage) {
			this.fight.removeChild(this.PlayerOneImageBorder, this.PlayerOneImage);
		}

		if (!playerOne && this.PlayerTwoImage) {
			this.fight.removeChild(this.PlayerTwoImageBorder, this.PlayerTwoImage);
		}

		let maxSize = 75;
		let player = this.fight.Manager.AssetsManager.ConvertToPlayerSelect(playerOne ? this.fight.Manager.CurrentCaracter : this.fight.Oponent);
		let image = new createjs.Bitmap(this.fight.Manager.AssetsManager.Load(player));

		let scale = maxSize / image.getBounds().width;
		image.scaleX *= scale;
		image.scaleY *= scale;
		image.y = 15;

		if (playerOne) {

			image.x = 15;

			this.PlayerOneImage = image;
			this.PlayerOneImageBorder = this.CreatePlayerBorder(this.PlayerOneImage, scale);
			this.fight.addChild(this.PlayerOneImageBorder, this.PlayerOneImage);

			return;
		}

		image.x = this.fight.Manager.Canvas.width - 90;
		this.PlayerTwoImage = image;
		this.PlayerTwoImageBorder = this.CreatePlayerBorder(this.PlayerTwoImage, scale);
		this.fight.addChild(this.PlayerTwoImageBorder, this.PlayerTwoImage);
	}

	private CreatePlayerBorder(image: createjs.Bitmap, scale: number): createjs.Shape {
		var border = new createjs.Shape();
		let command = border.graphics
			.beginStroke("#000")
			.setStrokeStyle(2)
			.beginFill("#fff")
			.command;

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, image.getBounds().width * scale + 8, image.getBounds().height * scale + 8);
		border.x = image.x - 5;
		border.y = image.y - 5;

		border.graphics.command = command;
		return border;
	}

	private CreateDamageBar(playerOne: boolean): void {
		if (playerOne && this.PlayerOneDamageBar) {
			this.fight.removeChild(this.PlayerOneDamageBar);
		}

		if (!playerOne && this.PlayerTwoDamageBar) {
			this.fight.removeChild(this.PlayerTwoDamageBar);
		}

		let border = new createjs.Shape();
		let command = border.graphics

			.beginFill("#f54848")
			.command;

		let timerSize = 200;
		let size = 0;

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, size, 38);
		border.setBounds(0, 0, size, 40);
		border.x = playerOne ? this.PlayerOnePowerBar.x + 1 : (this.PlayerTwoPowerBar.x + this.PlayerTwoPowerBar.getBounds().width) - 1 - size;
		border.y = 21;

		if (playerOne) {
			this.PlayerOneDamageBar = border;
			this.fight.addChild(this.PlayerOneDamageBar);
			return;
		}

		this.PlayerTwoDamageBar = border;
		this.fight.addChild(this.PlayerTwoDamageBar);
	}

	private CreatePowerBar(playerOne: boolean): void {

		if (playerOne && this.PlayerOnePowerBar) {
			this.fight.removeChild(this.PlayerOnePowerBar);
		}

		if (!playerOne && this.PlayerTwoPowerBar) {
			this.fight.removeChild(this.PlayerTwoPowerBar);
		}

		let border = new createjs.Shape();
		let command = border.graphics
			.beginStroke("#000")
			.setStrokeStyle(2)
			.beginFill("#dfb615")
			.command;

		let timerSize = 200;
		let size = (this.fight.Manager.Canvas.width - timerSize) / 2 - 85;

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, size, 40);
		border.setBounds(0, 0, size, 40);
		border.x = playerOne ? 105 : this.TimerBox.x + this.TimerBox.getBounds().width + 5;
		border.y = 20;

		if (playerOne) {
			this.PlayerOnePowerBar = border;
			this.fight.addChild(this.PlayerOnePowerBar);
			return;
		}

		this.PlayerTwoPowerBar = border;
		this.fight.addChild(this.PlayerTwoPowerBar);
	}

	private CreatePlayerText(playerOne: boolean): void {

		if (playerOne && this.PlayerOneText) {
			this.fight.removeChild(this.PlayerOneText);
		}

		if (!playerOne && this.PlayerTwoText) {
			this.fight.removeChild(this.PlayerTwoText);
		}

		let text = playerOne
			? this.fight.Manager.CurrentCaracter.toString()
			: this.fight.Oponent.toString();

		text = text.replace("-Fight", "");
		let result = new createjs.Text(text, "35px Haettenschweiler", "#FFF");

		result.x = playerOne
			? this.PlayerOnePowerBar.x + this.PlayerOnePowerBar.getBounds().width - result.getBounds().width - 15
			: this.PlayerTwoPowerBar.x + 15;

		result.y = 65;

		if (playerOne) {
			this.PlayerOneText = result;
			this.fight.addChild(this.PlayerOneText);
			return;
		}

		this.PlayerTwoText = result;
		this.fight.addChild(this.PlayerTwoText);
	}

	public UpdatePlayerInfo(): void {
		// Update the background image
		this.BackGroundImage.image = this.fight.Manager.AssetsManager.Load(this.BackGround[this.fight.Battle]);
		this.AdjustBackgroundSize();
		// Update the PlayerOne and PlayerTwo Text
		this.CreatePlayerText(true);
		this.CreatePlayerText(false);

		// Update Player Image
		this.CreatePlayerImage(true);
		this.CreatePlayerImage(false);
	}

	public ResetDamageBar(): void {
		this.UpdatePlayerDamageBar(true, 0);
		this.UpdatePlayerDamageBar(false, 0);
	}

	public UpdatePlayerDamageBar(playerOne: boolean, value: number) {
		let damageBar = playerOne
			? this.PlayerOneDamageBar
			: this.PlayerTwoDamageBar;

		let powerBar = playerOne
			? this.PlayerOnePowerBar
			: this.PlayerTwoPowerBar;

		let maxSize = powerBar.getBounds().width;
		let size = value === 0 ? 0 : maxSize * (value / 100);

		size = size > maxSize - 1
			? maxSize - 1
			: size;

		damageBar.graphics.drawRect(0, 0, size, 38);
		damageBar.setBounds(0, 0, size, 40);
		damageBar.x = playerOne ? powerBar.x + 1 : (powerBar.x + powerBar.getBounds().width) - 1 - size;

	}

	public CreateTimerText(): void {

		if (this.TimerText) {
			this.fight.removeChild(this.TimerText);
		}

		let timerText = new createjs.Text(this.fight.Timer.toString(), "70px Haettenschweiler", "#FFF");
		timerText.x = this.TimerBox.x + 25 + (timerText.getBounds().width / 2);

		let b = this.TimerBox.getBounds();

		timerText.set({
			textAlign: "center",
			textBaseline: "middle",
			x: (b.width / 2) + b.x,
			y: (b.height / 2) + b.y - 3
		})


		this.TimerText = timerText;
		this.fight.addChild(this.TimerText);
	}

	private BuildLists(): void {

		this.BackGround = [GameAssets.FightBackGround01, GameAssets.FightBackGround02, GameAssets.FightBackGround03];

		this.OponentList = [];

		for (let item in PlayerFight) {

			let value = <PlayerFight>PlayerFight[item];

			if (value !== this.fight.Manager.CurrentCaracter) {
				this.OponentList.push(value);
			}
		}
	}
} 