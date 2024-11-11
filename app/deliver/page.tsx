import DeliverComp from "@/components/Deliver";
import {
   getDeliver,
   getLatestId,
   refetchData,
   updateDataByBranch,
} from "@/lib/actions/deliver.actions";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import { Spinner } from "@nextui-org/react";
import _ from "lodash";
import { Suspense } from "react";
export const revalidate = 3600;

const DeliverPage = async () => {
   // addDeliverShipService({})
   let newData = false;
   const delivery = await getDeliver();
   const getLastIdKmitl = await getLatestId("KMITL");
   const getLastIdOdm = await getLatestId("ODM");
// TODO: ตัด stock when pickup and delivery
   const lastItemsByBranch = _.chain(delivery.data)
      .groupBy("branch") // Group items by 'branch'
      .mapValues((group) => _.maxBy(group, "webappOrderId")) // Get the item with the max 'id' in each group
      .value();

   const lastWebappOrderIdOdm = lastItemsByBranch["ODM"]?.webappOrderId ?? 0;
   const lastWebappOrderIdKmitl =
      lastItemsByBranch["KMITL"]?.webappOrderId ?? 0;
   if (getLastIdKmitl !== lastWebappOrderIdKmitl) {
      newData = true;
      await updateDataByBranch({
         branch: "KMITL",
         startId: lastWebappOrderIdKmitl + 1,
      });
   }
   if (getLastIdOdm !== lastWebappOrderIdOdm) {
      newData = true;
      await updateDataByBranch({
         branch: "ODM",
         startId: lastWebappOrderIdOdm + 1,
      });
   }

   if (newData) {
      refetchData();
   }
   // refetchData();
   console.table({
      lastODM: getLastIdOdm,
      lastKMITL: getLastIdKmitl,
      lastWebappOrderIdOdm,
      lastWebappOrderIdKmitl,
      newData,
   });

   // TODO: update data

   return (
      // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
      <section className="flex-1 flex flex-col">
         <Suspense
            fallback={(
               <div className={`absolute inset-0 bg-backdrop flex items-center justify-center`}>
                  <Spinner />
               </div>
            )}
            >
               <DeliverComp isNewData={newData} delivery={delivery} />
            </Suspense>
       </section> 
   );
};

export default DeliverPage;
