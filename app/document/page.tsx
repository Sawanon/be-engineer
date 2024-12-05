import DocumentComp from "@/components/Document";
import InventoryBookWrapper from "@/components/Server/InventoryBookWrapper";
import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";

const DocumentPage = async (props: {searchParams: {stockBookId: string}}) => {
   
   return (
      // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
      <section>
         <Suspense
            fallback={(
               <div></div>
            )}
         >
            <InventoryBookWrapper
               id={props.searchParams.stockBookId}
            />
         </Suspense>
         <Suspense
            fallback={(
               <div className={`absolute inset-0 bg-backdrop flex items-center justify-center`}>
                  <Spinner />
               </div>
            )}
            >
               <DocumentComp />
            </Suspense>
      </section>
   );
};

export default DocumentPage;
