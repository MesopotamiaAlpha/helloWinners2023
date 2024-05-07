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
      <section className='quadroExecutar'>
        <button onClick={executarScript}>Executar Script</button>
      </section>

      <section className='quadroUpar'>
        <input type="file" id="fileUploaded"/>
        <button onClick={executarScript}>Upar video</button>
      </section>

      <section className='quadroUpar'>
        <button onClick={executarScript}>Apagar video</button>
      </section>


    </div>
  );
};

export default App;
