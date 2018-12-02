const initialState =  {
  /* --- simple ---- */
  baseMessage: {},
  buyPowerCostData: {
    method: '年度用电量',
    checkedList: [],
    yearPower: '',
    deviationCost: '',
    signedPrice: '',
    averagePrice: '',
  },
  electricityCostData: {
    method: '用电量',
    high: '',
    medium: '',
    low: '',
    yearPower: '',
    averagePrice: '',
  },
  powerExpect: {},
  powerCostsOfHigh: {
    currMonth:  1,
    monthPowerList: [
      {
        name: '1月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '2月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '3月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '4月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '5月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '6月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '7月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '8月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '9月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '10月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '11月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },{
        name: '12月',
        finished: false,
        high: '',
        medium: '',
        low: ''
      },
    ],
    yearPower: '',
    averagePrice: '',
    highYearPower: '',
    mediumYearPower: '',
    lowYearPower: '',
  },

/* ------------------------------ higher step-3 ------------------------------------ */
  tradingVarieties: {
    singleRegular: '单一常规',
    singleProtocol: '单一长协',
    RegularAndSurplus: '常规+富余电量',
    protocolAndSurplus: '长协+富余电量'
  },
  powerCalc: {
    type: 'singleRegular',
    singleRegular: {
      isMonthlyFill: false,
      yearlyPowerVolume: undefined,
      yearlyHydropowerPrice: undefined,
      monthlyPowerVolume: {
        current: 0,
        // data: [{
        //   month: 0,
        //   finished: true,
        //   powerVolume: undefined,
        //   hydropowerPrice: undefined
        // }]
        data: new Array(12).fill({
          month: 0,
          finished: true,
          powerVolume: undefined,
          hydropowerPrice: undefined
        })
      },
      ratio: undefined,
      average: undefined,
    },
    singleProtocol: {
      isMonthlyFill: false,
      yearlyPowerVolume: undefined,
      yearlyHydropowerPrice: undefined,
      monthlyPowerVolume: {
        current: 0,
        // data: [{
        //   month: 0,
        //   finished: true,
        //   powerVolume: undefined,
        //   hydropowerPrice: undefined,
        // }],
        data: new Array(12).fill({
          month: 0,
          finished: true,
          powerVolume: undefined,
          hydropowerPrice: undefined
        })
      },
      isParticipate: false,
      ratio: undefined,
      average: undefined,
    },
    RegularAndSurplus: {
      isMonthlyFill: false,
      yearlyPowerVolume: undefined,
      yearlyHydropowerPrice: undefined,
      yearlySurplusPowerPrice: undefined,
      Surplus: {
        current: 5,
        data: [{
          month: 5,
          finished: true,
          powerVolume: undefined,
        }],
      },
      monthlyPower:  {
        current: 0,
        // data: [
        //   {
        //     month: 5,
        //     finished: true,
        //     powerVolume: undefined,
        //     hydropowerPrice: undefined,
        //     // 6 -> 10
        //     surplusPowerVolume: undefined,
        //     surplusPowerPrice: undefined,
        //   }
        // ]
        data: new Array(12).fill({
          month: 5,
          finished: true,
          powerVolume: undefined,
          hydropowerPrice: undefined,
          // 6 -> 10
          surplusPowerVolume: undefined,
          surplusPowerPrice: undefined,
        })
      },
      ratio: undefined,
      average: undefined,
    },
    protocolAndSurplus: {
      isMonthlyFill: false,
      yearlyPowerVolume: undefined,
      yearlyHydropowerPrice: undefined,
      yearlySurplusPowerPrice: undefined,
      Surplus: {
        current: 5,
        data: [{
          month: 5,
          finished: true,
          powerVolume: undefined,
        }],
      },
      monthlyPower:  {
        current: 0,
        // data: [
        //   {
        //     month: 5,
        //     finished: true,
        //     powerVolume: undefined,
        //     hydropowerPrice: undefined,
        //     // 6 -> 10
        //     surplusPowerVolume: undefined,
        //     surplusPowerPrice: undefined,
        //   }
        // ]
        data: new Array(12).fill({
          month: 5,
          finished: true,
          powerVolume: undefined,
          hydropowerPrice: undefined,
          // 6 -> 10
          surplusPowerVolume: undefined,
          surplusPowerPrice: undefined,
        })
      },
      isParticipate: false,
      ratio: undefined,
      average: undefined,
    }
  },
/* ---------------------------------------------------------- */

  powerCosts: {}
}



export default initialState;
