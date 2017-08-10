import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export class Continue extends SceneBase {


	private current = 9;
	private KeyDownEvents: any;

	constructor(manager: IManager) {
		super(manager);

		this.KeyDownEvents = this.RegisterKeyDownEvents.bind(this);
		this.registerSounds();
		
	}

	registerSounds(){
		// createjs.Sound.addEventListener('fileload', this.LoadHandler.bind(this));

		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];	

		createjs.Sound.registerSound({id:"9", src:"/data/sounds/common/nine.mp3"});
		createjs.Sound.registerSound({id:"8", src:"/data/sounds/common/eight.mp3"});
		createjs.Sound.registerSound({id:"7", src:"/data/sounds/common/seven.mp3"});
		createjs.Sound.registerSound({id:"6", src:"/data/sounds/common/six.mp3"});
		createjs.Sound.registerSound({id:"5", src:"/data/sounds/common/five.mp3"});
		createjs.Sound.registerSound({id:"4", src:"/data/sounds/common/four.mp3"});
		createjs.Sound.registerSound({id:"3", src:"/data/sounds/common/three.mp3"});
		createjs.Sound.registerSound({id:"2", src:"/data/sounds/common/two.mp3"});
		createjs.Sound.registerSound({id:"1", src:"/data/sounds/common/one.mp3"});
		createjs.Sound.registerSound({id:"continue", src:"/data/sounds/common/new_challenger.mp3"});


	}

	drawTextLayer(){
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
			.call(this.sfx.bind(this))
			.wait(600)
			.to({ scaleX: 1, scaleY: 1 }, 200)
			.to({ visible: false })
			.call(this.callback.bind(this, number));
	}

	callback(object: createjs.DisplayObject) {
		this.Dispose(object);
		if (this.current !== 1) {
			this.current -= 1;
			this.Counting(this.current);
		} else {
			this.Manager.Load(SceneType.GameOver);
		}
	}

	sfx(){
		createjs.Sound.play(this.current.toString());
	}


	public Register(): void {
		document.addEventListener('keydown', this.KeyDownEvents, false);
		this.drawTextLayer();
		this.Counting(this.current);
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyDownEvents, false);		
	}

	private RegisterKeyDownEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Enter':
				createjs.Sound.play('continue');
				this.Manager.Load(SceneType.Menu);//start previous gamefight scene;
				break;
		}
	}
}