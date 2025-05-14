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

  type BaseResponseClass = {
    code?: number;
    data?: Class;
    message?: string;
  };

  type BaseResponseCollege = {
    code?: number;
    data?: College;
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

  type BaseResponseIPageClass = {
    code?: number;
    data?: IPageClass;
    message?: string;
  };

  type BaseResponseIPageCollege = {
    code?: number;
    data?: IPageCollege;
    message?: string;
  };

  type BaseResponseIPageCourse = {
    code?: number;
    data?: IPageCourse;
    message?: string;
  };

  type BaseResponseIPageGradeVO = {
    code?: number;
    data?: IPageGradeVO;
    message?: string;
  };

  type BaseResponseIPageMajor = {
    code?: number;
    data?: IPageMajor;
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

  type BaseResponseListClass = {
    code?: number;
    data?: Class[];
    message?: string;
  };

  type BaseResponseListCollege = {
    code?: number;
    data?: College[];
    message?: string;
  };

  type BaseResponseListCourse = {
    code?: number;
    data?: Course[];
    message?: string;
  };

  type BaseResponseListGrade = {
    code?: number;
    data?: Grade[];
    message?: string;
  };

  type BaseResponseListMajor = {
    code?: number;
    data?: Major[];
    message?: string;
  };

  type BaseResponseListSurveyAnswer = {
    code?: number;
    data?: SurveyAnswer[];
    message?: string;
  };

  type BaseResponseListUserVO = {
    code?: number;
    data?: UserVO[];
    message?: string;
  };

  type BaseResponseMajor = {
    code?: number;
    data?: Major;
    message?: string;
  };

  type BaseResponseMapStringListCourseEvaluation = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseRankVO = {
    code?: number;
    data?: RankVO;
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

  type ChangePasswordRequest = {
    oldPassword?: string;
    newPassword?: string;
    userId?: string;
  };

  type Class = {
    classId?: string;
    majorId?: string;
    headTeacherId?: string;
    admissionYear?: string;
    studentCount?: number;
  };

  type ClassAddRequest = {
    classId: string;
    majorId: string;
    headTeacherId: string;
    admissionYear: string;
  };

  type ClassQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    majorId?: string;
    headTeacherId?: string;
  };

  type ClassUpdateRequest = {
    majorId: string;
    headTeacherId: string;
  };

  type College = {
    collegeId?: string;
    collegeName?: string;
    description?: string;
  };

  type CollegeAddRequest = {
    collegeId: string;
    collegeName: string;
    description?: string;
  };

  type CollegeQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    collegeId?: string;
    collegeName?: string;
  };

  type CollegeUpdateRequest = {
    collegeName: string;
    description?: string;
  };

  type Course = {
    courseId?: number;
    courseName?: string;
    semester?: string;
    credit?: number;
    teacherId?: string;
    maxCapacity?: number;
    selected?: number;
    hours?: number;
    schedule?: Schedule;
    location?: string;
    isDeleted?: number;
  };

  type CourseAddRequest = {
    courseName: string;
    credit: number;
    hours?: number;
    teacherId: string;
    semester?: string;
    maxCapacity: number;
    schedule?: Schedule;
    location: string;
  };

  type CourseCommentAddRequest = {
    rating?: number;
    comment?: string;
    courseId?: number;
  };

  type CourseEvaluation = {
    evaluationId?: number;
    studentId?: string;
    courseId?: number;
    rating?: number;
    comment?: string;
    submitTime?: string;
    isDeleted?: number;
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
    hours?: number;
    semester?: string;
    schedule?: Schedule;
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

  type deleteClassByIdParams = {
    id: string;
  };

  type deleteCollegeByIdParams = {
    id: string;
  };

  type deleteCourseByIdParams = {
    id: string;
  };

  type deleteMajorByIdParams = {
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

  type getClassByIdParams = {
    id: string;
  };

  type getCollegeByIdParams = {
    id: string;
  };

  type getCourseByIdParams = {
    id: string;
  };

  type getMajorByIdParams = {
    id: string;
  };

  type getMyCourseTimetableParams = {
    semester: string;
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

  type Grade = {
    gradeId?: number;
    studentId?: string;
    courseId?: number;
    score?: number;
    isDeleted?: number;
  };

  type GradeAddRequest = {
    studentId?: string;
    courseId?: number;
    score?: number;
  };

  type GradeQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    semester?: string;
  };

  type GradeVO = {
    courseId?: number;
    courseName?: string;
    semester?: string;
    credit?: number;
    teacherId?: string;
    hours?: number;
    score?: number;
    isComment?: boolean;
  };

  type IPageAnnouncement = {
    size?: number;
    total?: number;
    records?: Announcement[];
    current?: number;
    pages?: number;
  };

  type IPageBook = {
    size?: number;
    total?: number;
    records?: Book[];
    current?: number;
    pages?: number;
  };

  type IPageBorrowedBookVO = {
    size?: number;
    total?: number;
    records?: BorrowedBookVO[];
    current?: number;
    pages?: number;
  };

  type IPageCampusCard = {
    size?: number;
    total?: number;
    records?: CampusCard[];
    current?: number;
    pages?: number;
  };

  type IPageClass = {
    size?: number;
    total?: number;
    records?: Class[];
    current?: number;
    pages?: number;
  };

  type IPageCollege = {
    size?: number;
    total?: number;
    records?: College[];
    current?: number;
    pages?: number;
  };

  type IPageCourse = {
    size?: number;
    total?: number;
    records?: Course[];
    current?: number;
    pages?: number;
  };

  type IPageGradeVO = {
    size?: number;
    total?: number;
    records?: GradeVO[];
    current?: number;
    pages?: number;
  };

  type IPageMajor = {
    size?: number;
    total?: number;
    records?: Major[];
    current?: number;
    pages?: number;
  };

  type IPageSurveyAnswer = {
    size?: number;
    total?: number;
    records?: SurveyAnswer[];
    current?: number;
    pages?: number;
  };

  type IPageSurveyVO = {
    size?: number;
    total?: number;
    records?: SurveyVO[];
    current?: number;
    pages?: number;
  };

  type IPageTransaction = {
    size?: number;
    total?: number;
    records?: Transaction[];
    current?: number;
    pages?: number;
  };

  type IPageUserVO = {
    size?: number;
    total?: number;
    records?: UserVO[];
    current?: number;
    pages?: number;
  };

  type listGradesByStudentIdsParams = {
    courseId: number;
  };

  type listStudentByPageParams = {
    id: number;
  };

  type Major = {
    majorId?: string;
    majorName?: string;
    collegeId?: string;
    description?: string;
  };

  type MajorAddRequest = {
    majorId: string;
    majorName: string;
    collegeId: string;
    description?: string;
  };

  type MajorQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    majorId?: string;
    majorName?: string;
    collegeId?: string;
  };

  type MajorUpdateRequest = {
    majorName: string;
    collegeId: string;
    description?: string;
  };

  type payFineParams = {
    id: number;
  };

  type RankVO = {
    studentId?: string;
    studentName?: string;
    totalCredit?: number;
    requiredCredit?: number;
    failCredit?: number;
    totalCourse?: number;
    gpa?: number;
    classRank?: number;
    majorRank?: number;
  };

  type returnBookParams = {
    id: number;
  };

  type Schedule = {
    weeks?: string;
    weekdays?: string;
    sections?: string;
    remark?: string;
  };

  type selectCourseParams = {
    courseId: number;
    studentId: string;
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

  type unselectCourseParams = {
    courseId: number;
    studentId: string;
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

  type updateClassByIdParams = {
    id: string;
  };

  type updateCollegeByIdParams = {
    id: string;
  };

  type updateCourseByIdParams = {
    id: number;
  };

  type updateMajorByIdParams = {
    id: string;
  };

  type updateSurveyByIdParams = {
    id: number;
  };

  type updateUserByIdParams = {
    id: string;
  };

  type UserAddRequest = {
    userName: string;
    password: string;
    role: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'ALL';
    userId?: string;
    userAvatar?: string;
    email?: string;
    phone: string;
    classId?: string;
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
    classId?: string;
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
    userName?: string;
    role?: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'ALL';
    userId?: string;
    classId?: string;
    majorName?: string;
    collegeName?: string;
    email?: string;
    userAvatar?: string;
    phone?: string;
    createdTime?: string;
  };
}
