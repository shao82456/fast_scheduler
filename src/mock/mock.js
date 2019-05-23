import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { loginUsers, tasks } from './data/user';
let _tasks = tasks;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = loginUsers.some(u => {
            if (u.name === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _tasks.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    mock.onGet('/help/cronTime').reply(config => {
      let {cron}=config.params;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            data:["2019-05-09 00:00:00","2019-05-10 00:00:00","2019-05-11 00:00:00","2019-05-12 00:00:00","2019-05-13 00:00:00"]
          }]);
        }, 100);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/task/list').reply(config => {
      let {pageNum} = config.params;
      let total = tasks.length;
      let mockTasks = tasks.filter((u, index) => index < 12 * pageNum && index >= 12 * (pageNum - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            tasks: mockTasks
          }]);
        }, 1000);
      });
    });

    mock.onGet('/task/:id').reply(config => {
      alert(id)
      console.log("hehe")
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _tasks = _tasks.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _tasks = _tasks.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onPost('/task/update').reply(config => {
      alert(config.data);
      // let { id, name, addr, age, birth, sex } = config.params;
      // _tasks.some(u => {
      //   if (u.id === id) {
      //     u.name = name;
      //     u.addr = addr;
      //     u.age = age;
      //     u.birth = birth;
      //     u.sex = sex;
      //     return true;
      //   }
      // });
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve([200, {
      //       code: 200,
      //       msg: '编辑成功'
      //     }]);
      //   }, 500);
      // });
    });

    //新增任务
    mock.onPost('/task/add').reply(config => {
      let { name, command, cron, status, descript } = JSON.parse(config.data);
      alert(config.data);
      _tasks.push({
        uid:100,
        name: name,
        command:command,
        cron: cron,
        status: status,
        descript: descript
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/taskExecution/list').reply(config => {
      let res='{"msg":"SUCCESS!","total":12,"code":200,"executions":[{"id":6,"user":"admin","startTime":"2019-05-08 14:00:00","endTime":"2019-05-08 14:00:00","elapsed":"2 s","status":false,"descript":"dd","value":"10"},{"id":7,"user":"admin","startTime":"2019-05-08 14:05:01","endTime":"2019-05-08 14:05:01","elapsed":"0 s","status":true,"descript":"dd","value":"2"},{"id":8,"user":"admin","startTime":"2019-05-08 14:10:00","endTime":"2019-05-08 14:10:00","elapsed":"0 s","status":true,"descript":"dd","value":"3"},{"id":9,"user":"admin","startTime":"2019-05-08 14:15:00","endTime":"2019-05-08 14:15:00","elapsed":"0 s","status":true,"descript":"dd","value":"1"},{"id":10,"user":"admin","startTime":"2019-05-08 14:20:00","endTime":"2019-05-08 14:20:00","elapsed":"0 s","status":true,"descript":"dd","value":"4"},{"id":11,"user":"admin","startTime":"2019-05-08 14:25:00","endTime":"2019-05-08 14:25:00","elapsed":"0 s","status":true,"descript":"dd","value":"0"},{"id":12,"user":"admin","startTime":"2019-05-08 14:30:00","endTime":"2019-05-08 14:30:00","elapsed":"0 s","status":true,"descript":"dd","value":"0"},{"id":13,"user":"admin","startTime":"2019-05-08 14:35:00","endTime":"2019-05-08 14:35:00","elapsed":"0 s","status":true,"descript":"dd","value":"0"},{"id":14,"user":"admin","startTime":"2019-05-08 14:40:00","endTime":"2019-05-08 14:40:00","elapsed":"0 s","status":true,"descript":"dd","value":"2"},{"id":15,"user":"admin","startTime":"2019-05-08 14:45:00","endTime":"2019-05-08 14:45:01","elapsed":"1 s","status":true,"descript":"dd","value":"1"}]}'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,res]);
        }, 500);
      });
    });

    mock.onPost('/flow/updateTask').reply(config => {
      let { task } = JSON.parse(config.data);
      alert(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    mock.onPost('/flow/cron').reply(config => {
      alert(config.data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    mock.onGet('/flow/execute').reply(config => {
      let {flowId}=config.params
      alert(flowId)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
          }]);
        }, 100);
      });
    });


    mock.onGet('/flow/list').reply(config => {
      let res='{"msg":"SUCCESS!","total":6,"code":200,"flows":[{"id":2,"userName":"meN0By2JGX","name":"fsdf","description":"test","cron":"0 0 0 * * ?","status":0,"createTime":"2019-05-06 14:41:46","updateTime":"2019-05-23 14:27:09"},{"id":3,"userName":"eX7cMzGgg8","name":"cvxvc","description":"test","cron":"0 0 0 * * ?","status":0,"createTime":"2019-05-06 14:42:54","updateTime":"2019-05-23 14:27:09"},{"id":4,"userName":"meN0By2JGX","name":"dfsddf","description":"test","cron":"0 0 0 * * ?","status":0,"createTime":"2019-05-06 14:44:43","updateTime":"2019-05-23 14:27:09"},{"id":5,"userName":"meN0By2JGX","name":"sfdsfdff","description":"test","cron":"0 0 0 * * ?","status":0,"createTime":"2019-05-06 14:45:47","updateTime":"2019-05-23 14:27:09"},{"id":6,"userName":"rnVoSEGct7","name":"test_run","description":"test","cron":"0 0 0 * * ?","status":0,"createTime":"2019-05-06 14:48:12","updateTime":"2019-05-23 14:27:09"},{"id":7,"userName":"meN0By2JGX","name":"test_run2","description":"test","cron":"0 52 13 * * ?","status":1,"createTime":"2019-05-07 11:23:04","updateTime":"2019-05-08 13:51:29"}]}'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,res]);
        }, 500);
      });
    });

    mock.onGet('/flow/info').reply(config => {
      let res='{"msg":"SUCCESS!","code":200,"flow":{"id":6,"uid":2,"name":"test_run","descript":null,"cron":"0 0 0 * * ?","libpath":"uploaded/meN0By2JGX/test_run_6/lib.zip","status":0,"createTime":"2019-05-06T06:48:12.000+0000","updateTime":"2019-05-23T06:27:09.000+0000","tasks":null}}'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,res]);
        }, 500);
      });
    });

    mock.onGet('/flow/task').reply(config => {
      let res='{"msg":"SUCCESS!","code":200,"tasks":[{"id":1,"name":"A","dependencies":[],"description":"node a","command":"bash a.sh"},{"id":2,"name":"B","dependencies":[1],"description":"node b","command":"bash b.sh"},{"id":3,"name":"C","dependencies":[2],"description":"node c","command":"bash c.sh"}]}'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,res]);
        }, 500);
      });
    });

    mock.onGet('/flowExecution/list').reply(config => {
      let res='{"msg":"SUCCESS!","total":8,"code":200,"executions":[{"id":1,"beginTime":"2019-05-08 13:00:04","endTime":null,"status":2,"value":0,"taskExecutions":[{"id":17,"nodeId":1,"beginTime":"2019-05-07 13:15:25","endTime":"2019-05-07 13:15:30","status":0,"value":5},{"id":18,"nodeId":2,"beginTime":"2019-05-07 13:15:25","endTime":"2019-05-07 13:15:30","status":0,"value":5},{"id":19,"nodeId":3,"beginTime":"2019-05-07 13:15:25","endTime":"2019-05-07 13:15:30","status":0,"value":5},{"id":28,"nodeId":1,"beginTime":"2019-05-08 13:00:11","endTime":"2019-05-08 13:03:11","status":0,"value":180},{"id":29,"nodeId":2,"beginTime":"2019-05-08 13:00:11","endTime":"2019-05-08 13:03:11","status":0,"value":180},{"id":30,"nodeId":3,"beginTime":"2019-05-08 13:03:13","endTime":"2019-05-08 13:06:13","status":0,"value":180}]},{"id":2,"beginTime":"2019-05-08 13:13:38","endTime":"2019-05-08 13:17:47","status":0,"value":249,"taskExecutions":[{"id":21,"nodeId":1,"beginTime":"2019-05-07 13:16:44","endTime":"2019-05-07 13:19:49","status":0,"value":185},{"id":22,"nodeId":2,"beginTime":"2019-05-07 13:16:44","endTime":"2019-05-07 13:19:50","status":0,"value":186},{"id":23,"nodeId":3,"beginTime":"2019-05-07 13:16:44","endTime":"2019-05-07 13:19:50","status":0,"value":186},{"id":31,"nodeId":1,"beginTime":"2019-05-08 13:13:40","endTime":"2019-05-08 13:16:40","status":0,"value":180},{"id":32,"nodeId":2,"beginTime":"2019-05-08 13:13:41","endTime":"2019-05-08 13:16:41","status":0,"value":180},{"id":33,"nodeId":3,"beginTime":"2019-05-08 13:16:46","endTime":"2019-05-08 13:17:47","status":0,"value":61}]},{"id":3,"beginTime":"2019-05-08 13:20:42","endTime":"2019-05-08 13:25:02","status":0,"value":260,"taskExecutions":[{"id":25,"nodeId":1,"beginTime":"2019-05-07 14:07:47","endTime":"2019-05-07 14:10:54","status":0,"value":187},{"id":26,"nodeId":2,"beginTime":"2019-05-07 14:07:47","endTime":"2019-05-07 14:10:54","status":0,"value":187},{"id":27,"nodeId":3,"beginTime":"2019-05-07 14:10:55","endTime":"2019-05-07 14:14:00","status":0,"value":185},{"id":34,"nodeId":1,"beginTime":"2019-05-08 13:20:48","endTime":"2019-05-08 13:21:48","status":0,"value":60},{"id":35,"nodeId":2,"beginTime":"2019-05-08 13:20:48","endTime":"2019-05-08 13:21:48","status":0,"value":60},{"id":36,"nodeId":3,"beginTime":"2019-05-08 13:22:01","endTime":"2019-05-08 13:25:02","status":0,"value":181}]},{"id":4,"beginTime":"2019-05-08 13:23:00","endTime":"2019-05-08 13:24:07","status":1,"value":67,"taskExecutions":[{"id":37,"nodeId":1,"beginTime":"2019-05-08 13:23:06","endTime":"2019-05-08 13:24:06","status":0,"value":60},{"id":38,"nodeId":2,"beginTime":"2019-05-08 13:23:06","endTime":"2019-05-08 13:24:07","status":0,"value":61}]},{"id":5,"beginTime":"2019-05-08 13:47:43","endTime":null,"status":2,"value":0,"taskExecutions":[{"id":39,"nodeId":1,"beginTime":"2019-05-08 13:47:56","endTime":"2019-05-08 13:48:57","status":0,"value":61},{"id":40,"nodeId":2,"beginTime":"2019-05-08 13:47:57","endTime":"2019-05-08 13:48:57","status":0,"value":60},{"id":41,"nodeId":3,"beginTime":"2019-05-08 13:49:00","endTime":null,"status":2,"value":null}]},{"id":6,"beginTime":"2019-05-08 13:48:00","endTime":"2019-05-08 13:48:01","status":1,"value":1,"taskExecutions":[]},{"id":7,"beginTime":"2019-05-08 13:51:15","endTime":"2019-05-08 13:55:33","status":0,"value":258,"taskExecutions":[{"id":42,"nodeId":1,"beginTime":"2019-05-08 13:51:30","endTime":"2019-05-08 13:52:30","status":0,"value":60},{"id":43,"nodeId":2,"beginTime":"2019-05-08 13:51:31","endTime":"2019-05-08 13:52:31","status":0,"value":60},{"id":46,"nodeId":3,"beginTime":"2019-05-08 13:52:33","endTime":"2019-05-08 13:55:33","status":0,"value":180}]},{"id":8,"beginTime":"2019-05-08 13:52:00","endTime":"2019-05-08 13:56:20","status":0,"value":260,"taskExecutions":[{"id":44,"nodeId":1,"beginTime":"2019-05-08 13:52:05","endTime":"2019-05-08 13:53:05","status":0,"value":60},{"id":45,"nodeId":2,"beginTime":"2019-05-08 13:52:05","endTime":"2019-05-08 13:53:06","status":0,"value":61},{"id":47,"nodeId":3,"beginTime":"2019-05-08 13:53:20","endTime":"2019-05-08 13:56:20","status":0,"value":180}]}]}'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,res]);
        }, 500);
      });
    });

  }
};
