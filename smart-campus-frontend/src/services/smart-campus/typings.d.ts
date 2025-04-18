declare namespace API {
  type Announcement = {
    announcementId?: number;
    title?: string;
    content?: string;
    publisherId?: string;
    publishTime?: string;
    target?: 'STUDENT' | 'ALL' | 'TEACHER';
    isDeleted?: number;
  };

  type AnnouncementAddRequest = {
    title: string;
    content: string;
    target: 'STUDENT' | 'ALL' | 'TEACHER';
  };

  type AnnouncementQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    target?: 'STUDENT' | 'ALL' | 'TEACHER';
    title?: string;
  };

  type AnnouncementUpdateRequest = {
    title?: string;
    content?: string;
    target?: 'STUDENT' | 'ALL' | 'TEACHER';
  };

  type BaseResponseAnnouncement = {
    code?: number;
    data?: Announcement;
    message?: string;
  };

  type BaseResponseBatchResult = {
    code?: number;
    data?: BatchResult;
    message?: string;
  };

  type BaseResponseBook = {
    code?: number;
    data?: Book;
    message?: string;
  };

  type BaseResponseCampusCard = {
    code?: number;
    data?: CampusCard;
    message?: string;
  };

  type BaseResponseIPageAnnouncement = {
    code?: number;
    data?: IPageAnnouncement;
    message?: string;
  };

  type BaseResponseIPageBook = {
    code?: number;
    data?: IPageBook;
    message?: string;
  };

  type BaseResponseIPageCampusCard = {
    code?: number;
    data?: IPageCampusCard;
    message?: string;
  };

  type BaseResponseIPageUserVO = {
    code?: number;
    data?: IPageUserVO;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type BaseResponseVoid = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BatchFailure = {
    index?: number;
    reason?: string;
  };

  type BatchResult = {
    successCount?: number;
    failures?: BatchFailure[];
  };

  type Book = {
    bookId?: number;
    title?: string;
    cover?: string;
    author?: string;
    status?: 'AVAILABLE' | 'BORROWED';
    isDeleted?: number;
  };

  type BookAddRequest = {
    title: string;
    cover?: string;
    author: string;
    status: 'AVAILABLE' | 'BORROWED';
  };

  type BookQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    status?: 'AVAILABLE' | 'BORROWED';
    author?: string;
  };

  type BookUpdateRequest = {
    title: string;
    cover?: string;
    author: string;
    status: 'AVAILABLE' | 'BORROWED';
  };

  type CampusCard = {
    cardId?: string;
    userId?: string;
    balance?: number;
    isLost?: number;
  };

  type CampusCardAddRequest = {
    userId: string;
  };

  type CampusCardQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: string;
  };

  type CampusCardUpdateRequest = {
    isLost?: number;
    balance?: number;
  };

  type deleteAnnouncementByIdParams = {
    id: string;
  };

  type deleteBookByIdParams = {
    id: string;
  };

  type deleteCampusCardByIdParams = {
    id: string;
  };

  type deleteUserByIdParams = {
    id: string;
  };

  type getAnnouncementByIdParams = {
    id: string;
  };

  type getBookByIdParams = {
    id: string;
  };

  type getCampusCardByIdParams = {
    id: string;
  };

  type getUserByIdParams = {
    id: string;
  };

  type IPageAnnouncement = {
    size?: number;
    current?: number;
    records?: Announcement[];
    total?: number;
    pages?: number;
  };

  type IPageBook = {
    size?: number;
    current?: number;
    records?: Book[];
    total?: number;
    pages?: number;
  };

  type IPageCampusCard = {
    size?: number;
    current?: number;
    records?: CampusCard[];
    total?: number;
    pages?: number;
  };

  type IPageUserVO = {
    size?: number;
    current?: number;
    records?: UserVO[];
    total?: number;
    pages?: number;
  };

  type updateAnnouncementByIdParams = {
    id: number;
  };

  type updateBookByIdParams = {
    id: number;
  };

  type updateCampusCardByIdParams = {
    id: string;
  };

  type updateUserByIdParams = {
    id: number;
  };

  type UserAddRequest = {
    userName: string;
    password: string;
    role: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'ALL';
    userId: string;
    userAvatar?: string;
    email?: string;
    phone: string;
  };

  type UserLoginRequest = {
    userId: string;
    password: string;
  };

  type UserQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: string;
    role?: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'ALL';
    userName?: string;
  };

  type UserUpdateRequest = {
    userName: string;
    role: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'ALL';
    userId: string;
    userAvatar?: string;
    email?: string;
    phone: string;
  };

  type UserVO = {
    id?: number;
    userName?: string;
    role?: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'ALL';
    userId?: string;
    email?: string;
    userAvatar?: string;
    phone?: string;
    createdTime?: string;
  };
}
