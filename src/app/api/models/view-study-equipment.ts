/* tslint:disable */
import { CalculationParameter } from './calculation-parameter';
import { MinMax } from './min-max';
import { LayoutGeneration } from './layout-generation';

/**
 */
export class ViewStudyEquipment {
    ts?: number[];
    ID_STUDY_EQUIPMENTS?: number;
    ID_EQUIP?: number;
    EQP_LENGTH?: number;
    EQP_WIDTH?: number;
    EQUIP_VERSION?: number;
    ORIENTATION?: number;
    CAPABILITIES?: number;
    displayName?: string;
    TExt?: number;
    dh?: number[];
    tr?: number[];
    EQUIP_NAME?: string;
    vc?: number[];
    alpha?: number[];
    calculation_parameters?: CalculationParameter[];
    ldSetpointmax?: number;
    minMaxTr?: MinMax;
    minMaxTs?: MinMax;
    minMaxVc?: MinMax;
    minMaxAlpha?: MinMax;
    minMaxText?: MinMax;
    top_or_QperBatch?: string;
    layoutGen?: LayoutGeneration;
    layoutResults?: LayoutGeneration;
}
