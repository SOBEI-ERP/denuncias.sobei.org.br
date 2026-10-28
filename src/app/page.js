import Image from 'next/image';
import Link from 'next/link';
import ConsultaProtocoloSection from '@/components/ConsultaProtocoloSection';

export default function LandingPage() {
  return (
    <main className="landing">
      <div className="portal-container">
        {/* ---- Portal Grid Layout ---- */}
        <div className="portal-grid" style={{ paddingTop: 'var(--spacing-lg)' }}>
          {/* Coluna Esquerda: Informações e Guia */}
          <section className="portal-info">
            <div className="portal-info__logo-wrapper">
              <Image
                src="/images/LOGO BRANCO.png"
                alt="SOBEI - Sociedade Beneficente Equilíbrio de Interlagos"
                width={500}
                height={234}
                sizes="(max-width: 640px) 100vw, 440px"
                style={{ width: '100%', maxWidth: '440px', height: 'auto', aspectRatio: '1001 / 468' }}
                className="portal-info__logo"
                priority
                fetchPriority="high"
              />
            </div>
            <h1 className="portal-info__title">A SOBEI está com você!</h1>
            <p className="portal-info__description">
              Este canal é o ambiente seguro e confidencial para relatar desvios de conduta, violações éticas ou irregularidades. Nosso compromisso é com a verdade, a transparência e a melhoria contínua de nossas 18 unidades. Os relatos podem ser registrados de forma anônima ou identificada, sendo tratados com absoluto sigilo.
            </p>

            <div className="portal-guide">
              <h2 className="portal-guide__title">Orientações de Uso</h2>
              <div className="portal-steps">
                {/* Passo 1 */}
                <div className="portal-steps__item">
                  <div className="portal-steps__badge">1</div>
                  <div className="portal-steps__content">
                    <h3 className="portal-steps__step-title">Faça seu relato detalhado</h3>
                    <p className="portal-steps__step-text">
                      Descreva o ocorrido de forma clara e objetiva (o que, quem, quando e onde). Se preferir, você não precisa se identificar em nenhuma etapa do processo.
                    </p>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="portal-steps__item">
                  <div className="portal-steps__badge">2</div>
                  <div className="portal-steps__content">
                    <h3 className="portal-steps__step-title">Guarde seu número de protocolo</h3>
                    <p className="portal-steps__step-text">
                      Ao concluir o relato, salve o código gerado pelo sistema (ex: AAA-000-000). Ele será a sua única chave de acesso para consultar o andamento.
                    </p>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="portal-steps__item">
                  <div className="portal-steps__badge">3</div>
                  <div className="portal-steps__content">
                    <h3 className="portal-steps__step-title">Acompanhe a apuração</h3>
                    <p className="portal-steps__step-text">
                      Insira o seu número de protocolo no painel de acompanhamento para ler respostas, ver o status da investigação ou anexar esclarecimentos solicitados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Coluna Direita: Painel de Ações */}
          <aside className="portal-actions">
            {/* Seção 1: Nova Denúncia */}
            <div className="portal-actions__section">
              <h2 className="portal-actions__title">Registrar Relato</h2>
              <p className="portal-actions__subtitle">Comunique uma ocorrência de forma segura</p>
              <div className="portal-actions__btn-group">
                <Link href="/denuncia" className="btn">
                  <strong>Iniciar Novo Relato</strong>
                </Link>
              </div>
            </div>

            {/* Seção 2: Consulta de Protocolo (Client Component Isolado) */}
            <ConsultaProtocoloSection />
          </aside>
        </div>
      </div>
    </main>
  );
}
