<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getTasks">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="tasks" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;"  :row-class-name="table_row__class">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="text" style="color:gray" >
                {{props.row.description}}
              </div>
              <div class="text" style="color:gray" >
                <span style="color: black">Created on</span> {{props.row.createTime}}<br/>
                <span style="color: black">Modified on</span> {{props.row.updateTime}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="名称"
                           prop="name" sortable>
            <template slot-scope="scope">
              <router-link :to="'/task/execution?taskId='+scope.row.id+'&taskName='+scope.row.name" style="text-decoration:none;"><el-link>{{scope.row.name}}</el-link></router-link>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户"  sortable>
          </el-table-column>
          <el-table-column
            label="执行计划">
            <template slot-scope="scope">
              <div v-show="scope.row.status===0">{{scope.row.cron}}</div>
              <div v-show="scope.row.status!==0">未调度</div>
            </template>
          </el-table-column>



          <el-table-column label="操作" min-width="%30">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button type="success" size="mini"  icon="el-icon-time" @click="handleSchedule(scope.$index, scope.row)" v-show="scope.row.status!==0"></el-button>
                    <el-button type="warning" size="mini" icon="el-icon-circle-close" @click="handleUnSchedule(scope.$index, scope.row)" v-show="scope.row.status===0"></el-button>
                    <el-button type="primary" size="mini" @click="handleUpload(scope.$index, scope.row)"><i class="el-icon-upload el-icon--right"></i></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)"></el-button>
                  </el-button-group>
                 </template>
            </el-table-column>

        </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="12"
                       :total="total" style="float:right;">
        </el-pagination>
      </el-col>

      <el-dialog title="上传任务程序包" :visible.sync="uploadFormVisible"  @close="afterUpload" width="30%">
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
              :post-action="'/task/upload/' + this.uploadForm.id"
              accept="application/zip"
              v-model="files"
              ref="upload">
              选择文件<i
              class="el-icon-files el-icon--right"></i>
            </file-upload>
          </el-col>
          <el-col :span="6">
            <el-button size="small" v-if="!$refs.upload || !$refs.upload.active"
                       @click.prevent="$refs.upload.active = true">
              上传<i class="el-icon-upload2 el-icon--right"></i>
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="命令" prop="command">
                    <el-input v-model="editForm.command" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false,editLoading=false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

      <el-dialog title="调度任务" :visible.sync="cronFormVisible" @close="next5Times=[],next5Visible=false">
        <el-form :model="cronForm" :rules="cronFormRules" ref="cronForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="cronForm.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="执行计划" prop="cron">
            <el-input v-model="cronForm.cron" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="近期调度时间"　v-if="next5Visible">
            <br/>
            <div v-for="item in next5Times" :key="item" class="text item1" style="margin-left: 5%;color: green">
              {{item }}
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cronFormVisible = false,cronLoading=false">Cancel</el-button>
          <el-button type="primary" @click.native="cronSubmit" :loading="cronLoading">Submit</el-button>
        </div>
      </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="命令" prop="command">
                    <el-input v-model="addForm.command"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addLoading=false,addFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style>
    .el-table .unused-row {
        /*background: gray;*/
    }
    .el-table .used-row {
        background:	#FAFAFA;
    }
    .text {
        font-size: 14px;
    }
    .item {
      padding: 18px 0;
    }
    .item1 {
      padding: 5px 0;
    }

</style>

<script>
    import FileUpload from 'vue-upload-component'
    //import NProgress from 'nprogress'
    import {getTaskListPage, httpRemoveTask, editTask, addTask,enableTask,httpCronTime,httpUnscheduleTask} from '../../api/api';

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
            var check_cronTime = (rule, value, callback) => {
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
                filters: {
                    name: ''
                },
                tasks: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                uploadFormVisible: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '名称为空', trigger: 'blur'}
                    ],
                    command: [
                        {required: true, message: '执行命令为空', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    command: '',
                    description: ' ',
                },
                uploadForm: {
                    id: 0,
                    name: ''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '名称为空', trigger: 'blur'}
                    ],
                    command: [
                        {required: true, message: '执行命令为空', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    command: '',
                    status: 2,
                    description: ' '
                },
                files: [],
                cronForm:{
                  id:'',
                  name:'',
                  cron:''
                },
                cronFormVisible:false,
                cronLoading:false,
                next5Times: [],
                next5Visible: false,
                cronFormRules: {
                  cron: [
                    {validator: check_cronTime, trigger: 'blur'}
                  ]
                },
            }
        },
        methods: {
            table_row__class({row, rowIndex}) {
                if (row.status === 0) {
                    return 'used-row';
                } else {
                    return 'unused-row';
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getTasks();
            },
            //获取任务列表
            getTasks() {
                let para = {
                    pageNum: this.page,
                    partName: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getTaskListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.tasks = res.data.tasks;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该任务吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {taskId: row.id};
                    httpRemoveTask(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getTasks();
                    });
                }).catch(() => {

                });
            },
            //显示上传界面
            handleUpload: function (index, row) {
                this.uploadFormVisible = true;
                this.uploadForm = Object.assign({}, row);
            },
            afterUpload() {
                this.files = []
                this.getTasks()
            },
            clear_next_times(){
                this.next5Times=[]
                this.next5Visible=false
            },
            handleSchedule:function(index,row){
              if(row.status===2){
                this.$notify({
                  title:'任务无法调度',
                  message: '任务无法调度，请上传任务程序包',
                });
                return
              }
              this.cronForm.id=row.id
              this.cronForm.name=row.name
              this.cronFormVisible=true
            },
            cronSubmit(){
              this.$confirm('确认定时调度该任务', '确认调度', {}).then(() => {
                //如果para.status是true，则保留原样，即要么0启用，要么１　启用无依赖包
                let para={
                  id:this.cronForm.id,
                  cron:this.cronForm.cron
                }
                enableTask(para).then(res => {
                  let {code,msg,status} = res.data
                  if (code !== 200) {
                    this.$message({
                      message: msg,
                      type: 'error'
                    });
                  }else{
                    this.$message({
                      message: '启用成功',
                      type: 'success'
                    });
                    this.$refs['cronForm'].resetFields();
                    this.cronFormVisible = false;
                    this.getTasks();
                  }
                });
              });
            },
            handleUnSchedule(index,row){
              this.$confirm('取消该任务调度吗', '确认取消', {}).then(() => {
                let para = {
                  taskId:row.id
                }
                httpUnscheduleTask(para).then(res => {
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
                    this.getTasks()
                  }
                })
              })
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm.id=row.id
                this.editForm.name=row.name
                this.editForm.command=row.command
                this.editForm.description=row.description
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editTask(para).then(res => {
                                let {code, msg} = res.data
                                if (code !== 200) {
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getTasks();
                                }
                                this.editLoading = false
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addTask(para).then(res => {
                                let {code, msg} = res.data
                                if (code !== 200) {
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                } else {
                                    //NProgress.done();
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getTasks();
                                }
                                this.addLoading = false
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getTasks();
                    });
                }).catch(() => {

                });
            }
        },
        computed: {
            uploadpath() {
                // `this` 指向 vm 实例
                return '/task/upload/' + this.uploadForm.id
            }
        },
        mounted() {
            this.getTasks();
        }
    }

</script>
