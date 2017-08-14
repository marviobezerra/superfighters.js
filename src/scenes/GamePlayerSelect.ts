import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerSelect } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';
import { Map } from '../common/util';

interface IPlayer {
	Image: createjs.Bitmap;
	Border: createjs.Shape;
}

export class GamePlayerSelect extends SceneBase {

	private KeyBoardEvents: any;
	private CaracteresList: Array<PlayerSelect> = [];
	private Caracteres: Map<IPlayer>;
	private PositionStart = 20;
	private BackGroundImage: createjs.Bitmap;
	private CaracterIndex = -1;

	constructor(manager: IManager) {
		super(manager);

		// It is required to avoid scope references
		this.AddBackground();
		this.KeyBoardEvents = this.RegisterEvents.bind(this);
		this.RegisterSounds();
		this.Start();

	}

	private Start(): void {
		this.Caracteres = {};

		this.CaracteresList.push(PlayerSelect.Kyo);
		this.CaracteresList.push(PlayerSelect.Leona);
		this.CaracteresList.push(PlayerSelect.May);
		this.CaracteresList.push(PlayerSelect.Yory);

		this.CaracteresList.forEach(item => this.LoadPlayer(item));

		this.UpdateSelectedCaracter(true);
	}

	public Register(): void {
		this.RegisterSounds();
		document.addEventListener('keydown', this.KeyBoardEvents, false);
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyBoardEvents, false);
	}

	private RegisterSounds(){
		createjs.Sound.registerSound({ id: "choose", src: "/data/sounds/common/Choose_Sound_Effect.mp3" });
		createjs.Sound.registerSound({ id: "select", src: "/data/sounds/common/Selecting_Sound_Effect.mp3" });
	}

	private AddBackground(): void {
		this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.PlayerSelect));
		this.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.Manager.Canvas.width / this.BackGroundImage.getBounds().width
		this.BackGroundImage.scaleY = this.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
	}

	private LoadPlayer(player: PlayerSelect): void {
		let image = new createjs.Bitmap(this.Manager.AssetsManager.Load(player));

		let maxSize = this.BackGroundImage.getBounds().height / 4;
		let scale = maxSize / image.getBounds().height;
		let margin = 30;

		image.scaleX *= scale;
		image.scaleY *= scale;
		image.x = this.PositionStart + margin;
		image.y = 30;

		this.PositionStart += (image.getBounds().width * scale) + margin;

		this.Caracteres[player] = {
			Image: image,
			Border: this.CreateBorder(image, scale)
		}

		this.addChild(this.Caracteres[player].Border, this.Caracteres[player].Image);
	}

	private CreateBorder(image: createjs.Bitmap, scale: number): createjs.Shape {
		var border = new createjs.Shape();
		let command = border.graphics
			.beginStroke("#000")
			.setStrokeStyle(5)
			.beginFill("#222")
			.command;

		border.alpha = 0.8;
		border.snapToPixel = true;
		border.graphics.drawRect(0, 0, image.getBounds().width * scale + 8, image.getBounds().height * scale + 8);
		border.x = image.x - 5;
		border.y = image.y - 5;

		border.graphics.command = command;
		return border;
	}

	private RegisterEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				this.Manager.Load(SceneType.Menu);
				break;
			case 'ArrowLeft':
				this.PlaySelect();
				this.UpdateSelectedCaracter(false);
				break;
			case 'ArrowRight':
				this.PlaySelect();
				this.UpdateSelectedCaracter(true);
				break;
			case 'Enter':
				this.PlayChoose();
				this.Manager.Load(SceneType.Fight, true);
		}
	}

	private UpdateSelectedCaracter(next: boolean): void {

		if (this.CaracterIndex !== -1) {
			let caracter = this.CaracteresList[this.CaracterIndex];
			(<any>this.Caracteres[caracter].Border.graphics.command).style = "#222";
		}

		if (next) {
			this.CaracterIndex = this.CaracterIndex >= this.CaracteresList.length - 1
				? this.CaracteresList.length - 1
				: this.CaracterIndex + 1;
		} else {
			this.CaracterIndex = this.CaracterIndex <= 0
				? 0
				: this.CaracterIndex - 1;
		}

		let index = this.CaracteresList[this.CaracterIndex];
		(<any>this.Caracteres[index].Border.graphics.command).style = "#7a2929";
		this.Manager.CurrentCaracter = this.Manager.AssetsManager.ConvertToPlayerFight(this.CaracteresList[this.CaracterIndex]);
	}

	private PlaySelect(): void {		
		createjs.Sound.play('select');
	}

	private PlayChoose():void{		
		createjs.Sound.play('choose');
	}
}