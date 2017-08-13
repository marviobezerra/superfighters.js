import { AssetsManager, GameAssets } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';

export abstract class SceneBase extends createjs.Container {
	constructor(public Manager: IManager) {
		super();
	}

	abstract Register(args?: any): void;
	abstract UnRegister(): void;
} 