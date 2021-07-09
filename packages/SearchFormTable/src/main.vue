<template>
  <div class="search-form-table-container">
    <div v-if="searchForm.length" class="form-card">
      <div 
        ref="box" 
        class="form-container" 
        :class="{'show-arrow': arrowSwitch && showArrow, 'collapse': collapse}"
        :style="{'--h': sizeH - 10 + 'px' }">
        <el-form :model="query" inline :size="uiSize" :label-width="labelWidth" @submit.native.prevent>
          <el-form-item v-for="(item, index) in searchForm" :key="index" :label="item.label" :prop="item.key">
            <template v-if="item.labelInfo" slot="label">
              <el-tooltip
                effect="dark"
                :content="item.labelInfo"
                placement="top">
                <span>{{ item.label }}<i class="el-icon-info" style="margin-left: 4px;"></i></span>
              </el-tooltip>
            </template>
            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'input'" v-model="query[item.key]"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
              @keyup.enter.native="enterInput"
              clearable>
            </el-input>
            <!-- 下拉选择 -->
            <el-select
              v-if="item.type === 'select'"
              v-model="query[item.key]"
              :disabled="item.disabled"
              :filterable="item.filterable"
              :multiple="item.multiple"
              clearable>
              <el-option
                v-for="option in item.options"
                :key="option[item.valueKey || 'value']"
                :label="option[item.labelKey || 'label']"
                :value="option[item.valueKey || 'value']"
              ></el-option>
            </el-select>
            <!-- 单选框 -->
            <el-radio-group
              v-if="item.type === 'radio'"
              v-model="query[item.key]">
              <el-radio
                v-for="option in item.options"
                :key="option.label"
                :label="option.label"
              >{{ option.title }}</el-radio>
            </el-radio-group>
            <!-- 日期 -->
            <el-date-picker
              v-if="item.type === 'date'"
              type="date"
              v-model="query[item.key]"
              :placeholder="item.placeholder || '请选择'"
              :value-format="item.valueFormat || 'timestamp'"
              :format="item.format || 'yyyy-MM-dd'">
            </el-date-picker>
            <!-- 日期范围 -->
            <el-date-picker
              v-if="item.type === 'daterange'"
              type="daterange"
              v-model="query[item.key]"
              unlink-panels
              :value-format="item.valueFormat || 'timestamp'"
              :format="item.format || 'yyyy-MM-dd'"
              :start-placeholder="item.startPlaceholder || '开始'"
              :end-placeholder="item.endPlaceholder || '结束'"
              :picker-options="item.pickerOptions">
            </el-date-picker>
            <!-- checkbox -->
            <el-checkbox
              v-if="item.type === 'checkbox'"
              v-model="query[item.key]"
              :true-label="item.trueLabel"
              :false-label="item.falseLabel"
            >{{ item.text }}</el-checkbox>
            <!-- 级联选择器 -->
            <el-cascader
              v-if="item.type === 'cascader'"
              v-model="query[item.key]"
              :disabled="item.disabled"
              :options="item.options"
              :props="item.props"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="arrowSwitch && showArrow" class="arrow-container">
        <i :class="collapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="onCollapse"></i>
      </div>
    </div>
    <div class="button-wrapper">
      <el-button-group v-if="searchForm.length" style="margin-right: 10px;">
        <el-button :size="uiSize" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button :size="uiSize" type="danger" icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </el-button-group>
      <slot name="button" />
    </div>
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="loading"
      :data="data"
      :max-height="maxHeight"
      ref="table"
      :size="uiSize"
      style="margin: 10px 0;">
      <slot />
    </el-table>
    <el-pagination
      v-if="!hidePagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query[pageIndexKey]"
      :page-size="query[pageSizeKey]"
      :total="total || query.total"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import {
  cloneDeep,
  throttle
} from '../../utils'

