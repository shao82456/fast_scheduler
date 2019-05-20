<template>
  <section>
    <el-row>
      <div id="chartLine" style="width:100%;height:400px;"></div>
    </el-row>
    <el-row >
      <el-table :data="executions" highlight-current-row v-loading="listLoading"
                :row-style="row_style" style="left: 10%; width: 100%;"  border stripe @row-click="log_link">
        <el-table-column  prop="user" label="用户" width="120"/>
        <el-table-column prop="startTime" label="开始时间" width="240"  sortable/>
        <el-table-column prop="endTime" label="结束时间" width="240"  sortabl/>
        <el-table-column prop="elapsed" label="时间" width="120" sortable/>
        <el-table-column prop="status" label="状态"  :formatter="status_f" width="140" align="center">
          <template slot-scope="scope">
            <div  style="background: #66CD00; font-size: 16px;"  v-show="scope.row.status">success</div>
            <div  style="background: #CD2626; font-size: 16px;"   v-show="(!scope.row.status)">fail</div>
          </template>
        </el-table-column>
        <el-table-column prop="descript" label="描述" width="360"/>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                       :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>

  </section>
</template>

<script>
  import echarts from 'echarts'
  import {getExecutionPage} from '../../api/api';
  export default {
    data() {
      return {
        chartLine: null,
        executions:[],
        total: 0,
        page: 1,
        listLoading: false,
        begins:[]
      }
    },

    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getExecutions();
      },
      drawLineChart() {
        this.chartLine = echarts.init(document.getElementById('chartLine'));
        this.chartLine.setOption(
          {
            title:{
              text:'test_run_cron'+'　近期执行情况'
            },
            grid:{
              left:'10%',
              top:45,
              bottom:45
            },
            xAxis: {
              type: 'category',
              data: this.begins,
            },
            yAxis: {
              type: 'value',
              axisLabel:{
                formatter: function (value) {
                  if(value>3600){
                    var c=value/3600
                    var d=value%3600
                    return c+' h '+d/60+' m '+d%60+' s'
                  }else if(value>60){
                    return value/60+' m '+value%60+' s'
                  }else
                    return value+' s'
                }
              }
            },
            series: [{
              symbol: 'circle',
              symbolSize :8,
              itemStyle : {
                normal : {
                  color:function (params) {
                    if(params.data.status)
                      return '#66CD00'
                    else
                      return '#CD2626'
                  },
                  lineStyle:{
                    color:'#000'
                  }
                }
              },
              data: this.executions,
              type: 'line',
              smooth: true,
            }]
          }
        );
      },
      getExecutions(){
        let para={
          pageNum:this.page
        }
        this.listLoading=true
        getExecutionPage(para).then((res)=>{
          this.total=res.data.total
          this.executions=res.data.executions
          this.listLoading=false

          this.begins=[]
          this.executions.map(e=>{
            this.begins.push(e.startTime.substr(0,10))
          })
          this.drawLineChart()
        })
      },
      status_f(row,index){
        if (row.status)
          return 'success'
        else
          return 'fail'
      },
      row_style({ row, rowIndex }){
          return 'color:#1F1F1F;'
      },
      log_link(){

      }
    },

    mounted: function () {
      this.getExecutions()
    },
  }
</script>

<style>
  .chart-container {
    width: 100%;
    float: left;
  }
  /*.chart div {
      height: 400px;
      float: left;
  }*/

</style>
