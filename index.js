var app = require('express')();
var http = require('http').createServer(app);
const mysql = require('mysql2/promise');
var io = require('socket.io')(http);

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password : 'root@123',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket)=>{
    socket.on('chat message', async function(msg){
        conn = await pool.getConnection();
        let result = await conn.query('insert into `chat` (text) values(?)',[msg]);
        //get saved data
        let [results, fields] = await conn.query("select * from chat ORDER by id DESC LIMIT 1");
        io.emit('resultData',results);
      });
    
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});