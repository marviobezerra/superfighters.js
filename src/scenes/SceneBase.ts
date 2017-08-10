import { AssetsManager, GameAssets } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export abstract class SceneBase extends createjs.Container {
	constructor(protected Manager: IManager) {
		super();
	}

	abstract Register(): void;
	abstract UnRegister(): void;

	public Dispose(object:createjs.DisplayObject):void{
		this.removeChild(object);
	}
} 