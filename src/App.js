import React, { useState, useEffect } from 'react';
import AnyChart from 'anychart-react';
import anychart from 'anychart';
import * as utils from './utils';
import './App.css';

function App() {
  const [nestDataText, setNestDataText] = useState('');
  const [nestData, setNestData] = useState([]);
  const [inputFormat, setInputFormat] = useState(utils.INPUT_FORMAT_NUMBER);
  const [withHeader, setWithHeader] = useState(true);
  const [firstCount, setFirstCount] = useState(3);
  const [selectedNest, setSelectedNest] = useState(0);

  const anyChartDistances = anychart.line();
  const anyChartMap = anychart.bubble();
  anyChartMap.minBubbleSize('0.5%');
  anyChartMap.maxBubbleSize('5%');

  useEffect(() => {
    const nestData = utils.parseNestData(nestDataText, inputFormat, withHeader);
    utils.setDistancesAndDeltas(nestData);
    setNestData(nestData);
  }, [nestDataText, inputFormat, withHeader]);

  useEffect(() => {
    setDistancesGraphData(selectedNest);
  }, [nestData, selectedNest]);

  useEffect(() => {
    setMapGraphData(nestData);
  }, [nestData]);

  function calculate() {
    for (const currentNest of nestData) {
      currentNest.isAccepted = utils.isNestAccepted(currentNest, nestData, firstCount);
      if (currentNest.isAccepted) {
        const { r, neighborsCount } = utils.calculateR(currentNest);
        currentNest.r = r;
        currentNest.neighborsCount = neighborsCount;
      }
    }

    setNestData([...nestData]);
  }

  function setDistancesGraphData(selectedNest) {
    if (!nestData[selectedNest]) return;

    const chartData = [];
    for (let i = 0; i < nestData[selectedNest].distances.length; i++) {
      chartData.push([
        i,
        nestData[selectedNest].distances[i],
        nestData[selectedNest].deltaDistances[i]
      ]);
    }
    const dataSet = anychart.data.set(chartData);
    const seriesData_1 = dataSet.mapAs({ x: 0, value: 1 });
    const seriesData_2 = dataSet.mapAs({ x: 0, value: 2 });
    anyChartDistances.line(seriesData_1);
    anyChartDistances.line(seriesData_2);
  }

  function setMapGraphData(nests) {
    if (!nests || !nests.length) return;

    const accepted = [],
      notAccepted = [];
    for (const nest of nests) {
      if (nest.isAccepted) {
        accepted.push([nest.x, nest.y, nest.r]);
      } else {
        notAccepted.push([nest.x, nest.y, 0]);
      }
    }
    anyChartMap.bubble(accepted);
    anyChartMap.bubble(notAccepted);
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
          <div className="input-coordinates-block">
            <div className="input-textarea">
              <textarea
                rows={10}
                className="textarea-with-data"
                value={nestDataText}
                onChange={e => setNestDataText(e.target.value)}
              />
            </div>
            <div className="nest-list">
              <ul>
                {nestData.map(nest => (
                  <li key={nest.id}>
                    <b>{nest.title ? nest.title : nest.id}</b>&nbsp;
                    {nest.date && nest.date}&nbsp;
                    {nest.x} {nest.y}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
        <div className="distances">
          <h4>Расстояния до соседей:</h4>
          <input
            type="range"
            min="0"
            max={nestData.length - 1}
            value={selectedNest}
            onChange={e => setSelectedNest(e.target.value)}
          />
          <button onClick={() => selectedNest > 0 && setSelectedNest(selectedNest - 1)}>
            &lt;
          </button>
          <button
            onClick={() => selectedNest < nestData.length - 1 && setSelectedNest(selectedNest + 1)}
          >
            &gt;
          </button>
          <AnyChart
            id="distances"
            title={`Расстояния до соседей гнезда ${nestData[selectedNest]?.title}`}
            instance={anyChartDistances}
            height={600}
          />
        </div>
        <div>
          <button onClick={() => calculate()}>Расчитать!</button>
        </div>
        <div>
          <h4>Результат</h4>
          <p>
            Можно скопировать или{' '}
            <a
              href={`data:text/plain;charset=UTF-8,${encodeURIComponent(
                utils.resultToString(nestData).replace('\n', '\r\n')
              )}`}
              download="nest_results.txt"
            >
              скачать в виде файла
            </a>
          </p>
          <div className="results-block">
            <div className="results-textarea">
              <textarea
                className="textarea-with-data"
                rows={5}
                value={utils.resultToString(nestData)}
                readOnly
              />
            </div>
            <div className="results-graph">
              <AnyChart id="nest-map" instance={anyChartMap} title="Карта гнёзд" height={600} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
