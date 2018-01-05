/* tslint:disable */
import { ViewDwellingTimes } from './view-dwelling-times';
import { ViewTemperatures } from './view-temperatures';

/**
 */
export class StartBrainCalculate {
    relaxCoef?: number;
    idStudy?: number;
    checkOptim?: boolean;
    dwellingTimes?: ViewDwellingTimes[];
    temperatures?: ViewTemperatures[];
    toc?: number;
    epsilonTemp?: number;
    epsilonEnth?: number;
    nbOptimIter?: number;
    timeStep?: number;
    precision?: number;
    scheckStorage?: number;
    storagestep?: number;
    hRadioOn?: number;
    hRadioOff?: number;
    maxIter?: number;
    idStudyEquipment?: number;
    vRadioOn?: number;
    vRadioOff?: number;
    tempPtSurf?: number;
    tempPtIn?: number;
    tempPtBot?: number;
    tempPtAvg?: number;
    select1?: number;
    select2?: number;
    select3?: number;
    select4?: number;
    select5?: number;
    select6?: number;
    select7?: number;
    select8?: number;
    select9?: number;
}
