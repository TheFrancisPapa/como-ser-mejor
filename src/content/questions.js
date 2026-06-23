/**
 * questions.js — Los 8 bloques con todas las preguntas.
 * Cada pregunta tiene lógica adaptativa, tipo y metadata de scoring.
 *
 * Tipos: A (escala 1-10), B (frecuencia), C (elección forzada),
 *        D (afirmación+reacción), E (texto libre), F (multiselección)
 *
 * framing: 'positive' = más puntaje es mejor, 'negative' = más puntaje es peor
 * sensitive: true = no se lista en "Lo que no respondiste"
 * conditional: { dependsOn, operator, value } — pregunta condicional
 */

export const BLOCKS = [
  // ─────────────────────────────────────────────────────
  // BLOQUE 1 — FÍSICO
  // ─────────────────────────────────────────────────────
  {
    id: 'fisico',
    blockIndex: 0,
    title: 'Tu cuerpo',
    subtitle: 'La base de todo lo demás.',
    questions: [
      {
        id: 'f1',
        type: 'B',
        text: '¿Cuántas horas dormís por noche en promedio?',
        options: [
          { value: 0, label: 'Menos de 5', score: 0 },
          { value: 1, label: '5 a 6', score: 3 },
          { value: 2, label: '7 a 8', score: 9 },
          { value: 3, label: 'Más de 8', score: 7 },
        ],
        framing: 'positive',
        sensitive: false,
        // Si duerme 7+ → solo 2 preguntas más del bloque (f2, f4)
        // Si duerme <7 → bloque completo
        gatekeeper: true, // esta pregunta controla el flujo del bloque
      },
      {
        id: 'f2',
        type: 'B',
        text: '¿Cuántas veces por semana hacés actividad física que te exija esfuerzo real?',
        options: [
          { value: 0, label: 'Nunca', score: 0 },
          { value: 1, label: '1 a 2 veces', score: 3.5 },
          { value: 2, label: '3 a 4 veces', score: 8 },
          { value: 3, label: '5 o más', score: 10 },
        ],
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'f3',
        type: 'A',
        text: '¿Cómo describirías tu relación con la comida?',
        scaleMin: 'Desastrosa',
        scaleMax: 'Muy buena',
        framing: 'positive',
        sensitive: false,
        conditional: { dependsOn: 'f1', operator: 'lt', value: 2 }, // solo si duerme <7h
      },
      {
        id: 'f4',
        type: 'D',
        text: 'Mi nivel de energía durante el día es consistente y predecible.',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'f5',
        type: 'C',
        text: '¿Qué te molesta más de tu estado físico actual?',
        options: [
          { value: 'look', label: 'Cómo me veo' },
          { value: 'feel', label: 'Cómo me siento' },
        ],
        framing: 'neutral', // no genera score, orienta contenido
        sensitive: false,
      },
      {
        id: 'f6',
        type: 'B',
        text: '¿Con qué frecuencia tu cuerpo te da señales de que algo está mal (dolores, cansancio crónico, problemas digestivos)?',
        options: [
          { value: 0, label: 'Nunca', score: 10 },
          { value: 1, label: 'A veces', score: 6.5 },
          { value: 2, label: 'Seguido', score: 3 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: false,
        conditional: { dependsOn: 'f4', operator: 'lte_d', value: 'disagree' }, // si f4 es negativa
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 2 — MENTAL
  // ─────────────────────────────────────────────────────
  {
    id: 'mental',
    blockIndex: 1,
    title: 'Tu cabeza',
    subtitle: '¿Estás usando tu mente o tu mente te usa a vos?',
    questions: [
      {
        id: 'm1',
        type: 'A',
        text: 'Del 1 al 10, ¿qué tan bien te concentrás cuando necesitás hacer algo que requiere foco profundo?',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'm2',
        type: 'B',
        text: '¿Con qué frecuencia terminás el día sintiendo que no avanzaste en lo importante?',
        options: [
          { value: 0, label: 'Nunca', score: 10 },
          { value: 1, label: 'A veces', score: 6.5 },
          { value: 2, label: 'Seguido', score: 3 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: false,
      },
      {
        id: 'm3',
        type: 'D',
        text: 'Sé diferenciar lo urgente de lo importante y actúo en consecuencia.',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'm4',
        type: 'B',
        text: '¿Cuánto tiempo por día estimás que pasás en modo "piloto automático" (sin decidir conscientemente qué hacés)?',
        options: [
          { value: 0, label: 'Menos de 1 hora', score: 9 },
          { value: 1, label: '1 a 3 horas', score: 6 },
          { value: 2, label: '3 a 6 horas', score: 3 },
          { value: 3, label: 'Más de 6 horas', score: 0 },
        ],
        framing: 'negative',
        sensitive: false,
      },
      {
        id: 'm5',
        type: 'C',
        text: '¿Tu mayor problema mental es la distracción o la procrastinación?',
        options: [
          { value: 'distraction', label: 'La distracción' },
          { value: 'procrastination', label: 'La procrastinación' },
        ],
        framing: 'neutral',
        sensitive: false,
      },
      {
        id: 'm6',
        type: 'B',
        text: '¿Cuándo fue la última vez que aprendiste algo completamente nuevo de manera intencional?',
        options: [
          { value: 0, label: 'Esta semana', score: 10 },
          { value: 1, label: 'Este mes', score: 7 },
          { value: 2, label: 'Este año', score: 4 },
          { value: 3, label: 'No recuerdo', score: 0 },
        ],
        framing: 'positive',
        sensitive: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 3 — EMOCIONAL
  // ─────────────────────────────────────────────────────
  {
    id: 'emocional',
    blockIndex: 2,
    title: 'Tu mundo interior',
    subtitle: 'Lo que sentís cuando nadie mira.',
    questions: [
      {
        id: 'e1',
        type: 'A',
        text: 'Del 1 al 10, ¿cuánto control sentís que tenés sobre tus emociones cuando algo te afecta fuerte?',
        framing: 'positive',
        sensitive: true,
      },
      {
        id: 'e2',
        type: 'D',
        text: 'Cuando algo me duele, lo proceso. No lo ignoro ni me desborda.',
        framing: 'positive',
        sensitive: true,
      },
      {
        id: 'e3',
        type: 'B',
        text: '¿Con qué frecuencia sentís una angustia o malestar que no sabés muy bien de dónde viene?',
        options: [
          { value: 0, label: 'Nunca', score: 10 },
          { value: 1, label: 'A veces', score: 6 },
          { value: 2, label: 'Seguido', score: 2 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: true,
      },
      {
        id: 'e4',
        type: 'A',
        text: '¿Cómo está tu autoestima ahora mismo, honestamente?',
        scaleMin: 'Muy baja',
        scaleMax: 'Sólida',
        framing: 'positive',
        sensitive: true,
      },
      {
        id: 'e5',
        type: 'C',
        text: 'Si tuvieras que elegir: ¿tu mayor problema emocional está más relacionado con el pasado o con el futuro?',
        options: [
          { value: 'past', label: 'Con el pasado' },
          { value: 'future', label: 'Con el futuro' },
        ],
        framing: 'neutral',
        sensitive: true,
      },
      {
        id: 'e6',
        type: 'E',
        text: '¿Hay algo que arrastrás emocionalmente hace tiempo y que todavía no resolviste?',
        subtext: 'No tenés que escribirlo si no querés, pero si lo hacés, queda solo para vos.',
        framing: 'neutral',
        sensitive: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 4 — SOCIAL
  // ─────────────────────────────────────────────────────
  {
    id: 'social',
    blockIndex: 3,
    title: 'Tus vínculos',
    subtitle: 'Las personas que elegís y cómo te relacionás.',
    questions: [
      {
        id: 's1',
        type: 'B',
        text: '¿Cuántas personas tenés en tu vida con las que podés ser completamente honesto/a?',
        options: [
          { value: 0, label: 'Ninguna', score: 0 },
          { value: 1, label: '1 o 2', score: 5 },
          { value: 2, label: '3 a 5', score: 8 },
          { value: 3, label: '6 o más', score: 10 },
        ],
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 's2',
        type: 'D',
        text: 'Sé decir que no sin sentir culpa.',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 's3',
        type: 'B',
        text: '¿Con qué frecuencia salís de interacciones sociales sintiendo que diste más de lo que recibiste?',
        options: [
          { value: 0, label: 'Nunca', score: 10 },
          { value: 1, label: 'A veces', score: 6.5 },
          { value: 2, label: 'Seguido', score: 3 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: false,
      },
      {
        id: 's4',
        type: 'A',
        text: 'Del 1 al 10, ¿cómo evaluarías tu capacidad de comunicarte claramente en conflictos?',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 's5',
        type: 'C',
        text: 'En tus relaciones, ¿tendés más a dar demasiado o a cerrarte demasiado?',
        options: [
          { value: 'give', label: 'A dar demasiado' },
          { value: 'close', label: 'A cerrarme demasiado' },
        ],
        framing: 'neutral',
        sensitive: false,
      },
      {
        id: 's6',
        type: 'A',
        text: '¿Cuánto te importa lo que piensan otros de vos?',
        scaleMin: 'Nada',
        scaleMax: 'Demasiado',
        framing: 'negative', // más = peor (dependencia de validación)
        sensitive: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 5 — PROPÓSITO
  // ─────────────────────────────────────────────────────
  {
    id: 'proposito',
    blockIndex: 4,
    title: 'Tu dirección',
    subtitle: '¿A dónde vas? ¿Por qué?',
    questions: [
      {
        id: 'p1',
        type: 'D',
        text: 'Si me preguntaran cuál es mi propósito o misión de vida, tendría una respuesta clara.',
        framing: 'positive',
        sensitive: true,
      },
      {
        id: 'p2',
        type: 'A',
        text: 'Del 1 al 10, ¿cuánta claridad tenés sobre lo que querés para los próximos 5 años?',
        framing: 'positive',
        sensitive: true,
      },
      {
        id: 'p3',
        type: 'C',
        text: '¿Lo que hacés todos los días se alinea con lo que decís que te importa?',
        options: [
          { value: 'yes', label: 'Sí, generalmente' },
          { value: 'no', label: 'No, hay una brecha importante' },
          { value: 'unsure', label: 'No lo sé' },
        ],
        framing: 'positive',
        sensitive: true,
      },
      {
        id: 'p4',
        type: 'B',
        text: '¿Con qué frecuencia sentís que el día pasa y no te acercás a nada que de verdad te importe?',
        options: [
          { value: 0, label: 'Nunca', score: 10 },
          { value: 1, label: 'A veces', score: 6 },
          { value: 2, label: 'Seguido', score: 2 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: true,
      },
      {
        id: 'p5',
        type: 'E',
        text: '¿Cuál es la cosa que más miedo te da admitir que querés?',
        subtext: null,
        framing: 'neutral',
        sensitive: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 6 — FINANCIERO
  // ─────────────────────────────────────────────────────
  {
    id: 'financiero',
    blockIndex: 5,
    title: 'Tu plata',
    subtitle: 'No tiene que dominarte, pero sí tiene que respetarte.',
    questions: [
      {
        id: 'fi1',
        type: 'D',
        text: 'Sé exactamente cuánto dinero entra y sale por mes.',
        framing: 'positive',
        sensitive: false,
        gatekeeper: true, // 'yes' → profundizar en inversión; 'no' → básico
      },
      {
        id: 'fi2',
        type: 'B',
        text: '¿Con qué frecuencia tomás decisiones financieras por impulso o sin planificar?',
        options: [
          { value: 0, label: 'Nunca', score: 10 },
          { value: 1, label: 'A veces', score: 6.5 },
          { value: 2, label: 'Seguido', score: 3 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: false,
      },
      {
        id: 'fi3',
        type: 'A',
        text: 'Del 1 al 10, ¿qué tan tranquilo/a te sentís con tu situación económica actual?',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'fi4',
        type: 'C',
        text: '¿Tu mayor problema financiero es que gastás demasiado o que no generás suficiente?',
        options: [
          { value: 'spend', label: 'Gasto demasiado' },
          { value: 'earn', label: 'No genero suficiente' },
        ],
        framing: 'neutral',
        sensitive: false,
      },
      {
        id: 'fi5',
        type: 'D',
        text: 'Tengo un fondo de emergencia o algún tipo de respaldo para imprevistos.',
        framing: 'positive',
        sensitive: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 7 — PROFESIONAL
  // ─────────────────────────────────────────────────────
  {
    id: 'profesional',
    blockIndex: 6,
    title: 'Tu trabajo',
    subtitle: 'Pasás la mitad de tu vida despierto en esto.',
    questions: [
      {
        id: 'pr1',
        type: 'A',
        text: 'Del 1 al 10, ¿cuánto te energiza lo que hacés para vivir?',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'pr2',
        type: 'D',
        text: 'Siento que estoy creciendo profesionalmente, no estancado/a.',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'pr3',
        type: 'B',
        text: '¿Con qué frecuencia llegás al final de la semana laboral sintiéndote satisfecho/a?',
        options: [
          { value: 0, label: 'Nunca', score: 0 },
          { value: 1, label: 'A veces', score: 4 },
          { value: 2, label: 'La mayoría de las veces', score: 8 },
          { value: 3, label: 'Siempre', score: 10 },
        ],
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'pr4',
        type: 'C',
        text: '¿Tu mayor problema profesional es la dirección (no sabés a dónde ir) o la ejecución (sabés pero no avanzás)?',
        options: [
          { value: 'direction', label: 'La dirección' },
          { value: 'execution', label: 'La ejecución' },
        ],
        framing: 'neutral',
        sensitive: false,
      },
      {
        id: 'pr5',
        type: 'A',
        text: '¿Qué tan seguido hacés cosas fuera de tu zona de confort en el trabajo o en tu desarrollo profesional?',
        scaleMin: 'Casi nunca',
        scaleMax: 'Constantemente',
        framing: 'positive',
        sensitive: false,
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOQUE 8 — HÁBITOS
  // ─────────────────────────────────────────────────────
  {
    id: 'habitos',
    blockIndex: 7,
    title: 'Tus hábitos',
    subtitle: 'Lo que hacés todos los días es lo que sos.',
    questions: [
      {
        id: 'h1',
        type: 'B',
        text: '¿Tenés una rutina matutina intencional (no simplemente levantarte y arrancar con el teléfono)?',
        options: [
          { value: 0, label: 'No', score: 0 },
          { value: 1, label: 'A veces', score: 4 },
          { value: 2, label: 'Sí', score: 10 },
        ],
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'h2',
        type: 'A',
        text: 'Del 1 al 10, ¿qué tan bien manejás el uso del teléfono y las redes sociales?',
        framing: 'positive',
        sensitive: false,
      },
      {
        id: 'h3',
        type: 'B',
        text: '¿Con qué frecuencia prometés algo (a vos mismo/a o a otros) y no lo cumplís?',
        options: [
          { value: 0, label: 'Raramente', score: 9 },
          { value: 1, label: 'A veces', score: 5.5 },
          { value: 2, label: 'Seguido', score: 2 },
          { value: 3, label: 'Casi siempre', score: 0 },
        ],
        framing: 'negative',
        sensitive: false,
      },
      {
        id: 'h4',
        type: 'D',
        text: 'Hay hábitos que quiero cambiar hace tiempo y sigo sin cambiarlos.',
        framing: 'negative',
        sensitive: false,
      },
      {
        id: 'h5',
        type: 'C',
        text: '¿Qué te cuesta más: empezar nuevos hábitos o mantener los que empezaste?',
        options: [
          { value: 'start', label: 'Empezar nuevos' },
          { value: 'maintain', label: 'Mantener los que empecé' },
        ],
        framing: 'neutral',
        sensitive: false,
      },
    ],
  },
];

// Checkpoints: se muestran después del bloque con ese blockIndex
// CHECKPOINT_MAP = { blockIndexAfterWhichToShow: checkpointIndex }
export const CHECKPOINT_MAP = {
  2: 0, // después del bloque 1 (mental, index 1 → currentBlock avanza a 2), CP index 0
  5: 1, // después del bloque 4 (proposito, index 4 → currentBlock avanza a 5), CP index 1
};

// Pregunta de pre-selección (tipo F)
export const PRE_SELECT_OPTIONS = [
  { value: 'fisico', label: 'Físico', icon: '💪' },
  { value: 'mental', label: 'Mental', icon: '🧠' },
  { value: 'emocional', label: 'Emocional', icon: '❤️' },
  { value: 'social', label: 'Vínculos', icon: '🤝' },
  { value: 'proposito', label: 'Propósito', icon: '🎯' },
  { value: 'financiero', label: 'Financiero', icon: '💰' },
  { value: 'profesional', label: 'Profesional', icon: '💼' },
  { value: 'habitos', label: 'Hábitos', icon: '🔄' },
];

// Tabla de conversión para Type D (afirmación)
export const TYPE_D_SCORES = {
  positive: {
    strongly_agree: 10,
    agree: 7.5,
    unsure: 5,
    disagree: 2.5,
    dont_know: 4,
  },
  negative: {
    strongly_agree: 0,
    agree: 2.5,
    unsure: 5,
    disagree: 7.5,
    dont_know: 4,
  },
};
