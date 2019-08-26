<template>
  <section>
    <el-row class="toolbar1" style="padding-bottom: 0px;">
      <el-col :span="12">
        <el-popover
          placement="flow-name"
          :title="flow.name"
          trigger="hover">
            <div class="text" style="color:gray" >
              {{flow.description}}
            </div>
            <div class="text" style="color:gray" >
              <span style="color: black">Created on</span> {{flow.createTime}}<br/>
              <span style="color: black">Modified on</span> {{flow.updateTime}}
            </div>
          <div slot="reference" style="font-size: 20px;">{{flow.name}}</div>
        </el-popover>
      </el-col>
      <el-col :span="12">
        <div style="float: right;">
          <el-button-group>
            <el-button type="success" size="small" @click="handleSchedule" v-show="this.flow.status===1">Schedule</el-button>
            <el-button type="danger" size="small"  @click="handleUnSchedule" v-show="this.flow.status===0">UnSchedule</el-button>
            <el-button type="success" size="small" @click="handleExecute" v-show="this.flow.status===1">Execute</el-button>
          </el-button-group>
          <el-button-group >
            <el-button type="primary" size="small" @click="handleUpload"><i
              class="el-icon-upload el-icon--right"></i></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleRemove"></el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
        <el-dialog title="Cron FLow" :visible.sync="cronFormVisible" @close="next5Times=[],next5Visible=false">
        <el-form :model="cronForm" :rules="cronFormRules" ref="cronForm">
            <el-form-item label="Name" prop="name">
              <el-input v-model="cronForm.name" :disabled="true"></el-input>
            </el-form-item>
          <el-form-item label="Schedule Plan" prop="cron">
            <el-input v-model="cronForm.cron" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="Recently scheduling time"　v-if="next5Visible">
            <br/>
            <div v-for="item in next5Times" :key="item" class="text item" style="margin-left: 5%;color: green">
              {{item }}
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cronFormVisible = false,cronLoading=false">Cancel</el-button>
          <el-button type="primary" @click.native="cronSubmit" :loading="cronLoading">Submit</el-button>
        </div>
      </el-dialog>

      <!--上传界面-->
      <el-dialog title="Upload FlowFile" :visible.sync="uploadFormVisible"  @close="this.files=[]" width="30%">
        <ul>
          <li v-for="(file, index) in files" :key="file.id">
            <span>{{file.name}}</span>
            <span>{{file.size | formatSize1}}MB</span>
            <span v-if="file.error">{{file.error}}</span>
            <span v-else-if="file.success">success</span>
            <span v-else-if="file.active">uploading</span>
            <span v-else-if="file.active">uploading</span>
            <span v-else></span>
          </li>
        </ul>
        <el-row>
          <el-col :span="18">
            <file-upload
              class="btn btn-primary"
              :post-action="'/flow/upload/' + this.flow.id"
              accept="application/zip"
              v-model="files"
              ref="upload">
              Choose File<i
              class="el-icon-files el-icon--right"></i>
            </file-upload>
          </el-col>
          <el-col :span="6">
            <el-button size="small" v-if="!$refs.upload || !$refs.upload.active"
                       @click.prevent="$refs.upload.active = true">
              Upload<i class="el-icon-upload2 el-icon--right"></i>
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>

    </el-row>
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleActiveClick">
        <el-tab-pane label="图" name="graph">
          <el-row>
              <div id="chartDAG"></div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="子任务" name="task">  <el-row>
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
                    v-for="item in pretasks"
                    :label="item.name"
                    :key="item.id"
                    :value="item.id">
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
        <el-tab-pane label="执行记录" name="execution">
          <el-row>
              <div id="chartLine"></div>
          </el-row>
          <el-row >
            <el-table :data="executions" highlight-current-row  stripe>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table :data="props.row.taskExecutions" :show-header="false" highlight-current-row  stripe>
                    <el-table-column label="Task Name"   sortable>
                      <template slot-scope="scope">
                        <router-link :to="logpath(scope.row.id,scope.row.nodeId)" style="text-decoration:none;"><el-link>{{getTaskName(scope.row.nodeId)}}</el-link></router-link>
                      </template>
                    </el-table-column>
                    <el-table-column prop="beginTime" label="Begin"   sortable/>
                    <el-table-column prop="endTime" label="End"  sortabl/>
                    <el-table-column label="时间"  :formatter="secondsFormatter" sortable/>
                    <el-table-column prop="status" label="Status"    align="center">
                      <template slot-scope="scope">
                        <div  style="background: #66CD00; font-size: 16px;"  v-show="scope.row.status===0">Success</div>
                        <div  style="background: #CD2626; font-size: 16px;"   v-show="scope.row.status===1">Fail</div>
                        <div  style="background: #20a0ff; font-size: 16px;"   v-show="scope.row.status===2">Running</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="beginTime" label="开始时间"   sortable/>
              <el-table-column prop="endTime" label="结束时间"  sortabl/>
              <el-table-column label="时间"  :formatter="secondsFormatter" sortable/>
              <el-table-column prop="status" label="状态"    align="center">
                <template slot-scope="scope">
                  <div  style="background: #66CD00; font-size: 16px;"  v-show="scope.row.status===0">Success</div>
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
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </section>
</template>

