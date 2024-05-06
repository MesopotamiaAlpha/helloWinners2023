import React from 'react';
import axios from 'axios';

const App = () => {
  const executarScript = async () => {
    try {
      const response = await axios.post('http://192.168.1.108:3001/executar-script');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={executarScript}>Executar Script</button>
    </div>
  );
};

export default App;
