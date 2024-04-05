import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserTagsModel extends BaseModel {
    constructor() {
        super('user_tags');
    }

    async findUsedTags(userId, limit) {
        const query = `SELECT * FROM ${this.getTableName()}
                        WHERE user_id = ?
                        ORDER BY count DESC
                        limit ?`;

        const result = await connection.execute(query, [userId, limit.toString()]);
        return result;
    }
}
