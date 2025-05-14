-- 创建数据库
CREATE
    DATABASE IF NOT EXISTS smart_campus DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE
    smart_campus;

-- ----------------------------
-- 1. 用户表（核心表）
-- ----------------------------
CREATE TABLE `user`
(
    `userId`      VARCHAR(20) PRIMARY KEY COMMENT '学号或工号', #学号为10位=2(年份后两位)+2(学院)+2(专业)+2(班级)+2(序号)
    `classId`     char(8) COMMENT '所属班级ID',
    `userName`    VARCHAR(50)                        NOT NULL COMMENT '用户名',
    `userAvatar`  VARCHAR(200) COMMENT '用户头像url',
    `password`    VARCHAR(100)                       NOT NULL COMMENT '加密密码',
    `role`        ENUM ('student','teacher','admin') NOT NULL DEFAULT 'student' COMMENT '角色',
    `email`       VARCHAR(50) COMMENT '邮箱',
    `phone`       VARCHAR(15)                        NOT NULL COMMENT '手机号',
    `createdTime` DATETIME                           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 学院表（新增）
-- ----------------------------
CREATE TABLE `college`
(
    `collegeId`   char(2) PRIMARY KEY COMMENT '学院编号', #两位数(序号)
    `collegeName` VARCHAR(50) NOT NULL COMMENT '学院名称',
    `description` VARCHAR(500) COMMENT '学院简介'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 专业表（新增）
-- ----------------------------
CREATE TABLE `major`
(
    `majorId`     CHAR(4) PRIMARY KEY COMMENT '专业编号', #三位数=2(学院)+2(序号)
    `majorName`   VARCHAR(50) NOT NULL COMMENT '专业名称',
    `collegeId`   CHAR(2)     NOT NULL COMMENT '所属学院',
    `description` VARCHAR(500) COMMENT '专业简介',
    FOREIGN KEY (`collegeId`) REFERENCES `college` (`collegeId`),
    INDEX `idx_college` (`collegeId`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 班级表（新增）
-- ----------------------------
CREATE TABLE `class`
(
    `classId`       CHAR(8) PRIMARY KEY COMMENT '班级ID', #八位数=2(年份后两位)+2(学院)+2(专业)+2(序号)
    `majorId`       CHAR(4) NOT NULL COMMENT '所属专业',
    `headTeacherId` VARCHAR(20) COMMENT '班主任工号',
    `admissionYear` CHAR(4) NOT NULL COMMENT '入学年份',
    `studentCount`  INT DEFAULT 0 COMMENT '学生人数',
    FOREIGN KEY (`majorId`) REFERENCES `major` (`majorId`),
    FOREIGN KEY (`headTeacherId`) REFERENCES `user` (`userId`),
    INDEX `idx_major` (`majorId`),
    INDEX `idx_teacher` (`headTeacherId`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 2. 课程表（优化版）
-- ----------------------------
CREATE TABLE `course`
(
    `courseId`    INT AUTO_INCREMENT PRIMARY KEY COMMENT '课程ID',
    `courseName`  VARCHAR(100)         NOT NULL COMMENT '课程名称',
    `semester`    CHAR(11)             NOT NULL COMMENT '学期（格式：YYYY-YYYY-1/2，如2023-2024-1）',
    `credit`      DECIMAL(3, 1)        NOT NULL COMMENT '学分',
    `teacherId`   VARCHAR(20)          NOT NULL COMMENT '授课教师ID',
    `selected`    INT        DEFAULT 0 NOT NULL COMMENT '已选人数',
    `maxCapacity` INT                  NOT NULL COMMENT '最大选课人数',
    `hours`       INT                  NOT NULL COMMENT '总学时',
    `schedule`    JSON                 NOT NULL COMMENT '时间安排（JSON结构）',
    `location`    VARCHAR(100) COMMENT '教室地点',
    `isDeleted`   TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',

    -- 索引
    INDEX `idx_semester` (`semester`),
    INDEX `idx_teacher` (`teacherId`),

    FOREIGN KEY (`teacherId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 3. 成绩表
-- ----------------------------
CREATE TABLE `grade`
(
    `gradeId`   INT AUTO_INCREMENT PRIMARY KEY COMMENT '成绩ID',
    `studentId` VARCHAR(20) NOT NULL COMMENT '学生ID',
    `courseId`  INT         NOT NULL COMMENT '课程ID',
    `score`     FLOAT COMMENT '成绩',
    `isDeleted` TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`studentId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION,
    FOREIGN KEY (`courseId`) REFERENCES `Course` (`courseId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 4. 选课记录表
-- ----------------------------
CREATE TABLE `course_selection`
(
    `selectionId`   INT AUTO_INCREMENT PRIMARY KEY COMMENT '选课记录ID',
    `studentId`     VARCHAR(20)                  NOT NULL COMMENT '学生ID',
    `courseId`      INT                          NOT NULL COMMENT '课程ID',
    `operationTime` DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '选课时间',
    FOREIGN KEY (`studentId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION,
    FOREIGN KEY (`courseId`) REFERENCES `Course` (`courseId`) ON DELETE NO ACTION,
    UNIQUE KEY `uniqueSelection` (`studentId`, `courseId`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 5. 课程评价表（新增）
-- ----------------------------
CREATE TABLE `course_evaluation`
(
    `evaluationId` INT AUTO_INCREMENT PRIMARY KEY COMMENT '评价ID',
    `studentId`    VARCHAR(20) NOT NULL COMMENT '学生ID',
    `courseId`     INT         NOT NULL COMMENT '课程ID',
    `rating`       TINYINT     NOT NULL CHECK (`rating` BETWEEN 1 AND 5) COMMENT '评分',
    `comment`      TEXT COMMENT '评语',
    `submitTime`   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    `isDeleted`    TINYINT(1)           DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`studentId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION,
    FOREIGN KEY (`courseId`) REFERENCES `Course` (`courseId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 6. 校园卡表
-- ----------------------------
CREATE TABLE `campus_card`
(
    `cardId`  VARCHAR(20) PRIMARY KEY COMMENT '校园卡号',
    `userId`  VARCHAR(20)    NOT NULL UNIQUE COMMENT '用户ID',
    `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '余额',
    `isLost`  TINYINT(1)              DEFAULT 0 COMMENT '挂失状态',
    FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 7. 消费记录表(硬删除)
-- ----------------------------
CREATE TABLE `transaction`
(
    `transactionId` INT AUTO_INCREMENT PRIMARY KEY COMMENT '交易ID',
    `cardId`        VARCHAR(20)               NOT NULL COMMENT '校园卡号',
    `type`          ENUM ('recharge','spend') NOT NULL COMMENT '交易类型',
    `amount`        DECIMAL(10, 2)            NOT NULL COMMENT '金额',
    `timestamp`     DATETIME                  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
    FOREIGN KEY (`cardId`) REFERENCES campus_card (`cardId`) ON DELETE CASCADE,
    INDEX `idxCardTime` (`cardId`, `timestamp`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 8. 图书表
-- ----------------------------
CREATE TABLE `book`
(
    `bookId`        INT AUTO_INCREMENT PRIMARY KEY COMMENT '图书ID',
    `description`   varchar(500) COMMENT '简介',
    `title`         VARCHAR(200)         NOT NULL COMMENT '书名',
    `cover`         VARCHAR(500) COMMENT '封面URL',
    `author`        VARCHAR(100)         NOT NULL COMMENT '作者',
    `publisherName` VARCHAR(100)         NOT NULL COMMENT '出版社名称',
    `publishDate`   DATE COMMENT '出版日期',
    `total`         INT                  NOT NULL COMMENT '馆藏总量',
    `borrowedNum`   INT        DEFAULT 0 NOT NULL COMMENT '借出数量',
    `isDeleted`     TINYINT(1) DEFAULT 0 COMMENT '逻辑删除',
    INDEX `idx_title_author` (`title`, `author`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 9. 借阅记录表
-- ----------------------------
CREATE TABLE `borrow_record`
(
    `recordId`   INT AUTO_INCREMENT PRIMARY KEY COMMENT '借阅ID',
    `userId`     VARCHAR(20) NOT NULL COMMENT '用户ID',
    `bookId`     INT         NOT NULL COMMENT '图书ID',
    `borrowTime` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '借出时间',
    `dueTime`    date        NOT NULL COMMENT '应还时间',
    `returnTime` DATETIME COMMENT '实际归还时间',
    `fine`       DECIMAL(6, 2)        DEFAULT 0.00 COMMENT '罚款金额',
    `isPay`      TINYINT(1)  NOT NULL DEFAULT 0 COMMENT '是否缴纳',
    `isDeleted`  TINYINT(1)           DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION,
    FOREIGN KEY (`bookId`) REFERENCES `Book` (`bookId`) ON DELETE NO ACTION,
    INDEX `idxUserBook` (`userId`, `bookId`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 10. 公告表（新增）
-- ----------------------------
CREATE TABLE `announcement`
(
    `announcementId` INT AUTO_INCREMENT PRIMARY KEY COMMENT '公告ID',
    `title`          VARCHAR(200)                     NOT NULL COMMENT '标题',
    `content`        TEXT                             NOT NULL COMMENT '内容',
    `publisherId`    VARCHAR(20)                      NOT NULL COMMENT '发布人ID',
    `publishTime`    DATETIME                         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    `target`         ENUM ('all','student','teacher') NOT NULL DEFAULT 'all' COMMENT '目标受众',
    `isDeleted`      TINYINT(1)                                DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`publisherId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 11. 问卷表（新增）
-- ----------------------------
CREATE TABLE `survey`
(
    `surveyId`    INT AUTO_INCREMENT PRIMARY KEY COMMENT '问卷ID',
    `title`       VARCHAR(200) NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `creatorId`   VARCHAR(20)  NOT NULL COMMENT '创建人ID',
    `startTime`   DATETIME     NOT NULL COMMENT '开始时间',
    `endTime`     DATETIME     NOT NULL COMMENT '截止时间',
    `isDeleted`   TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`creatorId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 12. 问卷问题表（新增）
-- ----------------------------
CREATE TABLE `survey_question`
(
    `questionId` INT AUTO_INCREMENT PRIMARY KEY COMMENT '问题ID',
    `surveyId`   INT                              NOT NULL COMMENT '问卷ID',
    `type`       ENUM ('radio','multiple','text') NOT NULL COMMENT '问题类型',
    `content`    TEXT                             NOT NULL COMMENT '题干',
    `options`    JSON COMMENT '选项列表',
    FOREIGN KEY (`surveyId`) REFERENCES `Survey` (`surveyId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 13. 问卷回答表
-- ----------------------------
CREATE TABLE `survey_answer`
(
    `answerId`   INT AUTO_INCREMENT PRIMARY KEY COMMENT '回答ID',
    `surveyId`   INT                              NOT NULL COMMENT '问卷ID',
    `questionId` INT                              NOT NULL COMMENT '问题ID',
    `userId`     VARCHAR(20)                      NOT NULL COMMENT '用户ID',
    `type`       ENUM ('radio','multiple','text') NOT NULL COMMENT '问题类型',
    `answer`     TEXT                             NOT NULL COMMENT '回答内容',
    `submitTime` DATETIME                         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    FOREIGN KEY (`surveyId`) REFERENCES `Survey` (`surveyId`) ON DELETE NO ACTION,
    FOREIGN KEY (`questionId`) REFERENCES survey_question (`questionId`) ON DELETE NO ACTION,
    FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;