/* tslint:disable */
import { Equipment } from './equipment';
import { ViewStudyEquipment } from './view-study-equipment';
import { TempExt } from './temp-ext';

/**
 */
export class ViewOperatingSetting {
    equipments?: Equipment;
    studyEquipment?: ViewStudyEquipment;
    resultTempExts?: TempExt;
    changeTr?: boolean;
}
