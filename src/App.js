import './App.css';
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

const INPUT_FORMAT_COORDINATES = 1;
const INPUT_FORMAT_NUMBER = 2;
const INPUT_FORMAT_DATE = 3;

function parseFloat(string) {
  const parsedString = string.replace(',', '.');
  return Number.parseFloat(parsedString);
}

function parseString(string, inputFormat) {
  const parts = string.split(/\s/);
  const nest = {
    id: nanoid(),
    title: '',
    x: 0,
    y: 0,
    date: null
  };
  switch (inputFormat) {
    case INPUT_FORMAT_COORDINATES:
      nest.x = parseFloat(parts[0]);
      nest.y = parseFloat(parts[1]);
      break;
    case INPUT_FORMAT_NUMBER:
      nest.title = parts[0];
      nest.x = parseFloat(parts[1]);
      nest.y = parseFloat(parts[2]);
      break;
    case INPUT_FORMAT_DATE:
      nest.title = parts[0];
      nest.date = parts[1];
      nest.x = parseFloat(parts[2]);
      nest.y = parseFloat(parts[3]);
      break;
    default:
  }
  return nest;
}

function parseNestData(nestDataText, inputFormat, withHeader) {
  let result = [];
  const strings = nestDataText.split(/[\r\n]+/);
  let first = true;
  for (const string of strings) {
    if (withHeader && first) {
      first = false;
      continue;
    }
    if (string === '') continue;
    result.push(parseString(string, inputFormat));
  }
  return result;
}

function App() {
  const [nestDataText, setNestDataText] = useState('');
  const [nestData, setNestData] = useState([]);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT_NUMBER);
  const [withHeader, setWithHeader] = useState(false);
  const [firstCount, setFirstCount] = useState(3);

  useEffect(() => {
    setNestData(parseNestData(nestDataText, inputFormat, withHeader));
  }, [nestDataText, inputFormat, withHeader]);

  return (
    <div className="App">
      <div className="wrapper">
        <h1>Nest</h1>
        <h4>Выберите формат входных данных:</h4>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === INPUT_FORMAT_COORDINATES}
              onChange={e => e.target.checked && setInputFormat(INPUT_FORMAT_COORDINATES)}
            />
            X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === INPUT_FORMAT_NUMBER}
              onChange={e => e.target.checked && setInputFormat(INPUT_FORMAT_NUMBER)}
            />
            &lt;Метка гнезда&gt; X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === INPUT_FORMAT_DATE}
              onChange={e => e.target.checked && setInputFormat(INPUT_FORMAT_DATE)}
            />
            &lt;Метка гнезда&gt; &lt;Дата основания&gt; X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={withHeader}
              onChange={e => setWithHeader(e.target.checked)}
            />
            С заголовком
          </label>
        </div>
        <div>
          <h4>Скопируйте сюда координаты гнёзд:</h4>
          <textarea
            className="input-data"
            value={nestDataText}
            onChange={e => setNestDataText(e.target.value)}
          />
        </div>
        <div>
          <label>
            Брать первых
            <select value={firstCount} onChange={e => setFirstCount(e.target.value)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
            </select>
          </label>
        </div>
        <div>
          <h4>Гнёзда:</h4>
          <ul className="nest-list">
            {nestData.map(nest => (
              // eslint-disable-next-line react/jsx-key
              <li>
                <b>{nest.title ? nest.title : nest.id}</b>&nbsp;
                {nest.date && nest.date}&nbsp;
                {nest.x} {nest.y}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
