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

  type BaseResponseCourse = {
    code?: number;
    data?: Course;
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

  type BaseResponseIPageBorrowedBookVO = {
    code?: number;
    data?: IPageBorrowedBookVO;
    message?: string;
  };

  type BaseResponseIPageCampusCard = {
    code?: number;
    data?: IPageCampusCard;
    message?: string;
  };

  type BaseResponseIPageCourse = {
    code?: number;
    data?: IPageCourse;
    message?: string;
  };

  type BaseResponseIPageSurveyAnswer = {
    code?: number;
    data?: IPageSurveyAnswer;
    message?: string;
  };

  type BaseResponseIPageSurveyVO = {
    code?: number;
    data?: IPageSurveyVO;
    message?: string;
  };

  type BaseResponseIPageTransaction = {
    code?: number;
    data?: IPageTransaction;
    message?: string;
  };

  type BaseResponseIPageUserVO = {
    code?: number;
    data?: IPageUserVO;
    message?: string;
  };

  type BaseResponseListSurveyAnswer = {
    code?: number;
    data?: SurveyAnswer[];
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseSurveyVO = {
    code?: number;
    data?: SurveyVO;
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
    description?: string;
    title?: string;
    cover?: string;
    author?: string;
    publisherName?: string;
    publishDate?: string;
    total?: number;
    borrowedNum?: number;
    isDeleted?: number;
  };

  type BookAddRequest = {
    title: string;
    cover?: string;
    author: string;
    description?: string;
    publisherName?: string;
    publishDate?: string;
    total?: number;
    borrowedNum?: number;
  };

  type BookQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    author?: string;
    search?: string;
  };

  type BookUpdateRequest = {
    title: string;
    cover?: string;
    author: string;
    description?: string;
    publisherName?: string;
    publishDate?: string;
    total?: number;
    borrowedNum?: number;
  };

  type borrowBookParams = {
    id: number;
    dueTime: string;
  };

  type BorrowedBookVO = {
    cover?: string;
    recordId?: number;
    bookId?: number;
    title?: string;
    author?: string;
    borrowTime?: string;
    dueTime?: string;
    returnTime?: string;
    fine?: number;
    isPay?: number;
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

  type Course = {
    courseId?: number;
    courseName?: string;
    credit?: number;
    teacherId?: string;
    maxCapacity?: number;
    classTime?: string;
    location?: string;
    isDeleted?: number;
  };

  type CourseAddRequest = {
    courseName: string;
    credit: number;
    teacherId: string;
    maxCapacity: number;
    classTime: string;
    location: string;
  };

  type CourseQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    courseName?: string;
    teacherId?: string;
  };

  type CourseUpdateRequest = {
    courseName: string;
    credit: number;
    teacherId: string;
    maxCapacity: number;
    classTime: string;
    location: string;
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

  type deleteCourseByIdParams = {
    id: string;
  };

  type deleteSurveyByIdParams = {
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

  type getCourseByIdParams = {
    id: string;
  };

  type getSurveyAnswerParams = {
    surveyId: number;
  };

  type getSurveyVOByIdParams = {
    id: string;
  };

  type getTextAnswerParams = {
    surveyId: number;
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

  type IPageBorrowedBookVO = {
    size?: number;
    current?: number;
    records?: BorrowedBookVO[];
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

  type IPageCourse = {
    size?: number;
    current?: number;
    records?: Course[];
    total?: number;
    pages?: number;
  };

  type IPageSurveyAnswer = {
    size?: number;
    current?: number;
    records?: SurveyAnswer[];
    total?: number;
    pages?: number;
  };

  type IPageSurveyVO = {
    size?: number;
    current?: number;
    records?: SurveyVO[];
    total?: number;
    pages?: number;
  };

  type IPageTransaction = {
    size?: number;
    current?: number;
    records?: Transaction[];
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

  type payFineParams = {
    id: number;
  };

  type returnBookParams = {
    id: number;
  };

  type spendParams = {
    id: string;
    amount: number;
  };

  type submitSurveyAnswerParams = {
    surveyId: number;
  };

  type SurveyAddRequest = {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    surveyQuestionList: SurveyQuestion[];
  };

  type SurveyAnswer = {
    answerId?: number;
    surveyId?: number;
    questionId?: number;
    userId?: string;
    answer?: string;
    submitTime?: string;
    type?: 'RADIO' | 'MULTIPLE' | 'TEXT';
  };

  type SurveyQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
  };

  type SurveyQuestion = {
    questionId?: number;
    surveyId?: number;
    type?: 'RADIO' | 'MULTIPLE' | 'TEXT';
    content?: string;
    options?: string[];
  };

  type SurveyUpdateRequest = {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    surveyQuestionList: SurveyQuestion[];
  };

  type SurveyVO = {
    surveyId?: number;
    title?: string;
    description?: string;
    creatorId?: string;
    startTime?: string;
    endTime?: string;
    questionList?: SurveyQuestion[];
  };

  type Transaction = {
    transactionId?: number;
    cardId?: string;
    type?: 'RECHARGE' | 'SPEND';
    amount?: number;
    timestamp?: string;
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

  type updateCourseByIdParams = {
    id: number;
  };

  type updateSurveyByIdParams = {
    id: number;
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
