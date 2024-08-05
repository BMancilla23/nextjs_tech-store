"use client"

import { ActionBtn } from "@/components/ui/ActionBtn"
import { Badge } from "@/components/ui/Badge"
import { Heading } from "@/components/ui/Heading"
import { formatPrice } from "@/utils/formatPrice"
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Order, User } from "@prisma/client"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/navigation"
import { FC, useCallback } from "react"
import toast from "react-hot-toast"
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md"

interface OrdersClientProps{
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User
}

export const OrdersClient:FC<OrdersClientProps> = ({orders}) => {

  const router = useRouter()

  let rows: any = []

  if (orders) {
    rows=orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: moment(order.createDate).fromNow(),
        deliveryStatus: order.deliveryStatus,
     
      }
    })
  }


  const columns: GridColDef[] = [
    {
      field: 'id', headerName: 'ID', width: 220
    },
    {
      field: 'customer', headerName: 'Customer Name', width: 130
    },
    {
      field: 'amount', headerName: 'Amount(USD)', width: 130, renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.amount}</div>
        )
      }
    },
   
    {
      field: "paymentStatus", headerName: "Payment Status", width: 130, renderCell: (params) => {
        return (
          <div>{params.row.paymentStatus === 'pending' ? (<Badge text="pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700"/>) : params.row.paymentStatus === 'completed' ? (<Badge text="completed" icon={MdDone} bg="bg-green-200" color="text-green-700"/>): (<></>)}</div> 
        )
      }
    },
    {
      field: "deliveryStatus", headerName: "Delivery Status", width: 130, renderCell: (params) => {
        return (
          <div>{params.row.deliveryStatus === 'pending' ? (<Badge text="pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700"/>) : params.row.deliveryStatus === 'dispatched' ? (<Badge text="dispatched" icon={MdDeliveryDining} bg="bg-purple-200" color="text-purple-700"/>) : params.row.deliveryStatus === 'delivered' ? (
            <Badge text="delivered" icon={MdDone} bg="bg-green-200" color="text-green-700"/>
          ) : (<></>)}</div> 
        )
      }
    },
    {
      field: "date",
      headerName: "Date",
      width: 130
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between items-center gap-4 w-full h-full">
          
          <ActionBtn icon={MdRemoveRedEye} onClick={() => {
            router.push(`order/${params.row.id}`)
          }}/>
        </div>
        )
      }
    }
  ]

  return (
    <>
      <div className="mb-4 mt-8"><Heading title="Manage Orders" center/></div>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 9 },
          },
        }}
        pageSizeOptions={[9, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
    </>
  )
}