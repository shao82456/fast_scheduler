<template>
  <section>
    <el-row class="toolbar" style="padding-bottom: 0px;">
      <el-col :span="18">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getFlows">Search</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">Add</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form :inline="true">
          <el-form-item label="Visibility">
            <el-select v-model="visibility" placeholder="Permision" value="Personal">
              <el-option label="Personal" value="Personal"></el-option>
              <el-option label="Group" value="Group"></el-option>
              <el-option label="All" value="All"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="Add Flow" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item label="Name" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addLoading=false,addFormVisible=false">Cancel</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="24" class="grid-content bg-purple-light">
        <el-table
          :data="flows"
          style="width: 100%"
          :row-class-name="table_row__class">
          <el-table-column label="Name"
                           prop="name">
            <template slot-scope="scope">
              <router-link :to="'/flow/detail?flowId='+scope.row.id" style="text-decoration:none;"><el-link>{{scope.row.name}}</el-link></router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="Description"
            prop="description">
          </el-table-column>
          <el-table-column
            label="Owner"
            prop="userName">
          </el-table-column>
          <el-table-column
            label="Scheduling">
            <template slot-scope="scope">
              <div v-show="scope.row.status===0">{{scope.row.cron}}</div>
              <div v-show="scope.row.status!==0">UnSchedule</div>
            </template>
          </el-table-column>
          <el-table-column label="Operation">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" :disabled="scope.row.status!==0" @click="handleRemoveSchedule(scope.$index, scope.row)">Remove Schedule</el-button>
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
            this.$message({
              message: 'save success',
              type: 'success'
            });
            this.getTask()
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
    background: #f0f9eb;
  }

</style>
