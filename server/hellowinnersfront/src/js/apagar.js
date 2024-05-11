const fs = require ('fs');
const express = require('express');
const app = express();

const { promisify } = require ('util');
const unlink = promisify(fs.unlink);

console.log('executando arquivo para apagar');

// Especificamos o nome e extensão do arquivo a ser deletado
fs.unlink('../../videos/', function (err){
    if (err) throw err;
    console.log('Arquivo deletado!');
});