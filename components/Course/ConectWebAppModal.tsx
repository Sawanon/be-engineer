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
}:{
  isOpen: boolean,
  onClose: () => void,
  webappCourseId?: number | null,
  branch?: string | null,
  courseId?: number,
  books: DocumentBook[]
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

  useMemo(() => {
    // console.log("branch", branch);
    // console.log("webappCourseId", webappCourseId);
    // console.log(books);
    
  }, [branch, webappCourseId, books])

  const handleOnClose = () => {
    onClose()
    setSelectedBranch(undefined)
    setSelectedWebAppCourse(undefined)
  }

  const handleOnChangeWebappBranch = async (key: Key | null) => {
    console.log(key);
    if (!webappBranchCourseList) return;
    const webappCourseList = webappBranchCourseList.find(
      (webappBranch) => webappBranch.branch === key
    )?.courses;
    setWebappCourseList(webappCourseList);
    setSelectedBranch(key?.toString())
  };

  const renderWebappImage = (webappCourseId: number | null | undefined) => {
    if(!webappCourseId) return <div></div>
    if(!webappCourseList) return <div></div>
    const imageUrl = webappCourseList.find(course => course.id === webappCourseId)
    if(!imageUrl) return <div></div>
    return (
      <Image className={`min-w-6 rounded`} width={24} height={24} src={`${imageUrl.image}`} />
    )
  }

  const handleOnChangeWebapp = async (key: Key | null) => {
    console.log(key);
    if (!key) return;
    const webappCourse = webappCourseList?.find((course) => `${course.id}` === `${key}`)
    setSelectedWebAppCourse(webappCourse);
    // const response = await updateCourse(selectedCourse?.id, {
    //   webappCourseId: parseInt(key.toString()),
    //   status: webappCourse!.hasFeedback ? 'enterForm' : 'uploadWebapp'
    // });
    // console.log("🚀 ~ handleOnChangeWebapp ~ response:", response);
    // refetchCourse()
  };

  const submitConnectWebappCourse = async () => {
    try {
      console.log(courseId);
      console.log(selectedBranch);
      console.log(selectedWebAppCourse?.id);
      if(books.length === 0){
        return
      }
      const book = books[0]
      if(!courseId || !selectedBranch || !selectedWebAppCourse) {
        return
      }
      setIsLoading(true)
      const response = await courseConnectWebAppCourse(
        courseId,
        selectedBranch!,
        selectedWebAppCourse!.id,
        book.id,
      )
      console.log(response);
      if(typeof response === "string"){
        throw response
      }
      handleOnClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      closeButton={<></>}
      backdrop="blur"
      classNames={{
        backdrop: `bg-backdrop`,
      }}
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
          className={`mt-app font-IBM-Thai-Looped`}
          placeholder="เลือกสาขา"
          onSelectionChange={handleOnChangeWebappBranch}
          defaultSelectedKey={selectedBranch}
        >
          {webappBranchCourseList ? (
            webappBranchCourseList?.map((webappCourse, index) => {
              return (
                <AutocompleteItem
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
          defaultSelectedKey={
            !webappCourseList
              ? ""
              : webappCourseId?.toString()
          }
          startContent={renderWebappImage(selectedWebAppCourse?.id)}
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