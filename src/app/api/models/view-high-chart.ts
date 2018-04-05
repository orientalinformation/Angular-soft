/* tslint:disable */
import { Position } from './position';
import { Point } from './point';

/**
 */
export class ViewHighChart {
    maxPixY?: number;
    MiniMum?: number;
    minValueY?: number;
    maxValueY?: number;
    imageWidth?: number;
    imageHeight?: number;
    imageMargeWidth?: number;
    imageMargeHeight?: number;
    X?: Position;
    Y?: Position;
    ListOfPoints?: Point;
    path?: string;
    originY?: number;
    minPixY?: number;
    MaxiMum?: number;
    nbpixY?: number;
    valuesTabX?: number[];
    valuesTabY?: number[];
    selectedPoints?: number[];
    nbpoints?: number;
    axisYLength?: number;
    posTabY?: number[];
    checkTop?: number;
    checkLeft?: number;
    checkRight?: number;
    checkButton?: number;
    checkFront?: number;
    checkRear?: number;
}
