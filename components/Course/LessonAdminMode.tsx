import { renderBookName } from '@/lib/util';
import { Accordion, AccordionItem, Button, Image, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Course, CourseLesson, CourseVideo, DocumentBook, DocumentPreExam, DocumentSheet } from '@prisma/client';
import copy from 'copy-to-clipboard';
import { ChevronLeft, Copy, ExternalLink, FileSignature, FileText, ScrollText, Tag, Video } from 'lucide-react';
import React, { useState } from 'react'

const LessonAdminMode = ({
  mode,
  lessons,
  documentNumber,
  books,
  sheets,
  preExam,
}:{
  mode: string,
  lessons?: CourseLesson[],
  documentNumber:number,
  books: DocumentBook[],
  sheets: DocumentSheet[],
  preExam: DocumentPreExam[],
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<number | undefined>()
  const [selectedVideoId, setSelectedVideoId] = useState<number | undefined>()
  const [selectedDataType, setSelectedDataType] = useState<string | undefined>()
  const renderHourCourse = () => {
    if(!lessons) return {hour: 0, minute: 0, totalHour: 0}
    let totalMinute = 0
    lessons?.forEach((lesson:any) => {
      const courseVideoList: CourseVideo[] = lesson.CourseVideo
      courseVideoList.forEach(courseVideo => {
        totalMinute += (courseVideo.hour*60) + (courseVideo.minute)
      })
    })
    const hour = Math.floor(totalMinute / 60)
    const minute = totalMinute % 60
    let totalHour = 0
    if(hour < 20){
      totalHour = Math.round((hour + (minute / 60)) * 1.5)
    }else if(hour >= 20) {
      totalHour = Math.round(hour + (minute / 60)) + 10
    }
    return {
      hour,
      minute,
      totalHour,
    }
  }

  const renderLessonTime = (lesson: any) => {
    const courseVideoList: CourseVideo[] = lesson.CourseVideo
    let totalTime = 0
    courseVideoList.forEach(courseVideo => {
      totalTime += (courseVideo.hour * 60) + (courseVideo.minute)
    })
    const hour = Math.floor(totalTime / 60)
    const minute = totalTime % 60
    return `(${hour} ชม. ${minute} นาที)`
  }

  const {hour, minute, totalHour} = renderHourCourse()

  const handleOnCopy = (videoId: number, dataType: string, value: string) => {
    console.table({
      videoId: videoId,
      dataType
    });
    setSelectedVideoId(videoId)
    setSelectedDataType(dataType)
    copy(value)
  }
  return (
    <div
    className={`${
      mode === "tutor" ? `hidden` : ``
    } bg-default-100 p-[14px] md:min-w-[469px] md:w-[469px] overflow-y-auto`}
  >
    <div className={`text-2xl font-bold font-IBM-Thai`}>สารบัญ</div>
    <div className={`mt-2 bg-content1 p-2 rounded-lg shadow space-y-2`}>
      {lessons?.map((lesson, index) => {
        // selectedCourse?.CourseLesson.length
        if(lesson.name.toLowerCase().includes(`pre-exam`)){
          return <React.Fragment key={`sarabun${index}`}></React.Fragment>
        }
        return (
          <Popover key={`sarabun${index}`} placement="top">
            <PopoverTrigger className={`cursor-pointer`} onClick={() => copy(lesson.name)}>
              <div
                tabIndex={0}
                className={`px-1 w-max rounded-lg bg-default-100 font-serif`}
              >
                {lesson.name}
              </div>
            </PopoverTrigger>
            <PopoverContent className={`rounded-full py-1 h-6`}>
              <div className="px-1 py-2 font-serif">Copied</div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
    <div className={`mt-3 font-IBM-Thai space-x-1`}>
      <span className={`font-bold text-2xl`}>เนื้อหา</span>
      <span>({hour} ชม {minute} นาที)</span>
    </div>
    <div className={`mt-2`}>
      {!lessons ? (
        <></>
      ) : (
        <Accordion variant="splitted" className={`px-0`}>
          {lessons.map((lesson: any, index) => {
            return (
              <AccordionItem
                key={`lessonAccord${lesson.id}`}
                aria-label={`${lesson.name}`}
                title={(
                  <div className={`text-default-foreground text-sm font-IBM-Thai-Looped space-x-1`}>
                    <span className={`font-bold`}>
                      {lesson.name}
                    </span>
                    <span>
                      {renderLessonTime(lesson)}
                    </span>
                  </div>
                )}
                className={`p-0 shadow`}
                classNames={{
                  trigger: 'p-2 items-center',
                  title: 'text-sm',
                  content: 'px-2 pb-2 pt-0 rounded-lg',
                }}
                indicator={<ChevronLeft />}
              >
                <div className={`bg-content1`}>
                  {lesson.CourseVideo.map((courseVideo: any, index: number) => {
                    return (
                      <div className={`p-1 last:rounded-b ${selectedVideoId === courseVideo.id ? `bg-content4-foreground` : `odd:bg-content1 even:bg-content2`} space-y-1 font-IBM-Thai-Looped`} key={`courseVideo${index}`}>
                        <div className={`flex items-center gap-2`}>
                          <Tag size={16} className={`text-foreground-400`} />
                          <Popover placement="top">
                            <PopoverTrigger onClick={() => handleOnCopy(courseVideo.id, "videoName",courseVideo.name)} className={`cursor-pointer`}>
                              <div className={`px-1 ${(index+1) % 2 === 0 ? `bg-primary-foreground` : `bg-default-50`} rounded`}>
                                {courseVideo.name}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="px-1 py-2 font-serif">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className={`flex items-center gap-2`}>
                          <Video size={16} className={`text-foreground-400`} />
                          <Popover placement="top">
                            <PopoverTrigger onClick={() => handleOnCopy(courseVideo.id, "videoLink", courseVideo.videoLink)} className={`cursor-pointer`}>
                              <div className={`px-1 ${(index+1) % 2 === 0 ? `bg-primary-foreground` : `bg-default-50`} rounded flex gap-2 items-center`}>
                                <div>
                                  Video Link
                                </div>
                                <Copy size={16} />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="px-1 py-2 font-serif">Copied</div>
                            </PopoverContent>
                          </Popover>
                          <div className={`text-foreground-400`}>
                            ชั่วโมง:
                          </div>
                          <Popover placement="top">
                            <PopoverTrigger onClick={() => handleOnCopy(courseVideo.id, "videoHour", courseVideo.hour)} className={`cursor-pointer`}>
                              <div className={`w-10 ${(index+1) % 2 === 0 ? `bg-primary-foreground` : `bg-default-50`} rounded flex justify-center items-center`}>
                                {courseVideo.hour}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="px-1 py-2 font-serif">Copied</div>
                            </PopoverContent>
                          </Popover>
                          <div className={`text-foreground-400`}>
                            นาที:
                          </div>
                          <Popover placement="top">
                            <PopoverTrigger onClick={() => handleOnCopy(courseVideo.id, "videoMinute", courseVideo.minute)} className={`cursor-pointer`}>
                              <div className={`w-10 ${(index+1) % 2 === 0 ? `bg-primary-foreground` : `bg-default-50`} rounded flex justify-center items-center`}>
                                {courseVideo.minute}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="px-1 py-2 font-serif">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className={`flex items-center gap-2`}>
                          <FileText size={16} className={`text-foreground-400`} />
                          <Popover placement="top">
                            <PopoverTrigger onClick={() => handleOnCopy(courseVideo.id, "videoContentName", courseVideo.contentName)} className={`cursor-pointer`}>
                              <div className={`${(index+1) % 2 === 0 ? `bg-primary-foreground` : `bg-default-50`} rounded flex px-1`}>
                                {courseVideo.contentName}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="px-1 py-2 font-serif">Copied</div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
    <div className={`mt-3`}>
      <div className={`font-IBM-Thai flex items-center gap-2`}>
        <div className={`text-2xl font-bold`}>
          เอกสาร
        </div>
        <div className={`text-base font-normal`}>
          ({documentNumber} ชิ้น)
        </div>
      </div>
      <div className={`mt-2 space-y-2 bg-content1 shadow-neutral-base rounded-lg p-2 font-IBM-Thai-Looped`}>
        {books.length > 0 &&
          <div>
            <div className={`text-sm font-bold text-foreground-400`}>
              หนังสือ
            </div>
            <div className={`space-y-1 mt-2`}>
              {books.map((book, index) => (
                <div className={`flex gap-2 items-center`} key={`bookadmin${index}`}>
                  <Image src={book.image ?? ''} className={`h-10 rounded`} classNames={{wrapper: 'rounded'}} />
                  {renderBookName(book)}
                </div> 
              ))}
            </div>
          </div>
        }
        {sheets.length > 0 &&
          <div>
            <div className={`text-sm font-bold text-foreground-400`}>
              เอกสาร
            </div>
            <div className={`space-y-1 mt-2`}>
              {sheets.map((sheet, index) => (
                <div className={`flex items-center gap-2`} key={`sheetadmin${index}`}>
                  <ScrollText size={20} className={`text-default-foreground`} />
                  <div>
                    {sheet.name}
                  </div>
                  <Button
                    onClick={() => {
                      window.open(sheet.url, '_blank')
                    }}
                    isIconOnly
                    className={`min-w-0 w-8 h-8 rounded-lg bg-default-100`}
                  >
                    <ExternalLink size={24} className={`text-default-foreground`} />
                  </Button>
                </div> 
              ))}
            </div>
          </div>
        }
        {preExam.length > 0 &&
          <div>
            <div className={`text-sm font-bold text-foreground-400`}>
              Pre-Exam
            </div>
            <div className={`space-y-1 mt-2`}>
              {preExam.map((preExam, index) => (
                <div className={`flex items-center gap-2`} key={`preExamadmin${index}`}>
                  <FileSignature size={20} className={`text-default-foreground`} />
                  <div>
                    {preExam.name}
                  </div>
                  <Button
                    onClick={() => {
                      window.open(preExam.url, '_blank')
                    }}
                    isIconOnly
                    className={`min-w-0 w-8 h-8 rounded-lg bg-default-100`}
                  >
                    <ExternalLink size={24} className={`text-default-foreground`} />
                  </Button>
                </div> 
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  </div>
  )
}

export default LessonAdminMode