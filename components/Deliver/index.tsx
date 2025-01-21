"use client";

import { deliveryTypeProps, modalProps } from "@/@type";
import FormDeliver, { DeliverFilter } from "./form";
import PrintModal from "./printing.modal";
import TableDeliver from "./table";
import { useEffect, useMemo, useRef, useState } from "react";
import EditAddress from "./edit_address.modal";
import AddTracking from "./add_tracking.modal";
import { cn, rowsPerPage } from "@/lib/util";
import {
  useDeliver,
  useDeliverByFilter,
  useDeliverById,
  useInfinityDeliver,
} from "@/lib/query/delivery";
import AddMultiTracking from "./add_multi_tracking.modal";
import {
  changeType,
  DeliverRes,
  deliveryPrismaProps,
  getDeliver,
  getDeliverByFilter,
  refetchData,
  testAddBook,
  updateAddress,
} from "@/lib/actions/deliver.actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import {
  Button,
  Image,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Refresh } from "iconsax-react";
import { LuX } from "react-icons/lu";
import EditTracking from "./edit_tracking.modal";
import { X } from "lucide-react";
import { getQueryClient } from "@/app/provider";
import { revalidate } from "@/app/deliver/page";

export type multiTrackDialog = {
  key: Set<number>;
  data?: Record<string, DeliverRes["data"][0]>;
  open?: boolean;
};
const DeliverComp = ({
  isNewData,
  deliveryData,
  page,
  searchFilter,
}: {
  searchFilter: DeliverFilter;
  page: number;
  isNewData: boolean;
  deliveryData: DeliverRes;
}) => {
  const searchParams = useSearchParams();

  const route = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const isLoadPage = useRef<boolean>(false);
  const isLoadSearchData = useRef<boolean>(false);
  const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState(
  //   searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1
  // );
  // const [delivery, setDelivery] = useState(deliveryData);
  const router = useRouter();
  const pathname = usePathname();
  const [newData, setNewData] = useState(isNewData);
  useEffect(() => {
    setNewData(isNewData);
  }, [isNewData]);
  const [searchData, setSearchData] = useState<DeliverFilter>(searchFilter);
  const [allPage, setAllPage] = useState(
    Math.ceil(deliveryData.total / rowsPerPage)
  );

  // const [oldParams, setOldParams] = useState(searchParams.toString());

  // const deliverQuery = useDeliverByFilter(
  //   { ...searchData, page: page },
  //   deliveryData
  // );
  // const fetchData = async () => {
  //   try {
  //     console.log("call FetchData");
  //     setTimeout(async () => {
  //       const masterDeliver = await getDeliverByFilter({
  //         ...searchData,
  //         page: page,
  //       });
  //       console.log("masterDeliver", masterDeliver);
  //       setAllPage(Math.ceil(masterDeliver.total / rowsPerPage));
  //       setDelivery(masterDeliver);
  //     }, 100);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    // setDelivery(deliveryData);
    setAllPage(Math.ceil(deliveryData.total / rowsPerPage));
  }, [deliveryData]);

  // const fetchPage = async () => {
  //   const masterDeliver = await getDeliverByFilter({
  //     ...searchData,
  //     page: page,
  //   });
  //   // setDelivery(masterDeliver);
  //   setLoading(false);
  // };

  useEffect(() => {
    if (isLoadSearchData.current === false) {
      isLoadSearchData.current = true;
      // refetchData()
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (searchData.status) {
      params.set("status", searchData.status);
    } else {
      params.delete("status");
    }
    if (searchData.endDate) {
      params.set("endDate", searchData.endDate);
    } else {
      params.delete("endDate");
    }
    if (searchData.startDate) {
      params.set("startDate", searchData.startDate);
    } else {
      params.delete("startDate");
    }
    // if (searchData.input) {
    //   params.set("search", searchData.input);
    // } else {
    //   console.log("143", 143);
    //   params.delete("search");
    // }
    if (searchData.university) {
      params.set("university", searchData.university);
    } else {
      params.delete("university");
    }
    params.set("page", "1");
    // setOldParams(`?${params.toString()}`);
    route.replace(`/deliver?${params.toString()}`);
    // setPage(1);
  }, [searchData]);
  // useEffect(() => {
  //   if (isLoadPage.current === true) {
  //     setLoading(true);
  //     // fetchPage();
  //   }
  //   const oldPage = searchParams.get("page");
  //   const newSearchPage = `page=${page}`;
  //   let search = location.search;
  //   if (oldPage) {
  //     search = search.replaceAll(`page=${oldPage}`, newSearchPage);
  //   }
  //   const newParam = !search ? `?${newSearchPage}` : search;
  //   route.replace(`/deliver${newParam}`);
  //   // if (newParam.includes("addTracking") || !newParam.includes("editAddress")) {
  //   // setOldParams(newParam.toString());
  //   // }

  //   setPage(page);
  // }, [page]);

  const onChangePage = (newPage: number) => {
    // setPage(newPage);
    const oldPage = searchParams.get("page");
    const newSearchPage = `page=${newPage}`;
    let search = location.search;
    if (oldPage) {
      search = search.replaceAll(`page=${oldPage}`, newSearchPage);
    }
    const newParam = !search ? `?${newSearchPage}` : search;
    route.replace(`/deliver${newParam}`);
    scrollToSection();
  };

  const [multiTrackingState, setMultiTrackingState] =
    useState<multiTrackDialog>({
      key: new Set([]),
      open: false,
    });

  const [printModalState, setPrintModalState] = useState<
    modalProps<DeliverRes["data"]>
  >({
    open: false,
  });

  const [selectState, setSelectState] = useState<modalProps>({
    open: false,
    data: undefined,
  });
  const [isEditAddress, setIsEditAddress] = useState<
    modalProps<DeliverRes["data"][0]> & { refetch?: () => void; id?: string }
  >({ open: false, data: undefined });

  const [isAddTracking, setIsAddTracking] = useState<
    modalProps<DeliverRes["data"][0]> & {
      type?: deliveryTypeProps;
      id?: string;
    }
  >({ open: false, data: undefined, type: undefined, id: undefined });

  const [isEditTracking, setIsEditTracking] = useState<
    modalProps<DeliverRes["data"][0]> & { id?: string }
  >({ open: false, data: undefined, id: undefined });

  const handleOpenMultiTracking = () => {
    setMultiTrackingState((prev) => ({ ...prev, open: true }));
  };

  const handleOpenPrintTracking = (data: DeliverRes["data"]) => {
    setPrintModalState((prev) => ({ open: true, data: data }));
  };
  const onOpenEditTracking = (data: DeliverRes["data"][0], id?: string) => {
    if (data) {
      const param = new URLSearchParams(searchParams.toString());
      param.set("editTracking", data.id.toString());
      const newPath = `${pathname}?${param.toString()}`;
      window.history.replaceState(null, "", newPath);
      setIsEditTracking((prev) => ({ open: true, data: data, id: id }));
    }
  };
  const onCloseEditTracking = () => {
    replacePath("editTracking");
    setIsEditTracking((prev) => ({ open: false }));
  };

  const onEditAddress = (
    data: DeliverRes["data"][0] | undefined,
    refetch?: () => void
  ) => {
    if (data) {
      const param = new URLSearchParams(searchParams.toString());
      param.set("editAddress", data.id.toString());
      const newPath = `${pathname}?${param.toString()}`;
      window.history.replaceState(null, "", newPath);
      setIsEditAddress({ open: true, data: data, refetch: refetch });
    } else {
      replacePath("editAddress");
      setIsEditAddress({ open: false });
    }
  };
  const replacePath = (path: string) => {
    // if (
    //   oldParams.includes("addTracking") ||
    //   oldParams.includes("editAddress") ||
    //   oldParams.includes("editTracking")
    // ) {
    //   const newPath = `/deliver`;
    //   window.history.replaceState(null, "", newPath);
    // }
    const param = new URLSearchParams(searchParams.toString());
    param.delete(path);
    // route.replace(`/deliver?${param.toString()}`)
    window.history.replaceState(null, "", `/deliver?${param.toString()}`);
  };

  useMemo(() => {
    const id = searchParams.get("editAddress");
    if (id && !isEditAddress.open) {
      const findDataByID = deliveryData.data.find((d) => d.id === parseInt(id));
      setTimeout(() => {
        setIsEditAddress({ open: true, data: findDataByID, id });
      });
    }
  }, [searchParams.get("editAddress")]);
  useMemo(() => {
    const id = searchParams.get("editTracking");
    if (id) {
      const findDataByID = deliveryData.data.find((d) => d.id === parseInt(id));
      setTimeout(() => {
        setIsEditTracking({ open: true, data: findDataByID, id: id });
      });
    }
  }, [searchParams.get("editTracking")]);

  useMemo(() => {
    const id = searchParams.get("addTracking");
    if (id) {
      const findDataByID = deliveryData.data.find((d) => d.id === parseInt(id));
      setTimeout(() => {
        setIsAddTracking({
          open: true,
          data: findDataByID,
          type: findDataByID?.type as deliveryTypeProps,
          id: id,
        });
      });
    }
  }, [searchParams.get("addTracking")]);

  const onOpenAddTrack = (
    data: DeliverRes["data"][0],
    type: deliveryTypeProps
  ) => {
    const param = new URLSearchParams(searchParams.toString());
    param.set("addTracking", data.id.toString());
    const newPath = `${pathname}?${param.toString()}`;
    window.history.replaceState(null, "", newPath);
    setIsAddTracking({ open: true, data, type, id: data.id.toString() });
  };
  const onChangeTypeSuccess = (
    type: deliveryTypeProps,
    newData: Awaited<ReturnType<typeof changeType>>
  ) => {
    // alert("Change Type Success");
    if (isAddTracking.data !== undefined) {
      refetch();
    }
    if (type === "ship") {
      // onEditAddress(newData as DeliverRes["data"][0]);
      onCloseAddTrack();
      onEditAddress(newData as DeliverRes["data"][0]);
    } else {
      onOpenAddTrack(newData as DeliverRes["data"][0], "pickup");

      // setIsAddTracking((prev) => {
      //    return { open: true, data: prev.data, type: type };
      // });
    }
    //  refetchData();
  };

  const onCloseAddTrack = () => {
    setIsAddTracking({ open: false });
    replacePath("addTracking");
  };

  //   const updateDataTable = (data: typeof deliveryData.data)=>{
  //   data.forEach(d=>{
  //       if(d.id === )
  //   })

  //   }

  // const deliverQuery = useDeliver();
  const refetch = () => {
    console.log("call refetch");

    // setLoading(true);
    setTimeout(() => {
      refetchData();
    }, 100);
    // router.refresh()

    // fetchData();
  };

  const onCloseSelect = () => {
    setSelectState({ open: false });
    setMultiTrackingState({
      key: new Set([]),
      data: undefined,
    });
  };

  const handleClosePrint = () => {
    setPrintModalState({ open: false });
  };

  const updatePrintModal = (
    data: Awaited<ReturnType<typeof updateAddress>>
  ) => {
    setPrintModalState((prev: modalProps<DeliverRes["data"]>) => {
      const cloneData = _.cloneDeep(prev.data)!;
      const findUpdateData = _.findIndex(
        cloneData,
        (deliver) => deliver.id === data?.id
      );
      if (findUpdateData > -1) {
        cloneData[findUpdateData]["updatedAddress"] = data?.updatedAddress!;
      }
      return { ...prev, data: cloneData };
    });
  };
  return (
    <div
      ref={sectionRef}
      className="flex  flex-col pt-0 md:pt-6 px-app  bg-background  md:h-screenDevice h-[calc(100dvh-64px)] bg-default-50 "
    >
      {/* <button onClick={testFn}>test refetch</button> */}
      {newData && (
        <div
          className={` absolute justify-center md:justify-end  right-4 bottom-4 z-50 w-fit`}
        >
          <NotifyModal
            onRefresh={() => {
              // refetchData();
              window.location.reload();
              // router.refresh();
              // setNewData(false);
            }}
            onClose={() => setNewData(false)}
          />
        </div>
      )}
      {/*  <div className="flex flex-col relative flex-1 font-IBM-Thai-Looped px-[14px] overflow-y-hidden  bg-default-50 h-screenDevice bg-green-500   "> */}
      <h1 className="hidden md:block font-sans text-[30px] text-default-foreground font-bold leading-9 py-2 ">
        การจัดส่ง
      </h1>
      <PrintModal
        dialogState={[printModalState, setPrintModalState]}
        onEditAddress={onEditAddress}
        onClose={handleClosePrint}
      />
      <EditAddress
        refetch={refetch}
        dialogState={[isEditAddress, setIsEditAddress]}
        updatePrintModal={updatePrintModal}
        onEditAddress={onEditAddress}
      />
      <AddTracking
        onChangeTypeSuccess={onChangeTypeSuccess}
        dialogState={isAddTracking}
        refetch={refetch}
        onClose={onCloseAddTrack}
      />
      <EditTracking
        dialogState={isEditTracking}
        refetch={refetch}
        onClose={onCloseEditTracking}
      />

      <AddMultiTracking
        dialogState={multiTrackingState}
        refetch={refetch}
        onClose={onCloseSelect}
      />
      {/* max-w-[960px]  */}
      {/* <div className=" flex flex-col mb-4 flex-1  overflow-hidden  "> */}
      <FormDeliver
        onCloseSelect={onCloseSelect}
        searchState={[searchData, setSearchData]}
        state={[selectState, setSelectState]}
        onAddTrackings={handleOpenMultiTracking}
        onPrintTrackings={handleOpenPrintTracking}
        selectData={multiTrackingState}
      />
      <TableDeliver
        isLoading={loading}
        // query={deliverQuery}
        page={page}
        onChangePage={onChangePage}
        onOpenEditTracking={onOpenEditTracking}
        onPrintTrackings={handleOpenPrintTracking}
        searchState={[searchData, setSearchData]}
        tableSelect={[multiTrackingState, setMultiTrackingState]}
        // query={deliverQuery}
        data={deliveryData}
        onEditAddress={onEditAddress}
        state={[selectState, setSelectState]}
        // onPrint={handleClosePrint}
        onAddTrackings={onOpenAddTrack}
      />
      <div className="py-2 flex justify-center">
        <Pagination
          className="p-0 m-0 font-serif"
          classNames={{
            cursor: "bg-default-foreground",
          }}
          aria-label="pagination-document"
          showShadow
          color="primary"
          page={page}
          total={allPage}
          onChange={(page) => onChangePage(page)}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

const NotifyModal = ({
  onClose,
  onRefresh,
}: {
  onRefresh: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="backdrop-blur-md shadow-nextui-md bg-black/70 rounded-lg font-serif flex items-center gap-2 py-2 md:py-app px-4">
      <p className="text-default-100">มีคำสั่งซื้อใหม่เข้ามา</p>
      <Button
        onClick={onRefresh}
        endContent={
          <Refresh
            strokeWidth={1.5}
            size={20}
            className="text-default-foreground"
          />
        }
        className="bg-default-100 text-default-foreground text-base font-medium"
      >
        Refresh
      </Button>
      <Button
        onClick={onClose}
        isIconOnly
        className="bg-transparent text-default-foreground min-w-0 w-6 h-6 p-1"
      >
        <X size={16} className="text-default-100 " />
      </Button>
    </div>
  );
};

export default DeliverComp;

export const RenderPopoverImg = (props: { imgUrl: string }) => {
  const { imgUrl } = props;
  return (
    <Popover placement="right">
      <PopoverTrigger className="cursor-pointer">
        <Image
          className="rounded-sm min-w-7"
          width={28}
          height={40}
          alt="NextUI hero Image"
          src={imgUrl}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Image
          className="rounded-sm"
          // width={}
          height={136}
          alt="NextUI hero Image"
          src={imgUrl}
        />
      </PopoverContent>
    </Popover>
  );
};
