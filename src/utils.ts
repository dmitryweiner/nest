import { nanoid } from 'nanoid';

export enum INPUT_FORMAT {
  COORDINATES,
  NUMBER,
  DATE
}

export interface Nest {
  id: string;
  title: string;
  x: number;
  y: number;
  date: string;
  dateIndex: number;
  distances: number[][];
  deltaDistances: number[][];
  neighborsCount: number[];
  r: number[];
  isAccepted: boolean[];
}

export function parseFloat(string: string): number {
  const parsedString = string.replace(',', '.');
  return Number.parseFloat(parsedString);
}

export function parseString(string: string, inputFormat: INPUT_FORMAT): Nest {
  const parts = string.split(/\s/);
  const nest: Nest = {
    id: nanoid(),
    title: '',
    x: 0,
    y: 0,
    date: '',
    dateIndex: 0,
    distances: [],
    deltaDistances: [],
    neighborsCount: [0],
    r: [0],
    isAccepted: [false]
  };
  switch (inputFormat) {
    case INPUT_FORMAT.COORDINATES:
      nest.x = parseFloat(parts[0]);
      nest.y = parseFloat(parts[1]);
      break;
    case INPUT_FORMAT.NUMBER:
      nest.title = parts[0];
      nest.x = parseFloat(parts[1]);
      nest.y = parseFloat(parts[2]);
      break;
    case INPUT_FORMAT.DATE:
      nest.title = parts[0];
      nest.date = parts[1];
      nest.x = parseFloat(parts[2]);
      nest.y = parseFloat(parts[3]);
      break;
    default:
  }
  return nest;
}

