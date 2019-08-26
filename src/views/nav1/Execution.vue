<template>
  <section>
    <el-row>
      <div id="chartLine" style="width:100%;height:400px;"></div>
    </el-row>
    <el-row >
      <el-table :data="executions" highlight-current-row v-loading="listLoading" border stripe>
        <el-table-column label="执行记录" sortable>
          <template slot-scope="props">
            <router-link :to="logpath(props.row.id)" style="text-decoration:none;"><el-link>{{props.row.id}}</el-link></router-link>
          </template>
        </el-table-column>
        <el-table-column  prop="user" label="用户"/>
        <el-table-column prop="beginTime" label="开始时间"   sortable/>
        <el-table-column prop="endTime" label="结束时间" sortabl/>
        <el-table-column prop="value" label="时间"  :formatter="secondsFormatter" sortable/>
        <el-table-column prop="status" label="状态"  align="center">
          <template slot-scope="scope">
            <div  style="background: #66CD00; font-size: 16px;"   v-show="scope.row.status===0">Success</div>
            <div  style="background: #CD2626; font-size: 16px;"   v-show="scope.row.status===1">Fail</div>
            <div  style="background: #20a0ff; font-size: 16px;"   v-show="scope.row.status===2">Running</div>
          </template>
        </el-table-column>
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
        taskId:2,
        taskName:'',
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
              text:this.taskName+'　近期执行情况'
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
                    if(params.data.status==0)
                      return '#66CD00'
                    else if(params.data.status===2)
                      return '#20a0ff'
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
          taskId:this.taskId,
          pageNum:this.page
        }
        this.listLoading=true
        getExecutionPage(para).then((res)=>{
          this.total=res.data.total
          this.executions=res.data.executions
          this.listLoading=false

          this.begins=[]
          this.executions.map(e=>{
            this.begins.push(e.beginTime.substr(0,10))
          })
          this.drawLineChart()
        })
      },
      secondsFormatter(row){
        var value=row.value
        if(value>3600){
          var c= Math.floor(value/3600)
          var d=value%3600
          return c+' h '+Math.floor(d/60)+' m '+d%60+' s'
        }else if(value>60){
          return Math.floor(value/60)+' m '+value%60+' s'
        }else
          return value+' s'
      },
      logpath(eid){
        return '/log?eid=t'+eid+'&name='+this.taskName
      }
    },

    mounted: function () {
      this.taskId=this.$route.query.taskId
      this.taskName=this.$route.query.taskName
      this.getExecutions()
    },
  }
</script>

<style>
  .chart-container {
    width: 100%;
    float: left;
  }
  .chart div {
      height: 400px;
      float: left;
  }

</style>
