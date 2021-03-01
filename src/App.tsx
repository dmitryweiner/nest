import React, { useState, useEffect } from 'react';
// @ts-ignore
import AnyChart from 'anychart-react';
// @ts-ignore
import anychart from 'anychart';
import * as utils from './utils';
import { INPUT_FORMAT, Nest } from './utils';
import nestWithNumbersText from './demo-data/coords-with-numbers';
import nestWithDatesText from './demo-data/coords-with-dates';
import './App.css';
import RangeWithButtons from './components/RangeWithButtons';

function App() {
  const [nestDataText, setNestDataText] = useState('');
  const [nestData, setNestData] = useState<Nest[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [inputFormat, setInputFormat] = useState(utils.INPUT_FORMAT.NUMBER);
  const [withHeader, setWithHeader] = useState(true);
  const [firstCount, setFirstCount] = useState(3);
  const [selectedNest, setSelectedNest] = useState(0);

  const anyChartDistances = anychart.line();
  const anyChartMap = anychart.bubble();
  anyChartMap.minBubbleSize('0.5%');
  anyChartMap.maxBubbleSize('5%');

  useEffect(() => {
    const nestData = utils.parseNestData(nestDataText, inputFormat, withHeader);
    switch (inputFormat) {
      case utils.INPUT_FORMAT.NUMBER:
      case utils.INPUT_FORMAT.COORDINATES:
        utils.setDistancesAndDeltas(nestData);
        break;
      case utils.INPUT_FORMAT.DATE: {
        const dates = utils.getAllDatesSorted(nestData);
        setDates(dates);
        utils.setDateIndex(nestData, dates);
        for (let currentDateIndex = 0; currentDateIndex < dates.length; currentDateIndex++) {
          utils.setDistancesAndDeltas(
            utils.getAllNestsForSpecificDay(nestData, currentDateIndex),
            currentDateIndex
          );
        }
        break;
      }
    }
    setNestData(nestData);
    setSelectedNest(0);
    setSelectedDate(0);
  }, [nestDataText, inputFormat, withHeader]);

  useEffect(() => {
    setDistancesGraphData(selectedNest, selectedDate);
  }, [nestData, selectedNest, selectedDate]);

  useEffect(() => {
    setMapGraphData(nestData, selectedDate);
  }, [nestData, selectedDate]);

  function calculate() {
    switch (inputFormat) {
      case utils.INPUT_FORMAT.NUMBER:
      case utils.INPUT_FORMAT.COORDINATES:
        utils.calculateRforSpecificDay(nestData, firstCount);
        break;
      case utils.INPUT_FORMAT.DATE: {
        for (let currentDateIndex = 0; currentDateIndex < dates.length; currentDateIndex++) {
          utils.calculateRforSpecificDay(
            utils.getAllNestsForSpecificDay(nestData, currentDateIndex),
            firstCount,
            currentDateIndex
          );
        }
        break;
      }
    }

    setNestData([...nestData]);
  }

  function setDistancesGraphData(selectedNest: number, selectedDate = 0) {
    if (!nestData[selectedNest] || !nestData[selectedNest].distances[selectedDate]) return;

    const chartData = [];
    for (let i = 0; i < nestData[selectedNest].distances[selectedDate].length; i++) {
      chartData.push([
        i,
        nestData[selectedNest].distances[selectedDate][i],
        nestData[selectedNest].deltaDistances[selectedDate][i]
      ]);
    }
    const dataSet = anychart.data.set(chartData);
    const seriesData_1 = dataSet.mapAs({ x: 0, value: 1 });
    const seriesData_2 = dataSet.mapAs({ x: 0, value: 2 });
    anyChartDistances.line(seriesData_1);
    anyChartDistances.line(seriesData_2);
  }

  function setMapGraphData(nests: Nest[], selectedDate = 0) {
    if (!nests || !nests.length) return;

    const accepted = [],
      notAccepted = [];
    for (const nest of utils.getAllNestsForSpecificDay(nests, selectedDate)) {
      if (nest.isAccepted[selectedDate]) {
        accepted.push([nest.x, nest.y, nest.r[selectedDate]]);
      } else {
        notAccepted.push([nest.x, nest.y, 0]);
      }
    }
    anyChartMap.bubble(accepted);
    anyChartMap.bubble(notAccepted);
  }

  function setTestData(inputFormat: INPUT_FORMAT) {
    if (inputFormat === utils.INPUT_FORMAT.NUMBER) {
      setNestDataText(nestWithNumbersText);
      setInputFormat(utils.INPUT_FORMAT.NUMBER);
      setWithHeader(true);
    } else if (inputFormat === utils.INPUT_FORMAT.DATE) {
      setNestDataText(nestWithDatesText);
      setInputFormat(utils.INPUT_FORMAT.DATE);
      setWithHeader(false);
    }
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div className="header">
          <h1>Nest</h1>
        </div>
        <div>
          Исходная программа&nbsp;
          <a href="https://github.com/dmitryweiner/nest/raw/main/nest.exe">Nest.exe</a>,&nbsp;
          <a href="https://github.com/dmitryweiner/nest/raw/main/nest.pdf">статья</a> с объяснением
          работы алгоритма.
        </div>
        <div>
          <h4>Выберите формат входных данных:</h4>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === utils.INPUT_FORMAT.COORDINATES}
              onChange={e => e.target.checked && setInputFormat(utils.INPUT_FORMAT.COORDINATES)}
            />
            X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === utils.INPUT_FORMAT.NUMBER}
              onChange={e => e.target.checked && setInputFormat(utils.INPUT_FORMAT.NUMBER)}
            />
            &lt;Метка гнезда&gt; X Y
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="inputFormat"
              checked={inputFormat === utils.INPUT_FORMAT.DATE}
              onChange={e => e.target.checked && setInputFormat(utils.INPUT_FORMAT.DATE)}
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
          <p>
            Загрузить тестовые данные
            <button onClick={() => setTestData(utils.INPUT_FORMAT.NUMBER)}>с номерами</button>
            <button onClick={() => setTestData(utils.INPUT_FORMAT.DATE)}>с датами</button>
          </p>
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
            <select value={firstCount} onChange={e => setFirstCount(Number(e.target.value))}>
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
          {inputFormat === utils.INPUT_FORMAT.DATE && (
            <>
              <p>Текущий день {dates[selectedDate]}</p>
              <RangeWithButtons
                value={selectedDate}
                min={0}
                max={dates.length - 1}
                onChange={(value: number) => setSelectedDate(value)}
              />
            </>
          )}
          <p>Текущee гнездо {nestData[selectedNest] ? nestData[selectedNest].title : ''}</p>
          <RangeWithButtons
            value={selectedNest}
            min={0}
            max={nestData.length - 1}
            onChange={(value: number) => setSelectedNest(value)}
          />
          <AnyChart
            id="distances"
            title={`Расстояния до соседей гнезда ${
              nestData[selectedNest] ? nestData[selectedNest].title : ''
            }`}
            instance={anyChartDistances}
            height={600}
          />
        </div>
        <div>
          <button className="calculate-button" onClick={() => calculate()}>
            Рассчитать!
          </button>
        </div>
        <div>
          <h4>Результат</h4>
          <p>
            Можно скопировать или{' '}
            <a
              href={`data:text/plain;charset=UTF-8,${encodeURIComponent(
                utils.resultToString(nestData, inputFormat).replace('\n', '\r\n')
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
                value={utils.resultToString(nestData, inputFormat)}
                readOnly
              />
            </div>
            <div className="results-graph">
              {inputFormat === utils.INPUT_FORMAT.DATE && (
                <>
                  <p>Текущий день {dates[selectedDate]}</p>
                  <RangeWithButtons
                    value={selectedDate}
                    min={0}
                    max={dates.length - 1}
                    onChange={(value: number) => setSelectedDate(value)}
                  />
                </>
              )}
              <AnyChart id="nest-map" instance={anyChartMap} title="Карта гнёзд" height={600} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
