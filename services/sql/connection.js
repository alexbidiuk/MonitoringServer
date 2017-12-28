const sql = require('mssql/msnodesqlv8');
const config = require('../../config/sql').config;

const poolConnection = (() => {

        sql.on('error', err => {
            console.warn('SQL error', err);
        });

        return sql.connect(config);

}) (sql, config);

module.exports = poolConnection;

