// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增图书 POST /book/add/single */
export async function addBook(body: API.BookAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseVoid>('/book/add/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id删除图书 DELETE /book/delete/${param0} */
export async function deleteBookById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBookByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/book/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取图书 GET /book/get/${param0} */
export async function getBookById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBookByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBook>(`/book/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取图书列表 POST /book/page/list */
export async function listBookByPage(body: API.BookQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseIPageBook>('/book/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新图书 PUT /book/update/${param0} */
export async function updateBookById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBookByIdParams,
  body: API.BookUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/book/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
