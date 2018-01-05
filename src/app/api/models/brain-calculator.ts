/* tslint:disable */
import { ViewDwellingTimes } from './view-dwelling-times';
import { ViewTemperatures } from './view-temperatures';
import { ViewSelect } from './view-select';

/**
 */
export class BrainCalculator {
    relaxCoef?: number;
    sdisableFields?: number;
    scheckOptim?: number;
    sdisableOptim?: number;
    sdisableNbOptim?: number;
    epsilonTemp?: number;
    epsilonEnth?: number;
    nbOptimIter?: number;
    sdisableTimeStep?: number;
    sdisablePrecision?: number;
    sdisableStorage?: number;
    timeStep?: number;
    precision?: number;
    precisionlogstep?: number;
    scheckStorage?: number;
    storagestep?: number;
    hRadioOn?: number;
    hRadioOff?: number;
    maxIter?: number;
    sdisableCalculate?: number;
    vRadioOn?: number;
    vRadioOff?: number;
    tempPtSurf?: number;
    tempPtIn?: number;
    tempPtBot?: number;
    tempPtAvg?: number;
    dwellingTimes?: ViewDwellingTimes[];
    temperatures?: ViewTemperatures[];
    toc?: number;
    select1?: ViewSelect[];
    select2?: ViewSelect[];
    select3?: ViewSelect[];
    select4?: ViewSelect[];
    select5?: ViewSelect[];
    select6?: ViewSelect[];
    select7?: ViewSelect[];
    select8?: ViewSelect[];
    select9?: ViewSelect[];
}
