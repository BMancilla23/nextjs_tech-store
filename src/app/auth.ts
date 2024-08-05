import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/prismadb";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

// Configuración de opciones de NextAuth V4
export const authOptions: NextAuthOptions = {
  // Adaptador de Prisma para utilizar Prisma como base de datos
  adapter: PrismaAdapter(prisma),
  providers: [
    // Proveedor de autenticación de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Proveedor de autenticación con credenciales
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // Función de autorización personalizada
      async authorize(credentials) {
        // Verifica que las credenciales sean válidas
        if (!credentials || typeof credentials.email !== "string" || typeof credentials.password !== "string") {
          throw new Error("Invalid email or password");
        }

        // Buscar al usuario en la base de datos por su email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Si no se encuentra el usuario o no tiene contraseña, lanza un error
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

        // Si la contraseña no es correcta. lanza un error
        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }

        // Devuelve el usuario si la autorización es exitosa
        return user;
      },
    }),
  ],
  // Página personalizada de inicio de sesión
  pages: { signIn: "/auth/login" },
  // Modo de depuración activada en desarrollo
  debug: process.env.NODE_ENV === "development",
  // Estrategia de sesión utilizando JWT
  session: { strategy: "jwt" },
  // Secreto para firmar los JWT
  secret: process.env.AUTH_SECRET as string,
};
