import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { SceneBase } from './SceneBase';
import { GameMenu } from './GameMenu';
import { GameControl } from './GameControl';
import { GamePlayerSelect } from './GamePlayerSelect';
import { GameOver } from './GameOver';
import { GameFight } from './GameFight';
import { Map } from '../common/util';
import { Splash } from "./Splash";
import { Continue } from './Continue';
import { Winner } from './Winner';

export enum SceneType {
	Menu,
	Controls,
	PlayerSelect,
	Fight,
	GameOver,
	Splash,
	Continue,
	Winner
}

export interface IManager {
	Load(sceneType: SceneType, args?: any): void;
	AssetsManager: AssetsManager;
	Canvas: HTMLCanvasElement,
	CurrentCaracter: PlayerFight
}

export class SceneManager implements IManager {

	private Scenes: Map<SceneBase> = {};
	private CurrentScene: SceneBase;
	public CurrentCaracter = PlayerFight.Kyo;

	constructor(private Stage: createjs.Stage, public AssetsManager: AssetsManager, public Canvas: HTMLCanvasElement) {
		//this.Load(SceneType.Menu);
		this.Load(SceneType.Splash); 
	}

	public Load(sceneType: SceneType, args?: any): void {
		if (!this.Scenes[sceneType]) {
			this.Scenes[sceneType] = this.ResolveScene(sceneType);
		}

		if (this.CurrentScene) {
			this.CurrentScene.UnRegister();
			this.Stage.removeChild(this.CurrentScene);
		}

		this.CurrentScene = this.Scenes[sceneType];
		this.CurrentScene.Register(args);
		this.Stage.addChild(this.CurrentScene);
	}

	private ResolveScene(sceneType: SceneType): SceneBase {
		switch (sceneType) {
			case SceneType.Menu:
				return new GameMenu(this);
			case SceneType.Controls:
				return new GameControl(this);
			case SceneType.PlayerSelect:
				return new GamePlayerSelect(this);
			case SceneType.Fight:
				return new GameFight(this);
			case SceneType.GameOver:
				return new GameOver(this);
			case SceneType.Splash:
				return new Splash(this);
			case SceneType.Continue:
				return new Continue(this);
			case SceneType.Winner:
				return new Winner(this);

		}
	}
}