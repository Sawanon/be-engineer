import { addCourse } from '@/lib/actions/course.actions';
import { listTutor } from '@/lib/actions/tutor.actions';
import Alert from '@/ui/alert';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

type CreateCourse = {
  courseName: string,
  courseDetail: string | null,
  courseTutorId: string,
  clueLink: string | null,
  playlist: string | null,
  price: string | null,
}

const AddCourseForm = ({
  onConfirm,
}:{
  onConfirm: (courseId: number) => Promise<void>,
}) => {
  const { data: tutorList } = useQuery({
    queryKey: ["listTutor"],
    queryFn: () => listTutor(),
  });

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    watch,
    setError,
  } = useForm<CreateCourse>({
    defaultValues: {
      courseDetail: null,
      clueLink: null,
      playlist: null,
      price: null,
    }
  })

  const handleOnSubmit:SubmitHandler<CreateCourse> = async (data) => {
    try {
      console.log("data", data);
      const response = await addCourse({
        name: data.courseName,
        tutor: parseInt(data.courseTutorId),
        status: `noContent`,
        detail: data.courseDetail ?? undefined,
        clueLink: data.clueLink ?? undefined,
        playlist: data.playlist ?? undefined,
        price: data.price ? parseInt(data.price) : undefined,
      })
      if(!response) throw `response is ${response}`
      if(typeof response === "string") throw response
      await onConfirm(response.id)
      console.log("🚀 ~ consthandleOnSubmit:SubmitHandler<CreateCourse>= ~ response:", response)
    } catch (error) {
      console.error(error);
      setError('root', {
        message: `${error}`,
      })
    }
  }
  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        {errors.root &&
          <Alert label='เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console' />
        }
        {(errors.courseName || errors.courseTutorId) &&
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
            className="mt-2 font-serif"
            placeholder="วิชา MEE000 Engineering Mechanics II สำหรับ ม. พระจอมเกล้าธนบุรีเนื้อหา midterm"
            // onChange={(e) => handleOnChangeCourseDetail(e.target.value)}
            {...register('courseDetail')}
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
            input: `text-[1em] ${watch('clueLink') === "" || !watch('clueLink') ? 'no-underline' : 'underline'}`,
          }}
          placeholder="Link เฉลย"
          // onChange={(e) => handleOnChangeCourseLink(e.target.value)}
          {...register('clueLink')}
        />
        <Input
          className={`font-IBM-Thai-Looped mt-2`}
          classNames={{
            input: `text-[1em]`,
          }}
          placeholder={`Playlist`}
          // onChange={(e) => handleOnChangePlaylist(e.target.value)}
          {...register('playlist')}
        />
        <Input
          className="font-IBM-Thai-Looped mt-2"
          classNames={{
            input: `text-[1em]`,
          }}
          placeholder="ราคา"
          type="number"
          // onChange={(e) => handleOnChangePrice(e.target.value)}
          {...register('price')}
        />
        <div className={`pt-[6px] mt-2`}>
          <Button
            type='submit'
            className="bg-default-foreground text-primary-foreground font-IBM-Thai font-medium"
            fullWidth
            isLoading={isSubmitting}
          >
            บันทึก
          </Button>
        </div>
    </form>
  </div>
  )
}

export default AddCourseForm