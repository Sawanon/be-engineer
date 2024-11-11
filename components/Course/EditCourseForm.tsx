import { updateCourse } from '@/lib/actions/course.actions';
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
  course?: Course | null,
  onClickDelete: () => void,
}) => {
  const { data: tutorList } = useQuery({
    queryKey: ["listTutor"],
    queryFn: () => listTutor(),
  });

  const {
    register,
    handleSubmit,
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
          // onChange={(e) => handleOnChangeCourseName(e.target.value)}
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
            // onChange={(e) => handleOnChangeCourseDetail(e.target.value)}
            {...register('courseDetail', {required: true})}
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
          // onChange={(e) => {
          //   handleOnChangeCourseTutor(e.target.value);
          // }}
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
            // input: `text-[1em] ${clueLink === "" || !clueLink ? 'no-underline' : 'underline'}`,
          }}
          color={errors.clueLink ? `danger` : `default`}
          placeholder="Link เฉลย"
          // onChange={(e) => handleOnChangeCourseLink(e.target.value)}
          {...register('clueLink', {required: true})}
        />
        <Input
          className={`font-IBM-Thai-Looped mt-2`}
          classNames={{
            input: `text-[1em]`,
          }}
          placeholder={`Playlist`}
          color={errors.playlist ? `danger` : `default`}
          // onChange={(e) => handleOnChangePlaylist(e.target.value)}
          {...register('playlist', {required: true})}
        />
        <Input
          className="font-IBM-Thai-Looped mt-2"
          classNames={{
            input: `text-[1em]`,
          }}
          placeholder="ราคา"
          color={errors.price ? `danger` : `default`}
          type="number"
          // onChange={(e) => handleOnChangePrice(e.target.value)}
          {...register('price', {required: true})}
        />
        <div className={`pt-[6px] mt-2`}>
          <Button
            // onClick={handleConfirmEditCourse}
            className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
            fullWidth
            type='submit'
            isLoading={isSubmitting}
          >
            บันทึก
          </Button>
          <Button
            // onClick={() => handleDeleteCourse()}
            className="bg-transparent text-danger-500 font-IBM-Thai font-medium mt-2"
            fullWidth
            onClick={handleOnClickDelete}
          >
            ลบ
          </Button>
          {/* <Button
            type='submit'
            className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
            fullWidth
            isLoading={isSubmitting}
          >
            บันทึก
          </Button> */}
        </div>
    </form>
  </div>
  )
}

export default EditCourseForm