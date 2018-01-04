const sql = require('mssql/msnodesqlv8');
const config = require('../../config/sql').config;

const poolConnection = (() => {

        sql.on('error', err => {
            console.log('SQL error', err);
            return;
        });

        return sql.connect(config);

}) (sql, config);

module.exports = poolConnection;

