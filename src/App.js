import './App.css';
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Chart } from 'react-google-charts';

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
    date: null,
    distances: [],
    deltaDistances: [],
    neighborsCount: 0,
    r: 0,
    isAccepted: false
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

function getSortedDistancesToNeighbors(currentNest, nests) {
  /*
    procedure Calc_date(list_in: TList);
    var
      i, j, k: integer;
      L: TList;
      Rast: real;
      p1, p2: ^nestpoint;
      temp_d, temp1_d: ^dot;
      changed: boolean;
      p_real: ^real;
    begin
      L := TList.Create;
      for i := 0 to (List_in.Count - 1) do
      begin
        //заполняем список
        for j := 0 to (List_in.Count - 1) do
        begin
          if (i <> j) then
          begin
            p1 := List_in.Items[i];
            p2 := List_in.Items[j];
            //деление на 2, т.к. необходима ПОЛОВИНА расстояний (confirmed by Alexey)
            rast := (sqrt(sqr(p1^.x - p2^.x) + sqr(p1^.y - p2^.y))) / 2;
            new(temp_d);
            temp_d^.N := p2^.N;
            temp_d^.R := rast;
            L.Add(temp_d);
            temp_d := nil;
          end;//if
        end;//for
        //cортировка
        changed := True;
        while changed do
        begin
          changed := False;
          for k := 0 to (L.Count - 2) do
          begin
            temp_d := L.Items[k];
            temp1_d := L.Items[k + 1];
            if temp1_d^.R < temp_d^.R then
            begin
              L.Exchange(k, k + 1);
              Changed := True;
            end;
          end;//for
        end;//while
        //закидываем всё в Rast[]
        p1 := List_in.Items[i];
        p1^.Rast.Clear;
        for k := 0 to (L.Count - 1) do
        begin
          temp_d := L.Items[k];
          New(p_real);
          p_real^ := temp_d^.R;
          p1^.Rast.Add(p_real);
        end;
        L.Clear;
      end;
    end;// Calc_date;
   */
  const distances = [];
  for (const nest of nests) {
    if (nest.id === currentNest.id) continue;
    const distance =
      Math.sqrt(Math.pow(nest.x - currentNest.x, 2) + Math.pow(nest.y - currentNest.y, 2)) / 2;
    distances.push(distance);
  }
  distances.sort((a, b) => a - b);
  return distances;
}

function getDeltaDistancesToNeighbors(distances) {
  /*
    procedure DeltaCalc_date(list_in: TList);
    var
      p1: ^nestpoint;
      max: real;
      i, k: integer;
      p_real_1, p_real_2, p_real_3: ^real;
    begin
      for k := 0 to (list_in.Count - 1) do
      begin
        p1 := list_in.Items[k];
        //вычисление дельты
        p1^.Delta_Rast.Clear;
        for i := 0 to p1^.Rast.Count - 2 do
        begin
          p_real_1 := p1^.Rast.Items[i + 1];
          p_real_2 := p1^.Rast.Items[i];
          New(p_real_3);
          p_real_3^ := p_real_1^ - p_real_2^;
          p1^.Delta_Rast.Add(p_real_3);
        end;
        //поиск максимальной
        max := 0;
        for i := 0 to p1^.Delta_Rast.Count - 1 do
        begin
          p_real_1 := p1^.Delta_Rast.Items[i];
          if p_real_1^ > max then
            max := p_real_1^;
        end;
        //нормализация
        if max > 0 then
          for i := 0 to p1^.Delta_Rast.Count - 1 do
          begin
            p_real_1 := p1^.Delta_Rast.Items[i];
            p_real_1^ := p_real_1^ / max;
          end;
      end;//for
    end;// DeltaCalc_date;
   */
  const deltas = [];
  for (let i = 0; i < distances.length - 1; i++) {
    deltas.push(distances[i + 1] - distances[i]);
  }
  const maxDelta = Math.max(...deltas);
  return deltas.map(delta => delta / maxDelta);
}

