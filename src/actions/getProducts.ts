import prisma from "@/libs/prismadb"

// Definición de la interfaz para los parámetros de búsqueda de productos
export interface iProductParams{
  category?: string | null
  searchTerm?: string | null
}

// Función para obtener productos según los parámetros proporcionados
export async function getProducts(params: iProductParams){
  try {
    const {category, searchTerm} = params; // Destructuramos los parámetros
    let searchString = searchTerm || ''; // Asignamos una cadena vacía si no se proporciona searchTerm 

    // Construimos la consulta inicial
    let query:any = {}

    // Si se proporciona una categoría, la agregamos a la consulta
    if (category) {
      query.category = category
    }

    // Obtenemos los productos que coinciden con la categoria y el término de búsqueda
    const products = await prisma.product.findMany({
      where: {
        ...query,
        OR: [
          {
            name: {
              contains: searchString,  // Filtramos por nombre que contiene el término de búsqueda
              mode: 'insensitive' // Búsqueda insensible a mayúsculas/minúsculas
            },
            description: {
              contains: searchString,  // Filtramos por descripción que contiene el término de búsqueda 
              mode: 'insensitive' // Búsqueda insensible a mayúsculas/minúsculas
            }
          }
        ]
      },
      include: {
        reviews: { // Incluimos las reseñas del producto
          include: {
            user: true // Incluimos la información del usuario que hizo la reseña
          },
          orderBy: {
            createdDate: 'desc' // Ordenamos las reseñas por fecha de creación descendente
          }
        }
      }
    })

    return products; // Devolvemos los productos obtenidos

  } catch (error: any) {
    // Manejamos cualquier error que pueda ocurrir y lanzamos una nueva excepción
    throw new Error(error)
  }
}

