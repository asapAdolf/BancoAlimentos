-- =====================================================================
-- Rescate Alimentario - Esquema de base de datos (PostgreSQL)
-- Generado a partir del diagrama BaseDatosFinal.png
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Catálogos
-- ---------------------------------------------------------------------

CREATE TABLE Roles (
    RolID           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre          VARCHAR(50)  NOT NULL UNIQUE,
    Descripcion     VARCHAR(255)
);

CREATE TABLE Zonas (
    ZonaID          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre          VARCHAR(100) NOT NULL UNIQUE,
    Ciudad          VARCHAR(100) NOT NULL
);

CREATE TABLE Unidades_Medida (
    UnidadID        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre          VARCHAR(50)  NOT NULL UNIQUE,
    Abreviatura     VARCHAR(10)  NOT NULL
);

CREATE TABLE Categorias_Alimento (
    CategoriaID     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre          VARCHAR(100) NOT NULL UNIQUE,
    Descripcion     VARCHAR(255)
);

CREATE TABLE Metodos_Pago (
    MetodoPagoID    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre          VARCHAR(50)  NOT NULL UNIQUE,
    Activo          BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE Horarios_Recoleccion (
    HorarioID           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    FechaRecoleccion    DATE NOT NULL,
    HoraInicio          TIME NOT NULL,
    HoraFin             TIME NOT NULL,
    CONSTRAINT chk_horario_rango CHECK (HoraFin > HoraInicio)
);

-- ---------------------------------------------------------------------
-- Usuarios y seguridad
-- ---------------------------------------------------------------------

CREATE TABLE Usuarios (
    UsuarioID       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre          VARCHAR(150) NOT NULL,
    Email           VARCHAR(255) NOT NULL UNIQUE,
    Telefono        VARCHAR(20),
    PasswordHash    VARCHAR(255) NOT NULL,
    Activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    FechaRegistro   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuario_Roles (
    UsuarioID         INTEGER   NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE,
    RolID             INTEGER   NOT NULL REFERENCES Roles(RolID) ON DELETE RESTRICT,
    FechaAsignacion   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UsuarioID, RolID)
);

CREATE TABLE Tokens_Sesion (
    TokenID           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID         INTEGER      NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE,
    TipoToken         VARCHAR(30)  NOT NULL,
    TokenHash         VARCHAR(255) NOT NULL UNIQUE,
    FechaExpiracion   TIMESTAMP    NOT NULL,
    Revocado          BOOLEAN      NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- Notificaciones (suscripciones y preferencias)
-- ---------------------------------------------------------------------

CREATE TABLE Suscripciones_Notificacion (
    SuscripcionID       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID           INTEGER   NOT NULL UNIQUE REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE,
    Activa              BOOLEAN   NOT NULL DEFAULT TRUE,
    FechaSuscripcion    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Preferencias_Notificacion (
    PreferenciaID     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SuscripcionID     INTEGER     NOT NULL REFERENCES Suscripciones_Notificacion(SuscripcionID) ON DELETE CASCADE,
    CategoriaID       INTEGER     REFERENCES Categorias_Alimento(CategoriaID) ON DELETE SET NULL,
    ZonaID            INTEGER     REFERENCES Zonas(ZonaID) ON DELETE SET NULL,
    Medio             VARCHAR(30) NOT NULL,
    SoloDonaciones    BOOLEAN     NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- Empresas, establecimientos y transportistas
-- ---------------------------------------------------------------------

CREATE TABLE Empresas (
    EmpresaID         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RepresentanteID   INTEGER      NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE RESTRICT, -- Usuario responsable
    RazonSocial       VARCHAR(200) NOT NULL,
    NombreComercial   VARCHAR(200),
    RFC               VARCHAR(13)  NOT NULL UNIQUE,
    Email             VARCHAR(255),
    Telefono          VARCHAR(20),
    DireccionFiscal   VARCHAR(255),
    Activa            BOOLEAN      NOT NULL DEFAULT TRUE,
    FechaRegistro     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Establecimientos (
    EstablecimientoID    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpresaID            INTEGER      NOT NULL REFERENCES Empresas(EmpresaID) ON DELETE CASCADE,
    ZonaID               INTEGER      NOT NULL REFERENCES Zonas(ZonaID) ON DELETE RESTRICT,
    Nombre               VARCHAR(150) NOT NULL,
    TipoEstablecimiento  VARCHAR(50)  NOT NULL,
    Direccion            VARCHAR(255) NOT NULL,
    PuntoRecoleccion     VARCHAR(255),
    Telefono             VARCHAR(20),
    Activo               BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE Transportistas (
    TransportistaID    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID          INTEGER     NOT NULL UNIQUE REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE, -- Perfil del usuario
    EmpresaID          INTEGER     REFERENCES Empresas(EmpresaID) ON DELETE SET NULL,             -- Nulo si es independiente
    NumeroLicencia     VARCHAR(50) NOT NULL UNIQUE,
    VigenciaLicencia   DATE        NOT NULL,
    Activo             BOOLEAN     NOT NULL DEFAULT TRUE,
    FechaAlta          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vehiculos_Transportista (
    VehiculoID           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TransportistaID      INTEGER       NOT NULL REFERENCES Transportistas(TransportistaID) ON DELETE CASCADE,
    ZonaID               INTEGER       NOT NULL REFERENCES Zonas(ZonaID) ON DELETE RESTRICT,
    TipoVehiculo         VARCHAR(50)   NOT NULL,
    Placas               VARCHAR(15)   NOT NULL UNIQUE,
    TieneRefrigeracion   BOOLEAN       NOT NULL DEFAULT FALSE,
    CapacidadKilos       NUMERIC(10,2) NOT NULL CHECK (CapacidadKilos > 0),
    Disponible           BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- Alimentos y publicaciones
-- ---------------------------------------------------------------------

CREATE TABLE Alimentos (
    AlimentoID          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CategoriaID         INTEGER       NOT NULL REFERENCES Categorias_Alimento(CategoriaID) ON DELETE RESTRICT,
    UnidadID            INTEGER       NOT NULL REFERENCES Unidades_Medida(UnidadID) ON DELETE RESTRICT,
    Nombre              VARCHAR(150)  NOT NULL,
    Descripcion         VARCHAR(500),
    Kilos               NUMERIC(10,2) NOT NULL CHECK (Kilos >= 0),
    CantidadDisponible  INTEGER       NOT NULL CHECK (CantidadDisponible >= 0),
    FechaCaducidad      TIMESTAMP     NOT NULL,
    FotoUrl             VARCHAR(500)
);

CREATE TABLE Publicaciones (
    PublicacionID         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EstablecimientoID     INTEGER       NOT NULL REFERENCES Establecimientos(EstablecimientoID) ON DELETE CASCADE,
    AlimentoID            INTEGER       NOT NULL REFERENCES Alimentos(AlimentoID) ON DELETE RESTRICT,
    HorarioID             INTEGER       NOT NULL REFERENCES Horarios_Recoleccion(HorarioID) ON DELETE RESTRICT,
    TipoPublicacion       VARCHAR(30)   NOT NULL,
    PrecioBase            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (PrecioBase >= 0),
    PorcentajeDescuento   NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (PorcentajeDescuento BETWEEN 0 AND 100),
    EstadoActual          VARCHAR(30)   NOT NULL,
    FechaPublicacion      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Historial_Publicaciones (
    HistorialID             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PublicacionID           INTEGER     NOT NULL REFERENCES Publicaciones(PublicacionID) ON DELETE CASCADE,
    UsuarioResponsableID    INTEGER     REFERENCES Usuarios(UsuarioID) ON DELETE SET NULL,
    EstadoAnterior          VARCHAR(30),
    EstadoNuevo             VARCHAR(30) NOT NULL,
    FechaCambio             TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notificaciones (
    NotificacionID      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID           INTEGER      NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE,
    PublicacionID       INTEGER      REFERENCES Publicaciones(PublicacionID) ON DELETE SET NULL,
    TipoNotificacion    VARCHAR(50)  NOT NULL,
    Titulo              VARCHAR(150) NOT NULL,
    Mensaje             VARCHAR(1000) NOT NULL,
    FechaEnvio          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Medio               VARCHAR(30)  NOT NULL,
    Leida               BOOLEAN      NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- Reservaciones, pagos y entregas
-- ---------------------------------------------------------------------

CREATE TABLE Reservaciones (
    ReservacionID       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID           INTEGER       NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE RESTRICT,
    CodigoRetiro        VARCHAR(20)   NOT NULL UNIQUE,
    PrecioTotal         NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (PrecioTotal >= 0),
    Estado              VARCHAR(30)   NOT NULL,
    FechaReservacion    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Detalles_Reservacion (
    DetalleID                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReservacionID            INTEGER       NOT NULL REFERENCES Reservaciones(ReservacionID) ON DELETE CASCADE,
    PublicacionID            INTEGER       NOT NULL REFERENCES Publicaciones(PublicacionID) ON DELETE RESTRICT,
    CantidadReservada        INTEGER       NOT NULL CHECK (CantidadReservada > 0),
    PrecioUnitarioAplicado   NUMERIC(10,2) NOT NULL CHECK (PrecioUnitarioAplicado >= 0)
);

CREATE TABLE Pagos (
    PagoID              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReservacionID       INTEGER       NOT NULL REFERENCES Reservaciones(ReservacionID) ON DELETE RESTRICT,
    MetodoPagoID        INTEGER       NOT NULL REFERENCES Metodos_Pago(MetodoPagoID) ON DELETE RESTRICT,
    Monto               NUMERIC(10,2) NOT NULL CHECK (Monto >= 0),
    EstadoPago          VARCHAR(30)   NOT NULL,
    ReferenciaExterna   VARCHAR(100),
    FechaPago           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Entregas (
    EntregaID         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReservacionID     INTEGER     NOT NULL UNIQUE REFERENCES Reservaciones(ReservacionID) ON DELETE RESTRICT,
    TransportistaID   INTEGER     REFERENCES Transportistas(TransportistaID) ON DELETE SET NULL,
    VehiculoID        INTEGER     REFERENCES Vehiculos_Transportista(VehiculoID) ON DELETE SET NULL,
    EstadoEntrega     VARCHAR(30) NOT NULL,
    FechaEntrega      TIMESTAMP
);

-- ---------------------------------------------------------------------
-- Calificaciones e incidencias
-- ---------------------------------------------------------------------

CREATE TABLE Calificaciones (
    CalificacionID       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EntregaID            INTEGER      NOT NULL REFERENCES Entregas(EntregaID) ON DELETE CASCADE,
    AutorID              INTEGER      NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE RESTRICT,
    EstablecimientoID    INTEGER      NOT NULL REFERENCES Establecimientos(EstablecimientoID) ON DELETE CASCADE,
    Puntuacion           INTEGER      NOT NULL CHECK (Puntuacion BETWEEN 1 AND 5),
    Comentario           VARCHAR(1000),
    FechaCalificacion    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Incidencias (
    IncidenciaID      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReportadoPorID    INTEGER      NOT NULL REFERENCES Usuarios(UsuarioID) ON DELETE RESTRICT,
    PublicacionID     INTEGER      REFERENCES Publicaciones(PublicacionID) ON DELETE SET NULL,
    EntregaID         INTEGER      REFERENCES Entregas(EntregaID) ON DELETE SET NULL,
    AdminRevisorID    INTEGER      REFERENCES Usuarios(UsuarioID) ON DELETE SET NULL,
    TipoIncidencia    VARCHAR(50)  NOT NULL,
    Descripcion       VARCHAR(1000) NOT NULL,
    Estado            VARCHAR(30)  NOT NULL,
    FechaReporte      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- Índices sobre llaves foráneas (PostgreSQL no los crea automáticamente)
-- ---------------------------------------------------------------------

CREATE INDEX idx_usuario_roles_rol            ON Usuario_Roles(RolID);
CREATE INDEX idx_tokens_usuario               ON Tokens_Sesion(UsuarioID);
CREATE INDEX idx_pref_suscripcion             ON Preferencias_Notificacion(SuscripcionID);
CREATE INDEX idx_pref_categoria               ON Preferencias_Notificacion(CategoriaID);
CREATE INDEX idx_pref_zona                    ON Preferencias_Notificacion(ZonaID);
CREATE INDEX idx_empresas_representante       ON Empresas(RepresentanteID);
CREATE INDEX idx_establecimientos_empresa     ON Establecimientos(EmpresaID);
CREATE INDEX idx_establecimientos_zona        ON Establecimientos(ZonaID);
CREATE INDEX idx_transportistas_empresa       ON Transportistas(EmpresaID);
CREATE INDEX idx_vehiculos_transportista      ON Vehiculos_Transportista(TransportistaID);
CREATE INDEX idx_vehiculos_zona               ON Vehiculos_Transportista(ZonaID);
CREATE INDEX idx_alimentos_categoria          ON Alimentos(CategoriaID);
CREATE INDEX idx_alimentos_unidad             ON Alimentos(UnidadID);
CREATE INDEX idx_publicaciones_establecimiento ON Publicaciones(EstablecimientoID);
CREATE INDEX idx_publicaciones_alimento       ON Publicaciones(AlimentoID);
CREATE INDEX idx_publicaciones_horario        ON Publicaciones(HorarioID);
CREATE INDEX idx_publicaciones_estado         ON Publicaciones(EstadoActual);
CREATE INDEX idx_historial_publicacion        ON Historial_Publicaciones(PublicacionID);
CREATE INDEX idx_historial_usuario            ON Historial_Publicaciones(UsuarioResponsableID);
CREATE INDEX idx_notificaciones_usuario       ON Notificaciones(UsuarioID);
CREATE INDEX idx_notificaciones_publicacion   ON Notificaciones(PublicacionID);
CREATE INDEX idx_reservaciones_usuario        ON Reservaciones(UsuarioID);
CREATE INDEX idx_detalles_reservacion         ON Detalles_Reservacion(ReservacionID);
CREATE INDEX idx_detalles_publicacion         ON Detalles_Reservacion(PublicacionID);
CREATE INDEX idx_pagos_reservacion            ON Pagos(ReservacionID);
CREATE INDEX idx_pagos_metodo                 ON Pagos(MetodoPagoID);
CREATE INDEX idx_entregas_transportista       ON Entregas(TransportistaID);
CREATE INDEX idx_entregas_vehiculo            ON Entregas(VehiculoID);
CREATE INDEX idx_calificaciones_entrega       ON Calificaciones(EntregaID);
CREATE INDEX idx_calificaciones_autor         ON Calificaciones(AutorID);
CREATE INDEX idx_calificaciones_establec      ON Calificaciones(EstablecimientoID);
CREATE INDEX idx_incidencias_reportado        ON Incidencias(ReportadoPorID);
CREATE INDEX idx_incidencias_publicacion      ON Incidencias(PublicacionID);
CREATE INDEX idx_incidencias_entrega          ON Incidencias(EntregaID);
CREATE INDEX idx_incidencias_admin            ON Incidencias(AdminRevisorID);

COMMIT;
