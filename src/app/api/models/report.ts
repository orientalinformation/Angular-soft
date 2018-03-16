/* tslint:disable */
import { ProductElmt } from './product-elmt';

/**
 */
export class Report {
    PLAN_X?: number;
    ID_REPORT?: number;
    REP_CUSTOMER?: number;
    PROD_LIST?: number;
    PROD_TEMP?: number;
    PROD_3D?: number;
    PACKING?: number;
    EQUIP_LIST?: number;
    EQUIP_PARAM?: number;
    PIPELINE?: number;
    ASSES_TERMAL?: number;
    ASSES_CONSUMP?: number;
    ASSES_ECO?: number;
    ASSES_TR?: number;
    ASSES_TR_MIN?: number;
    ASSES_TR_MAX?: number;
    SIZING_TR?: number;
    SIZING_TR_MIN?: number;
    SIZING_TR_MAX?: number;
    SIZING_VALUES?: number;
    SIZING_GRAPHE?: number;
    SIZING_TEMP_G?: number;
    SIZING_TEMP_V?: number;
    SIZING_TEMP_SAMPLE?: number;
    AXE1_X?: number;
    AXE1_Y?: number;
    AXE2_X?: number;
    AXE2_Z?: number;
    AXE3_Y?: number;
    AXE3_Z?: number;
    ISOCHRONE_G?: number;
    ISOCHRONE_V?: number;
    ISOCHRONE_SAMPLE?: number;
    POINT1_X?: number;
    POINT1_Y?: number;
    POINT1_Z?: number;
    POINT2_X?: number;
    POINT2_Y?: number;
    POINT2_Z?: number;
    POINT3_X?: number;
    POINT3_Y?: number;
    POINT3_Z?: number;
    ISOVALUE_G?: number;
    ISOVALUE_V?: number;
    ISOVALUE_SAMPLE?: number;
    ID_STUDY?: number;
    PLAN_Y?: number;
    PLAN_Z?: number;
    CONTOUR2D_G?: number;
    CONTOUR2D_SAMPLE?: number;
    CONTOUR2D_TEMP_STEP?: number;
    ENTHALPY_V?: number;
    ENTHALPY_G?: number;
    ENTHALPY_SAMPLE?: number;
    DEST_SURNAME?: string;
    DEST_NAME?: string;
    DEST_FUNCTION?: string;
    DEST_COORD?: string;
    PHOTO_PATH?: string;
    CUSTOMER_LOGO?: string;
    CONS_SPECIFIC?: number;
    CONS_OVERALL?: number;
    CONS_TOTAL?: number;
    CONS_HOUR?: number;
    CONS_DAY?: number;
    CONS_WEEK?: number;
    CONS_MONTH?: number;
    CONS_YEAR?: number;
    CONS_EQUIP?: number;
    CONS_PIPE?: number;
    CONS_TANK?: number;
    CONTOUR2D_OUTLINE_TIME?: number;
    REPORT_COMMENT?: string;
    WRITER_SURNAME?: string;
    WRITER_NAME?: string;
    WRITER_FUNCTION?: string;
    WRITER_COORD?: string;
    REP_CONS_PIE?: number;
    CONTOUR2D_TEMP_MIN?: number;
    CONTOUR2D_TEMP_MAX?: number;
    consumptionSymbol?: string;
    isSizingValuesChosen?: number;
    isSizingValuesMax?: number;
    isThereCompleteNumericalResults?: string;
    idShape?: number;
    productElmt?: ProductElmt;
    temperatureSymbol?: string;
    refContRep2DTempMinRef?: number;
    refContRep2DTempMaxRef?: number;
    refContRep2DTempStepRef?: number;
    ip?: string;
}
