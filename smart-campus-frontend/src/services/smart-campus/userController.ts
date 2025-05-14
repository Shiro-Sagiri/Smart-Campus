// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 批量添加用户 POST /user/add/batch */
export async function batchAddUsers(body: API.UserAddRequest[], options?: { [key: string]: any }) {
  return request<API.BaseResponseBatchResult>('/user/add/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增单个用户 POST /user/add/single */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/user/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前登入用户 GET /user/currentUser */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserVO>('/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 根据id删除用户 DELETE /user/delete/${param0} */
export async function deleteUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/user/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取用户 GET /user/get/${param0} */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseUserVO>(`/user/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据班级id分页获取学生列表 POST /user/get/student/page */
export async function getStudentListByClassId(
  body: API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageUserVO>('/user/get/student/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取职工列表 GET /user/get/teacher */
export async function getTeacherList(options?: { [key: string]: any }) {
  return request<API.BaseResponseListUserVO>('/user/get/teacher', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户登录 POST /user/login */
export async function userLogin(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseUserVO>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登出 GET /user/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/user/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取用户列表 POST /user/page/list */
export async function listUserByPage(body: API.UserQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseIPageUserVO>('/user/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新用户 PUT /user/update/${param0} */
export async function updateUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserByIdParams,
  body: API.UserUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/user/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 PUT /user/update/password */
export async function updatePassword(
  body: API.ChangePasswordRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseVoid>('/user/update/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