export function parseNestData(
  nestDataText: string,
  inputFormat: INPUT_FORMAT,
  withHeader: boolean
): Nest[] {
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

/**
 * Метод вычисляет расстояния от текущего гнезда до всез остальных гнёзд
 *
 * @param {Nest} currentNest текущее гнездо
 * @param {Nest[]} nests все гнёзда
 * @returns {[number]}
 */
export function getSortedDistancesToNeighbors(currentNest: Nest, nests: Nest[]): number[] {
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

/**
 * Метод вычисляет дельту между расстояниями для конкретного гнезда
 * Своего рода производная по расстояниям
 *
 * @param {number[]} distances
 * @returns {number[]}
 */
export function getDeltaDistancesToNeighbors(distances: number[]): number[] {
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

/**
 * Метод определяет, рассчитывать ли среднее расстояние до ближайших гнёзд для
 * этого конкретного гнезда.
 *
 * Вначале мы считаем среднее расстояние до firstCount ближайших соседей для
 * каждого гнезда, кроме текущего. Это r_av.
 *
 * Потом мы считаем среднее этих средних расстояний r_avav.
 *
 * Если расстояние до ПЕРВОГО соседа у текущего гнезда больше или равно r_avav,
 * то гнездо участвует в дальнейшем расчёте. Т.е. гнездо не одиночное, у него
 * есть соседи.
 *
 * @param {Nest} currentNest
 * @param {Nest[]} nests
 * @param {number} firstCount
 * @param {number} [currentDayIndex]
 * @returns {boolean}
 */
export function isNestAccepted(
  currentNest: Nest,
  nests: Nest[],
  firstCount: number,
  currentDayIndex = 0
) {
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
      if (nest.distances[currentDayIndex]) {
        // TODO: что-то здесь странное
        r_av += nest.distances[currentDayIndex][i];
      }
    }

    r_av = r_av / firstCount;
    r_avav += r_av;
  }
  r_avav = r_avav / (nests.length - 1);
  return (
    currentNest.distances[currentDayIndex] && r_avav >= currentNest.distances[currentDayIndex][0]
  );
}

/**
 * Ключевая функция расчёта среднего расстояния до соседей.
 * 1. Определяем, скольких ближайших соседей анализировать (6 или сколько есть).
 * 2. Находим среди них максимальную дельту расстояний. Считаем, что этот пик
 * на графике ограничивает зону "настоящих" соседей.
 * 3. Для этой дельты находим номер соседа.
 * 4. Чисто соседей: номер соседа + 1.
 * 5. Среднее расстояние: сумма расстояний до соседей / число соседей.
 *
 * @param {Nest} nest
 * @param {number} [currentDayIndex]
 * @returns {{r: number, neighborsCount: number}}
 */
export function calculateR(nest: Nest, currentDayIndex = 0): { r: number; neighborsCount: number } {
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

  if (nest.deltaDistances[currentDayIndex].length > 6) {
    loop_limit = 5; //6 neibors
  } else {
    loop_limit = nest.deltaDistances[currentDayIndex].length - 1; //if less than 6
  }

  for (let i = 1; i <= loop_limit; i++) {
    if (nest.deltaDistances[currentDayIndex][i] > maxDelta) {
      maxDelta = nest.deltaDistances[currentDayIndex][i];
      i_max = i;
    }
  }

  for (let i = 0; i <= i_max; i++) {
    r += nest.distances[currentDayIndex][i];
  }
  r = r / (i_max + 1);
  return { r, neighborsCount: i_max + 1 };
}

export function calculateRforSpecificDay(nests: Nest[], firstCount: number, dateIndex = 0) {
  for (const currentNest of nests) {
    currentNest.isAccepted[dateIndex] = isNestAccepted(currentNest, nests, firstCount, dateIndex);
    if (currentNest.isAccepted[dateIndex]) {
      const { r, neighborsCount } = calculateR(currentNest, dateIndex);
      currentNest.r[dateIndex] = r;
      currentNest.neighborsCount[dateIndex] = neighborsCount;
    }
  }
}

function getResultForNest(nest: Nest, dayIndex = 0) {
  let resultStr = `${nest.title ? nest.title : nest.id}\t`;
  if (nest.isAccepted[dayIndex]) {
    resultStr += `${nest.r[dayIndex] ? nest.r[dayIndex].toFixed(3) : ''}\t${
      nest.neighborsCount[dayIndex] ? nest.neighborsCount[dayIndex] : ''
    }`;
  } else {
    resultStr += `NAN\t0`;
  }
  resultStr += `\n`;
  return resultStr;
}

export function getResultByDate(nests: Nest[], dateIndex: number) {
  const header = 'Number\tR\tNeib\n';
  let resultStr = '';

  resultStr = `${header}`;
  for (const nest of nests) {
    resultStr += getResultForNest(nest, dateIndex);
  }

  return resultStr;
}

export function resultToString(nests: Nest[], inputFormat: INPUT_FORMAT) {
  let resultStr = '';

  switch (inputFormat) {
    case INPUT_FORMAT.NUMBER:
    case INPUT_FORMAT.COORDINATES: {
      resultStr = getResultByDate(nests, 0);
      break;
    }
    case INPUT_FORMAT.DATE: {
      resultStr += `Number\tR0\tRk\n`;
      for (const nest of nests) {
        const notNullR = nest.r.filter(r => r > 0);
        resultStr += `${nest.title}\t`;
        if (notNullR.length) {
          resultStr += `${notNullR[0].toFixed(3)}\t${notNullR[notNullR.length - 1].toFixed(3)}\n`;
        } else {
          resultStr += 'NAN\tNAN\n';
        }
      }
      break;
    }
  }

  return resultStr;
}

/**
 * Расчёт расстояний и дельт, сохранение их в объекте гнезда
 *
 * @param {Nest[]} nests
 * @param {number} [currentDayIndex]
 */
export function setDistancesAndDeltas(nests: Nest[], currentDayIndex = 0) {
  for (const currentNest of nests) {
    const distances = getSortedDistancesToNeighbors(currentNest, nests);
    const deltaDistances = getDeltaDistancesToNeighbors(distances);
    currentNest.distances[currentDayIndex] = distances;
    currentNest.deltaDistances[currentDayIndex] = deltaDistances;
  }
}

function parseDate(dateStr: string) {
  const parts = dateStr.split('.');
  return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
}

/**
 * Возвращает массив дат откладки гнёзд, сортированный по возрастанию
 *
 * @param {Nest[]} nests
 * @return {string[]}
 */
export function getAllDatesSorted(nests: Nest[]): string[] {
  const result = [...new Set(nests.map(nest => nest.date))];
  result.sort((a: string, b: string) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    if (dateA > dateB) return 1;
    if (dateA < dateB) return -1;
    return 0;
  });
  return result;
}

/**
 * Установить номер дня у гнезда
 *
 * @param {Nest[]} nests
 * @param {string[]} dates
 */
export function setDateIndex(nests: Nest[], dates: string[]) {
  for (const currentNest of nests) {
    currentNest.dateIndex = dates.indexOf(currentNest.date);
  }
}

/**
 * Отфильтровать только те гнёзда, которые были в этот день и раньше
 *
 * @param {Nest[]} nests
 * @param {number} dateIndex
 * @return {Nest[]}
 */
export function getAllNestsForSpecificDay(nests: Nest[], dateIndex: number) {
  return nests.filter(nest => nest.dateIndex <= dateIndex);
}
