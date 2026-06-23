/**
 * copy.js — Todos los strings del sitio en rioplatense.
 * NUNCA hardcodear texto en componentes. Siempre usar este archivo.
 * Para una versión en español neutro: traducir solo este archivo.
 */

export const COPY = {
  // ─── LANDING ─────────────────────────────────────────────────────────────
  landing: {
    headline: '¿De verdad te conocés?',
    subheadline: 'La mayoría cree que sí. La mayoría está equivocada.\nRespondé estas preguntas y te decimos exactamente por dónde empezar.',
    cta: 'Empezar el diagnóstico',
    disclaimer: 'Sin edulcorante. Sin promesas vacías. El sistema te va a decir cosas que quizás no querés escuchar.',
    timeEstimate: '8 a 12 minutos',
    privacy: 'Tus respuestas no salen de tu dispositivo sin tu consentimiento. Nadie las lee.',
    skipNote: 'Podés saltear cualquier pregunta. El sistema lo va a tener en cuenta.',
  },

  // ─── APERTURA ────────────────────────────────────────────────────────────
  opening: {
    question: 'En una escala del 1 al 10, ¿cuánto creés que te conocés?',
    hint: 'Deslizá para elegir',
    continueBtn: 'Continuar',
    systemResponses: {
      low: 'Bien. La honestidad ya es el primer paso.',       // 1-3
      mid: 'Interesante. Vamos a ver si coincidimos.',        // 4-6
      high: 'Eso nos dijo el 80% de los usuarios. Veamos.',  // 7-9
      perfect: 'Perfecto. Esto va a ser revelador entonces.', // 10
    },
  },

  // ─── PRE-SELECCIÓN ───────────────────────────────────────────────────────
  preSelect: {
    question: '¿En qué áreas sentís que más te estancaste?',
    subtext: 'Elegí hasta 3. Esto no determina el resultado — solo es el punto de partida.',
    continueBtn: 'Empezar el diagnóstico',
  },

  // ─── CUESTIONARIO ────────────────────────────────────────────────────────
  diagnostic: {
    skipLabel: 'prefiero no responder esto',
    nextBtn: 'Siguiente',
    prevBtn: 'Anterior',
    blockOfTotal: (current, total) => `Área ${current} de ${total}`,
    scaleMin: 'Pésimo',
    scaleMax: 'Excelente',
    typeB_options: {
      never: 'Nunca',
      sometimes: 'A veces',
      usually: 'La mayoría de las veces',
      always: 'Siempre',
    },
    typeD_options: {
      strongly_agree: 'Totalmente de acuerdo',
      agree: 'De acuerdo',
      unsure: 'No estoy seguro/a',
      disagree: 'En desacuerdo',
      dont_know: 'No lo sé',
    },
    typeF_hint: (max) => `Elegí hasta ${max}`,
  },

  // ─── CHECKPOINTS ─────────────────────────────────────────────────────────
  checkpoints: [
    {
      id: 'cp1',
      text: 'A mitad de camino. La mayoría de la gente nunca llega hasta acá.',
      sub: null,
      continueBtn: 'Seguir',
    },
    {
      id: 'cp2',
      text: 'Las respuestas que diste hasta ahora ya dicen bastante.',
      sub: 'Último tramo.',
      continueBtn: 'Seguir',
    },
  ],

  // ─── PREGUNTA DE CIERRE ──────────────────────────────────────────────────
  closing: {
    line1: 'El diagnóstico fue honesto.',
    line2: '¿Por qué seguís acá?',
    hint: 'Podés escribir lo que quieras, o no escribir nada y avanzar.',
    placeholder: '',
    skipLabel: 'Saltar y ver resultados',
    continueBtn: 'Ver mis resultados',
  },

  // ─── PROCESAMIENTO ───────────────────────────────────────────────────────
  processing: {
    standard: 'Procesando tu diagnóstico...',
    profileMessages: {
      manyLow: 'El diagnóstico fue honesto. Eso ya es un buen comienzo.',
      midHigh: 'Tenés buena base. El trabajo ahora es de precisión.',
      oneBlindSpot: 'Un solo punto ciego puede frenarlo todo. Lo encontramos.',
      default: 'Tu perfil está listo.',
    },
  },

  // ─── DASHBOARD ───────────────────────────────────────────────────────────
  dashboard: {
    title: 'Tu Mapa',
    radarTitle: 'Tu perfil completo',
    openingContrast: (score) => `Al empezar, dijiste que te conocés un ${score}/10.`,
    openingContrastMatch: 'Tu diagnóstico confirma esa percepción.',
    openingContrastOver: 'Tu diagnóstico muestra que sobrestimaste algunas áreas.',
    openingContrastUnder: 'Tu diagnóstico muestra que te subestimaste.',
    prioritiesTitle: 'Por dónde empezar',
    prioritiesSubtitle: 'En ese orden. El sistema lo determinó por vos.',
    startHereBtn: 'Empezar por acá',
    otherAreasTitle: 'El resto del panorama',
    blindSpotsTitle: 'Tus puntos ciegos',
    blindSpotsSubtitle: 'Estas son las áreas donde tu percepción no coincidía con tus respuestas:',
    skipsTitle: 'Lo que no respondiste',
    skipsText: 'Hay algunas preguntas que decidiste no responder. Eso también es información. No te las vamos a repetir, pero las tuvimos en cuenta.',
    shareBtn: 'Compartir mi perfil',
    retakeBtn: 'Hacer el diagnóstico de nuevo',
    summaryLabel: 'Tu perfil en una frase:',
  },

  // ─── ETIQUETAS DE ESTADO ─────────────────────────────────────────────────
  labels: {
    critico: '🔴 Crítico',
    mejorar: '🟠 A mejorar',
    desarrollar: '🟡 Desarrollar',
    solido: '🟢 Sólido',
    incompleto: '⚪ Dato incompleto',
  },

  // ─── CATEGORÍAS ──────────────────────────────────────────────────────────
  categories: {
    fisico: { name: 'Físico', subtitle: 'La base de todo lo demás.' },
    mental: { name: 'Mental', subtitle: '¿Estás usando tu mente o tu mente te usa a vos?' },
    emocional: { name: 'Emocional', subtitle: 'Lo que sentís cuando nadie mira.' },
    social: { name: 'Vínculos', subtitle: 'Las personas que elegís y cómo te relacionás.' },
    proposito: { name: 'Propósito', subtitle: '¿A dónde vas? ¿Por qué?' },
    financiero: { name: 'Financiero', subtitle: 'No tiene que dominarte, pero sí tiene que respetarte.' },
    profesional: { name: 'Profesional', subtitle: 'Pasás la mitad de tu vida despierto en esto.' },
    habitos: { name: 'Hábitos', subtitle: 'Lo que hacés todos los días es lo que sos.' },
  },

  // ─── FRASES RESUMEN POR PERFIL ───────────────────────────────────────────
  // Generadas en profileBuilder.js según combinaciones de scores
  profileSummaries: {
    bodyBlocks: 'Tenés la cabeza clara pero el cuerpo te frena.',
    emotionalBlock: 'Sabés adónde querés ir pero algo emocional te detiene.',
    executionGap: 'Tu mayor problema no es el qué, es el cómo.',
    noDirection: 'Sin dirección clara, todo el esfuerzo se diluye.',
    highPerformer: 'Alta funcionalidad. El margen está en los detalles.',
    scattered: 'Mucho por mejorar, pero la conciencia ya es la mitad del trabajo.',
    habitLoop: 'Los hábitos te frenan. Ahí está el punto de palanca.',
    socialDrain: 'Tus vínculos te cuestan energía que no te devuelven.',
    default: 'Tu diagnóstico está listo. El primer paso es el más importante.',
  },

  // ─── SISTEMA SECRETO — textos de activación ──────────────────────────────
  secret: {
    activationLine1: 'El sistema ha detectado una inconsistencia.',
    activationLine2: 'No eras lo que el formulario esperaba.',
  },

  // ─── PÁGINAS DE CATEGORÍA ────────────────────────────────────────────────
  categoryPage: {
    yourScore: 'Tu puntaje en esta área',
    status: 'Estado',
    startGuide: 'Ver la guía completa',
    comingSoon: 'Contenido en desarrollo. Volvé pronto.',
  },

  // ─── NAVEGACIÓN ──────────────────────────────────────────────────────────
  nav: {
    home: 'Inicio',
    diagnostic: 'Diagnóstico',
    myMap: 'Mi Mapa',
    howItWorks: 'Cómo funciona',
    about: 'Sobre el sitio',
  },

  // ─── 404 ─────────────────────────────────────────────────────────────────
  notFound: {
    title: 'Esta página no existe.',
    sub: 'Igual que algunas respuestas del diagnóstico.',
    btn: 'Volver al inicio',
  },

  // ─── REPROBADO ──────────────────────────────────────────────────────────
  reprobado: {
    title: 'No podemos diagnosticarte\nsi no respondés en serio.',
    subtitle: 'El sistema detectó que las respuestas no reflejan una evaluación real. No es un castigo — es que sin material genuino no hay diagnóstico posible.',
    reasonsTitle: 'Qué detectamos',
    retryBtn: 'Intentar de nuevo',
    continueBtn: 'ver resultados de todos modos',
    footnote: 'El diagnóstico no guarda un registro de esto. Podés volver cuando quieras.',
    unreliableBadge: '⚠ Resultado no confiable',
    unreliableNote: 'Este diagnóstico fue marcado como no confiable. Los puntajes pueden no reflejar tu situación real.',
  },

  // ─── COOLDOWN ───────────────────────────────────────────────────────────
  cooldown: {
    title: 'Todavía no.',
    subtitle: (hours) => `Dale tiempo a que algo cambie de verdad antes de volverte a evaluar. Podés repetir el diagnóstico en ${hours} horas.`,
    viewResultsBtn: 'Ver mis resultados anteriores',
    bypassBtn: 'hacerlo igual',
    bypassNote: 'Si lo hacés ahora, los resultados van a ser casi idénticos a los anteriores.',
  },
};
