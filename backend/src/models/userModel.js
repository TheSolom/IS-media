import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserModel extends BaseModel {
    constructor() {
        super('users');
    }
}
