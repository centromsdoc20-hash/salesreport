import { useState, useEffect } from 'react';
import type { Sale, SalesFilters } from '../../../types/Sales';
import { salesService } from '../../../services/SalesService/SalesService';
import { productsService } from '../../../services/ProductService/ProductService';
import type { Product } from '../../../types/Products';

export const useSales = ( users: any[]) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SalesFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSales = async () => {
    try {
      setLoading(true);
      const salesData = await salesService.getSales();
      const sortedSales = salesData.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
      setSales(sortedSales);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await productsService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) {
      return false;
    }

    try {
      await salesService.deleteSale(saleId);
      await loadSales();
      return true;
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      alert('Erro ao excluir venda. Tente novamente.');
      return false;
    }
  };

  const handleFilterChange = (key: keyof SalesFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredSales = sales.filter(sale => {
    if (searchTerm && !sale.companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.stage && sale.stage !== filters.stage) return false;
    if (filters.salesPerson && sale.salesPerson !== filters.salesPerson) return false;
    if (filters.productType && sale.productType !== filters.productType) return false;
    if (filters.type && sale.type !== filters.type) return false;
    if (filters.contactMethod && sale.contactMethod !== filters.contactMethod) return false;
    if (filters.startDate && new Date(sale.date.split('/').reverse().join('-')) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(sale.date.split('/').reverse().join('-')) > new Date(filters.endDate)) return false;
    
    return true;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  const getUserName = (userId: string, sale?: Sale) => {
    if (sale?.sellerInfo?.fullName) {
      return sale.sellerInfo.fullName;
    }
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} ${user.lastName}` : userId;
  };

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  return {
    sales,
    products,
    loading,
    filters,
    currentPage,
    searchTerm,
    filteredSales,
    currentSales,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    setCurrentPage,
    handleFilterChange,
    clearFilters,
    handleSearchChange,
    handleDeleteSale,
    loadSales,
    getUserName
  };
};