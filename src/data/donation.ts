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
  githubSponsors?: string
  buyMeACoffee?: string
  authorName: string
  authorGithub: string
  repositoryUrl: string
}

export const donationConfig: DonationConfig = {
  // ← Substitua pela sua chave Pix aleatória (gerada no app do banco)
  pixKey: 'sua-chave-pix-aleatoria-aqui',
  pixKeyType: 'random',
  pixKeyLabel: 'Chave aleatória',
  githubSponsors: 'https://github.com/sponsors/jamesismos',
  buyMeACoffee: undefined, // ← adicione se quiser: 'https://buymeacoffee.com/jamesismos'
  authorName: 'James Oliveira',
  authorGithub: 'https://github.com/jamesismos',
  repositoryUrl: 'https://github.com/jamesismos/Respira',
}
