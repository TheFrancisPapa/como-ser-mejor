/**
 * quizzes.js — Bancos de preguntas para cada subtema de las categorías.
 */

export const QUIZZES = {
  fisico: {
    sueno: [
      {
        id: 'f_sueno_1',
        text: 'Te despiertas a las 3 AM con la cabeza a mil por hora pensando en problemas del trabajo. Llevas 20 minutos dando vueltas en la cama. Según el protocolo, ¿cuál es la mejor decisión?',
        options: [
          { id: 'a', text: 'Quedarte en la cama intentando forzar el sueño.' },
          { id: 'b', text: 'Levantarte, ir a un lugar con luz tenue, anotar tus pensamientos y volver solo cuando tengas sueño.' },
          { id: 'c', text: 'Mirar el móvil un rato para distraerte.' },
          { id: 'd', text: 'Tomar un café suave para calmar los nervios.' }
        ],
        correctOptionId: 'b'
      },
      // Stubs para completar luego con 10-12 preguntas
    ],
    fuerza: [
      {
        id: 'f_fuerza_1',
        text: 'Llevas un mes yendo al gimnasio, haciendo 6 días a la semana rutinas muy intensas, pero no ves progreso y estás agotado todo el día. ¿Qué principio biológico estás ignorando?',
        options: [
          { id: 'a', text: 'Necesitas hacer más cardio después de las pesas.' },
          { id: 'b', text: 'No estás tomando suficientes suplementos.' },
          { id: 'c', text: 'La síntesis de proteína y reparación neuronal ocurren durante el descanso, y estás sobreentrenando (volumen excesivo).' },
          { id: 'd', text: 'Debes cambiar los ejercicios todos los días para "confundir" al músculo.' }
        ],
        correctOptionId: 'c'
      }
    ]
  },
  emocional: {
    ansiedad: [
      {
        id: 'e_ansiedad_1',
        text: 'Sientes que te empieza a latir el corazón muy rápido y el aire te falta estando en una cola del súper. ¿Cuál es el enfoque correcto según el método de aceptación radical?',
        options: [
          { id: 'a', text: 'Decirte "no pienses en esto, cálmate" para intentar bloquear la sensación.' },
          { id: 'b', text: 'Huir inmediatamente de la tienda antes de que ocurra una catástrofe.' },
          { id: 'c', text: 'Decirte en voz alta "es solo ansiedad, haz lo peor que puedas hacer, cuerpo", perdiéndole el miedo a la sensación.' },
          { id: 'd', text: 'Buscar síntomas en Google para asegurarte de que no es un infarto.' }
        ],
        correctOptionId: 'c'
      }
    ]
  },
  social: {},
  proposito: {},
  financiero: {},
  profesional: {},
  habitos: {},
  mental: {}
};
