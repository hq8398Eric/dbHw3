const cred = require('./cred')
const Pool = require('pg').Pool
const pool = new Pool({
	user: cred.user,
	host: cred.host,
	database: cred.name,
	password: cred.password,
	port: cred.port,
});

