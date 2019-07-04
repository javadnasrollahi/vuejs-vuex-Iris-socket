import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
Vue.use(Vuex)


export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins:[IriSocket]
})



async function IriSocket(store){
  var config = {
    Connection:WsProtc+BaseURL,
    Path:"/socket",
    actionPrefix: 'A_SOCKET_',
    mutationPrefix: 'M_SOCKET_',
  }
  console.log("store",store,"config",config)
  Vue.set(store.state,"socketState",false)
  await Vue.set(store.state,"socket",new Ws(config.Connection + config.Path))
  store.state.socket.OnConnect(() => {
    store.state.socketState = true
  });
  Object.keys(store._mutations).forEach(key=>{
    if(config.mutationPrefix != null && config.mutationPrefix != undefined && key.startsWith(config.mutationPrefix)){
      store.state.socket.On(key.slice(config.mutationPrefix.length,key.length),msg => store.commit(key,msg))
    }

  })
  Object.keys(store._actions).forEach(key=>{

    if (config.actionPrefix != null && config.actionPrefix != undefined && key.startsWith(config.actionPrefix)){
      store.state.socket.On(key.slice(config.actionPrefix.length,key.length),msg => store.commit(key,msg))
    }

  })


}
