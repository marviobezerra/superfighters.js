import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export class Continue extends SceneBase {

	private CountingDown = false;
	private Current = 9;
	private KeyDownEvents: any;
	private BackGroundImage: createjs.Bitmap;

	constructor(manager: IManager) {
		super(manager);

		this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
		this.AddBackground();

	}

	registerSounds() {
		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];

		createjs.Sound.registerSound({ id: "9", src: "/data/sounds/common/nine.mp3" });
		createjs.Sound.registerSound({ id: "8", src: "/data/sounds/common/eight.mp3" });
		createjs.Sound.registerSound({ id: "7", src: "/data/sounds/common/seven.mp3" });
		createjs.Sound.registerSound({ id: "6", src: "/data/sounds/common/six.mp3" });
		createjs.Sound.registerSound({ id: "5", src: "/data/sounds/common/five.mp3" });
		createjs.Sound.registerSound({ id: "4", src: "/data/sounds/common/four.mp3" });
		createjs.Sound.registerSound({ id: "3", src: "/data/sounds/common/three.mp3" });
		createjs.Sound.registerSound({ id: "2", src: "/data/sounds/common/two.mp3" });
		createjs.Sound.registerSound({ id: "1", src: "/data/sounds/common/one.mp3" });
		createjs.Sound.registerSound({ id: "continue", src: "/data/sounds/common/new_challenger.mp3" });
	}

	drawTextLayer() {
		let title = new createjs.Text('CONTINUE', "150px Haettenschweiler", "#FFF");
		this.addChild(title);
		title.x = this.Manager.Canvas.width / 2 - title.getBounds().width / 2 - 20;
		title.y = 10;
	}

	Counting(count: number) {
		let number = new createjs.Text(count.toString(), "100px Haettenschweiler", "#FFF");

		this.addChild(number);

		number.x = this.Manager.Canvas.width / 2 - number.getBounds().width / 2;
		number.y = this.Manager.Canvas.height / 2 - number.getBounds().height / 2;
		number.regX = number.getBounds().width / 2;
		number.regY = number.getBounds().height / 2;

		createjs.Tween.get(number)
			.to({ scaleY: -2 })
			.to({ scaleX: 3, scaleY: 3 }, 200)
			.call(() => this.sfx())
			.wait(600)
			.to({ scaleX: 1, scaleY: 1 }, 200)
			.to({ visible: false })
			.call((c) => this.callback(number));
	}

	callback(object: createjs.DisplayObject) {

		this.removeChild(object);

		if (this.CountingDown == false) {
			return;
		}

		if (this.Current !== 1) {
			this.Current--;
			this.Counting(this.Current);
			return;
		}

		this.Manager.Load(SceneType.GameOver);
	}

	sfx() {
		createjs.Sound.play(this.Current.toString());
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
		this.registerSounds();
		this.drawTextLayer();
		this.Current = 9;
		this.CountingDown = true;
		this.Counting(this.Current);
		document.addEventListener('keydown', this.KeyDownEvents, false);

	}

	public UnRegister(): void {
		this.CountingDown = false;
		document.removeEventListener('keydown', this.KeyDownEvents, false);
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Enter':
				createjs.Sound.play('continue');
				this.CountingDown = false;
				this.Manager.Load(SceneType.Fight);//start previous gamefight scene;
				break;
		}
	}
}