import snapshot from './github-snapshot.json'

export type Commit = { repo: string; sha: string; message: string; date: string; url: string }
export type Activity = { commits: Commit[]; total: number; perDay: number[]; snapshotAt?: string }

// Commits públicos dos últimos 90 dias, contados no build (scripts/github-snapshot.mjs) e atualizados a cada
// deploy. O navegador não chama a API do GitHub: o limite de 60/h por IP estourava em rede compartilhada
// (NAT de empresa) e sujava o console.
export const activity: Activity = { ...snapshot, snapshotAt: snapshot.generatedAt }
