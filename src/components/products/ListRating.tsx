'use client'

import { Product, Review } from "@/interfaces/products.interface"
import { FC } from "react"
import { Heading } from "../ui/Heading"
import moment from "moment"
import { Rating } from "@mui/material"
import { Avatar } from "../ui/Avatar"

interface ListRatingProps{

  product: Product
}

export const ListRating: FC<ListRatingProps> = ({product}) => {
  return (
    <div>
      <Heading title="Product Review"/>

      <div className="text-sm mt-2">
        {
          product.reviews && product.reviews.map((review: Review) => (
            <div key={review.id} className="max-w-[300px] ">
              <div className="flex gap-2 items-center">
              <Avatar src={review?.user.image}/>
              <div className="font-semibold">{review?.user.name}</div>
              <div className="font-light">{moment(review.createdDate).fromNow()}</div>
              </div>
              <div className="mt-2">
                <Rating value={review.rating} readOnly/>
                <div className="">{review.comment}</div>
                <hr className="mt-4 mb-4"/>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}