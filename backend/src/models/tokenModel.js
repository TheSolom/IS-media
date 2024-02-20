import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class TokenModel extends BaseModel {
    constructor() {
        super('tokens');
    }
}
