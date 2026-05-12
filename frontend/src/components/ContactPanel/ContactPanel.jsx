import { useState } from 'react';
import './ContactPanel.css';

export default function ContactPanel({ cnpj, company }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  async function fetchContact() {
    setLoading(true);
    setError(null);
    try {
      const raw = cnpj.replace(/\D/g, '');
      const res = await fetch(`/api/cnpj/${raw}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao buscar contato.');
      setContact(json);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!fetched && !loading) {
    return (
      <div className="contact-trigger">
        <button className="btn-find-contact" onClick={fetchContact}>
          <span>📞</span> Buscar contato do responsável
        </button>
        <span className="contact-source">via Receita Federal / BrasilAPI</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="contact-loading">
        <div className="contact-spinner" />
        <span>Consultando Receita Federal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-error">
        <span>⚠️ {error}</span>
        <button className="btn-retry" onClick={fetchContact}>Tentar novamente</button>
      </div>
    );
  }

  if (!contact) return null;

  const enderecoFormatado = [
    contact.endereco.logradouro,
    contact.endereco.numero,
    contact.endereco.complemento,
    contact.endereco.bairro,
    `${contact.endereco.municipio} — ${contact.endereco.uf}`,
    contact.endereco.cep ? `CEP ${contact.endereco.cep}` : null,
  ].filter(Boolean).join(', ');

  return (
    <div className="contact-panel">
      <div className="contact-header">
        <div>
          <h3 className="contact-company">{contact.razaoSocial}</h3>
          {contact.nomeFantasia && (
            <p className="contact-fantasy">{contact.nomeFantasia}</p>
          )}
        </div>
        <span className={`contact-status ${contact.situacao === 'ATIVA' ? 'status-ativa' : 'status-inativa'}`}>
          {contact.situacao}
        </span>
      </div>

      <div className="contact-grid">
        {contact.email && (
          <ContactItem icon="✉️" label="E-mail">
            <a href={`mailto:${contact.email}`} className="contact-link">
              {contact.email}
            </a>
          </ContactItem>
        )}

        {contact.telefone && (
          <ContactItem icon="📞" label="Telefone">
            <a href={`tel:${contact.telefone.replace(/\D/g, '')}`} className="contact-link">
              {contact.telefone}
            </a>
          </ContactItem>
        )}

        {contact.telefone2 && (
          <ContactItem icon="📱" label="Telefone 2">
            <a href={`tel:${contact.telefone2.replace(/\D/g, '')}`} className="contact-link">
              {contact.telefone2}
            </a>
          </ContactItem>
        )}

        <ContactItem icon="📍" label="Endereço">
          <span>{enderecoFormatado}</span>
        </ContactItem>

        {contact.atividadePrincipal && (
          <ContactItem icon="🏭" label="Atividade Principal">
            <span>{contact.atividadePrincipal}</span>
          </ContactItem>
        )}

        {contact.capitalSocial != null && (
          <ContactItem icon="💰" label="Capital Social">
            <span>{formatCurrency(contact.capitalSocial)}</span>
          </ContactItem>
        )}

        {contact.dataAbertura && (
          <ContactItem icon="📅" label="Fundação">
            <span>{formatDate(contact.dataAbertura)}</span>
          </ContactItem>
        )}
      </div>

      {contact.socios?.length > 0 && (
        <div className="socios-section">
          <h4 className="socios-title">Quadro Societário</h4>
          <div className="socios-list">
            {contact.socios.map((s, i) => (
              <div key={i} className="socio-item">
                <span className="socio-icon">👤</span>
                <div>
                  <p className="socio-nome">{s.nome}</p>
                  <p className="socio-qual">{s.qualificacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="contact-disclaimer">
        {contact._source || 'Dados públicos fornecidos pela Receita Federal via BrasilAPI'}
      </p>
    </div>
  );
}

function ContactItem({ icon, label, children }) {
  return (
    <div className="contact-item">
      <span className="contact-item-icon">{icon}</span>
      <div>
        <span className="contact-item-label">{label}</span>
        <div className="contact-item-value">{children}</div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
