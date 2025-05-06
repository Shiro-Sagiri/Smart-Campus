// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增校园卡 POST /campusCard/add/single */
export async function addCampusCard(
  body: API.CampusCardAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseVoid>('/campusCard/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除校园卡 DELETE /campusCard/delete/${param0} */
export async function deleteCampusCardById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCampusCardByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/campusCard/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取校园卡 GET /campusCard/get/${param0} */
export async function getCampusCardById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCampusCardByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseCampusCard>(`/campusCard/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取校园卡列表 POST /campusCard/page/list */
export async function listCampusCardByPage(
  body: API.CampusCardQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageCampusCard>('/campusCard/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 消费 POST /campusCard/spend/${param0} */
export async function spend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.spendParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/campusCard/spend/${param0}`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 更新校园卡 PUT /campusCard/update/${param0} */
export async function updateCampusCardById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCampusCardByIdParams,
  body: API.CampusCardUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/campusCard/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
