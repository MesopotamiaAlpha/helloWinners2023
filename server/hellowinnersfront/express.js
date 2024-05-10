const express = require('express');
const app = express();
const cors = require("cors");
const multer = require('multer');

app.use(cors());

// Configuração do Multer para armazenar os arquivos no diretório 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/teste/helloWinners2023/videos'); // Especifique o diretório de destino dos arquivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use o nome original do arquivo
  }
});
const upload = multer({ storage: storage });

// Rota para lidar com o upload de arquivos
app.post('/upar', upload.single('file'), (req, res) => {
  // Verifique se o arquivo foi enviado
  if (!req.file) {
    res.status(400).send('Nenhum arquivo enviado.');
    return;
  }

  // Lógica de processamento do arquivo, se necessário
  // Aqui você pode acessar o arquivo usando req.file

  res.send('Arquivo enviado com sucesso.');
});

// Rota para executar o script
app.post('/executar-script', (req, res) => {
  const { exec } = require('child_process');

  exec('node src/js/rodarOprograma.js', (error, stdout, stderr) => {
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
