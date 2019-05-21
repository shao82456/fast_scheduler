<template>
  <section>
    <el-row class="toolbar" style="padding-bottom: 0px;">
      <el-col :span="6">
        <div class="el-textarea">{{flowName}}</div>
      </el-col>
      <el-col :span="6" :offset="12">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="small" @click="handleSchedule">Schedule</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" size="small" @click="handleExecute">Execute</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleUpload">Upload<i
              class="el-icon-upload el-icon--right"></i></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleActiveClick">
        <el-tab-pane label="Graph" name="graph">
          <el-row>
              <div id="chartDAG" style="width:100%; height:400px;"></div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Task" name="task">  <el-row>

              <el-table
                :data="tableData"
                style="width: 100%" stripe border>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                  label="Name"
                  width="180" prop="name">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" title="Command">
                      <p>{{ scope.row.command }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag type="success"> {{ scope.row.name }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="description"
                  width="180" prop="description">
                </el-table-column>
                <el-table-column
                  label="Dependencies"
                  width="360" prop="dependencies">
                  <template slot-scope="scope">
                    <el-tag
                      v-for="d in scope.row.dependencies"
                      :key="d">
                      {{d}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
        </el-row>
        </el-tab-pane>
        <el-tab-pane label="Execution" name="execution">Execution</el-tab-pane>
      </el-tabs>
    </el-row>

    <!--    <el-dialog title="Exe" :visible.sync="addFormVisible" @close="next5Times=[],next5Visible=false">-->
    <!--      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">-->
    <!--        <el-form-item label="名称" prop="name">-->
    <!--          <el-input v-model="addForm.name" ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="命令" prop="command">-->
    <!--          <el-input v-model="addForm.command"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="执行计划" prop="cron"  >-->
    <!--          <el-input v-model="addForm.cron" placeholder="0 0 8 * * ?" clearable></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="描述">-->
    <!--          <el-input type="textarea" v-model="addForm.descript"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div v-show="next5Visible">-->
    <!--        <div class="text item">近期执行时间</div>-->
    <!--        <div v-for="item in next5Times" :key="item" class="text item">-->
    <!--          {{item }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click.native="addLoading=false,addFormVisible=false">取消</el-button>-->
    <!--        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->


  </section>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        flowName: 'test_run',
        activeName:'graph',
        chartDAG:null,
        tableData: [{
          name: 'checkHDFSPath1',
          command:'bash checkHdfs.sh path1',
          description:'check job',
          dependencies: []
        },{
          name: 'checkHDFSPath2',
          command:'bash checkHdfs.sh path2',
          description:'check job',
          dependencies: []
        },{
          name: 'powerkeeper',
          command:'bash run_powerkeeper.sh',
          description:'spark job',
          dependencies: ['checkHDFSPath1','checkHDFSPath2']
        },{
          name: 'textToMysql',
          command: 'bash datatransport.sh path1 tabl1 date1',
          description:'datatrans job',
          dependencies:['powerkeeper']
        }]
      }
    },

    methods: {
      getFlows() {
        // let para = {
        //   pageNum: this.page,
        //   partName: this.filters.name
        // };
        // this.listLoading = true;
        // //NProgress.start();
        // getUserListPage(para).then((res) => {
        //   this.total = res.data.total;
        //   this.tasks = res.data.tasks;
        //   this.listLoading = false;
        //   //NProgress.done();
        // });
      },
      handleUpload() {

      },
      handleExecute() {
        this.$confirm('确认启用吗？', '提示', {}).then(() => {
          //如果para.status是true，则保留原样，即要么0启用，要么１　启用无依赖包
          // enableTask(row.id).then(res => {
          //   let {code,msg,status} = res.data
          //   if (code !== 200) {
          //     this.$message({
          //       message: msg,
          //       type: 'error'
          //     });
          //   } else if(status ==1){
          //     this.$message({
          //       message: '未上传包',
          //       type: 'warning'
          //     });
          //   }else{
          //     this.$message({
          //       message: '启用成功',
          //       type: 'success'
          //     });
          //     this.getTasks();
          //   }
          // });
        });
      },
      handleSchedule() {
        this.$confirm('确认启用吗？', '提示', {}).then(() => {
          //如果para.status是true，则保留原样，即要么0启用，要么１　启用无依赖包
          // enableTask(row.id).then(res => {
          //   let {code,msg,status} = res.data
          //   if (code !== 200) {
          //     this.$message({
          //       message: msg,
          //       type: 'error'
          //     });
          //   } else if(status ==1){
          //     this.$message({
          //       message: '未上传包',
          //       type: 'warning'
          //     });
          //   }else{
          //     this.$message({
          //       message: '启用成功',
          //       type: 'success'
          //     });
          //     this.getTasks();
          //   }
          // });
        });
      },
      drawDAGChart(){
        this.chartDAG=echarts.init(document.getElementById('chartDAG'))
        this.chartDAG.setOption({
          title: {
            text: 'Graph 简单示例'
          },
          tooltip: {},
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series : [
            {
              type: 'graph',
              layout: 'none',
              symbolSize: 50,
              roam: true,
              label: {
                normal: {
                  show: true
                }
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              data: [{
                name: 'A',
                x: 100,
                y: 100
              }, {
                name: 'C',
                x: 100,
                y: 200
              }, {
                name: 'B',
                x: 200,
                y: 200
              }, {
                name: 'E',
                x: 300,
                y: 200
              },{
                name:'D',
                x:100,
                y:300
              },{
                name:'F',
                x:200,
                y:300
              },{
                name:'H',
                x:100,
                y:400
              }],
              // links: [],
              links: [{
                source: 'A',
                target: 'C',
                // symbolSize: [5, 20],
              }, {
                source: 'A',
                target: 'B',
              }, {
                source: 'A',
                target: 'E',
              }, {
                source: 'C',
                target: 'D',
              },{
                source: 'B',
                target: 'D',
              },{
                source: 'E',
                target: 'F',
              },{
                source: 'D',
                target: 'H',
              },{
                source: 'F',
                target: 'H',
              }],
              lineStyle: {
                normal: {
                  opacity: 0.9,
                  width: 2,
                  curveness: 0
                }
              }
            }
          ]
        });
      },
      handleActiveClick(tab,e){
        if(tab.name==='graph')
          this.drawDAGChart()
        else
          alert(tab.name)
      }
    },
    mounted: function () {
      this.drawDAGChart()
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
