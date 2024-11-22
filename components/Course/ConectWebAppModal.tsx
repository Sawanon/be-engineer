import { courseConnectWebAppCourse, listCourseWebapp } from '@/lib/actions/course.actions';
import { Autocomplete, AutocompleteItem, Button, Image, Modal, ModalContent } from '@nextui-org/react'
import { DocumentBook } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React, { Key, useMemo, useState } from 'react'

type WebAppCourse = { id: number; name: string; image: string; hasFeedback: boolean; term: string; }

const ConectWebAppModal = ({
  isOpen,
  onClose,
  webappCourseId,
  branch,
  courseId,
  books,
  onSuccess,
}:{
  isOpen: boolean,
  onClose: () => void,
  webappCourseId?: number | null,
  branch?: string | null,
  courseId?: number,
  books: DocumentBook[],
  onSuccess: () => void,
}) => {
  const { data: webappBranchCourseList, isFetched } = useQuery({
    queryKey: [`listCourseWebapp`],
    queryFn: () => listCourseWebapp(),
  });
  const [webappCourseList, setWebappCourseList] = useState<
    | WebAppCourse[]
    | undefined
  >();

  const [selectedBranch, setSelectedBranch] = useState<string | undefined>()
  const [selectedWebAppCourse, setSelectedWebAppCourse] = useState<WebAppCourse | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleOnClose = () => {
    onClose()
    setSelectedBranch(undefined)
    setSelectedWebAppCourse(undefined)
  }

  const handleOnChangeWebappBranch = async (key: Key | null | string) => {
    console.log(key);
    if (!webappBranchCourseList) return;
    const webappCourseList = webappBranchCourseList.find(
      (webappBranch) => webappBranch.branch === key
    )?.courses;
    setWebappCourseList(webappCourseList);
    setSelectedBranch(key?.toString())
  };

  const renderWebappImage = (webappCourseId: number | null | undefined) => {
    if(!webappCourseId) return
    if(!webappCourseList) return
    const imageUrl = webappCourseList.find(course => course.id === webappCourseId)
    if(!imageUrl) return
    return (
      <Image className={`min-w-6 rounded`} width={24} height={24} src={`${imageUrl.image}`} />
    )
  }

  const handleOnChangeWebapp = async (key: Key | null) => {
    console.log(key);
    if (!key) return setSelectedWebAppCourse(undefined);
    const webappCourse = webappCourseList?.find((course) => `${course.id}` === `${key}`)
    console.log("🚀 ~ handleOnChangeWebapp ~ webappCourse:", webappCourse)
    setSelectedWebAppCourse(webappCourse);
  };

  const submitConnectWebappCourse = async () => {
    try {
      console.log(courseId);
      console.log(selectedBranch);
      console.log(selectedWebAppCourse?.id);
      // if(books.length === 0){
      //   console.log("books is empty", books);
      //   return
      // }
      if(!courseId || !selectedBranch || !selectedWebAppCourse) {
        return
      }
      setIsLoading(true)
      const response = await courseConnectWebAppCourse(
        courseId,
        selectedBranch!,
        selectedWebAppCourse!.id,
        // book.id,
        books,
        selectedWebAppCourse.image,
      )
      console.log(response);
      if(typeof response === "string"){
        throw response
      }
      onSuccess()
      handleOnClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useMemo(() => {
    if(webappBranchCourseList && branch && isOpen){
      handleOnChangeWebappBranch(branch)
      const courseByBranch = webappBranchCourseList.find(courseByBranch => courseByBranch.branch === branch)
      const webAppCourse = courseByBranch.courses.find((webAppCourse:any) => `${webAppCourse.id}` === `${webappCourseId}`)
      setSelectedWebAppCourse(webAppCourse)
    }
  }, [branch, webappCourseId, webappBranchCourseList, isOpen])

  return (
    <Modal
      isOpen={isOpen}
      closeButton={<></>}
      backdrop="blur"
      classNames={{
        backdrop: `bg-backdrop`,
      }}
      placement='top-center'
    >
      <ModalContent className={`p-app`}>
        <div className={`flex`}>
          <div className="flex-1"></div>
          <div className="flex-1 text-3xl font-semibold font-IBM-Thai text-center">
            Web-app
          </div>
          <div
            className="flex-1 flex justify-end items-center"
          >
            <Button
              isIconOnly
              onClick={handleOnClose}
              className={`bg-primary-foreground`}
            >
              <X size={32} />
            </Button>
          </div>
        </div>
        <Autocomplete
          aria-labelledby={`webappcourseBranch`}
          className={`mt-app font-serif`}
          placeholder="เลือกสาขา"
          onSelectionChange={handleOnChangeWebappBranch}
          defaultSelectedKey={selectedBranch}
          inputProps={{
            classNames: {
              input: [`text-[1em]`],
            },
          }}
        >
          {webappBranchCourseList ? (
            webappBranchCourseList?.map((webappCourse, index) => {
              return (
                <AutocompleteItem
                  className={`font-serif`}
                  aria-labelledby={`webappcourseBranch${index}`}
                  key={webappCourse.branch}
                  value={webappCourse.branch}
                >
                  {webappCourse.branch}
                </AutocompleteItem>
              );
            })
          ) : (
            <AutocompleteItem key={`webappCourseBranchLoading`}>
              loading...
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          aria-labelledby={`webappcourse`}
          className={`mt-2 font-IBM-Thai-Looped`}
          onSelectionChange={handleOnChangeWebapp}
          placeholder="เลือกคอร์ส"
          disabledKeys={['webappCourseLoading']}
          selectedKey={selectedWebAppCourse?.id.toString()}
          startContent={renderWebappImage(selectedWebAppCourse?.id)}
          inputProps={{
            classNames: {
              input: [`text-[1em]`],
            },
          }}
        >
          {webappCourseList ? (
            webappCourseList?.map((webappCourse, index) => {
              return (
                <AutocompleteItem
                  aria-labelledby={`webappcourse${index}`}
                  key={webappCourse.id}
                  value={webappCourse.id}
                  textValue={webappCourse.name}
                  startContent={<Image width={40} height={40} src={`${webappCourse.image}`} />}
                >
                  <div className={`font-IBM-Thai-Looped text-default-foreground`}>
                    {webappCourse.name}
                  </div>
                  <div className={`text-xs font-IBM-Thai-Looped text-default-500`}>
                    {webappCourse.term}
                  </div>
                </AutocompleteItem>
              );
            })
          ) : (
            <AutocompleteItem key={`webappCourseLoading`}>
              loading...
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          isLoading={isLoading}
          className={`mt-app bg-default-foreground text-primary-foreground font-IBM-Thai font-medium`}
          fullWidth
          onClick={submitConnectWebappCourse}
        >
          ตกลง
        </Button>
      </ModalContent>
    </Modal>
  )
}

export default ConectWebAppModal