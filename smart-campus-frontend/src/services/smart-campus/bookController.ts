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

/** 借阅图书 POST /book/borrow/${param0} */
export async function borrowBook(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.borrowBookParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/book/borrow/${param0}`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 分页获取登录用户借阅的图书 POST /book/borrowed/page/list */
export async function listBorrowedBookByPage(
  body: API.BookQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseIPageBorrowedBookVO>('/book/borrowed/page/list', {
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

/** 缴纳罚款 POST /book/pay/fine/${param0} */
export async function payFine(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.payFineParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/book/pay/fine/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 归还图书 POST /book/return/${param0} */
export async function returnBook(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.returnBookParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseVoid>(`/book/return/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
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
