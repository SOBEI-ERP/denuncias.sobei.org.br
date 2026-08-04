'use client';

import { useEffect } from 'react';

/**
 * AlertModal — Modal de Alerta/Erro elegante para o Portal de Denúncias SOBEI
 *
 * @param {boolean} isOpen - Controla a exibição do modal
 * @param {string} title - Título da mensagem
 * @param {string} message - Conteúdo detalhado
 * @param {'error' | 'warning' | 'info' | 'success'} type - Tipo do alerta
 * @param {string} buttonText - Texto do botão principal (padrão: "Entendido")
 * @param {function} onClose - Função acionada ao fechar
 */
export default function AlertModal({
  isOpen,
  title = 'Atenção',
  message,
  type = 'error',
  buttonText = 'Entendido',
  onClose,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    error: {
      color: '#E53935',
      bgColor: '#FFEBEE',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
    warning: {
      color: '#FF9800',
      bgColor: '#FFF3E0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
    info: {
      color: '#1B1464',
      bgColor: '#E8E6F5',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
    success: {
      color: '#43A047',
      bgColor: '#E8F5E9',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  };

  const config = typeConfig[type] || typeConfig.error;

  return (
    <div className="consulta-modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="consulta-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          padding: '28px 24px',
          textAlign: 'center',
          borderRadius: '16px',
        }}
      >
        <button className="consulta-modal__close" onClick={onClose} aria-label="Fechar modal">
          ×
        </button>

        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: config.bgColor,
            color: config.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          {config.icon}
        </div>

        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#212121',
            margin: '0 0 10px 0',
          }}
        >
          {title}
        </h2>

        {message && (
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#616161',
              marginBottom: '24px',
            }}
          >
            {message}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onClose}
            style={{
              minWidth: '130px',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
