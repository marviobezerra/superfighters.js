import { Character, Animations } from '../characters/Character';
import { CharacterAction } from '../characters/CharacterActions';

import { SceneBase } from '../scenes/SceneBase';
export class AiManager {

	static proximityRange: number = 300;
	static punching: boolean = false;
	static aiBehaviorChangeInterval: number = 50; //Level of dificulty

	static AiCheck(player: Character, enemy: Character, ticks: number) {
		if (ticks % this.aiBehaviorChangeInterval === Math.floor((Math.random() * 10))) {
			this.changeBehavior(player, enemy);
		}
	}

	static changeBehavior(player: Character, enemy: Character) {

		if (player.Damage >= 100 || enemy.Damage >= 100) {
			return;
		}

		let aiState: AiState = Math.floor((Math.random() * (Object.keys(AiState).length/2)));		
		console.log( "Changed behavior to: ",  aiState);
		switch (aiState) {
			case AiState.GoTo:
				if (player.x < enemy.x) {
					//Player on the left
					this.moveForward(player, enemy, true);
				} else {
					// Player on the right
					this.moveForward(player, enemy, false);
				}
				break;
			case AiState.Idle:
				break;
			case AiState.Taunt:
				enemy.gotoAndPlay('taunt');
				break;
			case AiState.Retreat:

				if (player.x < enemy.x) {
					//Player on the left
					this.moveBackwards(player, enemy, false);
				} else {
					// Player on the right
					this.moveBackwards(player, enemy, true);
				}
			default:
				break;
		}
	}

	static moveForward(player: Character, enemy: Character, isLeft: boolean) {
		if (this.checkProximity(player.x, enemy.x)) {
			enemy.Actions.Execute(CharacterAction.Punch);

		} else {

			if (isLeft) {
				enemy.Actions.Execute(CharacterAction.MoveLeft);
			}
			else {
				enemy.Actions.Execute(CharacterAction.MoveRight);
			}
		}
	}

	static moveBackwards(player: Character, enemy: Character, isLeft: boolean) {
		if (this.checkProximity(player.x, enemy.x)) {
			enemy.Actions.Execute(CharacterAction.Punch);

		} else {

			if (isLeft) {
				enemy.Actions.Execute(CharacterAction.MoveLeft);
			}
			else {
				enemy.Actions.Execute(CharacterAction.MoveRight);
			}
		}
	}

	static hit(enemy: Character) {
		enemy.Actions.Execute(CharacterAction.Punch);
	}

	static checkProximity(pX: number, eX: number) {

		if (Math.abs(pX - eX) < this.proximityRange) {
			return true;
		} else {
			return false;
		}
	}
}

export enum AiState {
	GoTo,
	Retreat,
	Idle,
	Taunt,
	//JumpTo - To be added
	//JumpBack - To be added
}