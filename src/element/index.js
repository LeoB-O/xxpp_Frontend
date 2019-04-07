import {
  Select,
  Option,
  OptionGroup,
  Input,
  Tree,
  Dialog,
  Row,
  Col,
  Button,
  FormItem,
  Form,
  Table,
  TableColumn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Submenu,
  Menu,
  MenuItem,
  InputNumber,
  Upload,
  Switch,
  TimePicker,
  DatePicker
} from 'element-ui'

const element = {
  install: function (Vue) {
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(OptionGroup)
    Vue.use(Input)
    Vue.use(Tree)
    Vue.use(Dialog)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Button)
    Vue.use(FormItem)
    Vue.use(Form)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Dropdown)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(Badge)
    Vue.use(Breadcrumb)
    Vue.use(BreadcrumbItem)
    Vue.use(Menu)
    Vue.use(MenuItem)
    Vue.use(Submenu)
    Vue.use(InputNumber)
    Vue.use(Upload)
    Vue.use(Switch)
    Vue.use(TimePicker)
    Vue.use(DatePicker)
  }
}
export default element
