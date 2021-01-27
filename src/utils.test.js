import nestWithNumbersText from './demo-data/coords-with-numbers';
import nestWithDatesText from './demo-data/coords-with-dates';
import * as utils from './utils';

describe('Calculation with numbers', () => {
  it('should parse input data', () => {
    const nestData = utils.parseNestData(nestWithNumbersText, utils.INPUT_FORMAT_NUMBER, true);
    expect(nestData.length).toEqual(236);
    expect(nestData[0]).toHaveProperty('title');
    expect(nestData[0].title).toEqual('1');
    expect(nestData[0]).toHaveProperty('x');
    expect(nestData[0].x).toBeCloseTo(-20.03);
    expect(nestData[0]).toHaveProperty('y');
    expect(nestData[0].y).toEqual(56.37);

    expect(nestData[nestData.length - 1]).toHaveProperty('title');
    expect(nestData[nestData.length - 1].title).toEqual('181');
    expect(nestData[nestData.length - 1]).toHaveProperty('x');
    expect(nestData[nestData.length - 1].x).toBeCloseTo(-2.96);
    expect(nestData[nestData.length - 1]).toHaveProperty('y');
    expect(nestData[nestData.length - 1].y).toEqual(40.77);
  });

  it('should calculate distances and delta', () => {
    const nestData = utils.parseNestData(nestWithNumbersText, utils.INPUT_FORMAT_NUMBER, true);
    const distances = utils.getSortedDistancesToNeighbors(nestData[0], nestData);
    const deltaDistances = utils.getDeltaDistancesToNeighbors(distances);

    expect(distances.length).toEqual(nestData.length - 1);
    expect(deltaDistances.length).toEqual(distances.length - 1);

    expect(distances[0]).toBeCloseTo(0.5850854638426756);
    expect(deltaDistances[0]).toBeCloseTo(0.06543685199018158);

    expect(distances[distances.length - 1]).toBeCloseTo(20.616574036439708);
    expect(deltaDistances[deltaDistances.length - 1]).toBeCloseTo(0.8876321116439182);
  });

  it('should test whether nest accepted or not', () => {
    const nestData = utils.parseNestData(nestWithNumbersText, utils.INPUT_FORMAT_NUMBER, true);
    utils.setDistancesAndDeltas(nestData);

    let isAccepted = utils.isNestAccepted(nestData[0], nestData, 3);
    expect(isAccepted).toBeTruthy();
    isAccepted = utils.isNestAccepted(nestData[9], nestData, 3);
    expect(isAccepted).not.toBeTruthy();
  });

  it('should calculate R and number of neighbors', () => {
    const nestData = utils.parseNestData(nestWithNumbersText, utils.INPUT_FORMAT_NUMBER, true);
    utils.setDistancesAndDeltas(nestData);

    let result = utils.calculateR(nestData[0]);
    expect(result.r).toBeCloseTo(0.6);
    expect(result.neighborsCount).toEqual(2);

    result = utils.calculateR(nestData[nestData.length - 1]);
    expect(result.r).toBeCloseTo(1.103);
    expect(result.neighborsCount).toEqual(5);
  });
});

describe('Calculation with dates', () => {
  it('should parse input data', () => {
    const nestData = utils.parseNestData(nestWithDatesText, utils.INPUT_FORMAT_DATE, false);
    const dates = utils.getAllDatesSorted(nestData);
    expect(dates.length).toEqual(16);
    expect(dates[0]).toEqual('18.05.17');
    expect(dates[dates.length - 1]).toEqual('03.06.17');
  });

  it('should set proper date index', () => {
    const nestData = utils.parseNestData(nestWithDatesText, utils.INPUT_FORMAT_DATE, false);
    const dates = utils.getAllDatesSorted(nestData);
    utils.setDateIndex(nestData, dates);
    expect(nestData[19].dateIndex).toEqual(0);
    expect(nestData[65].dateIndex).toEqual(15);
  });

  it('should filter nests by date index', () => {
    const nestData = utils.parseNestData(nestWithDatesText, utils.INPUT_FORMAT_DATE, false);
    const dates = utils.getAllDatesSorted(nestData);
    utils.setDateIndex(nestData, dates);

    const selectedNests = utils.getAllNestsForSpecificDay(nestData, 2);
    expect(selectedNests.length).toEqual(5);
  });
});
