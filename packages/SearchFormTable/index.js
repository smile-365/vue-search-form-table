import Vue from 'vue'
import SearchFormTable from './src/main.vue'
import { 
  Table,
  ButtonGroup,
  Button,
  Pagination,
  Form,
  FormItem,
  Tooltip,
  Input,
  Select,
  Option,
  RadioGroup,
  Radio,
  DatePicker,
  Checkbox,
  Cascader,
  Loading
} from 'element-ui'
Vue.use(Table)
Vue.use(ButtonGroup)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Checkbox)
Vue.use(Loading)

SearchFormTable.install = (v) => {
  v.component(SearchFormTable.name, SearchFormTable)
}

export default SearchFormTable