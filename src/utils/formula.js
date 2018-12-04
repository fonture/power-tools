/*
*   火电价格： firePrice
*   基金： collectionFund
*   输配电价： transmissionPrice
*   水电价格： waterPrice
*/
import { keepDecimal, deepExtract } from './index';


// 购电均价
export function getAvPriceOfElePur(waterPrice, firePrice, transmissionPrice, collectionFund) {
    let res = waterPrice * 0.7 + firePrice * 0.3 + transmissionPrice + collectionFund
    return keepDecimal(res, 5)
}
// 未参与市场
/**
   * @description 未参与市场，用电
   */
export class noMart {
    /**
     * @description 未参与市场 基金计算  对象包含值
     * @param {string} prce 平水期峰段目录电价
     * @param {string} scale
     *
     *
     *
     */
    buyCost = (args) => {
        const { } = args;
    }
}
// 参与市场
export class haveMart {
    /**
     * @description 未参与市场 基金计算  对象包含值
     * @param {string} prce 平水期峰段目录电价
     */
    buyCost = () => {

    }
}
// 全水电均价
export function getAllWaterAvPriceOfElePur(waterPrice, transmissionPrice, collectionFund) {
    let res = waterPrice + transmissionPrice + collectionFund
    return keepDecimal(res, 5)
}


/**
 * @author ouyangdc
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
export function powerAveragePriceOfJoin(firePrice, transmissionPrice, collectionFund, yearPower = 0, deviationCost = 0, signedPrice = 0, isJoin) {
    // AtInput返回的是字符串型的，因此要将输入的内容转为数值型
    yearPower = +yearPower
    deviationCost = +deviationCost
    signedPrice = +signedPrice

    // 如果年度用电量是0，不能做除数，直接结束计算
    if (!yearPower) return

    // 界面上输入的电量单位是“万千瓦时”，而价格的单位是“元/千瓦时”，因此计算均价时要将电量扩大10000
    yearPower *= 10000
    let price = 0
    if (isJoin) {
        price = signedPrice + transmissionPrice + deviationCost / yearPower + collectionFund
    } else {
        price = signedPrice * 0.7 + firePrice * 0.3 + deviationCost / yearPower + transmissionPrice + collectionFund
    }
    return keepDecimal(price, 5)
}


/**
 * @author ouyangdc
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
export function powerAveragePriceOfNotJoin(high = 0, medium = 0, low = 0, highPrice, mediumPrice, lowPrice, collectionFund) {
    // AtInput返回的是字符串型的，因此要将输入的内容转为数值型
    high = +high
    medium = +medium
    low = +low

    // 计算年度用电量
    let yearPower = high + medium + low

    // 如果年度用电量为0，则不需要进行后续的计算操作
    if (!yearPower) return { yearPower: undefined, averagePrice: undefined }
    let averagePrice = ((high * highPrice + medium * mediumPrice + low * lowPrice) / yearPower + collectionFund)

    // 保留指定的小数位
    averagePrice = keepDecimal(averagePrice, 5)
    yearPower = keepDecimal(yearPower, 4)
    return { yearPower, averagePrice }
}

/**
 * @author ouyangdc
 * @description 计算高级版的年度用电量和用电均价
 * @param {Array} data 每个月的数据组成的数组
 * @param {Array} yearCataloguePriceMap 每个月对应的基金和峰平谷电价
 * @param {Number} collectionFund 基金
 */
