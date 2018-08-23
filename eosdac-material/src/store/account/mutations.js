
export const IMPORT_ACCOUNT = (state, payload) => {
  state.info = payload.info
  state.imported = true
  if (payload.scatter) {
    state.useScatter = true
    state.unlocked = true
  } else {
    state.pkeys = payload.keys
  }
}

export const UPDATE_ACCOUNT_INFO = (state, payload) => {
  state.info = payload
}

export const UPDATE_TOKEN_BALANCE = (state, balance) => {
  state.tokenBalance = balance
}

export const UPDATE_MAIN_CURRENCY_BALANCE = (state, balance) => {
  state.mainCurrencyBalance = balance
}

export const LOCK_ACCOUNT = (state) => {
  state.pkeysArray = []
  state.unlocked = false
  state.info = null
}

export const UNLOCK_ACCOUNT = (state, payload) => {
  state.pkeysArray = payload.pkeysArray
  state.unlocked = true
  state.lastUnlock = Math.floor(Date.now() / 1000)
}

export const UNLOCK_ACCOUNT_SCATTER = (state) => {
  state.unlocked = true
  state.lastUnlock = Math.floor(Date.now() / 1000)
}

export const ADD_REGISTRATION = (state, version) => {
  state.registered.version = version
}

export const SET_FIRST_REGISTRATION = (state) => {
  state.firstReg = false
}

export const ADD_MEMBER_TERMS = (state, payload) => {
  let t = payload
  t.lastUpdate = Math.floor(Date.now() / 1000)
  state.registered.memberterms = t
}


export const REMOVE_REGISTRATION = (state) => {
  state.registered.version = null
}

export const ADD_TRANSFER_HISTORY = (state, payload) => {
  state.transferHistory = payload
}

export const RESET_STATE = (state) => {
    Object.assign(state, getDefaultState())
}
