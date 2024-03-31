import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class PostTagsModel extends BaseModel {
    constructor() {
        super('post_tags');
    }

    async findPostTags(postId) {
        const query = `SELECT tags.* FROM ${this.getTableName()}
                        JOIN tags
                        ON tags.id = ${this.getTableName()}.tag_id
                        WHERE ${this.getTableName()}.post_id = ?`;

        const result = await connection.execute(query, [postId]);
        return result;
    }
}