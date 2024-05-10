import React, { useState } from 'react';
import axios from 'axios';
import logo from './logo-hellowinners.png';
import uploadFile from './js/upload'; // Importa a função de upload

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [scriptResult, setScriptResult] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileSize(event.target.files[0].size);
  };

  const bytesToMegabytes = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  const handleUpload = () => {
    uploadFile(selectedFile, setUploadProgress, setUploadSpeed); // Chama a função de upload
  };

  const executarScript = async () => {
    try {
      const response = await axios.post('http://192.168.1.108:3001/executar-script');
      setScriptResult(response.data); // Define a mensagem de resultado do script
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <img src={logo} alt="Logo HelloWinners" />
      <section className='quadroGeral'>
        <a>Painel de controle do projeto</a>
        <section className='quadroUpar'>
          <input type="file" id="uploadInput" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upar video</button>
          <p>Tamanho do arquivo: {bytesToMegabytes(fileSize)} MB</p>
          <progress value={uploadProgress} max="100"></progress>
          <p>Progresso: {uploadProgress}% concluído</p>
          <p>Velocidade de upload: {uploadSpeed} KB/s</p>
        </section>
        <section className='quadroExecutar'>
          <button onClick={executarScript}>Executar Script</button>
          {scriptResult && <p>{scriptResult}</p>} {/* Mostra a mensagem de resultado do script */}
        </section>
        <section className='quadroApagarVideo'>
          <button onClick={executarScript}>Apagar video</button>
        </section>
        <section className='quadroEditar'>
          <button onClick={executarScript}>Editar o video</button>
        </section>
      </section>
    </div>
  );
};

export default App;
