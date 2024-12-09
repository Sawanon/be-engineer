import { DateRangePicker } from "@nextui-org/react";
import React from "react";

const Test = () => {
  return (
    <div className={`w-96`}>
      <DateRangePicker
        className={`font-serif text-red-400`}
        classNames={{
          segment: [`text-red-400`],
          separator: [`text-red-400`],
        }}
      />
    </div>
  );
};

export default Test;
