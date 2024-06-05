import axios from 'axios';

let variavel;

const uploadFile = async (selectedFile, setUploadProgress, setUploadSpeed) => {
  try {
    let formData = new FormData();
    formData.append('file', selectedFile);
    // tentando capturar o nome do arquivo sendo enviado
    selectedFile = variavel;
    console.log (variavel);
    console.log("dentro do upload");

    const startTime = new Date().getTime(); // Captura o tempo inicial

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress(progress);

        // Calcula a velocidade de upload
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000; // Converte para segundos
        const speed = Math.round((progressEvent.loaded / elapsedTime) / 1024); // Converte bytes/s para KB/s
        setUploadSpeed(speed);
      }
    };

    const response = await axios.post('http://localhost:3001/upar', formData, config);

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default uploadFile;
