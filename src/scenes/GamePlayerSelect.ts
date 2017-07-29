import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerSelect } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export class GamePlayerSelect extends SceneBase {

	private Events: any;

	constructor(manager: IManager) {
		super(manager);

		// It is required to avoid scope references
		this.Events = this.RegisterEvents.bind(this);
		this.Start();
	}

	private Start(): void {
		var kyo = new createjs.Bitmap(this.Manager.AssetsManager.Load(PlayerSelect.Kyo));
		var leona = new createjs.Bitmap(this.Manager.AssetsManager.Load(PlayerSelect.Leona));
		var yori = new createjs.Bitmap(this.Manager.AssetsManager.Load(PlayerSelect.Yory));
		var may = new createjs.Bitmap(this.Manager.AssetsManager.Load(PlayerSelect.May));

		let scale = .35;

		kyo.scaleX = kyo.scaleX * scale;
		kyo.scaleY = kyo.scaleY * scale;
		kyo.x = 30;
		kyo.y = 30;

		leona.scaleX = leona.scaleX * scale;
		leona.scaleY = leona.scaleY * scale;

		leona.x = this.Manager.Canvas.width - (leona.getBounds().width * scale) - 30;
		leona.y = 30;

		yori.scaleX = yori.scaleX * scale;
		yori.scaleY = yori.scaleY * scale;

		yori.x = 30;
		yori.y = this.Manager.Canvas.height - (yori.getBounds().height * scale);

		may.scaleX = may.scaleX * scale;
		may.scaleY = may.scaleY * scale;
		may.x = this.Manager.Canvas.width - (may.getBounds().width * scale) - 30;
		may.y = this.Manager.Canvas.height - (may.getBounds().height * scale);

		this.AddBorder(may, scale);

		this.addChild(kyo, leona, yori, may);
	}

	public Register(): void {
		document.addEventListener('keydown', this.Events, false);
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.Events, false);
	}

	private AddBorder(image: createjs.Bitmap, scale: number): void {
		let z = new createjs.Rectangle(image.x, image.y, image.getBounds().width * scale, image.getBounds().height * scale);		
	 }

	private RegisterEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				this.Manager.Load(SceneType.Menu);
				break;
		}

		console.log(event.key);
	}
}