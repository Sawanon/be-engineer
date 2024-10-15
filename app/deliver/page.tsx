import DeliverComp from "@/components/Deliver";
import { addDeliverShipService } from "@/lib/actions/delivery_ship.actions";

const DeliverPage = async() => {
   // addDeliverShipService({})
   return (
      // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
      <section className="flex-1 flex flex-col">
         <DeliverComp />
      </section>
   );
};

export default DeliverPage;
