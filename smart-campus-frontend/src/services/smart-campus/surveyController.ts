// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增问卷 POST /survey/add/single */
export async function addSurvey(body: API.SurveyAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/survey/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除问卷 DELETE /survey/delete/${param0} */
export async function deleteSurveyById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSurveyByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/survey/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取问卷 GET /survey/get/${param0} */
export async function getSurveyVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSurveyVOByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseSurveyVO>(`/survey/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取问卷列表 POST /survey/page/list */
export async function listSurveyByPage(
  body: API.SurveyQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageSurvey>('/survey/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新问卷 PUT /survey/update/${param0} */
export async function updateSurveyById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateSurveyByIdParams,
  body: API.SurveyUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/survey/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
