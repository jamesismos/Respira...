// ============================================================
// Respira — Default Triggers & Moods
// ============================================================

export interface TriggerOption {
  id: string
  label: string
  emoji: string
}

export interface MoodOption {
  id: string
  label: string
  emoji: string
}

export const defaultTriggers: TriggerOption[] = [
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'apos-refeicao', label: 'Após refeição', emoji: '🍽️' },
  { id: 'estresse', label: 'Estresse', emoji: '😤' },
  { id: 'ansiedade', label: 'Ansiedade', emoji: '😰' },
  { id: 'tedio', label: 'Tédio', emoji: '😑' },
  { id: 'trabalho', label: 'Trabalho', emoji: '💼' },
  { id: 'discussao', label: 'Discussão', emoji: '💬' },
  { id: 'alcool', label: 'Álcool', emoji: '🍺' },
  { id: 'antes-dormir', label: 'Antes de dormir', emoji: '🌙' },
  { id: 'acordar', label: 'Ao acordar', emoji: '🌅' },
  { id: 'social', label: 'Social / amigos', emoji: '👥' },
  { id: 'dirigindo', label: 'Dirigindo', emoji: '🚗' },
  { id: 'outro', label: 'Outro', emoji: '💭' },
]

export const moodOptions: MoodOption[] = [
  { id: 'ansioso', label: 'Ansioso(a)', emoji: '😰' },
  { id: 'estressado', label: 'Estressado(a)', emoji: '😤' },
  { id: 'entediado', label: 'Entediado(a)', emoji: '😑' },
  { id: 'triste', label: 'Triste', emoji: '😢' },
  { id: 'com-raiva', label: 'Com raiva', emoji: '😠' },
  { id: 'feliz', label: 'Feliz', emoji: '😊' },
  { id: 'cansado', label: 'Cansado(a)', emoji: '😴' },
  { id: 'normal', label: 'Normal', emoji: '😐' },
  { id: 'outro', label: 'Outro', emoji: '🤔' },
]

export const quitReasons: string[] = [
  'Minha saúde',
  'Minha família',
  'Meu dinheiro',
  'Meus filhos',
  'Minha liberdade',
  'Meu futuro',
  'Respirar melhor',
  'Me sentir bem comigo',
  'Outro motivo',
]
