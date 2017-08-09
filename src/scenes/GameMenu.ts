import { AssetsManager, GameAssets, Sounds } from '../assets/assets-manager';
import { SceneBase } from './SceneBase';
import { IManager, SceneType } from './SceneManager';

export enum Option {
	Play,
	Controls
}

export class GameMenu extends SceneBase {

	private GameTitle = "Super Fighter JS";
	private CurrentOption = Option.Play;
	private PlayOption: createjs.Text;
	private ControlsOption: createjs.Text;
	private BackGroundMusic: createjs.AbstractSoundInstance;
	private BackGroundImage: createjs.Bitmap;
	private KeyBoardEvents: any;
	private WindowsEvents: any;

	constructor(manager: IManager) {
		super(manager);
		this.AddBackground();
		this.AddTextLayer();
		this.RegisterSounds();

		// It is required to avoid scope references
		this.KeyBoardEvents = this.RegisterEvents.bind(this);
		this.WindowsEvents = this.AddBackground.bind(this);
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

	private AddBackground(): void {
		this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.Menu));
		this.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.Manager.Canvas.width / this.BackGroundImage.getBounds().width
		this.BackGroundImage.scaleY = this.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
	}

	private AddTextLayer(): void {
		let title = new createjs.Text(this.GameTitle.toUpperCase(), "100px Haettenschweiler", "#FFF");
		this.addChild(title);
		title.alpha = 0;
		title.scaleX = 0;
		title.scaleY = 0

		title.x = (this.getBounds().width / 2) - (title.getBounds().width / 2);
		title.y = 10;

		createjs.Tween
			.get(title, { loop: false })
			.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1500, createjs.Ease.getPowInOut(6));

		this.PlayOption = new createjs.Text("Play", "80px Haettenschweiler", "#F00");
		this.ControlsOption = new createjs.Text("Controls", "80px Haettenschweiler", "#FFF");

		this.addChild(this.PlayOption, this.ControlsOption);

		this.PlayOption.y = this.getBounds().height / 2 - 50;
		this.ControlsOption.y = this.PlayOption.y + 100;

		this.PlayOption.x = this.Manager.Canvas.width + this.PlayOption.getBounds().width;
		this.ControlsOption.x = this.Manager.Canvas.width + this.ControlsOption.getBounds().width;

		createjs.Tween.get(this.PlayOption).to({ x: this.Manager.Canvas.width / 2 + 10 }, 2000, createjs.Ease.getPowInOut(6));
		createjs.Tween.get(this.ControlsOption).to({ x: this.Manager.Canvas.width / 2 + 10 }, 2000, createjs.Ease.getPowInOut(6));
	}

	private RegisterSounds(): void {

		createjs.Sound.addEventListener('fileload', this.LoadHandler.bind(this));
		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];		
		createjs.Sound.registerSound({ id: "bg1", src: "/data/sounds/Bg_01.mp3" });
		createjs.Sound.registerSound({ id: "choose", src: "/data/sounds/common/Choose_Sound_Effect.mp3" });
		createjs.Sound.registerSound({ id: "select", src: "/data/sounds/common/Selecting_Sound_Effect.mp3" });
		createjs.Sound.registerSound({id: "coin", src: "/data/sounds/common/Coin_Effect.mp3"});
	}

	private LoadHandler(event: createjs.Event): void {
		if (event.id === 'bg1') {
			//this.PlayBackGroundMusic();
		}
	}

	private RegisterEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'w':
			case 'ArrowUp':
			case 's':
			case 'ArrowDown':
				this.ChangeOption(this.CurrentOption);
				this.PlaySelect();
				break;
			case 'm':
				this.PlayBackGroundMusic();
				break;
			case 'Enter':
				this.PlayChoose();
				switch (this.CurrentOption) {
					case Option.Play:
						this.Manager.Load(SceneType.PlayerSelect);
						break;
					case Option.Controls:
						this.Manager.Load(SceneType.Controls);
						break;
				}

				break;
		};
	}

	private ChangeOption(current: Option): void {
		if (current === Option.Controls) {
			this.PlayOption.color = "red";
			this.ControlsOption.color = "white";
			this.CurrentOption = Option.Play;
		} else {
			this.PlayOption.color = "white";
			this.ControlsOption.color = "red";
			this.CurrentOption = Option.Controls;
		}
	}

	private PlayBackGroundMusic(): void {

		if (!this.BackGroundMusic) {
			this.BackGroundMusic = createjs.Sound.play('bg1');
			this.BackGroundMusic.position = 18000;
			this.BackGroundMusic.setLoop(1);
			this.BackGroundMusic.volume = 0.1;

			return;
		}

		this.BackGroundMusic.paused = !this.BackGroundMusic.paused;
	}

	private PlaySelect(): void {		
		let instance = createjs.Sound.play('select');
		// instance.volume = 0.1;
	}

	private PlayChoose():void{		
		let instance = createjs.Sound.play('coin');
		// instance.volume = 0.1;
	}
}