export default {
  name: 'SearchFormTable',

  inheritAttrs: false,

  props: {
    // 查询条件参数，key值要与searchForm的key对应
    value: {
      type: Object,
      required: true
    },
    // 查询表单配置项
    searchForm: {
      type: Array,
      default: () => []
    },
    // 页码key
    pageIndexKey: {
      type: String,
      default: 'pageIndex'
    },
    // 页数key
    pageSizeKey: {
      type: String,
      default: 'pageSize'
    },
    // 可选的页数
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    },
    // 总数
    total: {
      type: Number,
      default: 0
    },
    // 是否显示折叠箭头
    arrowSwitch:{
      type: Boolean,
      default: true
    },
    // 是否隐藏分页
    hidePagination: {
      type: Boolean,
      default: false
    },
    // loading
    loading: {
      type: Boolean,
      default: false
    },
    // 是否开启表格高度自适应
    enableTableHeight: {
      type: Boolean,
      default: true
    },
    // 表格底部距离
    bottomOffset: {
      type: Number,
      default: 60
    },
    // 列表数据
    data: {
      type: Array,
      default: () => []
    },
    // form label宽度
    labelWidth: {
      type: String,
      default: ''
    },
    uiSize: {
      default: ''
    }
  },

  data() {
    return {
      query: this.value,
      temp: null,
      showArrow: false, // 是否要显示折叠箭头
      collapse: true, // 折叠状态
      maxHeight: 300, // 默认高度
      sizeH: 0
    }
  },

  mounted() {
    this.temp = cloneDeep(this.value)
    this.renderArrow()
    this.renderTableHeigth()
    this.addResize()
  },

  methods: {
    renderArrow() {
      if (this.searchForm.length > 0) {
        this.$nextTick(() => {
          // console.log(this.$refs['box'].offsetHeight)
          const h = this.$refs['box'].offsetHeight
          const sizeH = {
            mini: 48,
            small: 50,
            medium: 56
          }
          this.sizeH = sizeH[this.uiSize] || 60
          this.showArrow = h >= this.sizeH
        })
      }
    },

    renderTableHeigth() {
      if (this.enableTableHeight) {
        this.$watch('data', () => {
          this.$nextTick(() => {
            // 计算列表高度并设置
            const topOffset = this.$refs['table'].$el.getBoundingClientRect().top
            const height = window.innerHeight - topOffset - this.bottomOffset
            this.maxHeight = height
          })
        }, { deep: true, immediate: true })
      }
    },

    addResize() {
      window.addEventListener('resize', this.handleResize, true)
      this.$once('hook:beforeDestroy', () => {
        // console.log('beforeDestroy')
        window.removeEventListener('resize', this.handleResize, true)
      })
      this.$on('hook:activated', () => {
        // console.log('activated')
        window.addEventListener('resize', this.handleResize, true)
      })
      this.$on('hook:deactivated', () => {
        // console.log('deactivated')
        window.removeEventListener('resize', this.handleResize, true)
      })
    },

    handleResize: throttle(function() {
      console.log('resize')
      this.renderArrow()
      this.renderTableHeigth()
    }, 500),

    onReset() {
      this.query = cloneDeep(this.temp)
      this.search(true)
    },

    onSearch() {
      this.query[this.pageIndexKey] = 1
      this.search()
    },
 
    search(isReset = false) {
      this.$emit('input', this.query)
      this.$emit('search', { isReset })
    },

    handleSizeChange(val) {
      this.query[this.pageIndexKey] = 1
      this.query[this.pageSizeKey] = val
      this.search()
    },

    handleCurrentChange(val) {
      this.query[this.pageIndexKey] = val
      this.search()
    },

    enterInput(val) {
      this.query[this.pageIndexKey] = 1
      this.search()
    },

    // onClearInput() {
    //   this.query[this.pageIndexKey] = 1
    //   this.search()
    // },
    
    onCollapse() {
      this.collapse = !this.collapse
      this.$emit('collapse')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form-table-container {
  .form-card {
    background-color: #ffffff;
    padding: 10px;
    position: relative;
  }
  .form-container {
    display: flex;
    justify-content: space-between;
    .el-form-item {
      margin-right: 20px;
      margin-bottom: 0;
      .el-radio {
        margin-right: 10px;
      }
    }
    &.show-arrow {
      max-height: var(--h);
      overflow-y: hidden;
      .el-form-item {
        margin-bottom: 10px;
      }
      &.collapse {
        max-height: none;
        overflow-y: auto !important;
      }
    }
  }
  .arrow-container {
    text-align: center;
    line-height: 1;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    i {
      cursor: pointer;
    }
  }
  .button-wrapper {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
