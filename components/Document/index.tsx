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

   return (
      <div className="flex flex-col relative flex-1 ">
         <BookInventory />
         <EditInventory />
         <AddBook />
         <ConfirmBook />
         <BookUsage />

         <FormDocument />
         <div className="flex-1 pr-2">
            <TableDocument />
         </div>
      </div>
   );
};

export default DocumentComp;
