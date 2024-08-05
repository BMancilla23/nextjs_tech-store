import prisma from '@/libs/prismadb'

export async function getOrders(){
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true
      },
      orderBy: {
        createDate: 'desc'
      }
    })

    return orders;
  } catch (error: any) {
    console.error('Error retrieving orders:', error);
    throw new Error(`Failed to retrieve orders: ${error.message || error}`);
  }
}