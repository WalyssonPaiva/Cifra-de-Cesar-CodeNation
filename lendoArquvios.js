const fs = require('fs')
var FormData = require('form-data');

var arquivo = __dirname+"/answer.json"
var read_stream = fs.createReadStream(arquivo); //Evento para ler o arquivo. ( Caso tenha algo ) 
console.log(read_stream)
var data;
read_stream.on('data', function(chunk) { data += chunk; }); // Evento de fim de texto. 
read_stream.on('end',function(){ // console do conteudo. 
console.log("Stream data is : " + data); }); 