export function computePowerOfHigh(data, yearCataloguePriceMap) {
    let averagePrice = 0, price = 0, yearPower = 0, highYearPower = 0, mediumYearPower = 0, lowYearPower = 0
    data.forEach((item, index) => {
        const { collectionFund, cataloguePriceVoMap: { peak, plain, valley } } = yearCataloguePriceMap[index + 1]
        let { high, medium, low, finished } = item
        if (finished) {
            high = high === '' ? 0 : +high
            medium = medium === '' ? 0 : +medium
            low = low === '' ? 0 : +low
            highYearPower += high
            mediumYearPower += medium
            lowYearPower += low
            price += (peak.price + collectionFund) * high + (plain.price + collectionFund) * medium + (valley.price + collectionFund) * low
        }
    })
    yearPower = keepDecimal(highYearPower + mediumYearPower + lowYearPower, 4)
    averagePrice = yearPower === 0 || yearPower === '' ? '' : keepDecimal(price / yearPower, 5)
    return { averagePrice, yearPower, highYearPower, mediumYearPower, lowYearPower }
}


/**
 *
 * @description 高级版 年度一口价 购电均价计算
 * @export
 * @param {*} waterPrice 水电
 * @param {*} firePrice 火电
 * @param {*} transmissionPrice 输配电价
 * @param {*} collectionFund 基金
 * @param {*} yearPower 年度购电量
 * @param {*} [surplusaPowerList=[]] 月度富余电量数组
 * @param {*} surplusaPrice 富余电量电价
 * @returns
 */
export function computeAvPrcieByYearOfHigh(waterPrice, firePrice, transmissionPrice=[], collectionFund, yearPower, surplusaPowerList = [], surplusaPrice) {
    yearPower = yearPower * 10000;
    let a = (waterPrice * 0.7 + firePrice * 0.3 + transmissionPrice[0] + collectionFund) * yearPower;
    let b = surplusaPowerList.reduce((prev, item, index) => {
        return prev + item * ((+surplusaPrice) + transmissionPrice[1] + collectionFund) * 10000
    }, 0)
    let c = surplusaPowerList.reduce((prev, item) => {
        return prev + item * 10000
    }, yearPower)
    let res = (a + b) / c;
    return keepDecimal(res, 5);
}

/**
 *
 * @description 高级版 年度一口价 全水电购电均价计算
 * @export
 * @param {*} waterPrice 水电
 * @param {*} transmissionPrice 输配电价
 * @param {*} collectionFund 基金
 * @param {*} yearPower 年度购电量
 * @param {*} [surplusaPowerList=[]] 月度富余电量数组
 * @param {*} surplusaPrice 富余电量电价
 * @returns
 */
export function computeAvPrcieByYearAllWaterOfHigh(waterPrice, transmissionPrice=[], collectionFund, yearPower, surplusaPowerList = [], surplusaPrice) {
    yearPower = yearPower * 10000;
    console.log(typeof waterPrice , typeof transmissionPrice[0] , typeof collectionFund, typeof yearPower);
    let a = ( +waterPrice + transmissionPrice[0] + collectionFund) * yearPower;
    let b = surplusaPowerList.reduce((prev, item, index) => {
        return prev + item * (+(surplusaPrice) + transmissionPrice[1] + collectionFund) * 10000
    }, 0)
    let c = surplusaPowerList.reduce((prev, item) => {
        return prev + item * 10000
    }, yearPower)
    console.log(a, b, c);
    let res = (a + b) / c;
    return keepDecimal(res, 5);
}

/**
 *
 * @description 高级版 分月 购电均价计算
 * @export
 * @param {*} firePrice 火电
 * @param {*} transmissionPrice 输配电价
 * @param {*} collectionFund 基金
 * @param {*} [monthlyPower=[]] 月度购电量数组
 * @returns
 */
