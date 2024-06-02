import React from 'react';
import errorImage from '../../error_page.png'; 

function Error() {
  return (
    <div style={{ height: '100vh', margin: '2%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <img src={errorImage} alt="Error" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </div>
    </div>
  );
}

export default Error;
