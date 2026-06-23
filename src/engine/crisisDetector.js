/**
 * crisisDetector.js — Detección de señales de crisis emocional.
 * PURO: no toca el DOM ni el store. Recibe texto, devuelve booleano + nivel.
 *
 * DISEÑO DELIBERADO:
 * - Corre en paralelo al resto del sistema, con prioridad absoluta.
 * - No alimenta puntajes, triggers del Sistema Secreto, ni huella de sesión.
 * - No persiste ninguna identificación de la interacción.
 * - Erra hacia falsos positivos: más vale activarse de más que de menos.
 *
 * V1: pattern matching en cliente. V2: endpoint de servidor con NLP.
 */

// ─── Patrones de riesgo (español, incluyendo variantes rioplatenses) ──────────

// Nivel ALTO — señales directas de ideación o intención
const HIGH_RISK_PATTERNS = [
  // Ideación suicida directa
  /no quiero (seguir |más )?vivi(r|endo)/i,
  /quiero (morirme|morir(me)?|estar muerto)/i,
  /pens(é|ando|ar) en suicidarme/i,
  /pens(é|ando|ar) en (quitarme|sacarme) la vida/i,
  /suicid(io|arme|arse)/i,
  /no vale la pena (seguir|vivir)/i,
  /mejor (estar|estuviera) muerto/i,
  /no (me|le) importa (si|que) me (muero|mato)/i,
  /me quiero matar/i,
  /voy a (hacerme|ponerme) fin/i,

  // Autolesión directa
  /me (corto|cortarme|cortar(me)?)/i,
  /me (lastime|lastimarme|hago daño|hice daño)/i,
  /me (golp(eo|ié)|golpearme)/i,
  /autolesio(n|nar)/i,
  /hacerme daño/i,

  // Desesperanza extrema + intención
  /no hay (ninguna|ningún|nada) (salida|solución|remedio|futuro)/i,
  /no (quiero|deseo) (nada|existir)/i,
  /me rindo(,| para)? (todo|ya)/i,
  /ya no (puedo|aguanto|resisto) (más)?/i,
];

// Nivel MEDIO — señales de angustia intensa que merecen oferta de recursos
const MEDIUM_RISK_PATTERNS = [
  /no (siento|sé) por qué (sigo|estoy)/i,
  /estoy al límite/i,
  /no (aguanto|soporto) (más|esto)/i,
  /me siento (muy )?(sola?|perdida?|vacía?)/i,
  /nada tiene (sentido|valor)/i,
  /todo (me pesa|es difícil|se siente mal)/i,
  /no (me) importa (nada|nada más)/i,
  /estoy muy mal/i,
  /me siento (terrible|horrible|devastad[ao])/i,
];

// Exclusiones — patrones que reducen el riesgo de falsos positivos
// Si el texto coincide con esto, bajar un nivel de riesgo
const NEGATION_PATTERNS = [
  /antes (solía|pensaba|creía)/i,
  /hace (mucho|tiempo|años)/i,
  /ya (no|superé|supere)/i,
  /pero (ahora|ya)/i,
  /pienso en cómo (mejorar|cambiar|crecer)/i,
];

/**
 * Evalúa si un texto contiene señales de crisis.
 * @param {string} text - texto libre del usuario
 * @returns {{ detected: boolean, level: 'high'|'medium'|'none' }}
 */
export function detectCrisis(text) {
  if (!text || typeof text !== 'string' || text.trim().length < 5) {
    return { detected: false, level: 'none' };
  }

  const normalized = text.trim().toLowerCase();

  // Verificar si hay negaciones contextuales que reducen el riesgo
  const hasNegation = NEGATION_PATTERNS.some(p => p.test(normalized));

  // Alto riesgo
  const highMatch = HIGH_RISK_PATTERNS.some(p => p.test(normalized));
  if (highMatch && !hasNegation) {
    return { detected: true, level: 'high' };
  }
  if (highMatch && hasNegation) {
    // Hay patrón de alto riesgo pero con negación contextual → tratar como medio
    return { detected: true, level: 'medium' };
  }

  // Riesgo medio
  const mediumMatch = MEDIUM_RISK_PATTERNS.some(p => p.test(normalized));
  if (mediumMatch) {
    return { detected: true, level: 'medium' };
  }

  return { detected: false, level: 'none' };
}

/**
 * Evalúa múltiples textos (para revisar todas las respuestas libres de una vez).
 * Devuelve el nivel máximo detectado.
 */
export function detectCrisisInAll(textMap) {
  let maxLevel = 'none';
  for (const text of Object.values(textMap)) {
    const { level } = detectCrisis(text);
    if (level === 'high') return { detected: true, level: 'high' };
    if (level === 'medium') maxLevel = 'medium';
  }
  return {
    detected: maxLevel !== 'none',
    level: maxLevel,
  };
}
