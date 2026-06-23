/**
 * archetypes.js — Los 6 arquetipos del Sistema Secreto.
 * Stubs de contenido listos para expandir en fases posteriores.
 * Los símbolos, paletas y tonos son definitivos — el contenido profundo, no.
 */

export const ARCHETYPES = {
  // ∄₀ — el que no existe en el promedio
  ZERO: {
    id: 'ZERO',
    symbol: '∄₀',
    symbolAlt: 'nulo',
    // Paleta: carbón profundo, blanco frío, azul hielo
    palette: {
      bg: '#050508',
      surface: '#0d0d14',
      text: '#e8eaf2',
      accent: '#3d5af1',
      accentDim: '#1a2a7a',
      border: '#1c1c2e',
    },
    triggers: ['T1', 'T8'], // triggers primarios que lo activan
    tone: 'Sin colchón. Sin rodeos. El camino más corto desde el fondo.',
    activationMessage: 'Tu diagnóstico no cabe en el promedio.',
    activationSub: 'Por eso tiene su propia respuesta.',
    contentStub: {
      intro: 'El fondo es un lugar real. También es el único lugar donde no hay nada que perder.',
      approach: 'El sistema no te va a motivar. Te va a dar la secuencia más corta para salir. Sin retórica.',
      firstStep: 'Antes de cualquier categoría: ¿cuántas horas dormiste ayer? Eso es el punto cero.',
    },
  },

  // Ω⁻¹ — el que va en sentido contrario
  INVERSE: {
    id: 'INVERSE',
    symbol: 'Ω⁻¹',
    symbolAlt: 'inverso',
    // Paleta: azul marino oscuro, plateado-blanco, mínimo
    palette: {
      bg: '#03060f',
      surface: '#080f1e',
      text: '#d0d8f0',
      accent: '#7b9cff',
      accentDim: '#1a2a55',
      border: '#111a30',
    },
    triggers: ['T7', 'T_PURPOSE_HIGH_REST_OK'],
    tone: 'Alta funcionalidad, ningún para qué. No es un problema de eficiencia.',
    activationMessage: 'Todo funciona. Nada tiene dirección.',
    activationSub: 'Eso es un tipo particular de problema.',
    contentStub: {
      intro: 'Podés hacer todo bien y aun así estar yendo hacia ningún lado. Eso es exactamente lo que muestra tu perfil.',
      approach: 'El trabajo no es optimizar más. Es preguntarse para qué se optimiza.',
      firstStep: 'Escribí en una línea lo que querés que haya pasado dentro de 5 años. Sin pensar demasiado. Lo que salga.',
    },
  },

  // ⊗ℍ — el que cruzó el límite físico
  PHYSICAL: {
    id: 'PHYSICAL',
    symbol: '⊗ℍ',
    symbolAlt: 'fisico-limite',
    // Paleta: oscuro cálido, marrón-gris, sin colores llamativos
    palette: {
      bg: '#080604',
      surface: '#120e09',
      text: '#e0d8cc',
      accent: '#c8944a',
      accentDim: '#4a3010',
      border: '#1e1710',
    },
    triggers: ['T_PHYSICAL_HIGH', 'T_EMOTIONAL_LOW'],
    tone: 'El cuerpo como escudo. Lo que está adentro también existe.',
    activationMessage: 'Tu cuerpo está en orden. Eso no explica todo.',
    activationSub: 'Hay algo que el entrenamiento no resuelve.',
    contentStub: {
      intro: 'Físicamente, tu perfil está sólido. Emocionalmente, el diagnóstico cuenta otra historia.',
      approach: 'El orden habitual está invertido. Acá no empezamos por lo físico.',
      firstStep: 'Describí en tres palabras cómo te sentís cuando no estás entrenando ni trabajando.',
    },
  },

  // 𒀭̸ — el que opera en otro plano
  OPERATOR: {
    id: 'OPERATOR',
    symbol: '𒀭̸',
    symbolAlt: 'operador',
    // Paleta: casi negro, azul eléctrico muy sutil
    palette: {
      bg: '#030305',
      surface: '#09090f',
      text: '#dce0f5',
      accent: '#4d79f6',
      accentDim: '#0f1a4a',
      border: '#0f0f1a',
    },
    triggers: ['T2', 'T9', 'T_HIGH_TEXT_QUALITY'],
    tone: 'Inteligencia usada para no sentir. Eso también es un patrón.',
    activationMessage: 'Tu diagnóstico es coherente. Demasiado coherente.',
    activationSub: 'La claridad también puede ser una forma de evitar.',
    contentStub: {
      intro: 'Intelectualmente, tu perfil tiene muy pocas contradicciones. Eso es inusual — y es una pista.',
      approach: 'El trabajo no es entender más. Es identificar qué se está usando el entendimiento para evitar.',
      firstStep: '¿Cuándo fue la última vez que algo te afectó antes de que pudieras analizarlo?',
    },
  },

  // [̷̷̷] — el modo sin nombre
  UNNAMED: {
    id: 'UNNAMED',
    symbol: '▪',
    symbolAlt: 'sin-nombre',
    // Paleta: gris neutro oscuro, casi sin color
    palette: {
      bg: '#070707',
      surface: '#0e0e0e',
      text: '#d8d8d8',
      accent: '#888888',
      accentDim: '#2a2a2a',
      border: '#181818',
    },
    triggers: ['T3', 'T4', 'T6', 'T7'], // comportamiento pasivo
    tone: 'El sistema no tiene un molde para vos. Eso puede ser el punto.',
    activationMessage: 'No hay un perfil predefinido para tu diagnóstico.',
    activationSub: 'Eso significa que lo que sigue se construye desde acá.',
    contentStub: {
      intro: 'Tu perfil no encaja en ninguno de los patrones comunes. Eso no es un problema — es información.',
      approach: 'El contenido que recibís se va a construir según lo que hagás a partir de acá, no según un molde previo.',
      firstStep: '¿Qué era lo que esperabas que este diagnóstico te dijera?',
    },
  },

  // ◈ — el que ya sabe (solo en segundo diagnóstico)
  EVOLVED: {
    id: 'EVOLVED',
    symbol: '◈',
    symbolAlt: 'evolucionado',
    // Paleta: como la principal pero con dorado sutil
    palette: {
      bg: '#080706',
      surface: '#100e0a',
      text: '#ece8e0',
      accent: '#d4a84b',
      accentDim: '#3a2a0a',
      border: '#1e1a10',
    },
    triggers: ['T_SECOND_DIAGNOSIS', 'T_MEASURED_IMPROVEMENT'],
    tone: 'Ya no es lo que sos. Es lo que estás eligiendo construir.',
    activationMessage: 'Tu segundo diagnóstico muestra algo que el primero no podía mostrar.',
    activationSub: 'El cambio no se supone. Acá está.',
    contentStub: {
      intro: 'Noventa días después, el perfil es distinto. Eso no es magia — es lo que pasa cuando sabés dónde poner el foco.',
      approach: 'El trabajo ahora es de precisión. Ya sabés lo básico. Lo que sigue es lo que la mayoría no llega a ver.',
      firstStep: 'Revisá el área que más mejoró. ¿Qué hiciste distinto ahí?',
    },
  },
};

// Orden de evaluación de arquetipos (importa para casos límite)
export const ARCHETYPE_PRIORITY = ['ZERO', 'INVERSE', 'PHYSICAL', 'OPERATOR', 'EVOLVED', 'UNNAMED'];
