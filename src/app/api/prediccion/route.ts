import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simular llamada al microservicio Flask
    // En producción, esto sería una llamada real a tu API Flask
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simular latencia
    

    // Datos de ejemplo para demostración
    const predicciones = [
      { fecha: body.fecha_objetivo, prediccion: 0.75 },
      {
        fecha: new Date(new Date(body.fecha_objetivo).getTime() + 86400000).toISOString().split("T")[0],
        prediccion: 0.82,
      },
      {
        fecha: new Date(new Date(body.fecha_objetivo).getTime() + 172800000).toISOString().split("T")[0],
        prediccion: 0.68,
      },
    ]

    const response = {
      prediccion: predicciones,
      advertencia:
        body.datos.length < 5
          ? "Se recomienda proporcionar más datos históricos para mejorar la precisión de las predicciones."
          : null,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()

//     const res = await fetch("http://localhost:5000/predecir", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ...body,
//         col_fecha: "fecha",
//         col_ocup: "ocupacion",
//       }),
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       return NextResponse.json({ error: data.error || "Error desde Flask" }, { status: 500 })
//     }

//     return NextResponse.json(data)
//   } catch (error) {
//     return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
//   }
// }
