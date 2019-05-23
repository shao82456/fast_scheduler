import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/task/list`, { params: params }); };
export const getExecutionPage = params => { return axios.get(`${base}/taskExecution/list`,{ params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editTask = params => { return axios.post(`${base}/task/update`, params); };

export const addTask = params => { return axios.post(`${base}/task/add`, params); };

export const enableTask= params => { return axios.get(`${base}/task/cron/${params}`); };

export const cronTime= params => { return axios.get(`${base}/help/cronTime`,{ params: params }); };

export const httpCronTime= params => { return axios.get(`${base}/help/cronTime`,{ params: params }); };

export const httpSaveTask=params => { return axios.post(`${base}/flow/updateTask`, params); };
export const httpCronFlow=params => { return axios.post(`${base}/flow/cron`, params); };
export const httpExecuteFlow= params => { return axios.get(`${base}/flow/execute`,{ params: params }); };
export const httpRemoveFlow= params => { return axios.get(`${base}/flow/remove`,{ params: params }); };
export const httpGetFlowExecutionPage = params => { return axios.get(`${base}/flowExecution/list`,{ params: params }); };
export const httpGetExecutionLog = params => { return axios.get(`${base}/help/log`,{ params: params }); };
export const httpUnscheduleFlow =params => { return axios.get(`${base}/flow/unschedule`,{ params: params }); };
export const httpGetFlowListByPage =params=> { return axios.get(`${base}/flow/list`,{params:params});};
export const httpAddFlow =params=> { return axios.post(`${base}/flow/add`,params);};
export const httpGetFlow =params=> { return axios.get(`${base}/flow/info`,{params:params});};
export const httpGetFlowTask =params=> { return axios.get(`${base}/flow/task`,{params:params});};
