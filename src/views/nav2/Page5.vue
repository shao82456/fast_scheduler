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
          <el-dialog title="Add Task" :visible.sync="addFormVisible">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm">
              <el-form-item label="Name" prop="name">
                <el-input v-model="addForm.name" ></el-input>
              </el-form-item>
              <el-form-item label="Command" prop="command">
                <el-input v-model="addForm.command"></el-input>
              </el-form-item>
              <el-form-item label="Description" prop="description"  >
                <el-input type="textarea" v-model="addForm.description"></el-input>
              </el-form-item>
              <el-form-item label="Dependencies" prop="dependencies">
                <el-select
                  v-model="addForm.dependencies"
                  multiple
                  placeholder="请选择" >
                  <el-option
                    v-for="item in tasks"
                    :key="item.id"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="addLoading=false,addFormVisible=false">取消</el-button>
              <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
          </el-dialog>
          <el-dialog title="Edit Task" :visible.sync="editFormVisible">
            <el-form :model="editForm" :rules="addFormRules" ref="editForm">
              <el-form-item label="Name" prop="name">
                <el-input v-model="editForm.name" ></el-input>
              </el-form-item>
              <el-form-item label="Command" prop="command">
                <el-input v-model="editForm.command"></el-input>
              </el-form-item>
              <el-form-item label="Description" prop="description"  >
                <el-input type="textarea" v-model="editForm.description"></el-input>
              </el-form-item>
              <el-form-item label="Dependencies" prop="dependencies">
                <el-select
                  v-model="editForm.dependencies"
                  multiple
                  placeholder="请选择" >
                  <el-option
                    v-for="item in pretasks"
                    :label="item.name"
                    :key="item.id"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="editFormVisible = false,editLoading=false">取消</el-button>
              <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
          </el-dialog>
          <el-table
                :data="tasks"
                style="width: 100%" stripe border>
                <el-table-column
                  label="#"
                  width="60" prop="id">
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
                      {{tasks[d-1].name}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Operation">
                  <template slot-scope="scope">
                    <el-button plain type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button plain type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
          <el-row class="toolbar">
            <el-col :span="6" :offset="18">
                <el-button type="primary" @click="handleAdd">Add</el-button>
                <el-button type="success" @click="handleSave">Save</el-button>
            </el-col>
          </el-row>
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
  import {httpSaveTask} from '../../api/api';
  export default {
    data() {
      return {
        flowName: 'test_run',
        activeName:'graph',
        chartDAG:null,
        tasks: [{
          id:1,
          name: 'checkHDFSPath1',
          command:'bash checkHdfs.sh path1',
          description:'check job',
          dependencies: [],
        },{
          id:2,
          name: 'checkHDFSPath2',
          command:'bash checkHdfs.sh path2',
          description:'check job',
          dependencies: [],
        },{
          id:3,
          name: 'powerkeeper',
          command:'bash run_powerkeeper.sh',
          description:'spark job',
          dependencies: [1,2,5],
        },{
          id:4,
          name: 'textToMysql',
          command: 'bash datatransport.sh path1 tabl1 date1',
          description:'datatrans job',
          dependencies:[3],
        },
          {
            id:5,
            name: 'test',
            command: 'bash test',
            description:'test job',
            dependencies:[],
          }],
        taskHeight:[],
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '名称为空', trigger: 'blur'}
          ],
          command: [
            {required: true, message: '执行命令为空', trigger: 'blur'}
          ],
        },
        //新增界面数据
        addForm: {
          id:-1,
          name: '',
          command: '',
          description: ' ',
          dependencies:[],
        },
        editFormVisible: false,//新增界面是否显示
        editLoading: false,
        //编辑界面数据
        editForm: {
          id:'',
          name: '',
          command: '',
          description: ' ',
          dependencies:[]
        },
      }
    },
    computed: {
      pretasks:function () {
        var currentTaskId=this.editForm.id
        return this.tasks.filter(function (item) {
          return item.id !== currentTaskId
        })
      },
      dagInfo:function () {
        //计算结点高度，从而得出纵坐标
        var height=new Array(this.tasks.length+1)
        var temp_dd=new Array(this.tasks.length+1)
        var remainTask=new Set()

        for(var j = 1,len = height.length; j < len; j++) {
          height[j] = 0
          temp_dd[j]=new Set(this.tasks[j-1].dependencies)
          remainTask.add(j)
        }
        while (remainTask.size>0){
          for(var j = 1,len = temp_dd.length; j < len; j++){
            if(temp_dd[j].size===0){
              let taskId=j
              for(var k=1,lenk=temp_dd.length;k<lenk;k++){
                if(temp_dd[k].has(taskId)){
                  temp_dd[k].delete(taskId);
                  height[k]=Math.max(height[k],height[j]+1)
                }
              }
              remainTask.delete(j)
            }
          }
        }
        //获取节点横纵坐标
        var xmap=new Map()
        var datas=new Array(this.tasks.length)
        for(var j = 0,len = this.tasks.length; j < len; j++) {
          var task=this.tasks[j]
          var hy=height[task.id]
          var hx=-1
          if(xmap.has(hy)){
            hx=xmap.get(hy)+200
          }else{
            hx=0
          }
          xmap.set(hy,hx)
          datas[j]={
            name:task.name,
            x:hx,
            y:hy*200
          }
        }
        //获取连线
        var links=[]
        for(let index in this.tasks){
          var curTask=this.tasks[index]
          var ds=curTask.dependencies
          for(let index in ds){
            links.push({
              source:this.tasks[ds[index]-1].name,
              target:curTask.name
            })
          }
        }
        console.log(datas)
        console.log(links)
        return {
          data:datas,
          link:links
        }
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
      getTask(){
      },
      drawDAGChart(){
        this.chartDAG=echarts.init(document.getElementById('chartDAG'))
        this.chartDAG.setOption({
          title: {
            text:this.flowName
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
              data: this.dagInfo.data,
              // links: [],
              links:this.dagInfo.link,
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
        // if(tab.name==='graph')
        //   this.drawDAGChart()
      },
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      handleDelete: function (index, row) {
        this.$confirm('Are you sure you want to delete this Task?', 'Delete Task', {
          type: 'warning'
        }).then(() => {
          var currentTaskId=row.id
          //获取新旧Task id映射
          var newTaskIdMap=new Array(this.tasks.length+1)
          for(var j = 1,len = newTaskIdMap.length; j < len; j++){
            if(j<currentTaskId)
              newTaskIdMap[j]=j
            else if(j===currentTaskId)
              newTaskIdMap[j]=-1
            else
              newTaskIdMap[j]=j-1
          }
          //更新Task信息
          this.tasks.splice(currentTaskId-1,1)
          for(var j=0,len=this.tasks.length;j<len;j++){
            var currentTask=this.tasks[j]
            currentTask.id=newTaskIdMap[currentTask.id]
            var dd=currentTask.dependencies
            for(var k=0,lenk=dd.length;k<lenk;k++){
              var taskId=dd[k]
              if(newTaskIdMap[taskId]===-1)
                  dd.splice(k,1)
                else
                  dd.splice(k,1,newTaskIdMap[taskId])
            }
          }
          // console.log("task del done")
        }).catch(() => {

        });
      },
      handleAdd: function () {
        this.addFormVisible = true;
      },
      handleSave:function () {
        this.$confirm('Are you sure you want to save the change？', 'Save Change', {}).then(() => {
            let para = Object.assign({}, this.tasks)
            httpSaveTask(para).then(res => {
              let {code, msg} = res.data
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
              else {
                this.$message({
                  message: 'save success',
                  type: 'success'
                });
                this.getTask()
                this.drawDAGChart()
              }
            })
      })},
      addSubmit:function () {
        this.addForm.id=this.tasks.length+1
        this.tasks.push(this.addForm)
        this.addForm = {
        }
        this.addFormVisible=false
      },
      editSubmit:function () {
        this.tasks.splice(this.editForm.id-1,1,this.editForm)
        this.editForm={}
        this.editFormVisible=false
      }
    },
    mounted: function () {
      this.getTask()
      this.drawDAGChart()
      this.getTask()
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
