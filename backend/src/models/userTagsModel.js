import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserTagsModel extends BaseModel {
    constructor() {
        super('user_tags');
    }

    async findMostUsedTags(userId, limit) {
        const query = `SELECT
                            tag_id,
                            count,
                            (count / total_tags.total_count) AS probability
                        FROM
                            ${this.getTableName()}
                        JOIN (
                            SELECT SUM(count) AS total_count
                            FROM ${this.getTableName()}
                            WHERE user_id = ?
                        ) AS total_tags
                        WHERE
                            user_id = ?
                        GROUP BY
                            tag_id, count, probability
                        ORDER BY
                            count DESC
                        LIMIT ?`;

        const result = await connection.execute(query, [userId, userId, limit.toString()]);
        return result;
    }

    async incrementUsedTag(userId, tagId) {
        const query = `INSERT INTO ${this.getTableName()}
                        (user_id, tag_id, count)
                        VALUES(?, ?, 1) 
                        ON DUPLICATE KEY UPDATE
                        count = count + 1`;

        const result = await connection.execute(query, [userId, tagId]);
        return result[0];
    }

    async decrementUsedTag(userId, tagId) {
        const query = `Update ${this.getTableName()} 
                        SET count = count - 1 
                        WHERE user_id = ? AND tag_id = ? AND count > 0`;

        const result = await connection.execute(query, [userId, tagId]);
        return result;
    }
}
