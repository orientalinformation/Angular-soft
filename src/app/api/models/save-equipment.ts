/* tslint:disable */
import { Ramps } from './ramps';
import { Shelves } from './shelves';
import { Consumptions } from './consumptions';

/**
 */
export class SaveEquipment {
    NB_TS?: number;
    ID_EQUIP?: number;
    EQUIP_VERSION?: number;
    EQUIP_RELEASE?: number;
    EQUIP_COMMENT?: string;
    EQP_LENGTH?: number;
    EQP_WIDTH?: number;
    EQP_HEIGHT?: number;
    NB_TR?: number;
    EQUIP_NAME?: string;
    NB_VC?: number;
    MAX_FLOW_RATE?: number;
    TMP_REGUL_MIN?: number;
    MAX_NOZZLES_BY_RAMP?: number;
    MAX_RAMPS?: number;
    Ramps?: Ramps[];
    Shelves?: Shelves[];
    Consumptions?: Consumptions[];
}
