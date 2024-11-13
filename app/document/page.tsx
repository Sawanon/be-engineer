import DocumentComp from "@/components/Document";
import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";

const DocumentPage = () => {
   return (
      // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
      <section>
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
