/**
 * categories.js — Metadata de las 8 categorías.
 * Multiplicadores de impacto, color, ícono, y contenido stub de la guía.
 */
import { FISICO_GUIDE_HTML } from './guides/fisico.js';
import { MENTAL_GUIDE_HTML } from './guides/mental.js';
import { EMOCIONAL_GUIDE_HTML } from './guides/emocional.js';
import { SOCIAL_GUIDE_HTML } from './guides/social.js';
import { PROPOSITO_GUIDE_HTML } from './guides/proposito.js';
import { FINANCIERO_GUIDE_HTML } from './guides/financiero.js';
import { PROFESIONAL_GUIDE_HTML } from './guides/profesional.js';
import { HABITOS_GUIDE_HTML } from './guides/habitos.js';

export const CATEGORIES = {
  fisico: {
    id: 'fisico',
    slug: 'fisico',
    icon: '💪',
    color: '#f97316', // naranja
    impactMultiplier: 1.4, // mayor impacto transversal
    guideStub: {
      reality: 'Tu cuerpo es el sistema operativo de todo lo demás. Si el hardware falla, el software no importa. Subestimar el descanso o la alimentación termina cobrando peaje en la claridad mental y la estabilidad emocional.',
      why: 'La mayoría de la gente piensa en el ejercicio o la dieta como proyectos estéticos. En realidad, son infraestructura básica. Cuando te cuesta arrancar o mantener la energía, rara vez es falta de motivación; casi siempre es falta de combustible adecuado o descanso profundo.',
      system: '1. Levantate a la misma hora todos los días, incluso los fines de semana.\n2. Caminá al menos 30 minutos diarios sin el teléfono.\n3. Medí tus horas reales de sueño durante dos semanas antes de intentar cambiar cualquier otra cosa.',
      challenge: 'Documentá tu nivel de energía del 1 al 10 cada mañana ni bien te despertás y cada tarde a las 18:00. Después de 30 días, el patrón te va a mostrar exactamente qué te está drenando.',
    },
    fullGuide: FISICO_GUIDE_HTML,
  },
  mental: {
    id: 'mental',
    slug: 'mental',
    icon: '🧠',
    color: '#8b5cf6', // violeta
    impactMultiplier: 1.1,
    guideStub: {
      reality: 'La distracción no es un defecto de personalidad. Es el entorno por defecto del mundo en que vivimos. Tu atención es el recurso más valioso que tenés, y si no la dirigís vos, alguien más lo va a hacer.',
      why: 'El foco profundo funciona exactamente igual que un músculo. Se atrofia con los estímulos cortos y constantes (como el scroll infinito) y se reconstruye con práctica deliberada. Si te cuesta concentrarte, es porque estás entrenando a tu cerebro para la interrupción constante.',
      system: '1. Bloqueá al menos 60 minutos al día para trabajo profundo, con el teléfono en otra habitación.\n2. No uses pantallas durante la primera hora de tu día.\n3. Agrupá la revisión de correos y mensajes en dos bloques de tiempo fijos, en lugar de responder en tiempo real.',
      challenge: 'Hacé una sesión de trabajo o estudio de 90 minutos sin una sola interrupción digital, todos los días. Si te interrumpís, el reloj vuelve a cero.',
    },
    fullGuide: MENTAL_GUIDE_HTML,
  },
  emocional: {
    id: 'emocional',
    slug: 'emocional',
    icon: '❤️',
    color: '#ec4899', // rosa
    impactMultiplier: 1.3,
    guideStub: {
      reality: 'Las emociones que no se procesan no desaparecen. Se almacenan y saltan en los peores momentos. Evitar la incomodidad a corto plazo garantiza una crisis a largo plazo.',
      why: 'Reprimir y desbordar parecen cosas opuestas, pero son dos extremos del mismo problema: falta de regulación. Cuando no sabés nombrar lo que sentís, el cuerpo toma el control y reacciona de forma automática y casi siempre desproporcionada.',
      system: '1. Cuando sientas una reacción fuerte, hacé una pausa y nombrá la emoción en voz alta antes de actuar.\n2. Tené un espacio seguro para descargar (un cuaderno que nadie lea, terapia, una charla honesta).\n3. Separá lo que sentís de la historia que te estás contando sobre eso que sentís.',
      challenge: 'Escribí 5 minutos cada noche sobre la emoción más fuerte que sentiste en el día. Qué la disparó, cómo se sintió en el cuerpo y cómo reaccionaste. Sin editar, sin juzgar.',
    },
    fullGuide: EMOCIONAL_GUIDE_HTML,
  },
  social: {
    id: 'social',
    slug: 'social',
    icon: '🤝',
    color: '#06b6d4', // cian
    impactMultiplier: 0.9,
    guideStub: {
      reality: 'No todas las relaciones te suman. Algunas te cuestan una energía que no te sobra. La calidad de tu vida está directamente ligada a la calidad de las expectativas que los demás tienen sobre vos.',
      why: 'Poner límites no significa levantar muros; significa definir las reglas para que las relaciones funcionen sin que nadie termine drenado. El miedo a decepcionar a otros es la principal razón por la que terminás decepcionándote a vos mismo.',
      system: '1. Identificá a las tres personas que más energía te aportan e invertí tu tiempo libre ahí.\n2. Empezá a decir "no" en situaciones de bajo riesgo (una salida menor, un favor innecesario).\n3. Analizá qué porcentaje de tu agenda social es obligación y cuánto es elección real.',
      challenge: 'Decí que no a una propuesta, plan o favor por semana que normalmente aceptarías por culpa o compromiso. Observá qué pasa realmente (spoiler: nada grave).',
    },
    fullGuide: SOCIAL_GUIDE_HTML,
  },
  proposito: {
    id: 'proposito',
    slug: 'proposito',
    icon: '🎯',
    color: '#f59e0b', // ámbar
    impactMultiplier: 1.1,
    guideStub: {
      reality: 'El propósito no es una revelación mística que cae del cielo. Es una dirección que se elige, se prueba y se ajusta con el tiempo. La acción precede a la claridad.',
      why: 'Sin una dirección definida, tu energía se dispersa. Podés ser muy productivo, tachar mil tareas y aun así sentir que no estás yendo a ningún lado. La trampa de estar ocupado es que se siente igual que avanzar, pero no es lo mismo.',
      system: '1. Escribí de forma concreta y específica dónde querés estar en tres años.\n2. Identificá al menos una acción que podés hacer esta semana que empuje en esa dirección.\n3. Revisá esa meta una vez al mes para ver si sigue teniendo sentido o si ya cambió.',
      challenge: 'Escribí tu "Norte" en una sola frase y leela cada mañana antes de empezar el día. Si después de un tiempo deja de resonar, cambiala. Lo importante es tener siempre una brújula.',
    },
    fullGuide: PROPOSITO_GUIDE_HTML,
  },
  financiero: {
    id: 'financiero',
    slug: 'financiero',
    icon: '💰',
    color: '#10b981', // verde
    impactMultiplier: 1.0,
    guideStub: {
      reality: 'El dinero no compra la felicidad, pero la falta de control sobre tus finanzas sí genera una ansiedad constante y paralizante. Ignorar los números no hace que desaparezcan.',
      why: 'La mayoría de los problemas de plata no se resuelven solo ganando más, sino teniendo visibilidad. Si no sabés exactamente cuánto entra y en qué se va, estás operando a ciegas y a merced de los impulsos.',
      system: '1. Registrá todos tus gastos, hasta el más mínimo, durante 30 días corridos.\n2. Clasificá tus gastos en tres categorías simples: lo necesario, lo que querés y el ahorro.\n3. Destiná el primer porcentaje de cualquier ingreso a construir un fondo de emergencia de un mes.',
      challenge: 'Anotá cada gasto que hagas en el mismo momento en que lo hacés. Al final del mes, sentate a mirar los números reales sin juzgarte ni buscar excusas.',
    },
  },
  profesional: {
    id: 'profesional',
    slug: 'profesional',
    icon: '💼',
    color: '#6366f1', // índigo
    impactMultiplier: 1.0,
    guideStub: {
      reality: 'Vas a pasar gran parte de tu vida despierto trabajando. Que tu trabajo te resulte indiferente o te agote por completo tiene un costo real y acumulativo sobre todas las demás áreas.',
      why: 'El estancamiento laboral rara vez se debe a la falta de habilidad técnica. Casi siempre es falta de claridad sobre qué sigue o miedo a asumir un riesgo que te exponga al fracaso.',
      system: '1. Definí qué significa el crecimiento profesional para vos en los próximos 12 meses (no lo que dice tu jefe, lo que querés vos).\n2. Identificá qué habilidad específica te falta para llegar ahí.\n3. Dedicá dos horas por semana exclusivamente a aprender o practicar esa habilidad.',
      challenge: 'Una vez por semana, hacé algo que te saque de tu zona de confort profesional. Pedí un feedback difícil, hablá en una reunión donde suelas callar o proponé una mejora.',
    },
  },
  habitos: {
    id: 'habitos',
    slug: 'habitos',
    icon: '🔄',
    color: '#84cc16', // lima
    impactMultiplier: 1.2,
    guideStub: {
      reality: 'Tus hábitos son lo que sos cuando no estás prestando atención, lo cual pasa la mayor parte del tiempo. La motivación tiene fecha de vencimiento; los sistemas no.',
      why: 'Intentar cambiar a fuerza de voluntad pura es una batalla perdida. Los hábitos no se deciden, se construyen modificando el entorno. Si querés comer mejor pero tenés la alacena llena de galletas, tu entorno siempre le va a ganar a tus intenciones.',
      system: '1. Elegí un solo hábito para cambiar a la vez. Hasta que no sea automático, no sumes otro.\n2. Modificá tu entorno para hacer que el buen hábito sea fácil y el malo requiera mucho esfuerzo.\n3. Al principio, medí solo si apareciste y lo hiciste, no te fijes en la calidad del resultado.',
      challenge: 'Armá una cadena visual (en un calendario físico de papel). Marcá una X cada día que cumplas tu hábito elegido. Tu único objetivo del mes es no romper esa cadena.',
    },
    fullGuide: HABITOS_GUIDE_HTML,
  },
};

export const CATEGORY_ORDER = ['fisico', 'mental', 'emocional', 'social', 'proposito', 'financiero', 'profesional', 'habitos'];
