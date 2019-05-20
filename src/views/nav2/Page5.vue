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
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="所属店铺">
                        <span>{{ props.row.shop }}</span>
                      </el-form-item>
                      <el-form-item label="商品 ID">
                        <span>{{ props.row.id }}</span>
                      </el-form-item>
                      <el-form-item label="店铺 ID">
                        <span>{{ props.row.shopId }}</span>
                      </el-form-item>
                      <el-form-item label="商品分类">
                        <span>{{ props.row.category }}</span>
                      </el-form-item>
                      <el-form-item label="店铺地址">
                        <span>{{ props.row.address }}</span>
                      </el-form-item>
                      <el-form-item label="商品描述">
                        <span>{{ props.row.desc }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>

                <el-table-column label="Name"
                                 prop="name">
                  <template slot-scope="scope">
                    <el-link :href="'https://localhost:8080/flowdetail/'+scope.$index" target="_blank">{{scope.row.name}}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Description"
                  prop="description">
                </el-table-column>
                <el-table-column
                  label="Owner"
                  prop="owner">
                </el-table-column>
                <el-table-column
                  label="Status"
                  prop="status">
                </el-table-column>
              </el-table>
            </div>
          </el-col>
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
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
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
