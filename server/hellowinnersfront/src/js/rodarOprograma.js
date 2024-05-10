const { exec } = require('child_process');

exec('python3 /home/teste/helloWinners2023/teste.py', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o script Python: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Erro de execução do script Python: ${stderr}`);
    return;
  }
  console.log(`Script Python executado com sucesso: ${stdout}`);
});
