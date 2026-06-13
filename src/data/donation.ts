// ============================================================
// Respira — Donation Config
// Public utility app — James Oliveira
//
// 👋 James: edite este arquivo para configurar sua chave Pix.
// Use uma chave ALEATÓRIA (gerada pelo seu banco) para não
// expor e-mail, CPF ou telefone diretamente no código.
// ============================================================

export interface DonationConfig {
  pixKey: string
  pixKeyType: 'email' | 'cpf' | 'phone' | 'random'
  pixKeyLabel: string
  bitcoinAddress: string
  githubSponsors?: string
  buyMeACoffee?: string
  authorName: string
  authorGithub: string
}

export const donationConfig: DonationConfig = {
  pixKey: 'c23396a1-9c0e-4795-919e-d48e528074f2',
  pixKeyType: 'random',
  pixKeyLabel: 'Chave aleatória',
  bitcoinAddress: 'bc1qzewr447fjwln66es26qdzkwmpqy3ukfvs89nnz',
  githubSponsors: 'https://github.com/sponsors/jamesismos',
  buyMeACoffee: undefined,
  authorName: 'James Oliveira',
  authorGithub: 'https://github.com/jamesismos',
}
