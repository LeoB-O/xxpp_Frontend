const order = {
  state: {
    newOrderNum: 0,
    autoAccept: true
  },
  mutations: {
    NEW_ORDER: state => {
      state.newOrderNum += 1
    },
    NO_AUTO_ACCEPT: state => {
      state.autoAccept = false
    },
    AUTO_ACCPET: state => {
      state.autoAccept = true
    },
    CHANGE_AUTO_ACCEPT: (state, isAuto) => {
      state.autoAccept = isAuto
    },
    SET_NEW_ORDER_NUM: (state, num) => {
      state.newOrderNum = num
    }
  }
}

export default order
