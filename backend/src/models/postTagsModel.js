import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class PostTagsModel extends BaseModel {
    constructor() {
        super('post_tags');
    }

    async findPostTags(postId) {
        const query = `SELECT tag FROM ${this.getTableName()}
                        WHERE ${this.getTableName()}.post_id = ?`;

        const result = await connection.execute(query, [postId]);
        return result;
    }
}