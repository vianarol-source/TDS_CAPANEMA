import { useState } from 'react';
import styles from './ContactPanel.module.css';

export default function ContactPanel({ cnpj, company, isRuralProducer }) {
  const [contact, setContact] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCar, setLoadingCar] = useState(false);
  const [error, setError] = useState(null);
  const [errorCar, setErrorCar] = useState(null);
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

      // Se identificado como produtor rural (por atividade ou CNAE), já busca o CAR
      if (isRuralProducer || json.isRuralProducer) {
        fetchCAR(raw);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCAR(doc) {
    setLoadingCar(true);
    setErrorCar(null);
    try {
      const raw = (doc || cnpj).replace(/\D/g, '');
      const res = await fetch(`/api/car/${raw}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao consultar CAR.');
      setCar(json);
    } catch (err) {
      setErrorCar(err.message);
    } finally {
      setLoadingCar(false);
    }
  }

  if (!fetched && !loading) {
    return (
      <div className={styles.contactTrigger}>
        <button className={styles.btnFindContact} onClick={fetchContact}>
          <span>📞</span> Buscar contato do responsável
        </button>
        <span className={styles.contactSource}>via Receita Federal / BrasilAPI</span>
        {isRuralProducer && (
          <span className={styles.contactRuralHint}>
            🌾 Produtor Rural — também consultará o CAR/SICAR
          </span>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.contactLoading}>
        <div className={styles.contactSpinner} />
        <span>Consultando Receita Federal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contactError}>
        <span>⚠️ {error}</span>
        <button className={styles.btnRetry} onClick={fetchContact}>Tentar novamente</button>
      </div>
    );
  }

  if (!contact) return null;

  const isRural = isRuralProducer || contact.isRuralProducer;

  const enderecoFormatado = [
    contact.endereco.logradouro,
    contact.endereco.numero,
    contact.endereco.complemento,
    contact.endereco.bairro,
    `${contact.endereco.municipio} — ${contact.endereco.uf}`,
    contact.endereco.cep ? `CEP ${contact.endereco.cep}` : null,
  ].filter(Boolean).join(', ');

  return (
    <div className={styles.contactPanel}>
      <div className={styles.contactHeader}>
        <div>
          <h3 className={styles.contactCompany}>
            {contact.razaoSocial}
            {isRural && <span className={styles.contactRuralTag}>🌾 Produtor Rural</span>}
          </h3>
          {contact.nomeFantasia && (
            <p className={styles.contactFantasy}>{contact.nomeFantasia}</p>
          )}
        </div>
        <span className={`${styles.contactStatus} ${contact.situacao === 'ATIVA' ? styles.statusAtiva : styles.statusInativa}`}>
          {contact.situacao}
        </span>
      </div>

      <div className={styles.contactGrid}>
        {contact.email && (
          <ContactItem icon="✉️" label="E-mail">
            <a href={`mailto:${contact.email}`} className={styles.contactLink}>{contact.email}</a>
          </ContactItem>
        )}
        {contact.telefone && (
          <ContactItem icon="📞" label="Telefone">
            <a href={`tel:${contact.telefone.replace(/\D/g, '')}`} className={styles.contactLink}>{contact.telefone}</a>
          </ContactItem>
        )}
        {contact.telefone2 && (
          <ContactItem icon="📱" label="Telefone 2">
            <a href={`tel:${contact.telefone2.replace(/\D/g, '')}`} className={styles.contactLink}>{contact.telefone2}</a>
          </ContactItem>
        )}
        <ContactItem icon="📍" label="Endereço">
          <span>{enderecoFormatado}</span>
        </ContactItem>
        {contact.atividadePrincipal && (
          <ContactItem icon="🏭" label="Atividade Principal (CNAE)">
            <span>{contact.cnaeFiscal && <code className={styles.cnaeCode}>{contact.cnaeFiscal}</code>} {contact.atividadePrincipal}</span>
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
        <div className={styles.sociosSection}>
          <h4 className={styles.sociosTitle}>Quadro Societário</h4>
          <div className={styles.sociosList}>
            {contact.socios.map((s, i) => (
              <div key={i} className={styles.socioItem}>
                <span className={styles.socioIcon}>👤</span>
                <div>
                  <p className={styles.socioNome}>{s.nome}</p>
                  <p className={styles.socioQual}>{s.qualificacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção CAR — Cadastro Ambiental Rural */}
      {isRural && (
        <div className={styles.carSection}>
          <div className={styles.carHeader}>
            <h4 className={styles.carTitle}>🌿 CAR — Cadastro Ambiental Rural</h4>
            {!car && !loadingCar && !errorCar && (
              <button className={styles.btnCar} onClick={() => fetchCAR(cnpj)}>
                Consultar imóveis no SICAR
              </button>
            )}
          </div>

          {loadingCar && (
            <div className={styles.contactLoading}>
              <div className={styles.contactSpinner} />
              <span>Consultando SICAR / Serviço Florestal Brasileiro...</span>
            </div>
          )}

          {errorCar && (
            <div className={styles.contactError}>
              <span>⚠️ {errorCar}</span>
              <button className={styles.btnRetry} onClick={() => fetchCAR(cnpj)}>Tentar novamente</button>
            </div>
          )}

          {car && (
            <>
              {car.imoveis?.length === 0 ? (
                <p className={styles.carEmpty}>Nenhum imóvel rural cadastrado no CAR para este CPF/CNPJ.</p>
              ) : (
                <div className={styles.carImoveis}>
                  {car.imoveis.map((im, i) => {
                    const sitClass = situacaoClass(im.situacao);
                    const carImovelClass = sitClass === 'cancelado'
                      ? `${styles.carImovel} ${styles.carImovelCancelado}`
                      : styles.carImovel;
                    const carSituacaoClass = sitClass === 'ativo'
                      ? `${styles.carSituacao} ${styles.carSituacaoAtivo}`
                      : sitClass === 'cancelado'
                        ? `${styles.carSituacao} ${styles.carSituacaoCancelado}`
                        : `${styles.carSituacao} ${styles.carSituacaoPendente}`;
                    return (
                      <div key={i} className={carImovelClass}>
                        <div className={styles.carImovelHeader}>
                          <span className={styles.carCodigo}>{im.codigoCar}</span>
                          <span className={carSituacaoClass}>
                            {im.situacao}
                          </span>
                        </div>
                        <div className={styles.carImovelDetails}>
                          {im.municipio && <span>📍 {im.municipio} — {im.uf}</span>}
                          {im.area != null && <span>📐 {Number(im.area).toLocaleString('pt-BR')} ha</span>}
                          {im.modulos != null && <span>🔲 {im.modulos} módulos fiscais</span>}
                          {im.tipo && <span>🏷️ {im.tipo}</span>}
                          {im.dataInscricao && <span>📅 Inscrito em {formatDate(im.dataInscricao)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className={styles.contactDisclaimer}>{car._source || 'SICAR / Serviço Florestal Brasileiro'}</p>
            </>
          )}
        </div>
      )}

      <p className={styles.contactDisclaimer}>
        {contact._source || 'Dados públicos fornecidos pela Receita Federal via BrasilAPI'}
      </p>
    </div>
  );
}

function ContactItem({ icon, label, children }) {
  return (
    <div className={styles.contactItem}>
      <span className={styles.contactItemIcon}>{icon}</span>
      <div>
        <span className={styles.contactItemLabel}>{label}</span>
        <div className={styles.contactItemValue}>{children}</div>
      </div>
    </div>
  );
}

function situacaoClass(situacao) {
  if (!situacao) return 'pendente';
  const s = situacao.toLowerCase();
  if (s.includes('ativo') || s.includes('ativa')) return 'ativo';
  if (s.includes('cancel')) return 'cancelado';
  return 'pendente';
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
