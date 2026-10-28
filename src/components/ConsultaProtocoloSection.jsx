'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { consultarProtocolo } from '@/lib/api';

const ConsultaProtocoloModal = dynamic(
  () => import('@/components/ConsultaProtocoloModal'),
  { ssr: false }
);

export default function ConsultaProtocoloSection() {
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
        if (/[A-Z]/.test(char)) {
          formatted += char;
        } else {
          break;
        }
      } else {
        if (/[0-9]/.test(char)) {
          if (i === 3 || i === 6) {
            formatted += '-';
          }
          formatted += char;
        } else {
          break;
        }
      }
    }

    setProtocolo(formatted);
  }

  return (
    <>
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
              aria-label="Número do Protocolo"
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

      {showModal && resultado && (
        <ConsultaProtocoloModal resultado={resultado} onClose={handleCloseModal} />
      )}
    </>
  );
}
