import { AssetsManager, Assets } from '../assets/assets-manager';
export class GameMenu extends createjs.Container{
	

	constructor(private assetsManager:AssetsManager){
		super();
		this.addBg();
		this.registerSounds();
		this.registerEvents();
	}


	addBg(){
		let bg = new createjs.Bitmap(this.assetsManager.Load(Assets.Menu));
		this.addChild(bg);
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
		document.addEventListener('keydown',(event) => {			
			this.playSelect();
		});
	}


	playBgMusic(){		
		let instance = createjs.Sound.play('bg1');
		instance.pan = 1800;
		instance.volume = 0.1;	
	}

	playSelect(){		
		let instance = createjs.Sound.play('select');
		instance.volume = 0.05;
	}
}