import React from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import ProspectionSearch from '../../../ProspectionSearch';
import type { Product } from '../../../../types/Products';
import type { Prospection } from '../../../../types/Prospections';
import { formatDateToISO, formatDateToBR } from '../../utils/dateUtils';
import styles from '../../styles.module.scss';

interface SalesModalProps {
  darkMode: boolean;
  isOpen: boolean;
  editingSale: any;
  submitting: boolean;
  formData: any;
  products: Product[];
  users: any[];
  currentUser: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onProspectionSelect: (prospection: Prospection) => void;
  addProduct: () => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, field: string, value: string) => void;
}

export const SalesModal: React.FC<SalesModalProps> = ({
  darkMode,
  isOpen,
  editingSale,
  submitting,
  formData,
  products,
  users,
  currentUser,
  onClose,
  onSubmit,
  onFormChange,
  onProspectionSelect,
  addProduct,
  removeProduct,
  updateProduct
}) => {
  if (!isOpen) return null;

  const isMedicinaTrabalho = (productType: string): boolean => {
    return productType === 'Medicina do Trabalho';
  };

  /**
   * Handler específico para o campo de data
   * Converte o valor do input (ISO) para o formato brasileiro antes de salvar
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const isoDate = e.target.value; // Formato ISO (YYYY-MM-DD)
    const brDate = formatDateToBR(isoDate); // Converte para DD/MM/YYYY
    
    // Cria um evento sintético com o valor convertido
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'date',
        value: brDate
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onFormChange(syntheticEvent);
  };

  return (
    <div className={`${styles.modalOverlay} ${darkMode ? styles.dark : ''}`}>
      <div className={`${styles.modal} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.modalHeader}>
          <h2 className={`${styles.modalTitle} ${darkMode ? styles.dark : ''}`}>
            {editingSale ? 'Editar Venda' : 'Nova Venda'}
          </h2>
          <button
            className={`${styles.closeButton} ${darkMode ? styles.dark : ''}`}
            onClick={onClose}
            disabled={submitting}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.modalForm}>
          {!editingSale && (
            <ProspectionSearch
              darkMode={darkMode}
              onSelectProspection={onProspectionSelect}
              currentUser={currentUser}
            />
          )}
          
          {/* Campos básicos */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Data *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formatDateToISO(formData.date || '')} // Garante formato ISO para o input
                onChange={handleDateChange} // Converte de volta para BR
                required
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Tipo *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={onFormChange}
                required
                disabled={true}
                className={darkMode ? styles.dark : ''}
              >
                <option value="Em negociação">Em negociação</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Nome da Empresa *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={onFormChange}
              placeholder="Digite o nome da empresa"
              required
              disabled={submitting}
              className={darkMode ? styles.dark : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={onFormChange}
              placeholder="Digite o CNPJ"
              disabled={submitting}
              className={darkMode ? styles.dark : ''}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="lifes">Número de Vidas</label>
              <input
                type="number"
                id="lifes"
                name="lifes"
                value={formData.lifes}
                onChange={onFormChange}
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              />
            </div>
          </div>

          {/* Seção de Produtos */}
          <div className={styles.productsSection}>
            <div className={styles.productsHeader}>
              <label className={styles.productsLabel}>Produtos/Serviços *</label>
              <button
                type="button"
                className={`${styles.addProductButton} ${darkMode ? styles.dark : ''}`}
                onClick={addProduct}
                disabled={submitting}
              >
                <FiPlus size={16} />
                Adicionar Produto
              </button>
            </div>
            
            {formData.products?.map((product: any, index: number) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productCardHeader}>
                  <h4 className={styles.productTitle}>Produto {index + 1}</h4>
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      className={`${styles.removeProductButton} ${darkMode ? styles.dark : ''}`}
                      onClick={() => removeProduct(product.id)}
                      disabled={submitting}
                    >
                      <FiTrash2 size={14} />
                      Remover
                    </button>
                  )}
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`productType-${product.id}`}>Tipo de Produto *</label>
                    <select
                      id={`productType-${product.id}`}
                      value={product.productType}
                      onChange={(e) => updateProduct(product.id, 'productType', e.target.value)}
                      required
                      disabled={submitting}
                      className={darkMode ? styles.dark : ''}
                    >
                      <option value="">Selecione um produto</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`stage-${product.id}`}>Estágio *</label>
                    <select
                      id={`stage-${product.id}`}
                      value={product.stage}
                      onChange={(e) => updateProduct(product.id, 'stage', e.target.value)}
                      required
                      disabled={submitting}
                      className={darkMode ? styles.dark : ''}
                    >
                      <option value="Primeira Visita">Primeira Visita</option>
                      <option value="apresentada proposta">Apresentada proposta</option>
                      <option value="sondagem">Sondagem</option> 
                      <option value="negociar">Negociar</option>
                      <option value="fechar proposta">Fechar proposta</option>
                      <option value="finalizado">Finalizado</option>
                      <option value="visita manutenção">Visita manutenção</option>
                      <option value="renegociar contrato">Renegociar contrato</option>
                      <option value="perdida">Perdida</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`periodicidade-${product.id}`}>Periodicidade</label>
                    <select
                      id={`periodicidade-${product.id}`}
                      value={product.periodicidade}
                      onChange={(e) => updateProduct(product.id, 'periodicidade', e.target.value)}
                      disabled={submitting}
                      className={darkMode ? styles.dark : ''}
                    >
                      <option value="anual">Anual</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`valor-${product.id}`}>Valor (R$)</label>
                    <input
                      type="text"
                      id={`valor-${product.id}`}
                      value={product.valor}
                      onChange={(e) => updateProduct(product.id, 'valor', e.target.value)}
                      placeholder="Digite o valor"
                      disabled={submitting}
                      className={darkMode ? styles.dark : ''}
                    />
                  </div>
                </div>

                {isMedicinaTrabalho(product.productType) && (
             <div className={styles.medicinaFields}>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label htmlFor={`pgrLtcat-${product.id}`}>Valor do PGR/LTCAT *</label>
        <input
          type="text"
          id={`pgrLtcat-${product.id}`}
          value={product.pgrLtcat || ''}
          onChange={(e) => updateProduct(product.id, 'pgrLtcat', e.target.value)}
          placeholder="Valor do PGR/LTCAT"
          required
          disabled={submitting}
          className={darkMode ? styles.dark : ''}
        />
      </div>
    </div>
  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contactMethod">Forma de Contato *</label>
              <select
                id="contactMethod"
                name="contactMethod"
                value={formData.contactMethod}
                onChange={onFormChange}
                required
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              >
                <option value="presencial">Presencial</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telefone">Ligação</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="vendedor">Vendedor Responsável</label>
            <select
              id="vendedor"
              name="vendedor"
              value={formData.vendedor}
              onChange={onFormChange}
              disabled={submitting}
              className={darkMode ? styles.dark : ''}
            >
              <option value="">Selecione um vendedor</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} {user.lastName}</option>
              ))}
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contactName">Nome do Contato *</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={onFormChange}
                placeholder="Digite o nome do contato"
                required
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contatoEmail">E-mail</label>
              <input
                type="email"
                id="contatoEmail"
                name="contatoEmail"
                value={formData.contatoEmail}
                onChange={onFormChange}
                placeholder="email@empresa.com"
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contatoWhatsapp">Telefone/WhatsApp</label>
              <input
                type="text"
                id="contatoWhatsapp"
                name="contatoWhatsapp"
                value={formData.contatoWhatsapp}
                onChange={onFormChange}
                placeholder="(00) 00000-0000"
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contatoPresencial">Endereço:</label>
              <input
                type="text"
                id="contatoPresencial"
                name="contatoPresencial"
                value={formData.contatoPresencial}
                onChange={onFormChange}
                placeholder="Endereço ou local de reunião"
                disabled={submitting}
                className={darkMode ? styles.dark : ''}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comments">Comentário</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={onFormChange}
              placeholder="Digite observações sobre a venda..."
              rows={3}
              disabled={submitting}
              className={darkMode ? styles.dark : ''}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.cancelButton} ${darkMode ? styles.dark : ''}`}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.saveButton} ${darkMode ? styles.dark : ''}`}
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : (editingSale ? 'Salvar Alterações' : 'Criar Venda')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};