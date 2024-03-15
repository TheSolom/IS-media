import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserModel extends BaseModel {
    constructor() {
        super('users');
    }

    async search(username, limit) {
        const query = `SELECT * FROM ${this.getTableName()}
                        WHERE username LIKE ?
                        LIMIT ?`;

        const result = await connection.execute(query, [`%${username}%`, limit.toString()]);
        return result;
    }
}
