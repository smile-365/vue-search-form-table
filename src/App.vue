<template>
  <div id="app" style="padding: 20px;">
    <search-form-table
      v-model="query"
      :search-form="searchForm"
      :data="tableData"
      :total="total"
      @search="fetchData"
      :loading="loading"
      border>
      <el-button-group slot="button">
        <el-button type="success">新增</el-button>
        <el-button type="success">批量导出</el-button>
      </el-button-group>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="订单号" prop="orderNo"></el-table-column>
      <el-table-column label="创建人" prop="name"></el-table-column>
      <el-table-column label="创建时间" prop="createDate"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
    </search-form-table>
  </div>
</template>

<script>

export default {
  name: 'App',

  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
        orderNo: '',
        status: null,
        createDate: null
      },
      searchForm: [
        {
          label: '订单号',
          type: 'input',
          key: 'orderNo',
          labelInfo: '这是订单号的输入框'
        },
        {
          label: '状态',
          type: 'select',
          key: 'status',
          options: [
            { label: '待发货', value: 0 },
            { label: '已发货', value: 1 },
            { label: '已收货', value: 2 }
          ],
          filterable: true
        },
        {
          label: '创建时间',
          type: 'date',
          key: 'createDate'
        }
      ]
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.loading = true
      setTimeout(() => {
        this.tableData = [
          { id: '1', orderNo: '62642477247478', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '2', orderNo: '626424772474781', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '3', orderNo: '626424772474782', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '4', orderNo: '626424772474783', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '5', orderNo: '626424772474784', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '6', orderNo: '626424772474785', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '7', orderNo: '626424772474786', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '8', orderNo: '626424772474787', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '9', orderNo: '6264247724747866', status: 0, name: '张三', createDate: '2021-04-05 12:49' },
          { id: '10', orderNo: '6264247724747834', status: 0, name: '张三', createDate: '2021-04-05 12:49' }
        ]
        this.total = 100
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  background-color: #ddd;
}
div {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
}

body,
p,
div {
  padding: 0;
  margin: 0
}
</style>
