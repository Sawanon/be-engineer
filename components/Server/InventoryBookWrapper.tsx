import { listBookTransactionByBookIdGroupByYearMonth } from '@/lib/actions/bookTransactions'
import React from 'react'
import BookInventory from './InventoryBook'
import { getBookById } from '@/lib/actions/book.actions'

const InventoryBookWrapper = async ({
  id,
}:{
  id: string,
}) => {
  console.log("id: ", id);
  if(!id){
    return <></>
  }
  const bookTransactionsList = await listBookTransactionByBookIdGroupByYearMonth(parseInt(id))
  const book = await getBookById(parseInt(id))
  return (
    <div>
      <BookInventory
        bookTransactionsList={bookTransactionsList}
        book={book}
      />
    </div>
  )
}

export default InventoryBookWrapper