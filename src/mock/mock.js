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

    mock.onPost('/task/cron').reply(config => {
      alert(config.data)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'schedule success'
          }]);
        }, 500);
      });
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


    //编辑用户
    mock.onPost('/task/update').reply(config => {
      alert(config.data)
      let {id,name, command,status,description} = JSON.parse(config.data)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增任务
    mock.onPost('/task/add').reply(config => {
      let {name, command,status,description} = JSON.parse(config.data)
      _tasks.push({
        uid:100,
        name: name,
        command:command,
        status: status,
        description: description
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
      let res='{"msg":"SUCCESS!","total":2,"code":200,"executions":[{"id":4,"beginTime":"2019-05-26 06:04:51","endTime":null,"status":2,"value":0,"user":"ctA6uWwJHO"},{"id":5,"beginTime":"2019-05-26 06:19:51","endTime":"2019-05-26 06:20:21","status":0,"value":30,"user":"ctA6uWwJHO"}]}'
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

    mock.onPost('/flow/add').reply(config => {
      let {name,desc}=JSON.parse(config.data)
      alert(name)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
          }]);
        }, 100);
      });
    });

    mock.onPost('/flow/updateTask/').reply(config => {
      alert(config.data)
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
      let res='{"msg":"SUCCESS!","total":6,"code":200,"executions":[{"id":9,"beginTime":"2019-05-27 00:49:46","endTime":null,"status":2,"value":0,"taskExecutions":[]},{"id":10,"beginTime":"2019-05-27 01:01:38","endTime":null,"status":2,"value":0,"taskExecutions":[{"id":1,"nodeId":1,"beginTime":"2019-05-27 01:02:29","endTime":null,"status":2,"value":null}]},{"id":11,"beginTime":"2019-05-27 01:11:46","endTime":null,"status":2,"value":0,"taskExecutions":[{"id":2,"nodeId":1,"beginTime":"2019-05-27 01:12:38","endTime":null,"status":2,"value":null}]},{"id":12,"beginTime":"2019-05-27 01:20:39","endTime":null,"status":2,"value":0,"taskExecutions":[{"id":3,"nodeId":1,"beginTime":"2019-05-27 01:21:31","endTime":null,"status":2,"value":null}]},{"id":13,"beginTime":"2019-05-27 01:38:57","endTime":null,"status":2,"value":0,"taskExecutions":[{"id":4,"nodeId":1,"beginTime":"2019-05-27 01:39:04","endTime":null,"status":2,"value":null}]},{"id":14,"beginTime":"2019-05-27 01:44:42","endTime":"2019-05-27 01:46:41","status":0,"value":119,"taskExecutions":[{"id":5,"nodeId":1,"beginTime":"2019-05-27 01:44:57","endTime":"2019-05-27 01:45:27","status":0,"value":30},{"id":6,"nodeId":2,"beginTime":"2019-05-27 01:45:33","endTime":"2019-05-27 01:46:03","status":0,"value":30},{"id":7,"nodeId":3,"beginTime":"2019-05-27 01:46:11","endTime":"2019-05-27 01:46:41","status":0,"value":30}]}]}'
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200,res]);
        }, 500);
      });
    });

    mock.onGet('/task/uncron').reply(config => {
      alert(config.params.taskId)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'uncron success'
          }]);
        }, 500);
      });
    });

    mock.onGet('/task/remove').reply(config => {
      let taskId=config.params.taskId
      alert(taskId)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'remove success'
          }]);
        }, 500);
      });
    });

  }
};
