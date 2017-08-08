import { Character } from '../characters/Character';
import { SceneBase } from '../scenes/SceneBase';
export class AiManager{

	static proximityRange:number = 300;
	static punching:boolean = false;

	static AiCheck(player:Character, enemy:Character){		
		// Define positioning of characters left/right
		if (player.x < enemy.x ) {
			//Player on the left
			this.move(player,enemy,true);
		} else {
			// Player on the right
			this.move(player, enemy, false);
		}
	}

	static move(player:Character, enemy:Character, isLeft:boolean){
		if (this.checkProximity(player.x, enemy.x)){
			this.punching = true; //better defined by a bubble event from CharacterClass... check it later.
			this.hit(enemy);			
			this.punching = false;
		} else {
			if (isLeft){
				enemy.x --;
				console.log('Move left called')
			}
			else {
				console.log('Move right called')
				enemy.x ++;
			}
		}
	}

	static hit(enemy:Character){
		console.log('Hit called');
		enemy.gotoAndPlay('punch');
		
	}

	static checkProximity(pX:number, eX: number){
		console.log('Player Position: ', pX, ' Opponent Position: ', eX);
		
		if (Math.abs(pX-eX) < this.proximityRange) { 
			return true; }
		return false;
	}
}

export enum AiState{
	Idle,
	Walk,
	Hit
}