function isNestAccepted(currentNest, nests, firstCount) {
  /*
    procedure SelectNeibs(List_in: TList);
    var
      p1, p2: ^nestpoint;
      i, j, k, Count: integer;
      r_av, r_avav: real;
      p_real: ^real;
    begin
      for i := 0 to (List_in.Count - 1) do
      begin
        //вычисление R ср. ср.
        Count := 0;
        r_avav := 0;
        for j := 0 to (List_in.Count - 1) do
        begin
          r_av := 0;
          p1 := List_in.Items[i];
          p2 := List_in.Items[j];
          if p1^.N <> p2^.N then
          begin
            for k := 1 to (Form1.ComboBox1.ItemIndex + 1) do
            begin
              if (k - 1) < p2^.rast.Count then
              begin
                p_real := p2^.rast.Items[k - 1];
                r_av := r_av + p_real^;
              end;
            end;
            r_av := r_av / (form1.ComboBox1.ItemIndex + 1);
            r_avav := r_avav + r_av;
            Count := Count + 1;
          end;
        end;//while
        r_avav := r_avav / Count;
        //вывод
        p_real := p1^.Rast.Items[0];
        if r_avav < p_real^ then
        begin
          p1^.Attempted := False;
        end
        else
        begin
          p1^.Attempted := True;
        end;
      end;//for
    end;//selectNeibs
   */
  let r_avav = 0;
  for (const nest of nests) {
    let r_av = 0;
    if (nest.id === currentNest.id) continue;

    for (let i = 0; i < firstCount; i++) {
      r_av += nest.distances[i];
    }

    r_av = r_av / firstCount;
    r_avav += r_av;
  }
  r_avav = r_avav / (nests.length - 1);
  return r_avav >= currentNest.distances[0];
}

function calculateR(nest) {
  /*
      max := 0;
      i_max := 1;
      if p1^.Delta_Rast.Count > 6 then
        loop_limit := 5 //6 neibors
      else
        loop_limit := p1^.Delta_Rast.Count - 1; //if less than 6
      for i := 1 to loop_limit do
      begin
        p_real := p1^.Delta_Rast.Items[i];
        if (p_real^ > max) then
        begin
          max := p_real^;
          i_max := i;
        end;//if
      end;
      r := 0;
      for i := 0 to i_max do
      begin
        p_real := p1^.Rast.Items[i];
        r := r + p_real^;
      end;
      r := r / (i_max + 1);
      p1^.R_av := r;
      Set_R_and_Date(p1^.N, r, day);
      p1^.Neib_Count := i_max + 1;
   */
  let maxDelta = 0;
  let i_max = 0;
  let loop_limit;
  let r = 0;

  if (nest.deltaDistances.length > 6) {
    loop_limit = 5; //6 neibors
  } else {
    loop_limit = nest.deltaDistances.length - 1; //if less than 6
  }

  for (let i = 1; i <= loop_limit; i++) {
    if (nest.deltaDistances[i] > maxDelta) {
      maxDelta = nest.deltaDistances[i];
      i_max = i;
    }
  }

  for (let i = 0; i <= i_max; i++) {
    r += nest.distances[i];
  }
  r = r / (i_max + 1);
  return { r, neighborsCount: i_max + 1 };
}

function resultToString(nests) {
  let resultStr = 'Number\tR\tNeib\n';
  for (const nest of nests) {
    resultStr += `${nest.title ? nest.title : nest.id}\t`;
    if (nest.isAccepted) {
      resultStr += `${nest.r}\t${nest.neighborsCount}`;
    } else {
      resultStr += `NAN\t0`;
    }
    resultStr += `\n`;
  }
  return resultStr;
}

function App() {
  const [nestDataText, setNestDataText] = useState('');
  const [nestData, setNestData] = useState([]);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT_NUMBER);
  const [withHeader, setWithHeader] = useState(false);
  const [firstCount, setFirstCount] = useState(3);
  const [result, setResult] = useState([]);

  useEffect(() => {
    setNestData(parseNestData(nestDataText, inputFormat, withHeader));
  }, [nestDataText, inputFormat, withHeader]);

  function calculate() {
    for (const currentNest of nestData) {
      const distances = getSortedDistancesToNeighbors(currentNest, nestData);
      const deltaDistances = getDeltaDistancesToNeighbors(distances);
      currentNest.distances = distances;
      currentNest.deltaDistances = deltaDistances;
    }

    for (const currentNest of nestData) {
      currentNest.isAccepted = isNestAccepted(currentNest, nestData, firstCount);
      if (currentNest.isAccepted) {
        const { r, neighborsCount } = calculateR(currentNest);
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
          <textarea className="textarea-with-data" rows={5} value={resultToString(result)} />
        </div>
      </div>
    </div>
  );
}

export default App;
