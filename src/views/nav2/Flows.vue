<template>
  <section>
    <el-row class="toolbar" style="padding-bottom: 0px;">
      <el-col :span="18">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getFlows">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form :inline="true">
            <el-select v-model="visibility" placeholder="Permision" value="Personal">
              <el-option label="Personal" value="Personal"></el-option>
              <el-option label="Group" value="Group"></el-option>
              <el-option label="All" value="All"></el-option>
            </el-select>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="添加任务流" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
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
    <el-row>
      <el-col :span="24" class="grid-content bg-purple-light">
        <el-table
          :data="flows"
          style="width: 100%"
          :row-class-name="table_row__class">
          <el-table-column label="名称"
                           prop="name" sortable>
            <template slot-scope="scope">
              <router-link :to="'/flow/detail?flowId='+scope.row.id" style="text-decoration:none;"><el-link>{{scope.row.name}}</el-link></router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="description">
          </el-table-column>
          <el-table-column
            label="用户"
            prop="userName">
          </el-table-column>
          <el-table-column
            label="执行计划" sortable>
            <template slot-scope="scope">
              <div v-show="scope.row.status===0">{{scope.row.cron}}</div>
              <div v-show="scope.row.status!==0">未调度</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" size="small" :disabled="scope.row.status!==0" @click="handleRemoveSchedule(scope.$index, scope.row)">移除调度</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="12"
                       :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>


  </section>
</template>

<script>
  import {httpGetFlowListByPage, httpAddFlow,httpUnscheduleFlow} from '../../api/api';

  export default {
    data() {
      return {
        visibility: 'Personal',
        filters: {
          name: ''
        },
        flows: [],
        total: 0,
        page: 1,
        listLoading: false,
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: 'name cannot be blank', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          description: '',
        },
      }
    },

    methods: {
      getFlows() {
        let para = {
          pageNum: this.page,
          partName: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        httpGetFlowListByPage(para).then((res) => {
          this.total = res.data.total;
          this.flows = res.data.flows;
          this.listLoading = false;
          //NProgress.done();
        });

      },
      handleAdd() {
        this.addFormVisible = true;
      },
      addSubmit() {
        let para = {
          name: this.addForm.name,
          description: this.addForm.description
        }
        httpAddFlow(para).then(res => {
          let {code, msg} = res.data
          if (code !== 200) {
            this.$message({
              message: msg,
              type: 'error'
            });
          } else {
            let flowId=res.data.id
            // this.$router.push({ path: '/flow/detail&?flowId='+12 });
            this.$router.push({ path: '/flow/detail'+'?flowId='+flowId });
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getFlows();
      },
      table_row__class({row, rowIndex}) {
        if (row.status === 0) {
          return 'used-row';
        } else {
          return 'unused-row';
        }
      },
      handleRemoveSchedule(index,row) {
        this.$confirm('Are you sure you want to unschedule this flow？', 'Confirm Unschedule', {}).then(() => {
          let para = Object.assign({}, row.id)
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
              this.getFlows()
            }
          })
        })
      },
    },

    mounted: function () {
      this.getFlows()
    },
  }
</script>

<style>
  .chart-container {
    width: 100%;
    float: left;
  }

  .el-table .unused-row {
    /*background: gray;*/
  }
  .el-table .used-row {
    background:	#FAFAFA;
  }

</style>
