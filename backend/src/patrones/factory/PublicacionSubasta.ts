import type { PublicacionAlimento, DatosPublicacion, PublicacionDTO } from './PublicacionAlimento.js'
import type { Modalidad } from '../../modelos/tipos.js'

export class PublicacionSubasta implements PublicacionAlimento {
    id: string;
    alimento: any;
    horarioRecoleccion: any;
    establecimiento: any;
    estadoActual: any;
    precioBase: number;
    fechaPublicacion: string;

    constructor(datos: DatosPublicacion) {
        this.id = datos.id;
        this.alimento = datos.alimento;
        this.horarioRecoleccion = datos.horarioRecoleccion;
        this.establecimiento = datos.establecimiento;
        this.estadoActual = datos.estadoActual ?? 'disponible';
        this.precioBase = datos.precioBase;
        this.fechaPublicacion = datos.fechaPublicacion ?? new Date().toISOString();
    }

    getModalidad(): Modalidad {
        return 'subasta' as Modalidad;
    }

    getPorcentajeDescuento(): number {
        return 0;
    }

    calcularPrecioFinal(): number {
        return this.precioBase * 0.50;
    }

    mostrarPublicacion(): void {
        console.log(`[SUBASTA] ${this.alimento.nombre} - Puja inicial: $${this.calcularPrecioFinal()}`);
    }

    toJSON(): PublicacionDTO {
        return {
            id: this.id,
            modalidad: this.getModalidad(),
            alimento: this.alimento,
            horarioRecoleccion: this.horarioRecoleccion,
            establecimiento: this.establecimiento,
            estadoActual: this.estadoActual,
            precioBase: this.precioBase,
            porcentajeDescuento: 0,
            precioFinal: this.calcularPrecioFinal(),
            fechaPublicacion: this.fechaPublicacion
        };
    }
}
