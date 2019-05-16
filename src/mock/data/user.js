import Mock from 'mockjs';
const loginUsers = [
  {
    name: 'admin',
    password: 'admin',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
  }
];

const tasks = [];

for (let i = 0; i < 86; i++) {
  tasks.push(Mock.mock({
    id:Mock.Random.integer(1,100),
    uid: Mock.Random.integer(1,100),
    name: Mock.Random.string('abcdefghijklmnopqrstuvwxyz',4,8),
    command:'bash '+Mock.Random.string('abcdefghijklmnopqrstuvwxyz',4,8)+'.sh',
    cron:'0 0  * *  * ? ',
    status:Mock.Random.integer(0,1),
    descript:'test'
  }));
}

export { loginUsers, tasks };
