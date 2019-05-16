<template>
  <section>
    <el-table :data="tasks" highlight-current-row v-loading="listLoading"
              style="width: 100%"  :row-class-name="table_row__class">
      <el-table-column prop="uid" label="用户" width="120" sortable>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="240" sortable>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" :formatter="status_info" sortable>
      </el-table-column>
      <el-table-column prop="command" label="命令" width="360" sortable>
      </el-table-column>
      <el-table-column prop="cron" label="执行计划" width="120" sortable>
      </el-table-column>
      <el-table-column prop="descript" label="描述" min-width="240" sortable>
      </el-table-column>

<!--      <el-table-column label="操作">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="success" size="small" :disabled="status_boolean(scope.row.status)" @click="handleEnable(scope.$index, scope.row)">启用</el-button>-->
<!--          <el-button type="primary" size="small" @click="handleUpload(scope.$index, scope.row)">更新包</el-button>-->
<!--                              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--                              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

  </section>

</template>

<style scoped>
  .el-table .unused-row {
    background: gray;
  }

  .el-table .used-row {
    background: #f0f9eb;
  }
</style>

<script>
  import {getUserListPage, removeUser, batchRemoveUser, editTask, addTask,enableTask,cronTime} from '../../api/api';

  export default {
    methods: {
      status_info: function (row, column) {
        if (row.status === 0)
          return '已启用'
        else
          return '未启用'
      },
      table_row__class({row, rowIndex}) {
        if (row.status === 0) {
          return 'used-row';
        } else if(row.status ===1){
          return 'unused-row';
        }else{

        }
      },
      getTasks() {
        let para = {
          pageNum: this.page,
          partName: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        getUserListPage(para).then((res) => {
          this.total = res.data.total;
          this.tasks = res.data.tasks;
          this.listLoading = false;
          //NProgress.done();
        });
      },
    },
    data() {
      return {
        filters: {
          name: ''
        },
        page: 1,
        tasks: [],
        listLoading: false
      }
    },
    mounted() {
      this.getTasks();
    }
  }
</script>
