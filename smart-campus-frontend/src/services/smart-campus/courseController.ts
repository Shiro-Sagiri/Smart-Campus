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

/** 课程评价 POST /course/evaluate */
export async function evaluateCourse(
  body: API.CourseCommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseVoid>('/course/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取课程评价列表 GET /course/evaluate/list */
export async function getCourseEvaluationList(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringListCourseEvaluation>('/course/evaluate/list', {
    method: 'GET',
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

/** 分页获取登录用户的选课列表 POST /course/my/course/page/list */
export async function listMyCourseByPage(
  body: API.CourseQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageCourse>('/course/my/course/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取我的课程表信息 GET /course/my/course/timetable */
export async function getMyCourseTimetable(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyCourseTimetableParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListCourse>('/course/my/course/timetable', {
    method: 'GET',
    params: {
      ...params,
    },
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

/** 选课 POST /course/select/${param0}/${param1} */
export async function selectCourse(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectCourseParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, studentId: param1, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/course/select/${param0}/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 退选课程 POST /course/unselect/${param0}/${param1} */
export async function unselectCourse(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unselectCourseParams,
  options?: { [key: string]: any },
) {
  const { courseId: param0, studentId: param1, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/course/unselect/${param0}/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
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
