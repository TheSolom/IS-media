import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class TagsModel extends BaseModel {
    constructor() {
        super('tags');
    }
}
