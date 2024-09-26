"use client";

import { modalProps } from "@/@type";
import FormDeliver from "./form";
import DeliverModal from "./printing.modal";
import TableDeliver from "./table";
import { useState } from "react";
import EditAddress from "./edit_address.modal";
import AddTracking from "./add_tracking.modal";
import ChangeReceiveType from "./change_type.modal";

const DeliverComp = () => {
   const [selectState, setSelectState] = useState<modalProps>({
      open: false,
      data: undefined,
   });
   // console.log(selectState);
  
   return (
      <div className="flex flex-col relative flex-1 ">
         <DeliverModal />
         <EditAddress />
         <AddTracking />
         <ChangeReceiveType />
         <FormDeliver state={[selectState, setSelectState]} />
         <div className="flex-1 px-2">
            <TableDeliver state={[selectState, setSelectState]}  />
         </div>
      </div>
   );
};

export default DeliverComp;
