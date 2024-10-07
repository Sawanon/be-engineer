-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NULL,
    `defaultHours` INTEGER NOT NULL,
    `tutorLink` VARCHAR(191) NOT NULL,
    `clueLink` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `odmCourseId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `branch` VARCHAR(45) NOT NULL,
    `webappCourseId` INTEGER NULL,
    `webappTableOfContentId` INTEGER NULL,
    `webappPlaylistId` INTEGER NULL,

    INDEX `Course_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseLesson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseOnCourseLesson` (
    `courseId` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,

    INDEX `CourseOnCourseLesson_lessonId_fkey`(`lessonId`),
    PRIMARY KEY (`courseId`, `lessonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoLink` VARCHAR(191) NOT NULL,
    `hour` INTEGER NOT NULL,
    `minute` INTEGER NOT NULL,
    `position` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,
    `descriptionId` INTEGER NULL,

    INDEX `CourseVideo_lessonId_fkey`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentBook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NULL,
    `inStock` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `DocumentBook_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentPreExam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    INDEX `DocumentPreExam_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentSheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    INDEX `DocumentSheet_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonOnDocument` (
    `lessonId` INTEGER NOT NULL,
    `preExamId` INTEGER NOT NULL,

    INDEX `LessonOnDocument_preExamId_fkey`(`preExamId`),
    PRIMARY KEY (`lessonId`, `preExamId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonOnDocumentBook` (
    `lessonId` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,

    INDEX `LessonOnDocumentBook_bookId_fkey`(`bookId`),
    PRIMARY KEY (`lessonId`, `bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonOnDocumentSheet` (
    `lessonId` INTEGER NOT NULL,
    `sheetId` INTEGER NOT NULL,

    INDEX `LessonOnDocumentSheet_sheetId_fkey`(`sheetId`),
    PRIMARY KEY (`lessonId`, `sheetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliverShipService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `trackingUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(45) NOT NULL,
    `status` VARCHAR(45) NOT NULL,
    `updatedAddress` VARCHAR(45) NULL,
    `courseId` INTEGER NULL,
    `webappOrderId` INTEGER NULL,
    `webappCourseId` INTEGER NULL,
    `webappAdminId` INTEGER NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `serviceId` INTEGER NULL,
    `trackingCode` VARCHAR(191) NULL,

    INDEX `courseId_idx`(`courseId`),
    INDEX `trackingServiceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseOnCourseLesson` ADD CONSTRAINT `CourseOnCourseLesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseOnCourseLesson` ADD CONSTRAINT `CourseOnCourseLesson_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `CourseLesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseVideo` ADD CONSTRAINT `CourseVideo_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `CourseLesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonOnDocument` ADD CONSTRAINT `LessonOnDocument_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `CourseLesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonOnDocument` ADD CONSTRAINT `LessonOnDocument_preExamId_fkey` FOREIGN KEY (`preExamId`) REFERENCES `DocumentPreExam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonOnDocumentBook` ADD CONSTRAINT `LessonOnDocumentBook_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `DocumentBook`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonOnDocumentBook` ADD CONSTRAINT `LessonOnDocumentBook_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `CourseLesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonOnDocumentSheet` ADD CONSTRAINT `LessonOnDocumentSheet_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `CourseLesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonOnDocumentSheet` ADD CONSTRAINT `LessonOnDocumentSheet_sheetId_fkey` FOREIGN KEY (`sheetId`) REFERENCES `DocumentSheet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delivery` ADD CONSTRAINT `courseId` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Delivery` ADD CONSTRAINT `trackingServiceId` FOREIGN KEY (`serviceId`) REFERENCES `DeliverShipService`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

