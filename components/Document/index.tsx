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

const DocumentComp = () => {
   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
   const [isInventory, setIsInventory] = useState(false)
   const [isAddDocument, setIsAddDocument] = useState(false)
   const [isEditStock, setIsEditStock] = useState(false)
   const [isDelete, setIsDelete] = useState(false)
   const [isViewUsage, setIsViewUsage] = useState(false)

   return (
      <div className="flex flex-col relative flex-1 ">
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
         <ConfirmBook
            open={isDelete}
            onClose={() => setIsDelete(false)}
         />
         <BookUsage
            open={isViewUsage}
            onClose={() => setIsViewUsage(false)}
         />

         <FormDocument
            onAddDocument={() => setIsAddDocument(true)}
         />
         <div className="flex-1 px-2">
            <TableDocument
               onViewStock={() => setIsInventory(true)}
               onEditBook={() => setIsAddDocument(true)}
               onViewUsage={() => setIsViewUsage(true)}
            />
         </div>
      </div>
   );
};

export default DocumentComp;
