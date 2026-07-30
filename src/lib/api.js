// ============================================
// SOBEI Portal — API Integration
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function unwrapPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  return payload.denuncia || payload.data || payload;
}

function normalizeMedidas(value, asText = false) {
  if (!value) return asText ? null : [];

  const medidas = Array.isArray(value) ? value : [value];
  const normalized = medidas
    .map((medida, index) => {
      if (typeof medida === 'string') {
        return { id: `medida-${index}`, descricao: medida, dataRegistro: null };
      }

      if (!medida || typeof medida !== 'object') return null;

      return {
        id: medida.id ?? `medida-${index}`,
        descricao: medida.descricao || '',
        dataRegistro: medida.dataRegistro || null,
        autor: medida.autor || null,
      };
    })
    .filter(Boolean);

  if (asText) {
    const text = normalized
      .map((medida) => medida.descricao)
      .filter(Boolean)
      .join('\n');
    return text || null;
  }

  return normalized;
}

function normalizeDenuncia(raw) {
  const denuncia = unwrapPayload(raw);
  if (!denuncia || typeof denuncia !== 'object') return denuncia;

  return {
    ...denuncia,
    id: denuncia.id,
    protocolo: denuncia.protocolo,
    status: denuncia.status || denuncia.estado,
    tipo: denuncia.tipo,
    unidade: denuncia.unidade,
    dataEnvio: denuncia.dataEnvio || denuncia.dataAbertura,
    dataAbertura: denuncia.dataAbertura,
    ultimaAlteracao: denuncia.ultimaAlteracao,
    dataFechamento: denuncia.dataFechamento,
    dataArquivamento: denuncia.dataArquivamento,
    descricao: denuncia.descricao || '',
    envolvidos: denuncia.envolvidos || '',
    testemunhas: denuncia.testemunhas || '',
    nomeDenunciante: denuncia.nomeDenunciante || '',
    emailDenunciante: denuncia.emailDenunciante || '',
    telefoneDenunciante: denuncia.telefoneDenunciante || '',
    medidasAdotadas: normalizeMedidas(denuncia.medidasAdotadas),
    relatorioConclusao: denuncia.relatorioConclusao || '',
    tipoConclusao: denuncia.tipoConclusao || null,
    prioridade: (denuncia.prioridade || 'NEUTRA').toUpperCase(),
  };
}

function normalizeDenunciasList(raw) {
  const list = Array.isArray(raw)
    ? raw
    : raw?.content || raw?.items || raw?.denuncias || raw?.data || [];

  return Array.isArray(list) ? list.map(normalizeDenuncia) : [];
}



// ---- API Pública ----

export async function enviarDenuncia(rawData) {
  try {
    const data = { ...rawData };

    if (data.tipo === 'anonima') {
      delete data.nomeCompleto;
      delete data.email;
      delete data.telefone;
    } else {
      if (!data.nomeCompleto || typeof data.nomeCompleto !== 'string' || !data.nomeCompleto.trim()) {
        data.nomeCompleto = null;
      }
      if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
        data.email = null;
      }
      if (!data.telefone || typeof data.telefone !== 'string' || !data.telefone.trim()) {
        data.telefone = null;
      }
    }

    if (!data.envolvidos || typeof data.envolvidos !== 'string' || !data.envolvidos.trim()) {
      data.envolvidos = null;
    }
    if (!data.testemunhas || typeof data.testemunhas !== 'string' || !data.testemunhas.trim()) {
      data.testemunhas = null;
    }

    const response = await fetch(`${API_BASE_URL}/public/denuncias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      return { success: false, message: err.message || 'Erro ao enviar denúncia' };
    }

    const result = await response.json();
    return { protocolo: result.protocolo, success: true };
  } catch (error) {
    return { success: false, message: 'Erro de conexão com o servidor' };
  }
}

export async function consultarProtocolo(protocolo) {
  try {
    const response = await fetch(`${API_BASE_URL}/public/denuncias/protocolo/${protocolo}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      return { found: false, protocolo, status: null, timeline: [] };
    }
    
    const result = unwrapPayload(await response.json());
    const estado = result.estado ?? result.status;
    // A API já envia estado e ultimaAlteracao, simularemos a timeline visual com base no estado retornado
    const timeline = buildTimeline(estado ? estado.toUpperCase() : '');
    
    return {
      found: true,
      protocolo: result.protocolo,
      status: estado ? estado.toLowerCase() : null,
      timeline: timeline,
      dataEnvio: result.dataEnvio ?? result.dataAbertura ?? result.criadoEm,
      unidade: result.unidade,
      tipo: result.tipo,
      descricao: result.descricao ?? result.relato ?? '',
      envolvidos: result.envolvidos ?? result.pessoasEnvolvidas ?? '',
      testemunhas: result.testemunhas ?? '',
      relatorioConclusao: result.relatorioConclusao ?? result.relatorioFinal ?? result.relatorioArquivamento,
      tipoConclusao: result.tipoConclusao ?? result.conclusao?.tipoConclusao,
    };
  } catch (error) {
    return { found: false, protocolo, status: null, timeline: [] };
  }
}

function buildTimeline(estado) {
  const statusMap = {
    NA_FILA: [
      { label: 'Denúncia recebida!', active: true },
      { label: 'Sua denúncia está sendo analisada', active: false },
      { label: 'Protocolo fechado!', active: false },
    ],
    EM_ANDAMENTO: [
      { label: 'Denúncia recebida!', active: true },
      { label: 'Sua denúncia está sendo analisada', active: true },
      { label: 'Protocolo fechado!', active: false },
    ],
    FECHADA: [
      { label: 'Denúncia recebida!', active: true },
      { label: 'Sua denúncia está sendo analisada', active: true },
      { label: 'Protocolo fechado!', active: true },
    ],
    ARQUIVADA: [
      { label: 'Denúncia recebida!', active: true },
      { label: 'Sua denúncia está sendo analisada', active: true },
      { label: 'Denúncia arquivada', active: true },
    ],
  };
  return statusMap[estado] || [];
}
