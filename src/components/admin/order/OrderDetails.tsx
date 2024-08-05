"use client"

import { Order } from "@prisma/client"
import { useRouter } from "next/navigation"
import { FC } from "react"
import { Heading } from "../../ui/Heading"
import { formatPrice } from "@/utils/formatPrice"
import { Badge } from "../../ui/Badge"
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md"
import moment from "moment"
import { OrderItem } from "./OrderItem"

interface OrderDetailsProps{
  order: Order
}

export const OrderDetails:FC<OrderDetailsProps> = ({order}) => {

  const router = useRouter()

  return (
    <>
      <div className="max-w-[1150px] m-auto flex flex-col gap-2">
        <div className="mt-8">
          <Heading title="Order Details"/>
        </div>
        <div>Order ID: {order.id}</div>
        <div>Total Amount: {" "} <span>{formatPrice(order.amount)}</span></div>
        <div className="flex gap-2 items-center">
        <div>Payment status:</div>
        <div>
          {
            order.status === 'pending' ? (<Badge text="pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700"/>) : order.status === "completed" ? (
              <Badge text="completed" icon={MdDone} bg="bg-green-200" color="text-green-700"/> 
            ): (<></>)
          }
          </div>
        </div>

        <div className="flex gap-2 items-center">
        <div>Delivery status:</div>
        <div>
          {
            order.deliveryStatus === 'pending' ? (<Badge text="pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700"/>) : order.deliveryStatus === "dispatched" ? (
              <Badge text="dispatched" icon={MdDeliveryDining} bg="bg-purple-200" color="text-purple-700"/> 
            ): order.deliveryStatus === "delivered" ? (
              <Badge text="dispatched" icon={MdDone} bg="bg-green-200" color="text-green-700"/> 
            ): (<></>)
          }
          </div>
        </div>
          <div>Date: {
              moment(order.createDate).fromNow()
            }</div>
            <div>
              <h2 className="font-semibold mt-4 mb-2">Products ordered</h2>
              <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
                <div className="col-span-2 justify-self-start">PRODUCT</div>
                <div className="justify-self-center">PRICE</div>
                <div className="justify-self-center">QTY</div>
                <div className="justify-self-end">TOTAL</div>
              </div>
              {
                order.products && order.products.map((item) => {
                  return <OrderItem key={item.id} item={item}/>
                })
              }
            </div>
      </div>
    </>
  )
}