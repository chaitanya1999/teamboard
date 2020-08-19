
'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(path.join(__dirname, 'index.html')) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });
var clientCount=0;
wss.on('connection', (ws) => {
	clientCount++;
	wss.clients.forEach((c)=>{c.send(JSON.stringify({clientCount:clientCount}));})
  console.log('Client connected');
	ws.on('close', () => {console.log('Client disconnected');clientCount--;wss.clients.forEach((c)=>{c.send(JSON.stringify({clientCount:clientCount}));})});
  ws.on('message',(msg)=>{
    //console.log("msg from client");
	wss.clients.forEach((c)=>{/*if(c!=ws)*/c.send(msg);})
  });
});

setInterval(function(){
	console.log("ping all");
	wss.clients.forEach((c)=>{c.send(JSON.stringify({ping:true}));})
},10000);