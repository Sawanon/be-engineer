import DeliverComp from "@/components/Deliver";
import {
  cloneNewData,
  getDeliver,
  getDeliverByFilter,
  getDeliverById,
  getLatestId,
  refetchData,
  testFn,
  updateDataByBranch,
} from "@/lib/actions/deliver.actions";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";
import { input, Spinner } from "@nextui-org/react";
import dayjs from "dayjs";
import { m } from "framer-motion";
import _ from "lodash";
import { Suspense } from "react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
// export const revalidate = 3600;
export const revalidate = 60;
// export const fetchCache = "force-no-store";
const DeliverPage = async (props: {
  searchParams: {
    endDate?: string;
    startDate?: string;
    page?: string;
    search?: string;
    status?: string;
    editTracking?: string;
    addTracking?: string;
    editAddress?: string;
    university?: string;
  };
}) => {
  const {
    page = 1,
    status = "pickup,ship",
    search,
    endDate,
    startDate,
    university,
    editTracking,
    addTracking,
    editAddress
  } = props.searchParams;
  const delivery = await getDeliverByFilter({
    status: status,
    page: parseInt(page.toString()),
    input: search,
    endDate,
    startDate,
    university,
    
  });
  const newData = await cloneNewData();
  const searchData = {
    page,
    status,
    input: search,
    endDate,
    startDate,
    university,
  };

  const getEditTracking = editTracking
    ? await getDeliverById(parseInt(editTracking))
    : undefined;
  const getAddTracking = addTracking
    ? await getDeliverById(parseInt(addTracking))
    : undefined;
  const getEditAddress = editAddress
    ? await getDeliverById(parseInt(editAddress))
    : undefined;
  return (
    // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
    <section className="flex-1 flex flex-col">
      <Suspense
        fallback={
          <div
            className={`absolute inset-0 bg-backdrop flex items-center justify-center`}
          >
            <Spinner />
          </div>
        }
      >
        <DeliverComp
          editTrackingData={getEditTracking}
          editAddressData={getEditAddress}
          addTrackingData={getAddTracking}
          searchFilter={searchData}
          page={parseInt(page.toString())}
          isNewData={newData}
          deliveryData={delivery}
        />
      </Suspense>
    </section>
  );
};

export default DeliverPage;
