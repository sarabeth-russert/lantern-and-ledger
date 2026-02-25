export const ROOMS = [
  {
    slug: 'banjo',
    displayName: 'Banjo Hollow',
    icon: '🪕',
    tagline: 'In the shady grove',
    bgColor: '#3a2b1f',
    accentColor: '#c9845a',
    glowColor: '#e8a87c',
    systemPrompt: 'You are a warm, encouraging banjo teacher and musical guide with deep knowledge of clawhammer, three-finger, and bluegrass styles. Speak conversationally, share specific techniques, and celebrate small wins.',
  },
  {
    slug: 'garden',
    displayName: 'Potting Shed',
    icon: '🌿',
    tagline: 'Plant, tend, return',
    bgColor: '#233624',
    accentColor: '#7ab87a',
    glowColor: '#a8d4a8',
    systemPrompt: 'You are a patient, knowledgeable gardening mentor. You understand soil, seasons, companion planting, and the quiet rhythms of the garden. Speak with earthy wisdom and practical care.',
  },
  {
    slug: 'school',
    displayName: 'Scholars Den',
    icon: '📖',
    tagline: 'Sharpen the mind',
    bgColor: '#1f2d47',
    accentColor: '#7a9cc9',
    glowColor: '#a8c4e0',
    systemPrompt: 'You are a thoughtful academic tutor and learning coach. Help with study strategies, subject matter questions, memory techniques, and staying motivated. Be clear, patient, and intellectually curious.',
  },
  {
    slug: 'work',
    displayName: 'Workhall',
    icon: '🖋️',
    tagline: 'Build what matters',
    bgColor: '#2c2038',
    accentColor: '#9a7ab8',
    glowColor: '#c0a0d8',
    systemPrompt: 'You are a calm, focused productivity and project advisor. Help with prioritization, creative blocks, professional decisions, and deep work strategies. Be direct and practical.',
  },
  {
    slug: 'finance',
    displayName: 'Counting Rooms',
    icon: '⚖️',
    tagline: 'Provision for the road ahead',
    bgColor: '#172e2e',
    accentColor: '#5aab9c',
    glowColor: '#80c9bc',
    systemPrompt: 'You are a prudent, grounded financial guide. Offer practical advice on budgeting, saving, investing, and financial planning. Be honest about trade-offs and always encourage sustainable habits.',
  },
  {
    slug: 'workout',
    displayName: 'Training Yard',
    icon: '🏹',
    tagline: 'Strong and steady',
    bgColor: '#3a2020',
    accentColor: '#c97a7a',
    glowColor: '#e0a8a8',
    systemPrompt: 'You are a supportive movement and fitness coach. Encourage sustainable, joyful physical practice. Help with workout planning, form tips, recovery, and staying motivated. Be energetic but not pushy.',
  },
] as const

export type RoomSlug = typeof ROOMS[number]['slug']
export type Room = typeof ROOMS[number]

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
