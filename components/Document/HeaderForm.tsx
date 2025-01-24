"use client";
import { cn } from "@/lib/util";
import {
  Button,
  Input,
  Select,
  SelectItem,
  SharedSelection,
} from "@nextui-org/react";
import { Book, ChevronDown, FileSignature, ScrollText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LuPlus } from "react-icons/lu";
import _ from 'lodash'
import {Key} from '@react-types/shared';

const HeaderForm = () => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const [searchText, setSearchText] = useState('')

  const title = useMemo(() => {
    const documentMode = searchParams.get("type") ?? "book";
    switch (documentMode) {
      case "book":
        return "หนังสือ";
      case "sheet":
        return "เอกสาร";
      case "pre-exam":
        return "Pre-exam";
      default:
        return "";
    }
  }, [searchParams.get("type")]);

  const renderPlaceholder = () => {
    const documentMode = searchParams.get("type") ?? "book";
    if (documentMode === "book") {
      return `ชื่อหนังสือ midterm/final เทอม ปีการศึกษา`;
    } else if (documentMode === "sheet") {
      return `ชื่อเอกสาร ปีการศึกษา`;
    } else if (documentMode === "pre-exam") {
      return `ชื่อเอกสาร ปีการศึกษา`;
    } else {
      return ``;
    }
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    route.replace(`/document?${params.toString()}`);
  };

  const debounceSearchBook = _.debounce(handleSearch, 500)

  useEffect(() => {
    debounceSearchBook(searchText)
    return () => {
       debounceSearchBook.cancel()
    }
  }, [searchText])

  const selectedDocumentType:Iterable<Key> = useMemo(() => {
    const type = searchParams.get(`type`) ?? 'book'
    return new Set([type])
  }, [searchParams.get(`type`)])

  return (
    <div className={``}>
      <div className="font-sans text-3xl font-bold hidden md:block">
        {title}
      </div>
      <div className={`flex gap-2 md:flex-row flex-col items-center mt-app`}>
        <Input
          type="text"
          // label="Email"
          placeholder={renderPlaceholder()}
          // labelPlacement="outside"
          startContent={
            <CiSearch
              strokeWidth={1}
              className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
            />
          }
          aria-label={`search document`}
          className={`font-serif`}
          classNames={{
            input: [`text-[1em]`],
          }}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value)
          }}
          // onChange={(e) => onChangeSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-1 order-2 w-full md:w-auto">
          <div className={`flex-1`}>
            <StatusSelect
              selectedKeys={selectedDocumentType ?? undefined}
              onChange={(mode) => {
                //  onChangeMode(mode.currentKey as DocumentMode)
                console.log(mode);
                const size = (mode as any).size as number;
                console.log("🚀 ~ HeaderForm ~ size:", size);
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', '1')
                if (size > 0 && mode.currentKey) {
                  params.set("type", mode.currentKey);
                } else {
                  params.delete("type");
                }
                route.replace(`/document?${params.toString()}`);
              }}
            />
          </div>
          <div className={`flex-1`}>
            <Button
              // onClick={onAddDocument}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('add', 'true')
                route.replace(`/document?${params.toString()}`)
              }}
              className={`md:max-w-max w-full font-sans font-medium bg-default-foreground text-primary-foreground`}
              endContent={<LuPlus size={20} />}
              aria-label="add document"
            >
              <span className={`md:hidden`}>เพิ่มเอกสาร</span>
              <span className={`hidden md:block`}>เพิ่ม</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;

const StatusSelect = ({
  onChange,
  selectedKeys,
}: {
  onChange: (mode: SharedSelection) => void,
  selectedKeys?: Iterable<Key>,
}) => {
  return (
    <Select
      placeholder="หนังสือ"
      className={`font-sans md:max-w-[116px] w-full`}
      aria-label={`document`}
      classNames={{
        value: "text-default-foreground font-medium",
        trigger: cn("flex items-center justify-center  "),
        base: cn("flex-1 "),
        popoverContent: [`w-max right-0 absolute`],
        innerWrapper: [`w-max`],
        selectorIcon: [`w-6 h-6 end-0 relative`],
      }}
      selectionMode={"single"}
      selectorIcon={<ChevronDown size={24} />}
      onSelectionChange={onChange}
      selectedKeys={selectedKeys}
    >
      <SelectItem
        classNames={{
          base: cn("flex gap-1"),
        }}
        className={`font-serif`}
        aria-label={`หนังสือ`}
        startContent={<Book size={16} />}
        key={"book"}
      >
        หนังสือ
      </SelectItem>
      <SelectItem
        classNames={{
          base: cn("flex gap-1"),
        }}
        className={`font-serif`}
        aria-label={`เอกสาร`}
        startContent={<ScrollText size={16} />}
        key={"sheet"}
      >
        เอกสาร
      </SelectItem>
      <SelectItem
        classNames={{
          base: cn("flex gap-1"),
        }}
        className={`font-serif`}
        aria-label={`pre-exam`}
        startContent={<FileSignature size={16} />}
        key={"pre-exam"}
      >
        Pre-exam
      </SelectItem>
    </Select>
  );
};
