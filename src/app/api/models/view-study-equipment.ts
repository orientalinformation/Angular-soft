/* tslint:disable */
import { LayoutGeneration } from './layout-generation';

/**
 */
export class ViewStudyEquipment {
    TExt?: number;
    ID_STUDY_EQUIPMENTS?: number;
    ID_EQUIP?: number;
    EQP_LENGTH?: number;
    EQP_WIDTH?: number;
    EQUIP_VERSION?: number;
    ORIENTATION?: number;
    displayName?: string;
    EQUIP_NAME?: string;
    dh?: number[];
    tr?: number[];
    ts?: number[];
    vc?: number[];
    top_or_QperBatch?: string;
    layoutGen?: LayoutGeneration;
    layoutResults?: LayoutGeneration;
}
