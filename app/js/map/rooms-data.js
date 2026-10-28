export const ROOMS_REGISTRY = {
  comedor: {
    tag: 'ALA OESTE • SERVICIOS',
    name: 'Comedor y Cocinas',
    status: 'available',
    statusText: 'ACCESO PERMITIDO',
    desc: 'Bandejas metálicas oxidadas bajo fluorescentes parpadeantes. El recetario del personal aún descansa sobre el mostrador de acero.',
    target: 'pages/recetas.html',
    actionText: 'EXPLORAR COCINAS [ENTER]'
  },
  director: {
    tag: 'ALA NORTE • ADMINISTRACIÓN',
    name: 'Despacho de Dirección',
    status: 'available',
    statusText: 'TERMINAL ACTIVA',
    desc: 'Una pesada mesa de caoba preside el despacho. La terminal de red aguarda operativa para redactar y transmitir correos de socorro al exterior.',
    target: 'pages/correo.php',
    actionText: 'ACCEDER AL DESPACHO [ENTER]'
  },
  juego: {
    tag: 'ALA ESTE • SALA RECREATIVA',
    name: 'Sala de Juegos',
    status: 'warning',
    statusText: 'MINIJUEGO ACTIVO',
    desc: 'Mesa recreativa central y rastros arrastrados hacia el fondo del aula. Incursión interactiva de supervivencia.',
    target: 'pages/juego.html',
    actionText: 'INICIAR MINIJUEGO [ENTER]'
  },
  archivo: {
    tag: 'MARCO • EXPEDIENTE',
    name: 'Archivo Histórico',
    status: 'available',
    statusText: 'EXPEDIENTES OK',
    desc: 'Legajo confidencial y expediente personal sobre el creador de este proyecto.',
    target: 'pages/aboutus.html',
    actionText: 'CONSULTAR ARCHIVO [ENTER]'
  },
  musica: {
    tag: 'ALA OESTE • ARTES',
    name: 'Aula de Música',
    status: 'danger',
    statusText: 'CLAUSURADO JUDICIAL',
    desc: 'Cerradura bloqueada con precinto judicial. El piano de cola permanece cubierto por una lona mohosa. Acceso estrictamente prohibido.',
    target: null,
    actionText: 'ACCESO DENEGADO [BLOQUEADO]'
  },
  aseos: {
    tag: 'ALA OESTE • HIGIENE',
    name: 'Aseos de Alumnos',
    status: 'danger',
    statusText: 'CERRADO POR SANIDAD',
    desc: 'Cerradura bloqueada desde el interior con pasador forzado. Espejos quebrados y tuberías secas sin suministro tras el desalojo del centro.',
    target: null,
    actionText: 'ACCESO DENEGADO [BLOQUEADO]'
  },
  profesores: {
    tag: 'ALA NORTE • CLAUSTRO',
    name: 'Sala de Profesores',
    status: 'danger',
    statusText: 'CLAUSURADO JUDICIAL',
    desc: 'La puerta acristalada está atrancada con cadenas de acero y un precinto de 1993. Mesas volcadas y expedientes desparramados en el interior.',
    target: null,
    actionText: 'ACCESO DENEGADO [BLOQUEADO]'
  },
  laboratorio: {
    tag: 'ALA ESTE • CIENCIAS',
    name: 'Laboratorio de Ciencias',
    status: 'danger',
    statusText: 'RIESGO TOXICOLÓGICO',
    desc: 'Frascos fracturados en las bancadas de granito. Atmósfera viciada por vapores volátiles y precinto de cuarentena biológica.',
    target: null,
    actionText: 'ACCESO DENEGADO [BLOQUEADO]'
  },
  biblioteca: {
    tag: 'ALA ESTE • FONDO DOCUMENTAL',
    name: 'Biblioteca Central',
    status: 'danger',
    statusText: 'DERRUMBE ACTIVO',
    desc: 'Estanterías metálicas colapsadas y toneladas de libros húmedos bloqueando los pasillos. Peligro inminente de desprendimiento de techumbre.',
    target: null,
    actionText: 'ACCESO DENEGADO [BLOQUEADO]'
  },
  gimnasio: {
    tag: 'ALA ESTE • DEPORTES',
    name: 'Gimnasio Polideportivo',
    status: 'danger',
    statusText: 'ESTRUCTURA DAÑADA',
    desc: 'Cancha reglamentaria clausurada con parqué podrido y canastas oxidadas. Precintado judicialmente tras el colapso del muro perimetral.',
    target: null,
    actionText: 'ACCESO DENEGADO [BLOQUEADO]'
  }
};