<script>
  import echarts from 'echarts'
  import FileUpload from 'vue-upload-component'
  import {httpCronTime,httpSaveTask,httpCronFlow,httpExecuteFlow,httpRemoveFlow,httpGetFlowExecutionPage,httpUnscheduleFlow,httpGetFlow,httpGetFlowTask} from '../../api/api';
  export default {
    components: {
      FileUpload,
    },
    filters: {
      formatSize1(size) {
        return Math.round(size / 1000 / 1000)
      }
    },
    data() {
      var check_edit_cronTime = (rule, value, callback) => {
        if (!this.cronForm.cron) {
          return callback(new Error('cron不能为空'));
        }
        setTimeout(() => {
          let para = {
            cron: this.cronForm.cron
          };
          httpCronTime(para).then(res => {
            let {code, data} = res.data
            if (code === 200) {
              this.next5Times = data
              this.next5Visible = true
              callback()
            }
            else{
              callback(new Error('cron表达式错误'))
            }
          });
        }, 300);
      };
      return {
        flow:{
          id:12,
          name:'test_run',
          description:'this is a flow for test dev ',
          status:1,
          createTime:'2019-05-06 14:41:46',
          updateTime:'2019-05-06 14:41:46'
        },
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
        cronFormVisible:false,
        cronLoading:false,
        cronForm:{
          name:'',
          cron:''
        },
        cronFormRules:{
          cron: [
            {validator: check_edit_cronTime, trigger: 'blur'}
          ]
        },
        next5Times: [],
        next5Visible: false,
        uploadFormVisible: false,
        uploadForm:{
          id:-1,
        },
        files: [],
        chartLine: null,
        executions:[],
        begins:[],
        total: 0,
        page: 1
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
            hx=xmap.get(hy)+150
          }else{
            hx=0
          }
          xmap.set(hy,hx)
          datas[j]={
            name:task.name,
            x:hx,
            y:hy*100
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
        return {
          data:datas,
          link:links
        }
      }
    },
    methods: {
      getFlow(){
        let para={
          flowId:this.flow.id
        }
        httpGetFlow(para).then(res=>{
            if(res.data.code===200){
              this.flow=res.data.flow
              this.flow.createTime=this.flow.createTime.substr(0,20)
              this.flow.updateTime=this.flow.updateTime.substr(0,20)
            }
        })
      },
      getTaskName(id){
        return this.tasks[id-1].name
      },
      handleUpload() {
        this.uploadFormVisible = true;
        this.uploadForm.id = this.flow.id
      },

      handleExecute() {
        this.$confirm('Are you sure you want to execute this flow?', 'Execute Flow').then(() => {
            let para = {
              flowId: this.flow.id
            };
            //NProgress.start();
            httpExecuteFlow(para).then((res) => {
              let {code, msg} = res.data
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
              else {
                this.$message({
                  message: 'execute success',
                  type: 'success'
                });
              }
            });
        });
      },
      handleRemove(){
        this.$confirm('Are you sure you want to remove this flow?', 'Confirm Remove', {
          type: 'warning'
        }).then(() => {
          let para = {
            flowId: this.flow.id
          };
          //NProgress.start();
          httpRemoveFlow(para).then((res) => {
            let {code, msg} = res.data
            if (code !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              });
            }else {
              this.$message({
                message: 'remove success',
                type: 'success'
              });
              this.$router.push({ path: '/flow/list'});
            }
          });
        }).catch(() => {
        });
      },
      handleSchedule() {
        this.cronForm.name=this.flow.name
        this.cronFormVisible=true
      },
      handleUnSchedule() {
        this.$confirm('Are you sure you want to unschedule this flow？', 'Confirm Unschedule', {}).then(() => {
          let para = Object.assign({}, this.flow.id)
          httpUnscheduleFlow(para).then(res => {
            let {code, msg} = res.data
            if (code !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              });
            }
            else {
              this.$message({
                message: 'unschedule success',
                type: 'success'
              });
              this.getflow()
            }
          })
        })
      },
      getTask(){
        let para={
          flowId:this.flow.id
        }
        httpGetFlowTask(para).then(res=>{
          if(res.data.code===200){
            this.tasks=res.data.tasks
            this.drawDAGChart()
          }
        })
      },
      drawDAGChart(){
        var container = document.getElementById('chartDAG');
        container.style.width = window.innerWidth*0.95+'px';
        container.style.marginTop = window.innerHeight*0.10+'px';
        container.style.height = '400px';
        this.chartDAG=echarts.init(container)

        this.chartDAG.setOption({
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series : [
            {
              type: 'graph',
              layout: 'none',
              symbol:'circle',
              symbolSize: [90,60],
              roam: true,
              label: {
                normal: {
                  show: true
                }
              },
              edgeSymbol: ['none', 'arrow'],
              edgeSymbolSize: [0, 10],
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
        this.$confirm('Are you sure you want to save change？', 'Confirm Save', {}).then(() => {
          let para = this.tasks
          httpSaveTask(this.flow.id,para).then(res => {
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
                this.getTask(this.flow.id)
              }
            })
        })
      },
      addSubmit:function () {
        console.log(this.addForm.dependencies)
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
      },
      cronSubmit:function(){
        this.$refs.cronForm.validate((valid) => {
          if (valid) {
            this.$confirm('Are you sure you want to schedule this flow？', 'Schedule Flow', {
            }).then(() => {
              this.cronLoading = true;
              //NProgress.start();
              let para = {
                id:this.flow.id,
                cron:this.cronForm.cron
              }
              httpCronFlow(para).then(res => {
                let {code, msg} = res.data
                if (code !== 200) {
                  this.$message({
                    message: msg,
                    type: 'error'
                  });
                } else {
                  //NProgress.done();
                  this.$message({
                    message: 'Schedule Success',
                    type: 'success'
                  });
                  this.$refs['cronForm'].resetFields();
                  this.cronFormVisible = false;
                  this.getFlow();
                }
                this.cronLoading = false
              });
            });
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getExecutions();
      },
      drawLineChart() {
        var container = document.getElementById('chartLine');
        container.style.width = window.innerWidth*0.95+'px';
        container.style.height = '400px';
        this.chartLine = echarts.init(container);
        this.chartLine.setOption(
          {
            grid:{
              left:'3%',
            },
            xAxis: {
              type: 'category',
              data: this.begins
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
                    if(params.data.status===0)
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
          flowId:this.flow.id,
          pageNum:this.page
        }
        httpGetFlowExecutionPage(para).then((res)=>{
          this.total=res.data.total
          this.executions=res.data.executions
          console.log(this.total)
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
      logpath(eid,nodeid){
        return '/log?eid=n'+eid+'&name='+this.flow.name+' : '+this.getTaskName(nodeid)
      }
    },
    mounted: function () {
      var flowId=this.$route.query.flowId
      if(flowId){
        this.flow.id=flowId
        this.getFlow()
        this.getTask()
        if(this.flow.status!==2){
          this.drawDAGChart()
          this.getExecutions()
        }
      }else{
        this.drawDAGChart()
        this.getExecutions()
      }

    },
  }
</script>

<style>
</style>
