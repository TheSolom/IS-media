import connection from '../configs/database.js';

export default class BaseModel {
    #tableName;

    constructor(tableName) {
        this.#tableName = tableName;
    }

    getTableName() {
        return this.#tableName;
    }

    async find(conditions) {
        const values = [];
        const clauses = [];
        let query = `SELECT * FROM ${this.getTableName()} `;

        if (conditions) {
            Object.entries(conditions).forEach(([key, value]) => {
                clauses.push(`${key} = ?`);
                values.push(value);
            });
            query += `WHERE ${clauses.join(' AND ')}`;
        }

        const result = await connection.execute(query, values);
        return result;
    }

    async create(data) {
        const keys = Object.keys(data);

        const query = `INSERT INTO ${this.getTableName()} (${keys.join(', ')}) VALUES (:${keys.join(', :')})`;

        const result = await connection.execute(query, data);
        return result[0];
    }

    async update(data, conditions) {
        const setClause = Object.entries(data)
            .map(([key]) => `${key} = ?`)
            .join(', ');

        let whereClause = '';
        const values = [];
        if (conditions) {
            whereClause = 'WHERE ';
            Object.entries(conditions).forEach(([key, value]) => {
                whereClause += `${key} = ? AND `;
                values.push(value);
            });
            whereClause = whereClause.trim().slice(0, -4); // Remove trailing "AND"
        }

        const query = `UPDATE ${this.getTableName()} SET ${setClause} ${whereClause}`;

        const result = await connection.execute(query, [...Object.values(data), ...values]);
        return result[0];
    }

    async delete(conditions) {
        const query = `DELETE FROM ${this.getTableName()} ${conditions ? 'WHERE ?' : ''}`;
        const result = await connection.execute(query, conditions);
        return result[0];
    }
}
