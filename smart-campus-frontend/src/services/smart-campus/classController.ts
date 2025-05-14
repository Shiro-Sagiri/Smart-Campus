// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增班级 POST /class/add/single */
export async function addClass(body: API.ClassAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/class/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除班级 DELETE /class/delete/${param0} */
export async function deleteClassById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteClassByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/class/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取班级 GET /class/get/${param0} */
export async function getClassById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getClassByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseClass>(`/class/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取班级列表 GET /class/list */
export async function listClass(options?: { [key: string]: any }) {
  return request<API.BaseResponseListClass>('/class/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取班级列表 POST /class/page/list */
export async function listClassByPage(
  body: API.ClassQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageClass>('/class/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新班级 PUT /class/update/${param0} */
export async function updateClassById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateClassByIdParams,
  body: API.ClassUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/class/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
