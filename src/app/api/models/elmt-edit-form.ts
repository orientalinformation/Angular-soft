/* tslint:disable */
import { ProductElmt } from './product-elmt';
import { TempPoint } from './temp-point';

/**
 */
export class ElmtEditForm {
    isoThermal?: boolean;
    isoTemp?: number;
    elementId?: number;
    elmt?: ProductElmt;
    tempPoints?: TempPoint[];
    tempPositions?: TempPoint[];
    index?: number;
}
