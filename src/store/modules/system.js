// initial state
import * as types from '../mutation-types'
const state = {
    system_Width: 0,
    system_Height: 0
}

// getters
const getters = {
    system_Width: state => state.system_Width,
    system_Height: state => state.system_Height,
    system_IsMobileDev: state => state.system_Width < 1024
}

const mutations = {
    [types.SET_SYS_WIDTH](state, width) {
        state.system_Width = width
            //console.log("change:" + width)
    },
    [types.SET_SYS_HEIGHT](state, height) {
        state.system_Height = height
    }
}

const actions = {
    setSys_Width({ commit }, width) {
        //console.log("change:" + width)
        commit(types.SET_SYS_WIDTH, width)
    },
    setSys_Height({ commit }, height) {
        //console.log("change:" + height)
        commit(types.SET_SYS_HEIGHT, height)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}