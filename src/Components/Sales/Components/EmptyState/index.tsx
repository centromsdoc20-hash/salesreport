import React from 'react';
import styles from '../../styles.module.scss';

interface EmptyStateProps {
  darkMode: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  darkMode,
  hasFilters,
  onClearFilters
}) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9H21M9 21V9M5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z"
            stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <h3 className={styles.emptyStateTitle}>Nenhuma venda encontrada</h3>
      <p className={styles.emptyStateDescription}>
        {hasFilters
          ? "Tente ajustar os filtros para ver mais resultados."
          : "Comece adicionando sua primeira venda usando o botão acima."
        }
      </p>
      {hasFilters && (
        <button
          className={`${styles.emptyStateButton} ${darkMode ? styles.dark : ''}`}
          onClick={onClearFilters}
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
};