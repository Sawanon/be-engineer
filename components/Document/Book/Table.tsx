import { tableClassnames } from "@/lib/res/const";
import {
  Button,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { DocumentBook } from "@prisma/client";
import { ClipboardList } from "lucide-react";
import { LuListTree } from "react-icons/lu";

const TableBooks = ({
  booksList,
  onViewStock,
  onEditBook,
  onViewUsage,
  isLoading,
}: {
  booksList?: DocumentBook[];
  onViewStock: (book: DocumentBook) => void;
  onEditBook: (book: DocumentBook) => void;
  onViewUsage: (courseList: any[], book: DocumentBook) => void;
  isLoading: boolean;
}) => {
  const handleOnViewStock = (book: DocumentBook) => {
    onViewStock(book);
  };

  const renderDocument = (book: DocumentBook | any) => {
    const courseMap: Map<string, any> = new Map();
    const LessonOnDocument: any[] = book.LessonOnDocumentBook;
    console.log(LessonOnDocument);
    LessonOnDocument.forEach((lessonOnDocument) => {
      const courseLesson = lessonOnDocument.CourseLesson;
      const course: any = courseLesson.Course;
      courseMap.set(course.id, course);
    });
    const courseList = Array.from(courseMap.values());
    return (
      <div className={`flex gap-2 items-center`}>
        <p className="text-sm">{courseList.length}</p>
        <Button
          onClick={() => onViewUsage(courseList, book)}
          isIconOnly
          // color="secondary"
          className={`bg-default-100 text-default-foreground min-w-0 w-8 h-8`}
        >
          <LuListTree size={24} />
        </Button>
      </div>
    );
  };
  return (
    <Table classNames={tableClassnames} color={"primary"}>
      <TableHeader>
        <TableColumn className={`font-IBM-Thai`}>หนังสือ</TableColumn>
        <TableColumn className={`font-IBM-Thai`}>Stock</TableColumn>
        <TableColumn className={`font-IBM-Thai`}>คอร์สที่ใช้งาน</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner />}
        items={booksList ?? []}
      >
        {(book) => (
          <TableRow key={`documentRow${book.id}`}>
            <TableCell>
              <div
                onClick={() => onEditBook(book)}
                className="flex gap-2 items-center font-serif text-default-foreground"
              >
                <Image
                  className={`max-w-10 h-10 rounded`}
                  classNames={{
                    wrapper: "rounded",
                  }}
                  alt="NextUI hero Image"
                  src={book.image!}
                />
                <p>
                  {book.name} {book.term} {book.year} {book.volume ? `vol.${book.volume}` : ``}
                </p>
              </div>
            </TableCell>
            <TableCell className={`flex items-center gap-2`}>
              <p className={`text-sm font-serif`}>{book.inStock}</p>
              <Button
                isIconOnly
                className={`min-w-0 max-w-8 max-h-8 rounded-lg bg-default-100 text-default-foreground`}
                onClick={() => handleOnViewStock(book)}
              >
                <ClipboardList size={24} />
              </Button>
            </TableCell>
            <TableCell className={`font-serif`}>
              {renderDocument(book)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableBooks;
