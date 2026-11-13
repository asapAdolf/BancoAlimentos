import { crearApp } from './app.js'

const PUERTO = Number(process.env.PUERTO ?? 3000)

crearApp().listen(PUERTO, () => {
  console.log(`Back-End de Rescate Alimentario escuchando en http://localhost:${PUERTO}/api`)
})
