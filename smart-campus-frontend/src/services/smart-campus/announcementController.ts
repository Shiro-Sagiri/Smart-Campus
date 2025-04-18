// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增公告 POST /announcement/add/single */
export async function addAnnouncement(
  body: API.AnnouncementAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseVoid>('/announcement/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除公告 DELETE /announcement/delete/${param0} */
export async function deleteAnnouncementById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAnnouncementByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/announcement/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取公告 GET /announcement/get/${param0} */
export async function getAnnouncementById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAnnouncementByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseAnnouncement>(`/announcement/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取公告列表 POST /announcement/page/list */
export async function listAnnouncementByPage(
  body: API.AnnouncementQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageAnnouncement>('/announcement/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新公告 PUT /announcement/update/${param0} */
export async function updateAnnouncementById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAnnouncementByIdParams,
  body: API.AnnouncementUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/announcement/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
