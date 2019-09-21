import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, Col } from 'react-bootstrap';

function App() {

  const [data, setData] = useState(null);
  const [currencies, setCurrencies] = useState(null);
  const [active_elem, setActiveElem] = useState(null);

  useEffect(() => {
    if (data == null) {
      fetch('http://api.nbp.pl/api/exchangerates/tables/A/?format=json')
      .then(response => response.json())
      .then(response => {
          if (response) {
            setData(response);
            setActiveElem(response['0'].rates[0].code);

            let active_rates = [];

            active_rates.push(response['0'].rates[0]);
            active_rates.push(response['0'].rates[1]);
            active_rates.push(response['0'].rates[2]);

            setCurrencies(active_rates);
          }
      }).catch(error => {
          console.log('fetch', error)
      })
    }
  });

  var formStyle = {
    maxWidth: 400,
    width: '100%'
  };

  if ( !data || typeof data['0'] === 'undefined' ) {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="text-center">Please wait, loading...</h1>
        </header>
      </div>
    );
  }
  else {
    let tableData = '';

    if (currencies) {
      tableData = <Table striped bordered hover variant="dark" style={{maxWidth: 400, width: '100%'}}>
      <thead>
          <tr>
          <th>#</th>
          <th>Waluta</th>
          <th>Wskaźnik</th>
          <th>Działania</th>
          </tr>
      </thead>
      <tbody>
          {currencies.map((item, index) => <tr key={index}><td>{index+1}</td><td>{item.code}</td><td>{item.mid}</td><td><a href="#" onClick={() => {
            if (window.confirm('Jesteś pewny?') && currencies) {
              setCurrencies(currencies.filter(value => {return (value.code !== item.code)}));
            }
          }}>Usunąć</a></td></tr>)}
      </tbody>
      </Table>;
    } else {
      tableData = <p><i>Dodaj poniżej waluty</i></p>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="text-center">Przelicznik Walut</h1>
          <h3 className="text-center mt-4 mb-3">Ulubione waluty</h3>
          <div className="user-currencies mb-4">
            {tableData}
          </div>
          <Form style={formStyle}>
            <Form.Row>
              <Col>
                <label>Dodaj Nową Walutę</label>
                <Form.Control onChange={(e) => setActiveElem(e.target.value)} size="lg" as="select">
                  {data['0'].rates.map(item => <option key={item.code} value={item.code}>{item.code}</option>)}
                </Form.Control>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Button size="lg" className="my-3 mx-2" onClick={() => {
                  if (active_elem) {
                    let elem_index = -1;
                    let new_currencies = [];

                    if (currencies) {
                      elem_index = currencies.findIndex( elem => { return elem.code === active_elem });
                      new_currencies = [...currencies];
                    }

                    if (elem_index < 0 ) {
                      let add_index = data[0].rates.findIndex( elem => { return elem.code === active_elem });

                      if (add_index >= 0) {
                        new_currencies.push(data[0].rates[add_index]);
                        setCurrencies(new_currencies);
                      } else {
                        alert('Nie znaleziono elementu w tablicy');
                      }
                    } else {
                      alert('Element został już dodany');
                    }
                  }
                }}>Dodaj Walutę</Button>
                <Button variant="secondary" size="lg" className="my-3 mx-2" onClick={() => {setCurrencies(null)}}>Wyczyść Wszystko</Button>
              </Col>
            </Form.Row>
          </Form>
        </header>
      </div>
    );
  }
}

export default App;
