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

    async findTagPosts(tag, lastId, limit) {
        const query = `SELECT
                            p.*
                        FROM
                            ${this.getTableName()}
                        JOIN posts AS p
                            ON p.id = ${this.getTableName()}.post_id
                        WHERE
                            ${this.getTableName()}.tag = ?
                            AND ${this.getTableName()}.id > ?
                        ORDER BY
                            ${this.getTableName()}.created_at DESC,
                            ${this.getTableName()}.id DESC
                        limit ?`;

        const result = await connection.execute(query, [tag, lastId, limit.toString()]);
        return result;
    }
}