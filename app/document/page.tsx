import DocumentComp from "@/components/Document";
import PaginationDocument from "@/components/Document/PaginationDocument";
import PreExamComponent from "@/components/Document/PreExam/PreExamComponent";
import SheetComponent from "@/components/Document/Sheet/SheetComponent";
import InventoryBookWrapper from "@/components/Server/InventoryBookWrapper";
import {
  getBookById,
  getTotalBook,
  listBooksAction,
  listBooksActionPerPage,
} from "@/lib/actions/book.actions";
import {
  getTotalPreExam,
  listPreExamActionPerPage,
} from "@/lib/actions/pre-exam.actions";
import {
  getTotalSheet,
  listSheetActionPerPage,
} from "@/lib/actions/sheet.action";
import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";

const DocumentPage = async (props: {
  searchParams: {
    stockBookId: string;
    type?: string;
    search?: string;
    page?: string;
    documentId?: string;
    edit?: string;
  };
}) => {
  const { type, page, search, documentId } = props.searchParams;

  const rowPerPage = 30;
  const currentPage = page ?? "1";
  const documentType = type ?? "book";

  if (documentType === "book") {
    const selectedBook = documentId
      ? await getBookById(parseInt(documentId))
      : undefined;
    const totalBook = await getTotalBook(search);
    if (totalBook === undefined || typeof totalBook === "string") {
      const errorMessage =
        typeof totalBook === "string" ? totalBook : `Can't get book`;
      throw Error(errorMessage);
    }
    const pageSize = Math.ceil(totalBook / rowPerPage);
    const bookItems = await listBooksActionPerPage(
      rowPerPage,
      parseInt(currentPage),
      search
    );
    console.log("book?.length", bookItems?.length);
    return (
      // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
      <section className={`flex-1 flex flex-col p-1`}>
        <Suspense fallback={<div></div>}>
          <InventoryBookWrapper id={props.searchParams.stockBookId} />
        </Suspense>
        <div className={`flex-1 flex flex-col`}>
          <Suspense
            fallback={
              <div
                className={`absolute inset-0 bg-backdrop flex items-center justify-center`}
              >
                <Spinner />
              </div>
            }
          >
            <div className={`flex-1`}>
              <DocumentComp
                bookItems={bookItems}
                currentPage={parseInt(currentPage)}
                pageSize={pageSize}
                selectedBook={selectedBook}
              />
            </div>
            <PaginationDocument
              currentPage={parseInt(currentPage)}
              pageSize={pageSize}
            />
          </Suspense>
        </div>
      </section>
    );
  } else if (documentType === "sheet") {
    const totalSheet = await getTotalSheet(search);
    if (totalSheet === undefined || typeof totalSheet === "string") {
      const errorMessage =
        typeof totalSheet === "string" ? totalSheet : `Can't get sheet`;
      throw Error(errorMessage);
    }
    const sheetItems = await listSheetActionPerPage(
      rowPerPage,
      parseInt(currentPage),
      search
    );
    const pageSize = Math.ceil(totalSheet / rowPerPage);
    if (sheetItems === undefined || typeof sheetItems === "string") {
      const errorMessage =
        typeof sheetItems === "string" ? sheetItems : `Can't get sheet`;
      throw Error(errorMessage);
    }
    return (
      <Suspense
        fallback={
          <div
            className={`absolute inset-0 bg-backdrop flex items-center justify-center`}
          >
            <Spinner />
          </div>
        }
      >
        <div className={`flex-1 flex flex-col`}>
          <div className={`flex-1`}>
            <SheetComponent sheetItems={sheetItems} />
          </div>
          <PaginationDocument
            currentPage={parseInt(currentPage)}
            pageSize={pageSize}
          />
        </div>
      </Suspense>
    );
  } else if (documentType === "pre-exam") {
    const totalPreExam = await getTotalPreExam(search);
    if (totalPreExam === undefined || typeof totalPreExam === "string") {
      const errorMessage =
        typeof totalPreExam === "string" ? totalPreExam : `Can't get pre-exam`;
      throw Error(errorMessage);
    }
    const preExamItems = await listPreExamActionPerPage(
      rowPerPage,
      parseInt(currentPage),
      search
    );
    if (preExamItems === undefined || typeof preExamItems === "string") {
      const errorMessage =
        typeof preExamItems === "string" ? preExamItems : `Can't get pre-exam`;
      throw Error(errorMessage);
    }
    const pageSize = Math.ceil(totalPreExam / rowPerPage);
    return (
      <Suspense
        fallback={
          <div
            className={`absolute inset-0 bg-backdrop flex items-center justify-center`}
          >
            <Spinner />
          </div>
        }
      >
        <div className={`flex-1 flex flex-col`}>
          <div className={`flex-1`}>
            <PreExamComponent preExamItems={preExamItems} />
          </div>
          <PaginationDocument
            currentPage={parseInt(currentPage)}
            pageSize={pageSize}
          />
        </div>
      </Suspense>
    );
  } else {
    return <div>other document</div>;
  }
};

export default DocumentPage;
