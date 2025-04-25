// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增课程 POST /course/add/single */
export async function addCourse(body: API.CourseAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/course/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除课程 DELETE /course/delete/${param0} */
export async function deleteCourseById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCourseByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/course/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取课程 GET /course/get/${param0} */
export async function getCourseById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCourseByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseCourse>(`/course/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取课程列表 POST /course/page/list */
export async function listCourseByPage(
  body: API.CourseQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageCourse>('/course/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新课程 PUT /course/update/${param0} */
export async function updateCourseById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCourseByIdParams,
  body: API.CourseUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/course/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
