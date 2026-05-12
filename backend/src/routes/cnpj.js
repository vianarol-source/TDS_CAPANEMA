import { Router } from 'express';
import axios from 'axios';
import { isRuralByCnae } from '../data/cnae.js';

const router = Router();

// BrasilAPI — gratuita, sem autenticação, dados públicos da Receita Federal
const BRASIL_API = 'https://brasilapi.com.br/api/cnpj/v1';

router.get('/:cnpj', async (req, res) => {
  const cnpj = req.params.cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) {
    return res.status(400).json({ error: 'CNPJ inválido. Informe 14 dígitos.' });
  }

  try {
    const { data } = await axios.get(`${BRASIL_API}/${cnpj}`, { timeout: 10000 });

    res.json(mapBrasilAPI(data));
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'CNPJ não encontrado na base da Receita Federal.' });
    }
    if (err.response?.status === 429) {
      return res.status(429).json({ error: 'Limite de requisições atingido. Tente novamente em instantes.' });
    }

    // Em ambiente de desenvolvimento sem acesso externo, retorna mock ilustrativo
    if (process.env.NODE_ENV !== 'production') {
      return res.json(generateMockContact(cnpj));
    }

    res.status(502).json({ error: 'Falha ao consultar BrasilAPI. Tente novamente.' });
  }
});

function mapBrasilAPI(data) {
  return {
    cnpj: data.cnpj,
    razaoSocial: data.razao_social,
    nomeFantasia: data.nome_fantasia || null,
    situacao: data.descricao_situacao_cadastral,
    dataAbertura: data.data_inicio_atividade,
    email: data.email || null,
    telefone: data.ddd_telefone_1 ? formatPhone(data.ddd_telefone_1) : null,
    telefone2: data.ddd_telefone_2 ? formatPhone(data.ddd_telefone_2) : null,
    endereco: {
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento || null,
      bairro: data.bairro,
      municipio: data.municipio,
      uf: data.uf,
      cep: data.cep,
    },
    atividadePrincipal: data.cnae_fiscal_descricao || null,
    naturezaJuridica: data.descricao_natureza_juridica || null,
    capitalSocial: data.capital_social ?? null,
    socios: (data.qsa || []).map(s => ({
      nome: s.nome_socio,
      qualificacao: s.qualificacao_socio,
      cpfCnpj: s.cnpj_cpf_do_socio || null,
    })),
    isRuralProducer: isRuralByCnae(data.cnae_fiscal, data.cnae_fiscal_descricao),
    cnaeFiscal: data.cnae_fiscal ? String(data.cnae_fiscal) : null,
    _source: 'BrasilAPI / Receita Federal',
  };
}

// Gerador de contato ilustrativo para ambiente de desenvolvimento sem internet
function generateMockContact(cnpj) {
  const seed = parseInt(cnpj.slice(0, 4), 10);
  const ufs = ['SP', 'RJ', 'MG', 'BA', 'RS', 'PR', 'GO', 'PE'];
  const uf = ufs[seed % ufs.length];
  const ddd = ['11', '21', '31', '41', '51', '61', '71', '81'][seed % 8];

  return {
    cnpj,
    razaoSocial: 'EMPRESA EXEMPLO LTDA',
    nomeFantasia: 'Empresa Exemplo',
    situacao: 'ATIVA',
    dataAbertura: '2005-03-14',
    email: 'meioambiente@empresaexemplo.com.br',
    telefone: `(${ddd}) ${3000 + (seed % 9000)}-${1000 + (seed % 8999)}`,
    telefone2: null,
    endereco: {
      logradouro: 'Rua das Licenças Ambientais',
      numero: String(100 + (seed % 900)),
      complemento: 'Sala 42',
      bairro: 'Centro',
      municipio: 'São Paulo',
      uf,
      cep: `0${seed % 9}000-100`,
    },
    atividadePrincipal: 'Atividades de apoio à extração de minerais',
    naturezaJuridica: 'Sociedade Empresária Limitada',
    capitalSocial: 500000 + seed * 1000,
    socios: [
      { nome: 'JOÃO DA SILVA', qualificacao: 'Sócio-Administrador', cpfCnpj: null },
      { nome: 'MARIA OLIVEIRA', qualificacao: 'Sócia', cpfCnpj: null },
    ],
    isRuralProducer: seed % 3 === 0,
    cnaeFiscal: seed % 3 === 0 ? '0115600' : '2099101',
    _source: 'Dados ilustrativos (dev) — em produção consulta BrasilAPI / Receita Federal',
  };
}

function formatPhone(raw) {
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return raw;
}

export default router;
