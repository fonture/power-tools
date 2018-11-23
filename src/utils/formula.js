/*
*   火电价格： firePrice
*   基金： collectionFund
*   输配电价： transmissionPrice
*   水电价格： waterPrice
*/
import { keepDecimal } from './index';


// 购电均价
export function getAvPriceOfElePur(waterPrice, firePrice, transmissionPrice, collectionFund) {
    let res = waterPrice * 0.7 + firePrice * 0.3 + transmissionPrice + collectionFund
    return keepDecimal(res, 5)
}

// 全水电均价
export function getAllWaterAvPriceOfElePur(waterPrice, transmissionPrice, collectionFund) {
    let res = waterPrice + transmissionPrice + collectionFund
    return keepDecimal(res, 5)
}
