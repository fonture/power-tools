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


/**
 * @description 参与市场时购电均价计算
 * @export 购电均价
 * @param {Float} firePrice 火电价格
 * @param {Float} transmissionPrice 输配电价
 * @param {Float} collectionFund 基金
 * @param {Float} yearPower 年度用电量
 * @param {Float} deviationCost 年度偏差考核费用
 * @param {Float} signedPrice 签约水电价格
 * @param {Float} isJoin 是否参与全水电交易品种
 */
export function powerAveragePriceOfJoin(firePrice, transmissionPrice, collectionFund, yearPower, deviationCost, signedPrice, isJoin) {
    if(!yearPower) return
    let price = 0
    if(isJoin) {
        price = signedPrice + transmissionPrice +  deviationCost/yearPower + collectionFund
    } else {
        price = signedPrice * 0.7 + firePrice * 0.3 + deviationCost/yearPower + transmissionPrice + collectionFund
    }
    return keepDecimal(price, 4)
}


/**
 * @description 未参与市场时年度用电量、用电均价的计算
 * @param {Float} high 峰电量
 * @param {Float} medium 平电量
 * @param {Float} low 谷电量
 * @param {Float} highPrice 峰电价
 * @param {Float} mediumPrice 平电价
 * @param {Float} lowPrice 谷电价
 * @param {Float} collectionFund 基金
 * @returns 年度用电量、用电均价
 */
export function powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, collectionFund) {
    const yearPower = high + medium + low
    if(!yearPower) return {}
    let averagePrice = ((high * highPrice + medium * mediumPrice + low * lowPrice) / yearPower + collectionFund)
    averagePrice = keepDecimal(averagePrice, 4)
    return { yearPower, averagePrice }
}
