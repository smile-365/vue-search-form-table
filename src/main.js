import Vue from 'vue'
import App from './App'
import SearchFormTable from '../packages'
import Element from 'element-ui'

Vue.use(Element)
Vue.use(SearchFormTable)
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
