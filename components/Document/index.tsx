"use client";

import { modalProps } from "@/@type";
import { useState } from "react";
import FormDocument from "./form";
import TableDocument from "./table";
import AddBook from "./add_book.modal";
import ConfirmBook from "./confirm.book";
import BookInventory from "./inventory.book";
import EditInventory from "./inventory.book.edit";
import BookUsage from "./usage.book";
import { Pagination } from "@nextui-org/react";

const DocumentComp = () => {
   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
   const [isInventory, setIsInventory] = useState(false);
   const [isAddDocument, setIsAddDocument] = useState(false);
   const [isEditStock, setIsEditStock] = useState(false);
   const [isDelete, setIsDelete] = useState(false);
   const [isViewUsage, setIsViewUsage] = useState(false);

   return (
      <div className="flex flex-col relative flex-1 mt-2 md:mt-0 font-IBM-Thai-Looped">
         <h1 className="hidden md:block font-IBM-Thai text-[30px] text-default-foreground font-bold leading-9 py-2 ">การจัดส่ง</h1>

         <BookInventory
            open={isInventory}
            onClose={() => setIsInventory(false)}
            onEditStock={() => setIsEditStock(true)}
         />
         <EditInventory
            open={isEditStock}
            onClose={() => setIsEditStock(false)}
         />
         <AddBook
            open={isAddDocument}
            onClose={() => setIsAddDocument(false)}
            onDelete={() => setIsDelete(true)}
         />
         <ConfirmBook open={isDelete} onClose={() => setIsDelete(false)} />
         <BookUsage open={isViewUsage} onClose={() => setIsViewUsage(false)} />

         <FormDocument onAddDocument={() => setIsAddDocument(true)} />
         <div className="flex-1 flex flex-col justify-between pr-2 bg-white font-IBM-Thai-Looped">
            <TableDocument
               onViewStock={() => setIsInventory(true)}
               onEditBook={() => setIsAddDocument(true)}
               onViewUsage={() => setIsViewUsage(true)}
            />
            <div className="flex w-full justify-center my-[14px]">
               <Pagination
                  classNames={{
                     cursor: "bg-default-foreground",
                  }}
                  showShadow
                  color="primary"
                  page={1}
                  total={10}
                  // onChange={(page) => setPage(page)}
               />
            </div>
         </div>
      </div>
   );
};

export default DocumentComp;
