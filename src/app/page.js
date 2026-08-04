'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { consultarProtocolo } from '@/lib/api';
import ConsultaProtocoloModal from '@/components/ConsultaProtocoloModal';

export default function LandingPage() {
  const [protocolo, setProtocolo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function handleConsultar(e) {
    e.preventDefault();
    if (!protocolo.trim()) return;

    setBuscando(true);
    setErro(false);
    try {
      const res = await consultarProtocolo(protocolo.trim());
      if (res && res.found) {
        setResultado(res);
        setShowModal(true);
        setErro(false);
      } else {
        setResultado(null);
        setErro(true);
      }
    } catch {
      setResultado(null);
      setErro(true);
    } finally {
      setBuscando(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleProtocoloChange(e) {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = '';

    for (let i = 0; i < val.length && i < 9; i++) {
      let char = val[i];
      if (i < 3) {
        // Primeiros 3 devem ser letras
        if (/[A-Z]/.test(char)) {
          formatted += char;
        } else {
          break; // Ignora se não for letra
        }
      } else {
        // Restante deve ser número
        if (/[0-9]/.test(char)) {
          if (i === 3 || i === 6) {
            formatted += '-';
          }
          formatted += char;
        } else {
          break; // Ignora se não for número
        }
      }
    }

    setProtocolo(formatted);
  }

  return (
    <main className="landing">
      <div className="portal-container">
        {/* ---- Portal Grid Layout ---- */}
        <div className="portal-grid" style={{ paddingTop: 'var(--spacing-lg)' }}>
          {/* Coluna Esquerda: Informações e Guia */}
          <section className="portal-info">
            <div className="portal-info__logo-wrapper">
              <Image
                src="/public/images/LOGO BRANCO.png"
                alt="SOBEI - Sociedade Beneficente Equilíbrio de Interlagos"
                width={580}
                height={232}
                className="portal-info__logo"
                priority
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

            {/* Seção 2: Consulta de Protocolo */}
            <div className="portal-actions__section">
              <h2 className="portal-actions__title">Acompanhar Protocolo</h2>
              <p className="portal-actions__subtitle">Acompanhe o status e a evolução da sua apuração</p>

              <form onSubmit={handleConsultar} className="portal-search-form">
                <div className="portal-search-form__input-group">
                  <input
                    type="text"
                    className="portal-search-form__input"
                    placeholder="AAA-000-000"
                    value={protocolo}
                    onChange={handleProtocoloChange}
                    maxLength={11}
                    id="protocol-input"
                  />
                </div>

                {erro && (
                  <p style={{ color: 'var(--color-accent)', textAlign: 'center', margin: '0 0 16px 0', fontSize: '13px', fontWeight: '500' }}>
                    Protocolo não encontrado. Verifique e tente novamente.
                  </p>
                )}

                <div className="portal-search-form__btn">
                  <button
                    type="submit"
                    className="btn"
                    disabled={buscando}
                  >
                    <strong>{buscando ? 'Consultando...' : 'Consultar Protocolo'}</strong>
                  </button>
                </div>
              </form>


            </div>
          </aside>
        </div>
      </div>

      {/* ---- Modal de Consulta ---- */}
      {showModal && resultado && (
        <ConsultaProtocoloModal resultado={resultado} onClose={handleCloseModal} />
      )}
    </main>
  );
}