export function computeAvPrcieByMonthOfHigh(firePrice = 1, transmissionPrice=[], collectionFund =[], monthlyPower = []) {
    let a = monthlyPower.reduce((prev, item, index) => {
        const { powerVolume:_powerVolume = {}, hydropowerPrice:_hydropowerPrice= {}, surplusPowerVolume:_surplusPowerVolume={}, surplusPowerPrice:_surplusPowerPrice= {} } = item
        const [ {value: powerVolume = 0}, {value: hydropowerPrice = 0}, {value: surplusPowerVolume = 0} , {value: surplusPowerPrice = 0} ]= [_powerVolume , _hydropowerPrice, _surplusPowerVolume, _surplusPowerPrice];
        let b = (hydropowerPrice * 0.7 + firePrice * 0.3 + transmissionPrice[0][index] + collectionFund[index]) * powerVolume * 10000;
        let c = surplusPowerVolume * 10000 * ((+surplusPowerPrice) + transmissionPrice[1][index] + collectionFund[index])
        return prev + (b + c)
    }, 0)
    let d = monthlyPower.reduce((prev, item, index) => {
      const { powerVolume:_powerVolume = {}, surplusPowerVolume:_surplusPowerVolume={} } = item
      const [{value: powerVolume = 0}, {value: surplusPowerVolume = 0} ] = [_powerVolume, _surplusPowerVolume];
        return prev + powerVolume * 10000 + surplusPowerVolume * 10000
    }, 0)
    console.log(a,d);
    let res = a / d;
    return keepDecimal(res, 5);
}


/**
 *
 * @description 高级版 分月 全水电购电均价计算
 * @export
 * @param {*} transmissionPrice 输配电价
 * @param {*} collectionFund 基金
 * @param {*} [monthlyPower=[]] 月度购电量数组
 * @returns
 */
export function computeAvPrcieByMonthAllWaterOfHigh(transmissionPrice = [], collectionFund=[], monthlyPower = []) {
    let a = monthlyPower.reduce((prev, item, index) => {
        const { powerVolume:_powerVolume = {}, hydropowerPrice:_hydropowerPrice= {}, surplusPowerVolume:_surplusPowerVolume={}, surplusPowerPrice:_surplusPowerPrice= {} } = item
        const [ {value: powerVolume = 0}, {value: hydropowerPrice = 0}, {value: surplusPowerVolume = 0} , {value: surplusPowerPrice = 0} ]= [_powerVolume , _hydropowerPrice, _surplusPowerVolume, _surplusPowerPrice];
        let b = ((+hydropowerPrice) + transmissionPrice[0][index] + collectionFund[index]) * (+powerVolume) * 10000;
        let c = surplusPowerVolume * 10000 * ((+surplusPowerPrice) + transmissionPrice[1][index] + collectionFund[index])
        return prev + (b + c)
    }, 0)
    let d = monthlyPower.reduce((prev, item, index) => {
      const { powerVolume:_powerVolume = {}, surplusPowerVolume:_surplusPowerVolume={} } = item
      const [{value: powerVolume = 0}, {value: surplusPowerVolume = 0} ] = [_powerVolume, _surplusPowerVolume];
      return prev + powerVolume * 10000 + surplusPowerVolume * 10000
    }, 0)
    console.log(a, d);
    let res = a / d;
    return keepDecimal(res, 5);
}

export function extractDryAndHighData({ data }) {
    const extra = (prop) => ({ data }) => deepExtract(data, `${prop}.value`);

    const dry = data.filter((_, index) => {
        return (index >= 0 && index <= 3) || index == 11
    }).map(extra('powerVolume'))

    const high = data.filter((_, index) => {
        return index >= 5 && index <= 9
    }).map(extra('powerVolume'))

    return [dry, high]
}

/**
 *
 * @description 高级版 step3 丰枯比
 * @export
 * @param {Array} data [[dry], [high]]
 * @returns
 */
export function gethighDryProportion(data) {
    const [dry, high] = data;
    let dryPower = dry.reduce((prev, item = 0) => {
        return prev + (+item)
    }, 0)
    let highPower = high.reduce((prev, item = 0) => {
        return prev + (+item)
    }, 0)
    return (
        dryPower === 0
            ? '--'
            : highPower === 0
                ? 0
                : keepDecimal(highPower / dryPower, 2)
    )
}

export function getKvalue(plain, drain) {
    let a = 288 * (2 / 12 - plain);
    let b = 288 * (1 + 0.245) * (5 / 12 - drain);
    return keepDecimal((a + b), 2);
}
