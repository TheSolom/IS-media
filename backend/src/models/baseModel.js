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
        const conditionKeys = Object.keys(conditions);

        if (conditionKeys.length === 0)
            throw new Error('Empty conditions object');

        const values = [];
        const clauses = [];
        let query = `SELECT * FROM ${this.getTableName()} `;

        Object.entries(conditions).forEach(([key, value]) => {
            clauses.push(`${key} = ?`);
            values.push(value);
        });
        query += `WHERE ${clauses.join(' AND ')}`;

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
        const conditionKeys = Object.keys(conditions);

        if (conditionKeys.length === 0)
            throw new Error('Empty conditions object');

        const setClause = Object.keys(data).map((key) => `${key} = ?`).join(', ');
        const whereClause = conditionKeys.map(key => `${key} = ?`).join(' AND ');

        const values = [...Object.values(data), ...Object.values(conditions)];

        const query = `UPDATE ${this.getTableName()} SET ${setClause} WHERE ${whereClause}`;

        const result = await connection.execute(query, values);
        return result[0];
    }

    async delete(conditions) {
        const conditionKeys = Object.keys(conditions);

        if (conditionKeys.length === 0)
            throw new Error('Empty conditions object');

        const whereClause = conditionKeys.map(key => `${key} = ?`).join(' AND ');
        const values = conditionKeys.map(key => conditions[key]);

        const query = `DELETE FROM ${this.getTableName()} WHERE ${whereClause}`;

        const result = await connection.execute(query, values);
        return result[0];
    }
}