import { SceneBase } from './SceneBase';
import { IManager, SceneType, SceneManager } from './SceneManager';
import { GameAssets } from '../assets/assets-manager';

export class Splash extends SceneBase{


	constructor(manager:IManager) {
		super(manager);
		this.start();
	}

	start(){
		let splashContainer = new createjs.Container();
		splashContainer.alpha = 0;
		this.addChild(splashContainer);		
		
		let logo = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.Splash))			
		
		logo.x = this.Manager.Canvas.width / 2 - 200;
		logo.y = this.Manager.Canvas.height  / 2 - 300;
		logo.scaleX = 0.5;
		logo.scaleY = 0.5;

		let title = new createjs.Text('Presents', "100px Haettenschweiler", "#FFF");
		title.x = (this.Manager.Canvas.width / 2) - (title.getBounds().width / 2);
		title.y = this.Manager.Canvas.height - 130;

		splashContainer.addChild(logo, title);		

		createjs.Tween.get(splashContainer).to({alpha:1}, 3000).wait(5000).call(this.handleComplete);
	}

	handleComplete(){		
		this.Manager.Load(SceneType.Menu); // figure why is undefined, check with Marvio.
	}

	Register(): void {
		
	}
	UnRegister(): void {
		
	}

}