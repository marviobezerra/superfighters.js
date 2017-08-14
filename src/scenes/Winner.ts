import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export class Winner extends SceneBase {

	private KeyDownEvents: any;
	private BackGroundImage: createjs.Bitmap;
	private Title: createjs.Text;
	private SubTitle: Array<createjs.Text>;
	private SubTitleIndex = -1;
	private Credits: createjs.Text;
	private Color: string;

	constructor(manager: IManager) {
		super(manager);
		this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);

	}

	private SecondaryTextLayer(text: string): void {


		this.SubTitle.push(new createjs.Text(text, "30px Haettenschweiler", this.Color));
		let index = this.SubTitle.length - 1;
		this.addChild(this.SubTitle[index]);
		this.SubTitle[index].x = this.Manager.Canvas.width / 2 - this.SubTitle[index].getBounds().width / 2;
		this.SubTitle[index].y = (this.Manager.Canvas.height / 2 - this.Title.getBounds().height / 2 - 100) + 380 + 50 * (index + 1);
		this.SubTitle[index].shadow = new createjs.Shadow("#000", 4, 4, 8);

		createjs.Tween.get(this.SubTitle[index])
			.to({
				y: -900 + (100 * (index + 1))
			}, 150000);

	}

	private DrawTextLayer(): void {
		if (this.Title) {
			this.removeChild(this.Title);
		}

		if (this.SubTitle) {
			this.removeChild(...this.SubTitle);
		}

		this.Title = new createjs.Text('You win!', "300px Haettenschweiler", this.Color);
		this.Title.shadow = new createjs.Shadow("#000", 4, 4, 8);;
		this.addChild(this.Title);
		this.Title.x = this.Manager.Canvas.width / 2 - this.Title.getBounds().width / 2;
		this.Title.y = this.Manager.Canvas.height / 2 - this.Title.getBounds().height / 2 - 100;

		createjs.Tween.get(this.Title)
			.to({
				y: -900
			}, 150000);

		this.SubTitle = [];
		this.SecondaryTextLayer("Credits");
		this.SecondaryTextLayer("Project manager: Thiago Castilho");
		this.SecondaryTextLayer("Main Developer: Marvio André");
		this.SecondaryTextLayer("Developer team: Marvio André & Thiago Castilho");
		this.SecondaryTextLayer("Main Designer: Thiago Castilho");
		this.SecondaryTextLayer("Designer tema: Thiago Castilho & Márvio André");
		this.SecondaryTextLayer("Q.A. manager: Márvio André");
		this.SecondaryTextLayer("Q.A. tema: Márvio André & Thiago Castilho");
		this.SecondaryTextLayer("Coffer maker: Márvio André & Thiago Castilho");
	}

	private AddBackground(): void {
		if (this.BackGroundImage) {
			this.removeChild(this.BackGroundImage);
		}

		switch (this.Manager.CurrentCaracter) {
			case PlayerFight.Kyo:
				this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.FinalBackGround04));
				this.Color = "#FFF";
				break;
			case PlayerFight.Leona:
				this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.FinalBackGround00));
				this.Color = "#FFF";
				break;
			case PlayerFight.May:
				this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.FinalBackGround03));
				this.Color = "#396a76";
				break;
			case PlayerFight.Yory:
				this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.FinalBackGround07));
				this.Color = "#FFF";
				break;
			default:
				break;
		}


		this.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.Manager.Canvas.width / this.BackGroundImage.getBounds().width;
		this.BackGroundImage.scaleY = this.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
	}

	public Register(): void {
		document.addEventListener('keydown', this.KeyDownEvents, false);
		this.AddBackground();
		this.DrawTextLayer();
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyDownEvents, false);
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Enter':
				this.Manager.Load(SceneType.Menu);
				break;
		}
	}
}