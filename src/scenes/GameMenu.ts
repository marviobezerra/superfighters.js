import { AssetsManager, Assets } from '../assets/assets-manager';

export enum Option{
	Play,
	Controls		
}

export class GameMenu extends createjs.Container{	

	GameTitle = "Super Fighter JS";
	CurrentOption = Option.Play;
	PlayOption: createjs.Text;
	ControlsOption:createjs.Text;	
	

	constructor(private assetsManager:AssetsManager, private Canvas:HTMLCanvasElement){
		super();
		this.addBg();
		this.addTextLayer();
		this.registerSounds();
		this.registerEvents();
	}


	addBg(){
		let bg = new createjs.Bitmap(this.assetsManager.Load(Assets.Menu));		
		this.addChild(bg);
		this.adjustBackgroundSize(bg);
	}

	adjustBackgroundSize(bg:createjs.Bitmap){
		let ratioX = 1 - bg.getBounds().width / this.Canvas.width;
		let ratioY = 1 - bg.getBounds().height / this.Canvas.height;

		bg.scaleX = bg.scaleX + ratioX;
		bg.scaleY = bg.scaleY + ratioY;
	}

	addTextLayer(){
		let title = new createjs.Text(this.GameTitle.toUpperCase(),"100px Haettenschweiler", "#FFF");
		this.addChild(title);
		title.alpha = 0;
		
		title.x = (this.getBounds().width / 2 ) - (title.getBounds().width / 2);
		title.y = 10;

		createjs.Tween.get(title, {loop:true}).to({alpha:1}, 500);

		this.PlayOption = new createjs.Text("Play", "80px Haettenschweiler", "#F00");		
		this.ControlsOption = new createjs.Text("Controls", "80px Haettenschweiler", "#FFF");

		this.addChild(this.PlayOption,this.ControlsOption);

		this.PlayOption.x = this.getBounds().width / 2 + 10;
		this.PlayOption.y = this.getBounds().height / 2 - 50;

		this.ControlsOption.x = this.PlayOption.x;
		this.ControlsOption.y = this.PlayOption.y + 100;

	}
	
	registerSounds(){
		
		createjs.Sound.addEventListener('fileload', this.loadHandler.bind(this));
		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];
		createjs.Sound.registerSound({id:"bg1", src:"/data/sounds/Bg_01.mp3"});		
		createjs.Sound.registerSound({id:"select", src:"/data/sounds/Iori_40-1.mp3"});	
	}

	loadHandler(event:createjs.Event){
		if (event.id === 'bg1') this.playBgMusic();
	}

	registerEvents(): any {
		document.addEventListener('keydown',(event:KeyboardEvent) => {
			switch (event.key) {
				case 'w':
				case 'ArrowUp':	
				case 's':
				case 'ArrowDown':					
					this.changeOption(this.CurrentOption);	
					this.playSelect();		
					break;
				case 'enter':
					//load scene;
					break;
			}			
			
		});
	}

	changeOption(current:Option){
		if (current === Option.Controls){
			this.PlayOption.color = "red";
			this.ControlsOption.color = "white";
			this.CurrentOption = Option.Play;
		} else {
			this.PlayOption.color = "white";
			this.ControlsOption.color = "red";
			this.CurrentOption = Option.Controls;
		}
	}


	playBgMusic(){		
		let instance = createjs.Sound.play('bg1');
		instance.position = 18000;
		instance.setLoop(0);
		instance.volume = 0.1;	
	}

	playSelect(){		
		let instance = createjs.Sound.play('select');
		instance.volume = 0.1;
	}
}