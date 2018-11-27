/* tslint:disable */
import { Product } from './product';
import { ProductElmt } from './product-elmt';
import { ViewFamily } from './view-family';

/**
 */
export class ViewProduct {
    product?: Product;
    elements?: ProductElmt[];
    specificDimension?: number;
    compFamily?: ViewFamily;
    subFamily?: ViewFamily;
    waterPercentList?: number[];
    isAddComponentAllowed?: boolean;
}
