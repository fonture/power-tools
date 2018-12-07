const initialState =  {
  /* --- simple ---- */
  baseMessage: {},
  buyPowerCostData: {
    method: '年度用电量',
    checkedList: [],
    yearPower: undefined,
    deviationCost: undefined,
    signedPrice: undefined,
    averagePrice: undefined,
    inputYearPower: undefined,
    inputAveragePrice: undefined
  },
  electricityCostData: {
    method: '用电量',
    high: undefined,
    medium: undefined,
    low: undefined,
    yearPower: undefined,
    averagePrice: undefined,
    inputYearPower: undefined,
    inputAveragePrice: undefined
  },
  stepInfo: { current: 0, items: ['基础信息', '第二步', '第三步'] },
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
    regularAndSurplus: '常规+富余电量',
    protocolAndSurplus: '长协+富余电量'
  },
  powerCalc: {
    type: 'singleRegular',
    singleRegular: {
      isMonthlyFill: false,
      yearlyData: {
        powerVolume: {
          name: '预计年度购电量',
          unit: '万千瓦时',
          value: undefined
        },
        hydropowerPrice: {
          name: '签约水电价格',
          unit: '元/千瓦时',
          value: undefined
        },
      },
      monthlyPower: {
        current: 0,
        data: []
      },
      ratio: undefined,
      average: undefined,
    },
    singleProtocol: {
      isMonthlyFill: false,
      yearlyData: {
        powerVolume: {
          name: '预计年度购电量',
          unit: '万千瓦时',
          value: undefined
        },
        hydropowerPrice: {
          name: '签约水电价格',
          unit: '元/千瓦时',
          value: undefined
        },
      },
      monthlyPower: {
        current: 0,
        data: []
      },
      isYearlyParticipate: false,
      isMonthlyParticipate: false,
      ratio: undefined,
      average: undefined,
    },
    regularAndSurplus: {
      isMonthlyFill: false,
      yearlyData: {
        powerVolume: {
          name: '预计年度购电量',
          unit: '万千瓦时',
          value: undefined
        },
        hydropowerPrice: {
          name: '签约水电价格',
          unit: '元/千瓦时',
          value: undefined
        },
        surplusPowerPrice: {
          name: '签约富余电量价格',
          unit: '元/千瓦时',
          value: undefined
        },
      },
      surplus: {
        current: 5,
        data: [],
      },
      monthlyPower:  {
        current: 0,
        data: []
      },
      ratio: undefined,
      average: undefined,
    },
    protocolAndSurplus: {
      isMonthlyFill: false,
      yearlyData: {
        powerVolume: {
          name: '预计年度购电量',
          unit: '万千瓦时',
          value: undefined
        },
        hydropowerPrice: {
          name: '签约水电价格',
          unit: '元/千瓦时',
          value: undefined
        },
        surplusPowerPrice: {
          name: '签约富余电量价格',
          unit: '元/千瓦时',
          value: undefined
        },
      },
      surplus: {
        current: 5,
        data: [],
      },
      monthlyPower:  {
        current: 0,
        data: []
      },
      isYearlyParticipate: false,
      isMonthlyParticipate: false,
      ratio: undefined,
      average: undefined,
    }
  },
/* ---------------------------------------------------------- */

  powerCosts: {}
}
for(let i = 0; i < 12; i++) {
  initialState.powerCalc.singleRegular.monthlyPower.data.push({
    month: i,
    finished: false,
    data: {
      powerVolume: {
        name: '预计购电量',
        unit: '万千瓦时',
        value: undefined
      },
      hydropowerPrice: {
        name: '签约水电价格',
        unit: '元/千瓦时',
        value: undefined
      }
    }
  })
  initialState.powerCalc.singleProtocol.monthlyPower.data.push({
    month: i,
    finished: false,
    data: {
      powerVolume: {
        name: '预计购电量',
        unit: '万千瓦时',
        value: undefined
      },
      hydropowerPrice: {
        name: '签约水电价格',
        unit: '元/千瓦时',
        value: undefined
      }
    }
  })
  initialState.powerCalc.regularAndSurplus.monthlyPower.data.push({
    month: i,
    finished: false,
    data: {
      powerVolume: {
        name: '预计购电量',
        unit: '万千瓦时',
        value: undefined
      },
      hydropowerPrice: {
        name: '签约水电价格',
        unit: '元/千瓦时',
        value: undefined
      },
      surplusPowerVolume: {
        name: '富余电量',
        unit: '万千瓦时',
        value: undefined
      },
      surplusPowerPrice: {
        name: '富余电量价格',
        unit: '元/千瓦时',
        value: undefined
      },
    }
  })
  initialState.powerCalc.protocolAndSurplus.monthlyPower.data.push({
    month: i,
    finished: false,
    data: {
      powerVolume: {
        name: '预计购电量',
        unit: '万千瓦时',
        value: undefined
      },
      hydropowerPrice: {
        name: '签约水电价格',
        unit: '元/千瓦时',
        value: undefined
      },
      surplusPowerVolume: {
        name: '富余电量',
        unit: '万千瓦时',
        value: undefined
      },
      surplusPowerPrice: {
        name: '富余电量价格',
        unit: '元/千瓦时',
        value: undefined
      },
    }
  })
}

for(let j = 5; j < 10; j++) {
  initialState.powerCalc.regularAndSurplus.surplus.data.push({
    month: j,
    finished: false,
    powerVolume: undefined,
  })
  initialState.powerCalc.protocolAndSurplus.surplus.data.push({
    month: j,
    finished: false,
    powerVolume: undefined,
  })
}

export default initialState;
