import { Router } from 'express';
import axios from 'axios';

const router = Router();

// SICAR – Sistema Nacional de Cadastro Ambiental Rural (Serviço Florestal Brasileiro)
// Documentação: https://www.car.gov.br/publico/imoveis/index
const SICAR_BASE = 'https://consultapublica.car.gov.br/publico/imovel';

router.get('/:cpfCnpj', async (req, res) => {
  const doc = req.params.cpfCnpj.replace(/\D/g, '');

  if (doc.length !== 11 && doc.length !== 14) {
    return res.status(400).json({ error: 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido.' });
  }

  try {
    const { data } = await axios.post(
      `${SICAR_BASE}/pesquisarPorCpfCnpj`,
      { cpfCnpj: doc },
      { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
    );

    const imoveis = Array.isArray(data) ? data : (data.imoveis ?? []);

    const result = imoveis.map(im => ({
      codigoCar: im.codigo ?? im.codigoCar ?? im.num_car,
      situacao: im.situacaoImovel ?? im.situacao ?? im.ds_situacao,
      area: im.areaTotalHectares ?? im.area_total ?? null,
      municipio: im.municipio ?? im.nm_municipio,
      uf: im.uf ?? im.sg_estado,
      modulos: im.modulosFiscais ?? null,
      dataInscricao: im.dataInscricao ?? im.dt_inscricao ?? null,
      tipo: im.tipoImovel ?? im.tipo ?? null,
    }));

    res.json({ cpfCnpj: doc, imoveis: result, total: result.length });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.json({ cpfCnpj: doc, imoveis: [], total: 0, message: 'Nenhum imóvel rural cadastrado.' });
    }

    // Fallback ilustrativo para desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return res.json(generateMockCAR(doc));
    }

    res.status(502).json({ error: 'Falha ao consultar SICAR. Tente novamente.' });
  }
});

function generateMockCAR(doc) {
  const seed = parseInt(doc.slice(0, 6), 10);
  const ufs = ['MT', 'PA', 'MG', 'GO', 'BA', 'RS', 'MS', 'PR'];
  const uf = ufs[seed % ufs.length];
  const situacoes = ['Ativo', 'Pendente', 'Cancelado'];

  const totalImoveis = 1 + (seed % 3);
  const imoveis = Array.from({ length: totalImoveis }, (_, i) => ({
    codigoCar: `${uf}-${doc.slice(0, 7).padStart(7, '0')}-${String(i + 1).padStart(4, '0')}`,
    situacao: situacoes[(seed + i) % situacoes.length],
    area: parseFloat((50 + (seed % 2000) + i * 100).toFixed(2)),
    municipio: `Município ${(seed % 50) + 1}`,
    uf,
    modulos: parseFloat((1 + (seed % 10) + i).toFixed(1)),
    dataInscricao: `${2015 + (seed % 8)}-0${(seed % 9) + 1}-${(seed % 28) + 1}`,
    tipo: seed % 2 === 0 ? 'Imóvel Rural' : 'Assentamento',
  }));

  return {
    cpfCnpj: doc,
    imoveis,
    total: imoveis.length,
    _source: 'Dados ilustrativos (dev) — em produção consulta SICAR / Serviço Florestal Brasileiro',
  };
}

export default router;
