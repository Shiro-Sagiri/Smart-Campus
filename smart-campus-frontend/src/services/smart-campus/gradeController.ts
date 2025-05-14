// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登记成绩 POST /grade/add */
export async function addGrade(body: API.GradeAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/grade/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取登录用户的成绩列表 POST /grade/list */
export async function listGrades(body: API.GradeQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseIPageGradeVO>('/grade/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据学生id列表和课程id获取成绩列表 POST /grade/list/${param0} */
export async function listGradesByStudentIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listGradesByStudentIdsParams,
  body: string[],
  options?: { [key: string]: any },
) {
  const { courseId: param0, ...queryParams } = params;
  return request<API.BaseResponseListGrade>(`/grade/list/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 根据课程id分页获取该课程学生列表 POST /grade/page/list/student/${param0} */
export async function listStudentByPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listStudentByPageParams,
  body: API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseIPageUserVO>(`/grade/page/list/student/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取登录用户的排名信息 GET /grade/rank */
export async function getGpa(options?: { [key: string]: any }) {
  return request<API.BaseResponseRankVO>('/grade/rank', {
    method: 'GET',
    ...(options || {}),
  });
}
