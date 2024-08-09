import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import InputTable from './components/InputTable';

function App() {
  const [orderData, setOrderData] = useState([]);

  useEffect(()=> {
    console.log("DADDADADA", orderData)
  },[orderData]);

  const handleSaveData = (newData) => {
    setOrderData([...orderData, newData]);
    
  };

  return (
    <div>
      <header style={{
        backgroundColor: '#282c34',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs="auto">
              <h1>Name Tag Request Form</h1>
            </Col>
          </Row>
        </Container>
      </header>

      <div className="d-flex justify-content-center" style={{ margin: '1rem' }}>
        <InputTable saveData={handleSaveData} />
      </div>
    </div>
  );
}

export default App;
