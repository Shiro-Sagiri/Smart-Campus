-- 创建数据库
CREATE DATABASE IF NOT EXISTS smart_campus DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_campus;

-- ----------------------------
-- 1. 用户表（核心表）
-- ----------------------------
CREATE TABLE `user`
(
    `id`          INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `userName`    VARCHAR(50)                        NOT NULL COMMENT '用户名',
    `userAvatar`  VARCHAR(200)                       NOT NULL COMMENT '用户头像url',
    `password`    VARCHAR(100)                       NOT NULL COMMENT '加密密码',
    `role`        ENUM ('student','teacher','admin') NOT NULL DEFAULT 'student' COMMENT '角色',
    `userId`      VARCHAR(20) UNIQUE COMMENT '学号或工号',
    `email`       VARCHAR(50) COMMENT '邮箱',
    `phone`       VARCHAR(15)                        NOT NULL COMMENT '手机号',
    `createdTime` DATETIME                           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    `isDeleted`   TINYINT(1)                                  DEFAULT 0 COMMENT '逻辑删除标记'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 2. 课程表
-- ----------------------------
CREATE TABLE `course`
(
    `courseId`    INT AUTO_INCREMENT PRIMARY KEY COMMENT '课程ID',
    `courseName`  VARCHAR(100) NOT NULL COMMENT '课程名称',
    `credit`      FLOAT        NOT NULL COMMENT '学分',
    `teacherId`   VARCHAR(20)  NOT NULL COMMENT '授课教师ID',
    `maxCapacity` INT          NOT NULL COMMENT '最大选课人数',
    `classTime`   VARCHAR(50) COMMENT '上课时间',
    `location`    VARCHAR(100) COMMENT '教室地点',
    `isDeleted`   TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`teacherId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
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
    `semester`  VARCHAR(20) NOT NULL COMMENT '学期',
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
    `status`        ENUM ('selected','withdraw') NOT NULL DEFAULT 'selected' COMMENT '状态',
    `operationTime` DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    `isDeleted`     TINYINT(1)                            DEFAULT 0 COMMENT '逻辑删除标记',
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
    `cardId`    VARCHAR(20) PRIMARY KEY COMMENT '校园卡号',
    `userId`    VARCHAR(20)    NOT NULL UNIQUE COMMENT '用户ID',
    `balance`   DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '余额',
    `isLost`    TINYINT(1)              DEFAULT 0 COMMENT '挂失状态',
    FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 7. 消费记录表(硬删除) //todo
-- ----------------------------
CREATE TABLE `transaction`
(
    `transactionId` INT AUTO_INCREMENT PRIMARY KEY COMMENT '交易ID',
    `cardId`        VARCHAR(20)               NOT NULL COMMENT '校园卡号',
    `type`          ENUM ('recharge','spend') NOT NULL COMMENT '交易类型',
    `amount`        DECIMAL(10, 2)            NOT NULL COMMENT '金额',
    `merchant`      VARCHAR(50) COMMENT '商户名称',
    `timestamp`     DATETIME                  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
    FOREIGN KEY (`cardId`) REFERENCES campus_card (`cardId`) ON DELETE NO ACTION,
    INDEX `idxCardTime` (`cardId`, `timestamp`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 8. 图书表
-- ----------------------------
CREATE TABLE `book`
(
    `bookId`    INT AUTO_INCREMENT PRIMARY KEY COMMENT '图书ID',
    `title`     VARCHAR(200)                  NOT NULL COMMENT '书名',
    `cover`     VARCHAR(200)                           COMMENT '封面',
    `author`    VARCHAR(100)                  NOT NULL COMMENT '作者',
    `status`    ENUM ('available','borrowed') NOT NULL DEFAULT 'available',
    `isDeleted` TINYINT(1)                             DEFAULT 0 COMMENT '逻辑删除标记'
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
    `dueTime`    DATETIME    NOT NULL COMMENT '应还时间',
    `returnTime` DATETIME COMMENT '实际归还时间',
    `fine`       DECIMAL(6, 2)        DEFAULT 0.00 COMMENT '罚款金额',
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
    `title`       VARCHAR(200)             NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `creatorId`   VARCHAR(20)              NOT NULL COMMENT '创建人ID',
    `startTime`   DATETIME                 NOT NULL COMMENT '开始时间',
    `endTime`     DATETIME                 NOT NULL COMMENT '截止时间',
    `status`      ENUM ('ongoing','ended') NOT NULL DEFAULT 'ongoing',
    `isDeleted`   TINYINT(1)                        DEFAULT 0 COMMENT '逻辑删除标记',
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
    `isDeleted`  TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`surveyId`) REFERENCES `Survey` (`surveyId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- 13. 问卷回答表
-- ----------------------------
CREATE TABLE `survey_answer`
(
    `answerId`   INT AUTO_INCREMENT PRIMARY KEY COMMENT '回答ID',
    `surveyId`   INT         NOT NULL COMMENT '问卷ID',
    `questionId` INT         NOT NULL COMMENT '问题ID',
    `userId`     VARCHAR(20) NOT NULL COMMENT '用户ID',
    `answer`     TEXT        NOT NULL COMMENT '回答内容',
    `submitTime` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    `isDeleted`  TINYINT(1)           DEFAULT 0 COMMENT '逻辑删除标记',
    FOREIGN KEY (`surveyId`) REFERENCES `Survey` (`surveyId`) ON DELETE NO ACTION,
    FOREIGN KEY (`questionId`) REFERENCES survey_question (`questionId`) ON DELETE NO ACTION,
    FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;