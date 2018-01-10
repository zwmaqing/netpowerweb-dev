// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui';
// import {
//   Range
// } from 'mint-ui';

// Vue.component(Range.name, Range);

// import Mint from 'mint-ui';
// Vue.use(Mint);

import 'element-ui/lib/theme-chalk/index.css';

import {
  // Pagination,
  Dialog,
  // Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  // Breadcrumb,
  // BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  // Upload,
  Progress,
  Badge,
  // Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  // CarouselItem,
  Collapse,
  CollapseItem,
  // Cascader,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui'

// Vue.use(Pagination)
Vue.use(Dialog)
// Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
// Vue.use(Upload)
Vue.use(Progress)
Vue.use(Badge)
// Vue.use(Card)
// Vue.use(Rate)
// Vue.use(Steps)
// Vue.use(Step)
// Vue.use(Carousel)
//  Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
// Vue.use(Cascader)
// Vue.use(ColorPicker)
//  Vue.use(Container)
// Vue.use(Header)
// Vue.use(Aside)
// Vue.use(Main)
// Vue.use(Footer)
Vue.use(Loading)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

Vue.config.productionTip = false

import {
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'

/* eslint-disable no-new */
var winSize = function () {
  var e = window,
    a = 'inner';

  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  };
};

// 格式为 yyyy-MM-dd hh:mm:ss
Date.prototype.format = function (format) {
  var args = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
    var n = args[i];
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
};

Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}


// v-loadmore: 用于在element-ui的select下拉框加上滚动到底事件监听vscrollbar
Vue.directive('vscrollbar', {
  bind(el, binding, vnode) {
    // 获取element-ui定义好的scroll盒子
    // console.log(el);
    let SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
    if (SELECTWRAP_DOM == null) {
      SELECTWRAP_DOM = el;
    }
    // console.log(SELECTWRAP_DOM);
    SELECTWRAP_DOM.addEventListener('scroll', function () {

      /*
       * scrollHeight 获取元素内容高度(只读)
       * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
       * clientHeight 读取元素的可见高度(只读)
       * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
       * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
       */

      // const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) &&
      //this.scrollTop > sign) 
      // 注意: && this.scrollTop
      //console.log("scrollHeight:" + this.scrollHeight + " clientHeight：" + this.clientHeight + " scrollTop:" + this.scrollTop);
      if (this.scrollTop == 0) {
        // console.log('到顶了')
        binding.value('Top');
      }
      if (this.scrollTop == (this.scrollHeight - this.clientHeight)) {
        // console.log('到底了')
        binding.value('Bottom');
      }
      // if (this.scrollTop > sign) {
      //     sign = this.scrollTop;
      //     console.log('向下')
      // }
      // if (this.scrollTop < sign) {
      //     sign = this.scrollTop;
      //     console.log('向上')
      // }
      // console.log(CONDITION)
      // if (CONDITION) {
      //     binding.value();
      // }
    });
  }
});

function vueTouch(el, binding, type) {
  var _this = this;
  this.obj = el;
  this.binding = binding;
  this.touchType = type;
  this.vueTouches = {
    x: 0,
    y: 0
  };
  this.vueMoves = true;
  this.vueLeave = true;
  this.longTouch = true;
  this.vueCallBack = typeof (binding.value) == "object" ? binding.value.fn : binding.value;
  this.obj.addEventListener("touchstart", function (e) {
    _this.start(e);
  }, false);
  this.obj.addEventListener("touchend", function (e) {
    _this.end(e);
  }, false);
  this.obj.addEventListener("touchmove", function (e) {
    _this.move(e);
  }, false);
};
vueTouch.prototype = {
  start: function (e) {
    this.vueMoves = true;
    this.vueLeave = true;
    this.longTouch = true;
    this.vueTouches = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType == "longtap" && this.vueCallBack(this.binding.value, e);
        this.longTouch = false;
      };
    }.bind(this), 1000);
  },
  end: function (e) {
    var disX = e.changedTouches[0].pageX - this.vueTouches.x;
    var disY = e.changedTouches[0].pageY - this.vueTouches.y;
    clearTimeout(this.time);
    if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
      this.touchType == "swipe" && this.vueCallBack(this.binding.value, e);
      if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 10) {
          this.touchType == "swiperight" && this.vueCallBack(this.binding.value, e);
        };
        if (disX < -10) {
          this.touchType == "swipeleft" && this.vueCallBack(this.binding.value, e);
        };
      } else {
        if (disY > 10) {
          this.touchType == "swipedown" && this.vueCallBack(this.binding.value, e);
        };
        if (disY < -10) {
           // console.log(e)
          this.touchType == "swipeup" && this.vueCallBack(this.binding.value, e);
        };
      };
    } else {
      if (this.longTouch && this.vueMoves) {
        this.touchType == "tap" && this.vueCallBack(this.binding.value, e);
        this.vueLeave = false
      };
    };
  },
  move: function (e) {
    this.vueMoves = false;
  }
};
Vue.directive("tap", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "tap");
  }
});
Vue.directive("swipe", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "swipe");
  }
});
Vue.directive("swipeleft", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "swipeleft");
  }
});
Vue.directive("swiperight", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "swiperight");
  }
});
Vue.directive("swipedown", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "swipedown");
  }
});
Vue.directive("swipeup", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "swipeup");
  }
});
Vue.directive("longtap", {
  bind: function (el, binding) {
    new vueTouch(el, binding, "longtap");
  }
});

new Vue({
  el: '#app',
  router,
  store,
  methods: {
    ...mapActions([
      'setWidth', 'setHeight', 'setSys_Width', 'setSys_Height', 'setFastDivHeight'
    ]),
    ...mapMutations(['SET_WIDTH', 'SET_HEIGHT', 'SET_SYS_WIDTH', 'SET_SYS_HEIGHT'])
  },
  mounted() {
    //转存 this，以便于在事件方法调用
    const that = this
    // console.log("system.systemWidth:" + store.state.system.system_Width);
    //启动时设置初始值
    //Global Actions
    // window.resizeTo(winSize().height, (winSize().width + 10));
    // console.log("change:" + winSize().width);
    that.setWidth(winSize().width);
    that.setHeight(winSize().height);
    //modules system Actions
    that.setSys_Width(winSize().width);
    that.setSys_Height(winSize().height);

    //绑定事件方法
    window.onresize = function () {
      return function () {
        console.log('window.onresized');
        //Global Mutations
        that.SET_WIDTH(winSize().width);
        //Global Actions
        that.setHeight(winSize().height);
        //modules system Mutations
        that.SET_SYS_WIDTH(winSize().width);
        that.SET_SYS_HEIGHT(winSize().height);


      }()
    }
  },
  render: h => h(App)
  // template: '<App/>',
  // components: { App }
}).$mount('#app');
