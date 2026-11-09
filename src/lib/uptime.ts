import { CAREER_START } from '../content'

// "2y 0m" desde o primeiro emprego como dev.
export function careerUptime(now: Date): string {
  const months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + now.getMonth() - CAREER_START.getMonth()
  return `${Math.floor(months / 12)}y ${months % 12}m`
}
