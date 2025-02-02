import { listBooksAction } from "@/lib/actions/book.actions";
import { listPreExamAction } from "@/lib/actions/pre-exam.actions";
import { listSheetsAction } from "@/lib/actions/sheet.action";
import Alert from "@/ui/alert";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
  Modal,
  ModalContent,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ClipboardSignature, ScrollText, X } from "lucide-react";
import React, { Key, useMemo, useState } from "react";
import DisconnectDocument from "./DisconnectDocument";
import { updateBookInLesson, updatePreExamInLesson, updateSheetInLesson } from "@/lib/actions/lesson.actions";
import { renderBookName } from "@/lib/util";
import { DocumentBook } from "@prisma/client";

const EditDocument = ({
  isOpen,
  onClose,
  onConfirm,
  lessonId,
  document,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: string) => void;
  lessonId?: number;
  document: any;
}) => {
  // const { data: sheetList, refetch: refetchSheets } = useQuery({
  //   queryKey: ['listSheetsAction', 'edit'],
  //   queryFn: () => listSheetsAction(),
  //   // enabled: lessonId !== undefined,
  // })
  // const {data: bookList, refetch: refetchBooks} = useQuery({
  //   queryKey: ["listBooksAction", 'edit'],
  //   queryFn: () => listBooksAction(),
  //   // enabled: lessonId !== undefined,
  // })
  // const {data: preExamList, refetch: refetchPreExam} = useQuery({
  //   queryKey: ["listPreExamAction", 'edit'],
  //   queryFn: () => listPreExamAction(),
  //   // enabled: lessonId !== undefined,
  // })
  const [sheetList, setSheetList] =
    useState<Awaited<ReturnType<typeof listSheetsAction>>>();
  const [bookList, setBookList] =
    useState<Awaited<ReturnType<typeof listBooksAction>>>();
  const [preExamList, setPreExamList] =
    useState<Awaited<ReturnType<typeof listPreExamAction>>>();
  const [selectedDocument, setSelectedDocument] = useState<
    string | undefined
  >();
  const [error, setError] = useState({
    isError: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDisconnect, setIsOpenDisconnect] = useState(false);

  const documentList = useMemo(() => {
    if (!sheetList || !bookList || !preExamList) return [];
    return [
      ...sheetList.map((sheet) => ({ ...sheet, type: "sheet" })),
      ...bookList.map((book) => ({ ...book, type: "book" })),
      ...preExamList.map((preExam) => ({ ...preExam, type: "preExam" })),
    ];
  }, [sheetList, bookList, preExamList]);

  const setup = async () => {
    const responseSheet = await listSheetsAction();
    const responseBook = await listBooksAction();
    const responsePreExam = await listPreExamAction();
    setSheetList(responseSheet);
    setBookList(responseBook);
    setPreExamList(responsePreExam);
  };

  useMemo(() => {
    if (isOpen) {
      setup();
    }
  }, [isOpen]);

  const handleOnClose = () => {
    setSelectedDocument(undefined);
    setError({
      isError: false,
      message: "",
    });
    onClose();
  };

  const handleOnChangeDocument = (key: Key | null) => {
    console.log('key', key);
    if (!key) {
      setSelectedDocument(undefined);
      return;
    }
    setSelectedDocument(key.toString());
  };

  const handleOnConfirm = async () => {
    try {
      console.log("selectedDocument", selectedDocument);
      if (!selectedDocument) {
        setError({
          isError: true,
          message: "โปรดเลือกเอกสารที่คุณต้องการเปลี่ยน",
        });
        return;
      }
      if (!lessonId) {
        throw "lessonId is undefined";
      }
      const [id, type] = selectedDocument.split(":");
      console.log(id, type);
      setIsLoading(true);
      const oldDocumentId = getId(document);
      if (type === "sheet") {
        // const response = await addDocumentToLesson(parseInt(id), lessonId)
        // console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
        const response = await updateSheetInLesson(
          oldDocumentId,
          parseInt(id),
          lessonId,
        )
        console.log("🚀 ~ handleOnConfirm ~ response:", response)
      } else if (type === "book") {
        // const oldBookId = document.DocumentBook.id
        // console.log("old book", oldBookId);
        // console.log("new book", id);
        // return
        const response = await updateBookInLesson(
          oldDocumentId,
          parseInt(id),
          lessonId
        );
        console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response);
      } else if (type === "preExam") {
        // const response = await addPreExamToLessonAction(parseInt(id), lessonId)
        // console.log("🚀 ~ submitAddDocumentToLesson ~ response:", response)
        const response = await updatePreExamInLesson(
          oldDocumentId,
          parseInt(id),
          lessonId,
        )
        console.log("🚀 ~ handleOnConfirm ~ response:", response)
      }
      onConfirm(type);
      handleOnClose();
    } catch (error) {
      console.error(error);
      setError({
        isError: true,
        message: "เกิดข้อผิดพลาดบางอย่าง ดูเพิ่มเติมใน Console",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnDisconnect = () => {
    setIsOpenDisconnect(true);
  };

  const renderStartContent = (document: any) => {
    if (document.type === "book") {
      return (
        <Image
          width={16}
          className={`rounded`}
          src={document.image}
          alt="image book"
        />
      );
    } else if (document.type === "sheet") {
      return <ScrollText size={16} />;
    } else if (document.type === "preExam") {
      return <ClipboardSignature size={16} />;
    }
    return <div></div>;
  };

  const renderStartContentSelected = (selectedKey: string | undefined) => {
    let documentSelect: any;
    if (!selectedKey) {
      const id = getId(document);
      documentSelect = documentList.find(
        (_document) =>
          _document.id === parseInt(id) && _document.type === document.type
      );
      // return <div></div>
    } else {
      const [id, type] = selectedKey.split(":");
      documentSelect = documentList.find(
        (document) => document.id === parseInt(id) && document.type === type
      );
      console.log("document", documentSelect);
    }

    if (!documentSelect) {
      return <div></div>;
    }
    if (documentSelect.type === "book") {
      return (
        <div className={`w-7`}>
          <Image
            height={32}
            className={`rounded`}
            src={documentSelect.image}
            alt="image book"
          />
        </div>
      );
    } else if (documentSelect.type === "sheet") {
      return <ScrollText size={20} />;
    } else if (documentSelect.type === "preExam") {
      return <ClipboardSignature size={20} />;
    }
    return <div></div>;
  };

  const getId = (document?: any) => {
    if (!document) return;
    if (document.type === "book") {
      return document.DocumentBook.id;
    } else if (document.type === "sheet") {
      return document.DocumentSheet.id;
    } else if (document.type === "preExam") {
      return document.DocumentPreExam.id;
    }
  };

  const renderKey = (document?: any) => {
    if (!document) return "";
    if (document.type === "book") {
      return `${document.DocumentBook.id}:${document.type}`;
    } else if (document.type === "sheet") {
      return `${document.DocumentSheet.id}:${document.type}`;
    } else if (document.type === "preExam") {
      return `${document.DocumentPreExam.id}:${document.type}`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      closeButton={<></>}
      backdrop="blur"
      classNames={{
        backdrop: `bg-backdrop`,
      }}
      scrollBehavior="inside"
      placement="top-center"
    >
      <ModalContent className={`p-app`}>
        {lessonId && (
          <DisconnectDocument
            isOpen={isOpenDisconnect}
            document={document}
            onClose={() => setIsOpenDisconnect(false)}
            lessonId={lessonId}
            onSuccess={(type) => {
              onConfirm(type);
              handleOnClose();
            }}
          />
        )}
        <div className={`flex items-center`}>
          <div className={`flex-1`}></div>
          <div
            className={`flex-1 text-center text-3xl font-semibold font-IBM-Thai`}
          >
            เอกสาร
          </div>
          <div className={`flex-1 flex items-center justify-end`}>
            <Button
              onClick={handleOnClose}
              className={`min-w-0 w-8 max-w-8 max-h-8 bg-primary-foreground`}
              isIconOnly
            >
              <X />
            </Button>
          </div>
        </div>
        {error.isError && (
          <div className={`mt-app`}>
            <Alert label={error.message} />
          </div>
        )}
        <div className={`mt-app`}>
          <Autocomplete
            onSelectionChange={handleOnChangeDocument}
            startContent={renderStartContentSelected(selectedDocument)}
            // defaultSelectedKey={`${document?.id}:${document?.type}`}
            defaultSelectedKey={renderKey(document)}
            className={`font-serif`}
            inputProps={{
              classNames: {
                input: ['text-[1em]'],
              }
            }}
            listboxProps={{
              className: 'font-serif',
            }}
            selectorIcon={<ChevronDown size={24} />}
            disabledKeys={["loading"]}
          >
            {documentList ? (
              documentList?.sort((a, b) => {
                if(a.updatedAt! > b.updatedAt!){
                  return -1
                }else if(a.updatedAt! < b.updatedAt!){
                  return 1
                }
                return 0
              }).map((document, index) => {
                const name =
                  document.type === "book"
                    ? renderBookName(document as DocumentBook)
                    : document.name;
                return (
                  <AutocompleteItem
                    key={`${document.id}:${document.type}`}
                    startContent={renderStartContent(document)}
                    className={`font-serif`}
                  >
                    {name}
                  </AutocompleteItem>
                );
              })
            ) : (
              <AutocompleteItem key={`loading`}>loading...</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <Button
          isLoading={isLoading}
          onClick={handleOnConfirm}
          className={`mt-app bg-default-foreground text-primary-foreground font-IBM-Thai font-medium text-base antialiased`}
        >
          บันทึก
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleOnDisconnect}
          color="danger"
          variant="light"
          className={`mt-2 text-danger-500 font-sans font-medium text-base antialiased`}
        >
          เอาออก
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default EditDocument;
