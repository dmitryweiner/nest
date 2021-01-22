import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as utils from './utils';
import './App.css';

function App() {
  const [nestDataText, setNestDataText] = useState('');
  const [nestData, setNestData] = useState([]);
  const [inputFormat, setInputFormat] = useState(utils.INPUT_FORMAT_NUMBER);
  const [withHeader, setWithHeader] = useState(false);
  const [firstCount, setFirstCount] = useState(3);
  const [result, setResult] = useState([]);

  useEffect(() => {
    setNestData(utils.parseNestData(nestDataText, inputFormat, withHeader));
  }, [nestDataText, inputFormat, withHeader]);

  function calculate() {
    for (const currentNest of nestData) {
      const distances = utils.getSortedDistancesToNeighbors(currentNest, nestData);
      const deltaDistances = utils.getDeltaDistancesToNeighbors(distances);
      currentNest.distances = distances;
      currentNest.deltaDistances = deltaDistances;
    }

    for (const currentNest of nestData) {
      currentNest.isAccepted = utils.isNestAccepted(currentNest, nestData, firstCount);
      if (currentNest.isAccepted) {
        const { r, neighborsCount } = utils.calculateR(currentNest);
        currentNest.r = r;
        currentNest.neighborsCount = neighborsCount;
      }
    }

    setResult([...nestData]);
  }

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
              checked={inputFormat === utils.INPUT_FORMAT_COORDINATES}
              onChange={e => e.target.checked && setInputFormat(utils.INPUT_FORMAT_COORDINATES)}
            />
            X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === utils.INPUT_FORMAT_NUMBER}
              onChange={e => e.target.checked && setInputFormat(utils.INPUT_FORMAT_NUMBER)}
            />
            &lt;Метка гнезда&gt; X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === utils.INPUT_FORMAT_DATE}
              onChange={e => e.target.checked && setInputFormat(utils.INPUT_FORMAT_DATE)}
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
            rows={5}
            className="textarea-with-data"
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
          <Chart
            width={'600px'}
            height={'400px'}
            chartType="ScatterChart"
            loader={<div>Loading Chart</div>}
            data={[['x', 'y'], ...nestData.map(nest => [nest.x, nest.y])]}
            options={{
              legend: 'none'
            }}
          />
        </div>
        <div>
          <button onClick={() => calculate()}>Расчитать!</button>
        </div>
        <div>
          <h4>Результат</h4>
          <p>
            Можно скопировать или <a>скачать в виде файла</a>
          </p>
          <textarea className="textarea-with-data" rows={5} value={utils.resultToString(result)} />
        </div>
      </div>
    </div>
  );
}

export default App;
