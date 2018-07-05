/* tslint:disable */
import { CalculationParameter } from './calculation-parameter';
import { MinMax } from './min-max';
import { LayoutGeneration } from './layout-generation';
import { layoutResults } from './layout-results';

/**
 */
export class ViewStudyEquipment {
    dh?: number[];
    ID_STUDY_EQUIPMENTS?: number;
    EQUIP_NAME?: string;
    ID_EQUIP?: number;
    EQP_LENGTH?: number;
    EQP_WIDTH?: number;
    EQUIP_VERSION?: number;
    ORIENTATION?: number;
    CAPABILITIES?: number;
    BRAIN_TYPE?: number;
    EQUIP_STATUS?: number;
    RUN_CALCULATE?: number;
    displayName?: string;
    TExt?: number;
    ID_EQUIPSERIES?: number;
    tr?: number[];
    ts?: number[];
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
    layoutResults?: layoutResults;
}
