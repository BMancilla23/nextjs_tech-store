"use client"

import { CategoryInput } from "@/components/ui/inputs/CategoryInput"
import { CustomCheckbox } from "@/components/ui/inputs/CustomCheckbox"
import { Heading } from "@/components/ui/Heading"
import { Input } from "@/components/ui/inputs/Input"
import { TextArea } from "@/components/ui/inputs/TextArea"
import { categories } from "@/data/categories"
import { useCallback, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { colors } from "@/data/colors"
import { SelectColor } from "@/components/ui/inputs/SelectColor"
import { ImageType } from "@/types/image.type"
import { Button } from "@/components/ui/Button"
import { UploadedImageType } from "@/types/uploadedImage.type"
import toast from "react-hot-toast"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from "@/libs/firebase"
import axios from "axios"
import { useRouter } from "next/navigation"

export const AddProductForm = () => {

  const router = useRouter()

  // Estado para manejar la carga del formulario
  const [isLoading, setIsLoading] = useState(false)

  // Estado para almacenar las imágenes seleccionadas
  const [images, setImages] = useState<ImageType[] | null>(null)

  // Estado para indicar si el producto se creó correctamente
  const [isProductCreated, setIsProductCreated] = useState(false)

/*   console.log("images>>>", images) */

// Inicialización del formulario con valores por defecto
  const {register, handleSubmit, setValue, watch, reset, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: ""
    }
  })

 

  // Efecto para actualizar el campo de imágenes del formulario cuando cambia el estado de imágenes
  useEffect(() => {
    
  setCustomValue('images', images)
    
  }, [images])


  // Función para agregar una imagen al estado
  const addImageToState = useCallback(
    (value: ImageType) => {
      setImages((prev) => {
        if (!prev) {
          return [value]
        }

        return [...prev, value]
      })
    },
    [],
  )

  // Función para eliminar una imagen del estado
  const removeImageFromState = useCallback(
    (value: ImageType) => {
      setImages((prev) => {
        if (prev) {
          const filteredImages = prev.filter((item) => item.color !== value.color)
          return filteredImages;
        }
        return prev;
      })
    },
    [],
  )
  
  // Efecto para reiniciar el formulario y el estado de imágenes cuando se crea un producto exitosamente
  useEffect(() => {
    if (isProductCreated) {
      reset()
      setImages(null)
      setIsProductCreated(false)
    }
  
  }, [isProductCreated])
  
  
  // Manejo del envió del formulario
  const onSubmit: SubmitHandler<FieldValues> = async(data) => {
    console.log("Product Data" ,data);
    
    // Indicamos que ese está cargando el formulario
    setIsLoading(true)
    let uploadedImages: UploadedImageType[] = []

    // Validación de categoría seleccionada
    if (!data.category) {
      setIsLoading(false)
      return toast.error('Category is not selected')
    }

    // Validación de imágenes seleccionadas
    if (!data.images || data.images.length === 0) {
      setIsLoading(false)
      return toast.error('No selected image!')
    }

    // Función para manejar la subida de imágenes a Firebase
    const handleImageUploads = async () => {
      toast('Creating product, please wait...');

      try {

        // Iteramos sobre cada imagen en el array de imágenes
        for (const item of data.images) {
          if (item.image) {

            // Creamos un nombre único para cada archivo de imagen
            const fileName = new Date().getTime() + '-' + item.image.name;

            // Inicializamos el almacenamiento de Firebase y la referencia del archivo
            const storage = getStorage(app)
            const storageRef = ref(storage, `products/${fileName}`)
            
            // Subimos el archivo usando uploadBytesResumable para obtener el progreso de la carga
            const uploadTask = uploadBytesResumable(storageRef, item.image)

            await new Promise<void>((resolve, reject) => {

              // Monitoreamos el estado de la carga
              uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')

                // Control de estado de la carga
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused')
                    break;
                  
                  case 'running':
                    console.log('Upload is running')
                    break;
                }
              }, (error) => {
                // En caso de error durante la carga, rechazamos la promesa
                console.log('Error uploading image', error)
                reject(error)
              }, () => {
                
                // Cuando la carga se completa, obtenemos la URL de descarga del archivo
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  
                  // Agregamos la URL de descarga y otros datos de la imagen al array uploadedImages
                  uploadedImages.push({
                    ...item,
                    image: downloadURL
                  })

                  console.log('File available at', downloadURL);
                  resolve()
                }).catch((error) => {
                  
                  console.log("Error getting the download URL", error)
                  reject(error)
                });
              }
            )
            })
          }
          
        }
      } catch (error) {
        // En caso de error en la carga de cualquier imagen, mostramos un error y detenemos la carga 
        setIsLoading(false)
        console.log('Error handling image uploads', error)
        return toast.error('Error handling image uploads')
      }
    }
    
    // Esperar a que todas las imágenes se suban antes de continuar
    await handleImageUploads()

    // Creamoos el objeto con los datos del producto incluyendo las URLs de las imágenes subidas
    const productData = {...data, images: uploadedImages}
    console.log("productData", productData)

    // Enviamos los datos del productos a nuestra API para guardarlo en la base de datos
    axios.post('/api/product', productData).then(() => {
      toast.success('Product created')
      setIsProductCreated(true)
      router.refresh()
    }).catch((error) => {
      toast.error('Something went wrong when saying product to db')
    }).finally(() => {
      setIsLoading(false)
    })

  }

  // Observar el valor de la categoría seleccionada
  const category = watch("category")

  // Función para establecer valores personalizados en el formulario
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  return (
    <>
      <Heading title="Add a Product" center/>
      <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required/>
      <Input id="price" label="Price" disabled={isLoading} register={register} errors={errors} required/>
      <Input id="brand" label="Brand" disabled={isLoading} register={register} errors={errors} required/>
      <TextArea id="description" label="Description" disabled={isLoading} register={register} errors={errors} required/>
      <CustomCheckbox id="inStock" register={register} label="This product is in stock"/>
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
          {
            categories.map((item) => {
              if (item.label === 'All') {
                return null
              }

              return (
                <div key={item.label} className="col-span">
                <CategoryInput onClick={(category) => setCustomValue('category', category)} selected={category === item.label} label={item.label} icon={item.icon}/>
              </div>
              )
            })
          }
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">Select the available product colors and upload their images</div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise your color selection will be ignored
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {
            colors.map((item, i) => {
              return <SelectColor key={i} item={item} addImageToState={addImageToState} removeImageFromState={removeImageFromState} isProductCreated={isProductCreated}/>
            })
          }
        </div>
      </div>
      <Button label={isLoading? 'Loading...': 'Add Product'} onClick={handleSubmit(onSubmit)}/>
    </>
  )
}
