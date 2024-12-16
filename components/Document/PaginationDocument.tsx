"use client"
import { Pagination } from '@nextui-org/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const PaginationDocument = ({
  currentPage,
  pageSize,
  className,
}:{
  currentPage: number,
  pageSize: number,
  className?: string,
}) => {
  const searchParams = useSearchParams()
  const route = useRouter()
  return (
    <div className={`flex w-full justify-center my-[14px] ${className ?? ''}`}>
      <Pagination
          classNames={{
            cursor: "bg-default-foreground",
          }}
          className={`font-serif`}
          aria-label="pagination-document"
          showShadow
          color="primary"
          // page={page}
          page={currentPage}
          total={pageSize}
          // onChange={(page) => setPage(page)}
          onChange={(page) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('page', page.toString())
            route.replace(`/document?${params.toString()}`)
          }}
      />
    </div>
  )
}

export default PaginationDocument