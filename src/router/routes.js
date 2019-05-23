import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Table from '../views/nav1/Table.vue'
import Execution from '../views/nav1/Execution'

import Flows from '../views/nav2/Flows.vue'
import Detail from '../views/nav2/Detail.vue'
import Log from '../views/nav2/Log.vue'

import Page6 from '../views/nav3/Page6.vue'
import echarts from '../views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/task',
        component: Home,
        name: 'Task',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/task/list', component: Table, name: 'Table' },
            { path: '/task/execution', component: Execution, name: '记录' },
        ]
    },
    {
        path: '/flow',
        component: Home,
        name: 'Flow',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/flow/list', component: Flows, name: 'Flows' },
            { path: '/flow/detail', component: Detail, name: 'Detail' },
            { path: '/log', component: Log, name: 'Log' }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
