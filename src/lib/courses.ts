// ─── LAEMU Academy: Kurse, Module & Lektionen ─────────────────────────────────
// Zentrale Kursdaten für die Kurs-Übersicht und die Modul-/Lektionsseiten.

export type LessonType = 'video' | 'text' | 'video+text'

export interface Lesson {
  id: string
  title: string
  duration: string
  type: LessonType
  completed: boolean
}

export type ModuleStatus = 'completed' | 'in-progress' | 'not-started' | 'locked'

export interface CourseModule {
  id: string
  title: string
  status: ModuleStatus
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  instrumentId: string
  instrumentLabel: string
  emoji: string
  level: 'Starter' | 'Pro' | 'Allgemein'
  teacher: string
  modules: CourseModule[]
}

// ─── Handorgel — Grundlagenkurs ───────────────────────────────────────────────

const grundlagenModules: CourseModule[] = [
  {
    id: 'einfuehrung', title: 'Einführung', status: 'completed',
    lessons: [
      { id: 'auspacken', title: 'Auspacken des Instrumentes', duration: '5 min', type: 'video', completed: true },
      { id: 'saitenstimmen', title: 'Stimmen & Intonation', duration: '8 min', type: 'video', completed: true },
      { id: 'haltung', title: 'Die richtige Haltung', duration: '10 min', type: 'video', completed: true },
      { id: 'knoepfe', title: 'Die Knöpfe kennenlernen', duration: '12 min', type: 'video', completed: true },
      { id: 'ersterklang', title: 'Dein erster Klang', duration: '7 min', type: 'video', completed: true },
    ],
  },
  {
    id: 'erste-schritte', title: 'Erste Schritte mit der Handorgel', status: 'in-progress',
    lessons: [
      { id: 'bassseite', title: 'Die Bassseite verstehen', duration: '10 min', type: 'video', completed: true },
      { id: 'diskantseite', title: 'Die Diskantseite', duration: '12 min', type: 'video', completed: false },
      { id: 'koordination', title: 'Koordination beider Hände', duration: '15 min', type: 'video+text', completed: false },
      { id: 'erstesuebung', title: 'Erste Übung: Polka-Rhythmus', duration: '18 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'system', title: 'System der Handorgel', status: 'not-started',
    lessons: [
      { id: 'tonleiter', title: 'Die Tonleiter', duration: '8 min', type: 'video+text', completed: false },
      { id: 'akkorde', title: 'Grundakkorde', duration: '12 min', type: 'video', completed: false },
      { id: 'bassbegleitung', title: 'Bassbegleitung', duration: '15 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'erste-lieder', title: 'Erste Lieder', status: 'not-started',
    lessons: [
      { id: 'polka1', title: 'Einfache Polka — Schritt 1', duration: '20 min', type: 'video', completed: false },
      { id: 'polka2', title: 'Einfache Polka — Schritt 2', duration: '20 min', type: 'video', completed: false },
      { id: 'mazurka', title: 'Erste Mazurka', duration: '25 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'feedback', title: 'Feedback & Weiterentwicklung', status: 'not-started',
    lessons: [
      { id: 'selbstbewertung', title: 'Selbstbewertung — wo stehst du?', duration: '10 min', type: 'text', completed: false },
      { id: 'tipps', title: 'Tipps vom Lehrer', duration: '15 min', type: 'video', completed: false },
    ],
  },
]

// ─── Schwyzerörgeli — Grundlagenkurs ──────────────────────────────────────────

const schwyzerGrundlagenModules: CourseModule[] = [
  {
    id: 'einfuehrung', title: 'Einführung ins Schwyzerörgeli', status: 'completed',
    lessons: [
      { id: 'kennenlernen', title: 'Das Schwyzerörgeli kennenlernen', duration: '6 min', type: 'video', completed: true },
      { id: 'stimmung-pflege', title: 'Stimmung & Pflege im Überblick', duration: '9 min', type: 'video', completed: true },
      { id: 'haltung', title: 'Die richtige Haltung', duration: '10 min', type: 'video', completed: true },
      { id: 'knoepfe-register', title: 'Knöpfe & Register kennenlernen', duration: '12 min', type: 'video', completed: true },
      { id: 'erster-ton', title: 'Dein erster Ton', duration: '7 min', type: 'video', completed: true },
    ],
  },
  {
    id: 'erste-schritte', title: 'Erste Schritte mit dem Örgeli', status: 'in-progress',
    lessons: [
      { id: 'bassseite', title: 'Die Bassseite — die Begleitung', duration: '10 min', type: 'video', completed: true },
      { id: 'diskantseite', title: 'Die Diskantseite — die Melodie', duration: '12 min', type: 'video', completed: false },
      { id: 'balgfuehrung', title: 'Zugrichtung & Balgführung', duration: '14 min', type: 'video+text', completed: false },
      { id: 'erste-tonleiter', title: 'Erste Tonleiter — ziehend & stossend', duration: '16 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'diatonik', title: 'Das diatonische System verstehen', status: 'not-started',
    lessons: [
      { id: 'system', title: 'Wie das diatonische System funktioniert', duration: '11 min', type: 'video+text', completed: false },
      { id: 'grundakkorde', title: 'Grundakkorde auf der Bassseite', duration: '13 min', type: 'video', completed: false },
      { id: 'reihenwechsel', title: 'Wechsel zwischen den Reihen', duration: '15 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'erste-laendler', title: 'Erste Ländler & Walzer', status: 'not-started',
    lessons: [
      { id: 'walzer1', title: 'Einfacher Walzer — Schritt 1', duration: '20 min', type: 'video', completed: false },
      { id: 'walzer2', title: 'Einfacher Walzer — Schritt 2', duration: '20 min', type: 'video', completed: false },
      { id: 'erste-polka', title: 'Erste Appenzeller Polka', duration: '22 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'feedback', title: 'Feedback & Weiterentwicklung', status: 'not-started',
    lessons: [
      { id: 'selbstbewertung', title: 'Selbstbewertung — wo stehst du?', duration: '10 min', type: 'text', completed: false },
      { id: 'tipps', title: 'Tipps von Cyrill', duration: '15 min', type: 'video', completed: false },
    ],
  },
]

// ─── Allgemeiner Lehrgang — für alle freigeschaltet ───────────────────────────

const harmonielehreModules: CourseModule[] = [
  {
    id: 'grundlagen-harmonie', title: 'Grundlagen der Harmonielehre', status: 'completed',
    lessons: [
      { id: 'intervalle', title: 'Intervalle verstehen', duration: '11 min', type: 'video+text', completed: true },
      { id: 'tonleitern', title: 'Dur- und Moll-Tonleitern', duration: '13 min', type: 'video', completed: true },
      { id: 'dreiklaenge', title: 'Dreiklänge bilden', duration: '10 min', type: 'video', completed: true },
    ],
  },
  {
    id: 'akkordlehre', title: 'Akkorde & Kadenzen', status: 'in-progress',
    lessons: [
      { id: 'kadenz', title: 'Die Grundkadenz (I–IV–V)', duration: '14 min', type: 'video+text', completed: true },
      { id: 'umkehrungen', title: 'Akkord-Umkehrungen', duration: '12 min', type: 'video', completed: false },
      { id: 'septakkorde', title: 'Septakkorde in der Volksmusik', duration: '15 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'anwendung-harmonie', title: 'Anwendung in der Ländlermusik', status: 'not-started',
    lessons: [
      { id: 'begleitsatz', title: 'Den passenden Begleitsatz finden', duration: '16 min', type: 'video', completed: false },
      { id: 'modulation', title: 'Einfache Modulationen', duration: '13 min', type: 'video+text', completed: false },
    ],
  },
]

const taktartenModules: CourseModule[] = [
  {
    id: 'grundtakte', title: 'Die Grundtaktarten', status: 'completed',
    lessons: [
      { id: 'walzer', title: 'Walzer — der 3/4-Takt', duration: '9 min', type: 'video', completed: true },
      { id: 'polka', title: 'Polka — der 2/4-Takt', duration: '8 min', type: 'video', completed: true },
      { id: 'marsch', title: 'Marsch — der 4/4-Takt', duration: '8 min', type: 'video', completed: true },
    ],
  },
  {
    id: 'weitere-takte', title: 'Weitere Taktarten', status: 'in-progress',
    lessons: [
      { id: 'mazurka', title: 'Mazurka — betonter 3/4-Takt', duration: '11 min', type: 'video+text', completed: false },
      { id: 'schottisch', title: 'Schottisch & Polka-Varianten', duration: '12 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'rhythmusgefuehl', title: 'Rhythmusgefühl entwickeln', status: 'not-started',
    lessons: [
      { id: 'metronom', title: 'Üben mit dem Metronom', duration: '10 min', type: 'video', completed: false },
      { id: 'betonung', title: 'Betonung & Phrasierung', duration: '13 min', type: 'video+text', completed: false },
    ],
  },
]

const buehnenpraesenzModules: CourseModule[] = [
  {
    id: 'auftreten', title: 'Sicher auftreten', status: 'not-started',
    lessons: [
      { id: 'lampenfieber', title: 'Lampenfieber meistern', duration: '12 min', type: 'video+text', completed: false },
      { id: 'koerperhaltung', title: 'Körperhaltung & Ausstrahlung', duration: '10 min', type: 'video', completed: false },
      { id: 'blickkontakt', title: 'Blickkontakt mit dem Publikum', duration: '8 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'interaktion', title: 'Publikumsinteraktion', status: 'not-started',
    lessons: [
      { id: 'ansage', title: 'Die gelungene Ansage', duration: '11 min', type: 'video', completed: false },
      { id: 'dynamik', title: 'Spannung & Dynamik im Programm', duration: '14 min', type: 'video+text', completed: false },
    ],
  },
]

// ─── Ausgebaute Lehrgänge: weitere Starter- & Pro-Kurse je Instrument ─────────
// Kompakte Helfer (neue Kurse starten ohne Fortschritt).
const L = (id: string, title: string, duration: string, type: LessonType = 'video'): Lesson => ({ id, title, duration, type, completed: false })
const M = (id: string, title: string, lessons: Lesson[]): CourseModule => ({ id, title, status: 'not-started', lessons })

// Handorgel — Übungskurse (Starter)
const handorgelUebungenModules: CourseModule[] = [
  M('fingeruebungen', 'Fingerübungen', [
    L('warmup', 'Warm-up für die Finger', '8 min'),
    L('tonleitern', 'Tonleitern üben', '12 min'),
    L('fingersaetze', 'Fingersätze festigen', '10 min', 'video+text'),
  ]),
  M('rhythmus-balg', 'Rhythmus & Balg', [
    L('balg', 'Balgführung trainieren', '11 min'),
    L('patterns', 'Rhythmus-Patterns', '13 min'),
    L('dynamik', 'Dynamik üben', '9 min'),
  ]),
]
// Handorgel — Harmonielehre (Pro)
const handorgelHarmonieModules: CourseModule[] = [
  M('akkorde', 'Akkorde verstehen', [
    L('dur-moll', 'Dur- und Moll-Akkorde', '12 min', 'video+text'),
    L('kadenzen', 'Die wichtigsten Kadenzen', '14 min'),
    L('septakkorde', 'Septakkorde', '11 min'),
  ]),
  M('begleitung', 'Begleitung gestalten', [
    L('basslaeufe', 'Bassläufe entwickeln', '13 min'),
    L('wendungen', 'Harmonische Wendungen', '15 min', 'video+text'),
    L('eigene-begleitung', 'Eigene Begleitung bauen', '16 min'),
  ]),
]
// Handorgel — Fortgeschrittene Techniken (Pro)
const handorgelFortgeschrittenModules: CourseModule[] = [
  M('verzierungen', 'Verzierungen', [
    L('triller', 'Triller & Mordent', '10 min'),
    L('vorschlaege', 'Vorschläge & Doppelschläge', '12 min'),
    L('laeufe', 'Schnelle Läufe', '14 min'),
  ]),
  M('ausdruck', 'Ausdruck & Tempo', [
    L('dynamik', 'Dynamische Gestaltung', '11 min', 'video+text'),
    L('tempo', 'Tempo-Wechsel meistern', '13 min'),
    L('phrasierung', 'Phrasierung wie die Profis', '15 min'),
  ]),
]

// Schwyzerörgeli — Übungskurse (Starter)
const schwyzerUebungenModules: CourseModule[] = [
  M('grifftechnik', 'Grifftechnik', [
    L('diatonisch', 'Diatonische Fingerübungen', '9 min'),
    L('reihenwechsel', 'Reihenwechsel üben', '12 min'),
    L('uebergaenge', 'Saubere Tonübergänge', '10 min', 'video+text'),
  ]),
  M('balg-rhythmus', 'Balg & Rhythmus', [
    L('balg', 'Balgführung ziehend/stossend', '11 min'),
    L('rhythmusgefuehl', 'Rhythmusgefühl entwickeln', '13 min'),
    L('tempo', 'Tempo steigern', '9 min'),
  ]),
]
// Schwyzerörgeli — Harmonielehre (Pro)
const schwyzerHarmonieModules: CourseModule[] = [
  M('tonarten', 'Tonarten & Akkorde', [
    L('tonarten', 'Die gängigen Tonarten', '12 min', 'video+text'),
    L('begleitakkorde', 'Begleitakkorde auf der Bassseite', '13 min'),
    L('kadenzen', 'Kadenzen im Örgeli-Spiel', '11 min'),
  ]),
  M('begleitsaetze', 'Begleitsätze', [
    L('appenzeller', 'Typische Appenzeller Begleitung', '14 min'),
    L('stimmfuehrung', 'Stimmführung', '15 min', 'video+text'),
    L('eigene-saetze', 'Eigene Sätze entwickeln', '16 min'),
  ]),
]
// Schwyzerörgeli — Fortgeschrittene Grifftechnik (Pro)
const schwyzerFortgeschrittenModules: CourseModule[] = [
  M('verzierungen', 'Verzierungen', [
    L('zaeuerli', 'Zäuerli-Verzierungen', '11 min'),
    L('wechsel', 'Schnelle Wechsel', '13 min'),
    L('balg', 'Präzise Balgführung', '12 min', 'video+text'),
  ]),
  M('stilistik', 'Stilistik', [
    L('innerschwyzer', 'Innerschwyzer Stil', '14 min'),
    L('ausdruck', 'Ausdruck & Dynamik', '12 min'),
    L('interpretation', 'Eigene Interpretation', '15 min'),
  ]),
]

// Bassgeige — Grundlagenkurs (Starter)
const bassgeigeGrundlagenModules: CourseModule[] = [
  M('einfuehrung', 'Einführung', [
    L('kennenlernen', 'Die Bassgeige kennenlernen', '7 min'),
    L('haltung', 'Haltung & Stand', '10 min'),
    L('bogen-zupfen', 'Der Bogen & das Zupfen', '11 min', 'video+text'),
  ]),
  M('erste-toene', 'Erste Töne', [
    L('leere-saiten', 'Die leeren Saiten', '9 min'),
    L('greifen', 'Erste Töne greifen', '12 min'),
    L('basslinie', 'Einfache Basslinie', '14 min'),
  ]),
]
// Bassgeige — Übungskurse (Starter)
const bassgeigeUebungenModules: CourseModule[] = [
  M('bogen-zupfen', 'Bogen & Zupfen', [
    L('bogenfuehrung', 'Bogenführung üben', '10 min'),
    L('pizzicato', 'Pizzicato-Technik', '11 min'),
    L('ton', 'Sauberer Ton', '9 min', 'video+text'),
  ]),
  M('rhythmus', 'Rhythmus', [
    L('puls', 'Der Ländler-Puls', '12 min'),
    L('walzer', 'Walzer-Begleitung', '13 min'),
    L('timing', 'Timing festigen', '10 min'),
  ]),
]
// Bassgeige — Harmonielehre (Pro)
const bassgeigeHarmonieModules: CourseModule[] = [
  M('basslinien', 'Basslinien', [
    L('grundtoene', 'Grundtöne finden', '12 min', 'video+text'),
    L('quintfall', 'Quintfall & Kadenzen', '13 min'),
    L('durchgang', 'Durchgangsnoten', '11 min'),
  ]),
  M('begleitung', 'Begleitung', [
    L('walzer-bass', 'Walzer-Bass gestalten', '14 min'),
    L('polka-bass', 'Polka-Bass', '12 min'),
    L('eigene', 'Eigene Basslinien', '15 min', 'video+text'),
  ]),
]
// Bassgeige — Fortgeschrittene Bogentechnik (Pro)
const bassgeigeFortgeschrittenModules: CourseModule[] = [
  M('bogentechnik', 'Bogentechnik', [
    L('detache-legato', 'Détaché & Legato', '11 min'),
    L('akzente', 'Akzente setzen', '12 min'),
    L('dynamik', 'Dynamik mit dem Bogen', '13 min', 'video+text'),
  ]),
  M('ausdruck', 'Ausdruck', [
    L('groove', 'Groove & Timing', '14 min'),
    L('zusammenspiel', 'Zusammenspiel mit der Kapelle', '13 min'),
    L('eigener-ausdruck', 'Eigener Ausdruck', '12 min'),
  ]),
]

// ─── Kurs-Katalog ─────────────────────────────────────────────────────────────

const handorgelCourses: Record<string, Course> = {
  grundlagen: {
    id: 'grundlagen', title: 'Grundlagenkurs', instrumentId: 'handorgel', instrumentLabel: 'Handorgel',
    emoji: '🪗', level: 'Starter', teacher: 'Hansruedi Wenger', modules: grundlagenModules,
  },
  uebungen: {
    id: 'uebungen', title: 'Übungskurse', instrumentId: 'handorgel', instrumentLabel: 'Handorgel',
    emoji: '🪗', level: 'Starter', teacher: 'Hansruedi Wenger', modules: handorgelUebungenModules,
  },
  harmonielehre: {
    id: 'harmonielehre', title: 'Harmonielehre', instrumentId: 'handorgel', instrumentLabel: 'Handorgel',
    emoji: '🪗', level: 'Pro', teacher: 'Franz Hess', modules: handorgelHarmonieModules,
  },
  fortgeschritten: {
    id: 'fortgeschritten', title: 'Fortgeschrittene Techniken', instrumentId: 'handorgel', instrumentLabel: 'Handorgel',
    emoji: '🪗', level: 'Pro', teacher: 'Hansruedi Wenger', modules: handorgelFortgeschrittenModules,
  },
}

const schwyzerCourses: Record<string, Course> = {
  grundlagen: {
    id: 'grundlagen', title: 'Grundlagenkurs Schwyzerörgeli', instrumentId: 'schwyzer', instrumentLabel: 'Schwyzerörgeli',
    emoji: '🎶', level: 'Starter', teacher: 'Cyrill Rusch', modules: schwyzerGrundlagenModules,
  },
  uebungen: {
    id: 'uebungen', title: 'Übungskurse', instrumentId: 'schwyzer', instrumentLabel: 'Schwyzerörgeli',
    emoji: '🎶', level: 'Starter', teacher: 'Cyrill Rusch', modules: schwyzerUebungenModules,
  },
  harmonielehre: {
    id: 'harmonielehre', title: 'Harmonielehre', instrumentId: 'schwyzer', instrumentLabel: 'Schwyzerörgeli',
    emoji: '🎶', level: 'Pro', teacher: 'Cyrill Rusch', modules: schwyzerHarmonieModules,
  },
  fortgeschritten: {
    id: 'fortgeschritten', title: 'Fortgeschrittene Grifftechnik', instrumentId: 'schwyzer', instrumentLabel: 'Schwyzerörgeli',
    emoji: '🎶', level: 'Pro', teacher: 'Cyrill Rusch', modules: schwyzerFortgeschrittenModules,
  },
}

const bassgeigeCourses: Record<string, Course> = {
  grundlagen: {
    id: 'grundlagen', title: 'Grundlagenkurs Bassgeige', instrumentId: 'bassgeige', instrumentLabel: 'Bassgeige',
    emoji: '🎻', level: 'Starter', teacher: 'Simon Rusch', modules: bassgeigeGrundlagenModules,
  },
  uebungen: {
    id: 'uebungen', title: 'Übungskurse', instrumentId: 'bassgeige', instrumentLabel: 'Bassgeige',
    emoji: '🎻', level: 'Starter', teacher: 'Simon Rusch', modules: bassgeigeUebungenModules,
  },
  harmonielehre: {
    id: 'harmonielehre', title: 'Harmonielehre', instrumentId: 'bassgeige', instrumentLabel: 'Bassgeige',
    emoji: '🎻', level: 'Pro', teacher: 'Franz Hess', modules: bassgeigeHarmonieModules,
  },
  fortgeschritten: {
    id: 'fortgeschritten', title: 'Fortgeschrittene Bogentechnik', instrumentId: 'bassgeige', instrumentLabel: 'Bassgeige',
    emoji: '🎻', level: 'Pro', teacher: 'Simon Rusch', modules: bassgeigeFortgeschrittenModules,
  },
}

const allgemeinCourses: Record<string, Course> = {
  harmonielehre: {
    id: 'harmonielehre', title: 'Harmonielehre', instrumentId: 'allgemein', instrumentLabel: 'Allgemein',
    emoji: '🎼', level: 'Allgemein', teacher: 'Franz Hess', modules: harmonielehreModules,
  },
  taktarten: {
    id: 'taktarten', title: 'Taktarten in der Ländlermusik', instrumentId: 'allgemein', instrumentLabel: 'Allgemein',
    emoji: '🥁', level: 'Allgemein', teacher: 'Seebi Diener', modules: taktartenModules,
  },
  buehnenpraesenz: {
    id: 'buehnenpraesenz', title: 'Bühnenpräsenz', instrumentId: 'allgemein', instrumentLabel: 'Allgemein',
    emoji: '🎤', level: 'Allgemein', teacher: 'Cécile Schmidig', modules: buehnenpraesenzModules,
  },
}

// Kurskatalog nach Instrument verschachtelt — ein Kurs-Slug (z. B. "grundlagen")
// kann je Instrument einen eigenen Kurs haben.
const courseRegistry: Record<string, Record<string, Course>> = {
  handorgel: handorgelCourses,
  schwyzer: schwyzerCourses,
  bassgeige: bassgeigeCourses,
  allgemein: allgemeinCourses,
}

// Flacher Katalog für Lookups per Kurs-ID (Allgemeiner Lehrgang & Handorgel).
export const courses: Record<string, Course> = { ...handorgelCourses, ...allgemeinCourses }

// Reihenfolge der Kurse im allgemeinen Lehrgang.
export const ALLGEMEIN_COURSES = ['harmonielehre', 'taktarten', 'buehnenpraesenz'] as const

export const instrumentLabels: Record<string, string> = {
  handorgel: 'Handorgel',
  schwyzer: 'Schwyzerörgeli',
  bassgeige: 'Bassgeige',
  klavierbegleitung: 'Klavierbegleitung',
  klarinette: 'Klarinette',
  allgemein: 'Allgemein',
}

export function getCourse(instrumentId: string, kursId: string): Course | undefined {
  return courseRegistry[instrumentId]?.[kursId]
}

export function courseStats(course: Course) {
  const lessons = course.modules.flatMap((m) => m.lessons)
  const total = lessons.length
  const completed = lessons.filter((l) => l.completed).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  return { total, completed, percent }
}

// Flache, geordnete Liste aller Lektionen (für Weiter-/Zurück-Navigation).
export function flatLessons(course: Course) {
  return course.modules.flatMap((m, moduleIndex) =>
    m.lessons.map((lesson, lessonIndex) => ({ moduleId: m.id, moduleTitle: m.title, lesson, moduleIndex, lessonIndex })),
  )
}

// ─── Free-Account: Schnupper-Lektionen ────────────────────────────────────────
// Im Free-Account sind die ersten drei Lektionsvideos des ersten Kurses zum
// Reinschnuppern frei.
export const FREE_TRIAL_LESSON_COUNT = 3

// Set der im Free-Account freigeschalteten Lektions-Keys (`moduleId:lessonId`).
export function freeTrialLessonKeys(course: Course): Set<string> {
  return new Set(
    flatLessons(course)
      .slice(0, FREE_TRIAL_LESSON_COUNT)
      .map((x) => `${x.moduleId}:${x.lesson.id}`),
  )
}
