import React from 'react';
import { FiX } from 'react-icons/fi';
import type { SalesFilters as SalesFiltersType } from '../../../../types/Sales';
import type { Product } from '../../../../types/Products';
import styles from '../../styles.module.scss';

interface SalesFiltersProps {
  darkMode: boolean;
  filters: SalesFiltersType;
  products: Product[];
  users: any[];
  searchTerm: string;
  onFilterChange: (key: keyof SalesFiltersType, value: string) => void;
  onClearFilters: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  darkMode,
  filters,
  products,
  users,
  searchTerm,
  onFilterChange,
  onClearFilters,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <div className={`${styles.filtersContainer} ${darkMode ? styles.dark : ''}`}>
      <h3 className={`${styles.filtersTitle} ${darkMode ? styles.dark : ''}`}>Filtros</h3>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label>Forma de Contato</label>
          <select
            value={filters.contactMethod || ''}
            onChange={(e) => onFilterChange('contactMethod', e.target.value)}
          >
            <option value="">Todas as formas</option>
            <option value="presencial">Presencial</option>
            <option value="telefone">Ligação</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Estágio</label>
          <select
            value={filters.stage || ''}
            onChange={(e) => onFilterChange('stage', e.target.value)}
          >
            <option value="">Todos os estágios</option>
            <option value="Primeira Visita">Primeira Visita</option>
            <option value="apresentada proposta">Apresentada proposta</option>
            <option value="negociar">Negociar</option>
            <option value="finalizado">Finalizado</option>
            <option value="visita manutenção">Visita manutenção</option>
            <option value="renegociar contrato">Renegociar contrato</option>
            <option value="perdida">Perdida</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo de Produto</label>
          <select
            value={filters.productType || ''}
            onChange={(e) => onFilterChange('productType', e.target.value)}
          >
            <option value="">Todos os produtos</option>
            {products.map(product => (
              <option key={product.id} value={product.name}>{product.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Vendedor</label>
          <select
            value={filters.salesPerson || ''}
            onChange={(e) => onFilterChange('salesPerson', e.target.value)}
          >
            <option value="">Todos os vendedores</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Data Início</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Data Fim</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>
      
      <div className={`${styles.searchContainer} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.searchGroup}>
          <label htmlFor="companySearch">Pesquisar por Empresa</label>
          <input
            type="text"
            id="companySearch"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Digite o nome da empresa..."
            className={darkMode ? styles.dark : ''}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={onClearSearch}
              aria-label="Limpar pesquisa"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.filterActions}>
        <button className={`${styles.clearButton} ${darkMode ? styles.dark : ''}`} onClick={onClearFilters}>
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};