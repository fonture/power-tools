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
  /* --- higher step-3 --- */
  tradingVariety: [
    {
      name: '单一常规',
    },
    {
      name: '单一长协',
    },
    {
      name: '常规+富余电量',
    },
    {
      name: '长协+富余电量',
    },
  ],
  powerCosts: {}
}

export default initialState;
