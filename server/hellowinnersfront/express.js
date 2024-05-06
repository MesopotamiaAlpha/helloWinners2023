const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());


app.post('/executar-script', (req, res) => {
  const { exec } = require('child_process');

  exec('node js/rodarOprograma.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o arquivo JavaScript: ${error.message}`);
      res.status(500).send('Erro ao executar o arquivo JavaScript.');
      return;
    }
    if (stderr) {
      console.error(`Erro de execução do arquivo JavaScript: ${stderr}`);
      res.status(500).send('Erro de execução do arquivo JavaScript.');
      return;
    }
    console.log(`Arquivo JavaScript executado com sucesso: ${stdout}`);
    res.send('Arquivo JavaScript executado com sucesso.');
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
