// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增学院 POST /college/add/single */
export async function addCollege(body: API.CollegeAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/college/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除学院 DELETE /college/delete/${param0} */
export async function deleteCollegeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCollegeByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/college/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取学院 GET /college/get/${param0} */
export async function getCollegeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCollegeByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseCollege>(`/college/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取学院列表 GET /college/list */
export async function listCollege(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCollege>('/college/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取学院列表 POST /college/page/list */
export async function listCollegeByPage(
  body: API.CollegeQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageCollege>('/college/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新学院 PUT /college/update/${param0} */
export async function updateCollegeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCollegeByIdParams,
  body: API.CollegeUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/college/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
