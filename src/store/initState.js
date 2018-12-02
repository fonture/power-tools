const initialState =  {
  /* --- higher step-3 --- */
  tradingVarieties: [
    {
      value: 'singleRegular',
      name: '单一常规',
    },
    {
      value: 'singleProtocol',
      name: '单一长协',
    },
    {
      value: 'RegularAndSurplus',
      name: '常规+富余电量',
    },
    {
      value: 'protocolAndSurplus',
      name: '长协+富余电量',
    },
  ],
  powerCalc: {
    type: 'singleRegular',
    singleRegular: {
      isMonthlyFill: false,
      yearlyPowerVolume: undefined,
      yearlyHydropowerPrice: undefined,
      monthlyPowerVolume: {
        current: 0,
        data: [{
          month: 0,
          powerVolume: undefined,
          hydropowerPrice: undefined
        }]
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
        data: [{
          month: 0,
          powerVolume: undefined,
          hydropowerPrice: undefined,
        }],
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
          powerVolume: undefined,
        }],
      },
      monthlyPower:  {
        current: 0,
        data: [
          {
            month: 5,
            current: true,
            powerVolume: undefined,
            hydropowerPrice: undefined,
            // 6 -> 10
            surplusPowerVolume: undefined,
            surplusPowerPrice: undefined,
          }
        ]
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
          powerVolume: undefined,
        }],
      },
      monthlyPower:  {
        current: 0,
        data: [
          {
            month: 5,
            current: true,
            powerVolume: undefined,
            hydropowerPrice: undefined,
            // 6 -> 10
            surplusPowerVolume: undefined,
            surplusPowerPrice: undefined,
          }
        ]
      },
      isParticipate: false,
      ratio: undefined,
      average: undefined,
    }
  }
}

export default initialState;
