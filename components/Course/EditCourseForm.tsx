import { listCourseAction, updateCourse } from '@/lib/actions/course.actions';
import { listTutor } from '@/lib/actions/tutor.actions';
import Alert from '@/ui/alert';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Course } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

type EditCourse = {
  courseName: string,
  courseDetail: string | null,
  courseTutorId?: string | null,
  clueLink: string | null,
  playlist: string | null,
  price: string | null,
}

const EditCourseForm = ({
  onConfirm,
  course,
  onClickDelete,
}:{
  onConfirm: (courseId: number) => Promise<void>,
  course?: NonNullable<Awaited<ReturnType<typeof listCourseAction>>>[0],
  onClickDelete: () => void,
}) => {
  const { data: tutorList } = useQuery({
    queryKey: ["listTutor"],
    queryFn: () => listTutor(),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isSubmitting},
    setError,
  } = useForm<EditCourse>({
    defaultValues: course ? {
      courseName: course.name,
      courseDetail: course.detail,
      clueLink: course.clueLink,
      courseTutorId: String(course.tutorId),
      playlist: course.playlist,
      price: String(course.price),
    }:undefined,
  })

  const handleOnSubmit:SubmitHandler<EditCourse> = async (data) => {
    try {
      console.log('courseId', course);
      console.log("🚀 ~ consthandleOnSubmit:SubmitHandler<EditCourse>= ~ data:", data)
      if(!course) throw `course is empty`
      const response = await updateCourse(course!.id, {
        name: data.courseName,
        detail: data.courseDetail,
        clueLink: data.clueLink,
        Tutor: {
          connect: {
            id: parseInt(data.courseTutorId!),
          },
        },
        playlist: data.playlist,
        price: parseInt(data.price!),
      })
      if(!response) throw `response is ${response}`
      if(typeof response === "string") throw response
      console.log("🚀 ~ consthandleOnSubmit:SubmitHandler<EditCourse>= ~ response:", response)
      await onConfirm(response.id)
    } catch (error) {
      console.error(error)
      setError('root', {
        message: `${error}`,
      })
    }
  }

  const handleOnClickDelete = () => {
    onClickDelete()
  }

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        {errors.root &&
          <Alert label='เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console' />
        }
        {(errors.courseName || errors.courseTutorId || errors.courseDetail || errors.clueLink || errors.playlist || errors.price) &&
          <Alert label={`กรุณากรอกข้อมูลให้ครบ`} />
        }
        <Input
          size="lg"
          color={errors.courseName ? `danger` : `default`}
          className="font-serif text-lg font-medium"
          classNames={{
            input: "font-serif font-medium text-[1em]",
          }}
          placeholder="ชื่อวิชา"
          {...register('courseName', {required: true})}
        />
        <div id="textarea-wrapper">
          <Textarea
            classNames={{
              input: `text-[1em]`,
            }}
            color={errors.courseDetail ? `danger` : `default`}
            className="mt-2 font-serif"
            placeholder="วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรีเนื้อหา midterm"
            {...register('courseDetail', {required: (course?.CourseLesson.length ?? 0) > 0 ? true : false})}
          />
        </div>
        <Select
          placeholder={`ติวเตอร์`}
          classNames={{
            value: `text-[1em]`,
          }}
          color={errors.courseTutorId ? `danger` : `default`}
          aria-label="ติวเตอร์"
          className="font-serif mt-2"
          disabledKeys={["loading"]}
          {...register('courseTutorId', {required: true})}
        >
          {tutorList ? (
            tutorList.map((tutor) => {
              return (
                <SelectItem
                  className="font-serif"
                  aria-label={`${tutor.name}`}
                  key={tutor.id}
                >
                  {tutor.name}
                </SelectItem>
              );
            })
          ) : (
            <SelectItem
              className="font-IBM-Thai-Looped"
              aria-label={`loading`}
              key={`loading`}
            >
              loading...
            </SelectItem>
          )}
        </Select>
        <Input
          className="font-IBM-Thai-Looped mt-2"
          classNames={{
            input: `text-[1em] ${watch('clueLink') === "" || !watch('clueLink') ? 'no-underline' : 'underline'}`,
          }}
          color={errors.clueLink ? `danger` : `default`}
          placeholder="Link เฉลย"
          {...register('clueLink', {required: (course?.CourseLesson.length ?? 0) > 0 ? true : false})}
        />
        <Input
          className={`font-IBM-Thai-Looped mt-2`}
          classNames={{
            input: `text-[1em]`,
          }}
          placeholder={`Playlist`}
          color={errors.playlist ? `danger` : `default`}
          {...register('playlist', {required: (course?.CourseLesson.length ?? 0) > 0 ? true : false})}
        />
        <Input
          className="font-IBM-Thai-Looped mt-2"
          classNames={{
            input: `text-[1em]`,
          }}
          placeholder="ราคา"
          color={errors.price ? `danger` : `default`}
          type="number"
          {...register('price', {required: (course?.CourseLesson.length ?? 0) > 0 ? true : false})}
        />
        <div className={`pt-[6px] mt-2`}>
          <Button
            className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
            fullWidth
            type='submit'
            isLoading={isSubmitting}
          >
            บันทึก
          </Button>
          <Button
            className="bg-transparent text-danger-500 font-IBM-Thai font-medium mt-2"
            fullWidth
            onClick={handleOnClickDelete}
          >
            ลบ
          </Button>
        </div>
    </form>
  </div>
  )
}

export default EditCourseForm