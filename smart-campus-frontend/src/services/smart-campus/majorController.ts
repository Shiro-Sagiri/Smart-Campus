// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增专业 POST /major/add/single */
export async function addMajor(body: API.MajorAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/major/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除专业 DELETE /major/delete/${param0} */
export async function deleteMajorById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMajorByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/major/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取专业 GET /major/get/${param0} */
export async function getMajorById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMajorByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseMajor>(`/major/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取专业列表 GET /major/list */
export async function listMajor(options?: { [key: string]: any }) {
  return request<API.BaseResponseListMajor>('/major/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取专业列表 POST /major/page/list */
export async function listMajorByPage(
  body: API.MajorQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageMajor>('/major/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新专业 PUT /major/update/${param0} */
export async function updateMajorById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMajorByIdParams,
  body: API.MajorUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/major/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
