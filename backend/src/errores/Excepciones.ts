// Excepciones del Back-End. Se nombran igual que en Java para seguir el código muestra
// (por ejemplo: throw new IllegalArgumentException("Tipo de personaje no válido")).
// Cada una lleva el código HTTP con el que se responde al cliente.

export class IllegalArgumentException extends Error {
  readonly codigoHttp: number = 400

  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'IllegalArgumentException'
  }
}

export class IllegalStateException extends Error {
  readonly codigoHttp: number = 409

  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'IllegalStateException'
  }
}

export class NoEncontradoException extends Error {
  readonly codigoHttp: number = 404

  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'NoEncontradoException'
  }
}

export class NoAutorizadoException extends Error {
  readonly codigoHttp: number = 401

  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'NoAutorizadoException'
  }
}

export class AccesoDenegadoException extends Error {
  readonly codigoHttp: number = 403

  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'AccesoDenegadoException'
  }
}
