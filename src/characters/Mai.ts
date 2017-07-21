import { Caracter } from './Character';
import '../../data/images/Mai/mai-data.json';
import '../../data/images/Mai/mai-image.png';

export class Mai extends Caracter {
	constructor() {
		let data = require('../../data/images/Mai/mai-data.json');
		super(data);
	}
}