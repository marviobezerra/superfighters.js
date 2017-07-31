import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export class GameControl extends SceneBase {

	private BackGroundImage: createjs.Bitmap;
	private KeyBoardEvents: any;
	private WindowsEvents: any;
	
	constructor(manager:IManager) {
		super(manager);


		this.AddBackground();
		this.AddTextLayer();
		this.RegisterSounds();
	}

	private RegisterEvents(event: KeyboardEvent): void {
		this.Manager.Load(SceneType.PlayerSelect);
	}

	private AddBackground(): void {
		this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.Controls));
		this.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AddTextLayer(){
		let title = new createjs.Text('Press any key to go back to menu', "100px Haettenschweiler", "#FFF");
		this.addChild(title);
		title.alpha = 0;
		title.scaleX = 0;
		title.scaleY = 0

		title.x = (this.getBounds().width / 2) - (title.getBounds().width / 2);
		title.y = this.Manager.Canvas.height - 130;

		createjs.Tween
			.get(title, { loop: false })
			.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1500, createjs.Ease.getPowInOut(6));
	}

	private RegisterSounds(): void {

		createjs.Sound.addEventListener('fileload', this.LoadHandler.bind(this));
		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];		
		createjs.Sound.registerSound({ id: "select", src: "/data/sounds/Iori_40-1.mp3" });
	}

	private LoadHandler(event: createjs.Event): void {
		
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.Manager.Canvas.width / this.BackGroundImage.getBounds().width
		this.BackGroundImage.scaleY = this.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
	}

	public Register(): void {
		document.addEventListener('keydown', this.KeyBoardEvents, false);
		window.addEventListener('onresize', this.WindowsEvents, false);
		this.AdjustBackgroundSize();
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyBoardEvents, false);
		window.removeEventListener('onresize', this.WindowsEvents, false);
	}

	private PlaySelect(): void {
		let instance = createjs.Sound.play('select');
		instance.volume = 0.1;
	}

	private LaunchIntoFullscreen(element: any): void {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}

	private ExitFullscreen(): void {

		let element: any = document;

		if (element.exitFullscreen) {
			element.exitFullscreen();
		} else if (element.mozCancelFullScreen) {
			element.mozCancelFullScreen();
		} else if (element.webkitExitFullscreen) {
			element.webkitExitFullscreen();
		}
	}
}