"use server";

import prisma from "@/libs/prismadb";

import { authOptions } from "@/app/auth"
import { getServerSession } from "next-auth"

// Obtener la sesión del usuario
export async function getSession(){
  return await getServerSession(authOptions)
}

// Función para obtener el usuario actual basado en la sesión
export async function getCurrentUser() {
  try {
    // Obtener la sesión actual
    const session = await getSession();

    // Verificar que la sesión y el email del usuario existan
    if (!session || !session.user || typeof session.user.email !== "string") {
      return null;
    }

    // Buscar el usuario en la base de datos por su email
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Si el usuario no se encuentra, devolver null
    if (!currentUser) {
      return null;
    }

    // Devolver el usuario con fechas convertidas a ISO string
    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toString() || null,
    };

  } catch (error: any) {
    // Manejo de errores y registro del error en la consola
    console.error(error);
    return null;
  }
}
