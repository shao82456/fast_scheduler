<template>
  <section>
    <el-row class="toolbar" style="padding-bottom: 0px;">
      <el-col :span="18">
        <el-form :inline="true" :model="filters" >
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
        <el-form :inline="true" label-position="right">
          <el-form-item label="Visibility">
            <el-select   v-model="visibility" placeholder="Permision">
              <el-option label="Personal" value="Personal"></el-option>
              <el-option label="Group" value="Group"></el-option>
              <el-option label="All" value="All"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-light">
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
            <el-link :href="'https://localhost:8080/flowdetail/'+scope.$index" target="_blank">{{scope.row.name}}</el-link>
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
      </div></el-col>
    </el-row>


  </section>
</template>

<script>
  export default {
    data() {
      return {
        visibility:'Personal',
        filters: {
          name: ''
        },
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

    methods:{
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
      handleAdd(){

      }
    },

    mounted: function () {},
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
