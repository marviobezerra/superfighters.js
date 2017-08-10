import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export class GameOver extends SceneBase {

	private KeyDownEvents: any;
	private BackGroundImage: createjs.Bitmap;

	
	constructor(manager:IManager) {
		super(manager);
		
		this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
		this.AddBackground();
		this.registerSounds();		
	}

	drawTextLayer() {
		let title = new createjs.Text('GAME OVER', "300px Haettenschweiler", "#FFF");
		this.addChild(title);
		title.x = this.Manager.Canvas.width / 2 - title.getBounds().width / 2 ;
		title.y = this.Manager.Canvas.height / 2 - title.getBounds().height / 2 - 100 ;
	}

	registerSounds() {
		createjs.Sound.addEventListener('fileload', this.LoadHandler.bind(this));

		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];
		
		createjs.Sound.registerSound({ id: "game_over", src: "/data/sounds/common/common_00006.mp3" });

	}

	LoadHandler(){
		createjs.Sound.play('game_over');
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

	public Register(): void {
		document.addEventListener('keydown', this.KeyDownEvents, false);
		this.drawTextLayer();
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