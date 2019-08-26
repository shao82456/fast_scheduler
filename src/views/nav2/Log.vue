  <template>
  <section>
    <el-row class="toolbar1" style="padding-bottom: 0px;">
<!--      <el-col :span="20">-->
        <span style="font-size: 20px;align-content: center">{{name}}</span>
<!--      </el-col>-->
<!--      <el-col :span="4">-->
      <el-button size="small" @click="handleReFresh" style="float: right">Refresh</el-button>
<!--      </el-col>-->
    </el-row>
    <el-tabs v-model="activeLog" type="card" >
      <el-tab-pane label="stdout" name="stdout" >
        <el-row>
          <textarea id="stdoutLog" style="font-size: 12px; width: 99%; resize:none;" readonly></textarea>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="stderr" name="stderr">
        <textarea id="stderrLog" style="font-size: 12px;width: 99%;resize:none;" readonly>

        </textarea>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  import {httpGetExecutionLog} from '../../api/api'
  export default {
    data(){
      return{
        activeLog:'stdout',
        name:'flow1 / node1',
        eid:46,
      }
    },
    methods:{
      handleReFresh() {
        if (this.activeLog === 'stdout'){
          var obj = document.getElementById('stdoutLog')
          obj.innerHTML = 'Loading...';
          let para = {
            eid: this.eid,
            isStd: true
          }
          httpGetExecutionLog(para).then(res => {
            obj.innerText = res.data
          });
        }
        else{
          var obj=document.getElementById('stderrLog')
          obj.innerHTML = 'Loading...';
          let para={
            eid:this.eid,
            isStd:false
          }
          httpGetExecutionLog(para).then(res => {
            obj.innerText=res.data
          });
        }
      },
      textArea(){
        var container1 = document.getElementById('stdoutLog');
        var container2 = document.getElementById('stderrLog');
        container1.style.height = window.innerHeight*0.7+'px';
        container2.style.height = window.innerHeight*0.7+'px';
      }
    },
    mounted() {
      this.eid=this.$route.query.eid
      this.name=this.$route.query.name
      this.textArea()
      this.handleReFresh()
    }
  }
</script>
<style>
  .toolbar1 {
    background: #f2f2f2;
    padding: 0px;
  }
</style>
