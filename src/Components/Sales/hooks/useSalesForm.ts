import { useState } from 'react';
import type { Sale } from '../../../types/Sales';
import type { Prospection } from '../../../types/Prospections';
import { salesService } from '../../../services/SalesService/SalesService';

interface FormDataState {
  date: string;
  company: string;
  type: string;
  contactName: string;
  contactMethod: 'presencial' | 'telefone' | 'email' | 'whatsapp';
  products: Array<{
    id: string;
    productType: string;
    periodicidade: 'anual' | 'mensal';
    valor: string;
    stage: string;
    pgrLtcat?: string;
  }>;
  comments: string;
  salesPerson: string;
  statusFechado: boolean;
  lifes: number;
  cnpj: string;
  vendedor: string;
  contatoTelefone: string;
  contatoEmail: string;
  contatoWhatsapp: string;
  contatoPresencial: string;
}

export const useSalesForm = (
  currentUser: any,
  editingSale: Sale | null,
  onSuccess: () => void,
  onClose: () => void
) => {
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormDataState>({
    date: new Date().toLocaleDateString('pt-BR'),
    company: '',
    type: 'Em negociação',
    contactName: '',
    contactMethod: 'presencial',
    products: [{
      id: Date.now().toString(),
      productType: '',
      periodicidade: 'anual',
      valor: '',
      stage: 'apresentada proposta',
      pgrLtcat: ''
    }],
    comments: '',
    salesPerson: currentUser?.id || '',
    statusFechado: false,
    lifes: 0,
    cnpj: '',
    vendedor: currentUser?.id || '',
    contatoTelefone: '',
    contatoEmail: '',
    contatoWhatsapp: '',
    contatoPresencial: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        id: Date.now().toString(),
        productType: '',
        periodicidade: 'anual',
        valor: '',
        stage: 'apresentada proposta',
        pgrLtcat: ''
      }]
    }));
  };

  const removeProduct = (productId: string) => {
    if (formData.products.length === 1) {
      alert('É necessário ter pelo menos um produto na venda.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  const updateProduct = (productId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === productId
          ? { ...product, [field]: value }
          : product
      )
    }));
  };

  const handleProspectionSelect = (prospection: Prospection) => {
    setFormData(prev => ({
      ...prev,
      company: prospection.companyName,
      contactName: prospection.contactName,
      contatoEmail: prospection.contactEmail || '',
      contatoWhatsapp: prospection.contactPhone || '',
      contatoTelefone: prospection.contactPhone || '',
      comments: prospection.notes || '',
      vendedor: prospection.assignedTo || currentUser?.id || '',
      salesPerson: prospection.assignedTo || currentUser?.id || '',
      lifes: 0,
      products: [{
        ...prev.products[0],
        productType: prospection.productType || '',
      }]
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.company || !formData.contactName) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  for (let i = 0; i < formData.products.length; i++) {
    const product = formData.products[i];
    
    if (!product.productType) {
      alert(`Por favor, selecione o tipo de produto para o item ${i + 1}.`);
      return;
    }
    
    if (product.productType === 'Medicina do Trabalho' && !product.pgrLtcat) {
      alert(`Por favor, informe o valor do PGR/LTCAT para o produto ${i + 1} (Medicina do Trabalho).`);
      return;
    }
  }

  setSubmitting(true);

  try {
    const stagesOrder = ['Primeira Visita', 'apresentada proposta', 'negociar', 'fechar proposta', 'finalizado', 'visita manutenção', 'renegociar contrato', 'perdida'];
    const minStageIndex = Math.min(...formData.products.map(p => stagesOrder.indexOf(p.stage)));
    const mainStage = stagesOrder[minStageIndex] || 'apresentada proposta';

    const totalValor = formData.products.reduce((total, p) => {
      const valorNumerico = parseFloat(p.valor.replace(/\./g, '').replace(',', '.'));
      return total + (isNaN(valorNumerico) ? 0 : valorNumerico);
    }, 0);

    const productsToSave = formData.products.map(p => ({
      id: p.id,
      productType: p.productType,
      periodicidade: p.periodicidade,
      valor: p.valor,
      stage: p.stage,
      pgrLtcat: p.pgrLtcat || ''
    }));

    console.log('📦 Produtos para salvar:', productsToSave);

    const saleData = {
      date: formData.date,
      companyName: formData.company,
      type: 'Em negociação' as const,
      contactName: formData.contactName,
      contactMethod: formData.contactMethod,
      stage: mainStage as any,
      cnpj: formData.cnpj,
      productType: formData.products.map(p => p.productType).join(', '),
      products: productsToSave,  // <-- ISSO É CRUCIAL! Estava faltando?
      comments: formData.comments,
      salesPerson: formData.salesPerson,
      lifes: Number(formData.lifes),
      result: mainStage === 'finalizado' ? 'Finalizado' : (mainStage === 'perdida' ? 'Perdida' : 'Negociação em andamento'),
      statusFechado: formData.statusFechado,
      vendedor: formData.vendedor,
      contatoTelefone: formData.contatoTelefone,
      contatoEmail: formData.contatoEmail,
      contatoWhatsapp: formData.contatoWhatsapp,
      contatoPresencial: formData.contatoPresencial,
      valor: totalValor.toString(),
      periodicidade: 'anual'
    };

    console.log('📦 Dados completos para salvar:', saleData);

    if (editingSale) {
      await salesService.updateSale(editingSale.id, saleData as any);
    } else {
      await salesService.addSale(saleData as any);
    }

    onSuccess();
    onClose();
  } catch (error) {
    console.error('Erro ao salvar venda:', error);
    alert('Erro ao salvar venda. Tente novamente.');
  } finally {
    setSubmitting(false);
  }
};

  const resetForm = () => {
    setFormData({
      date: new Date().toLocaleDateString('pt-BR'),
      company: '',
      type: 'Em negociação',
      contactName: '',
      contactMethod: 'presencial',
      products: [{
        id: Date.now().toString(),
        productType: '',
        periodicidade: 'anual',
        valor: '',
        stage: 'apresentada proposta',
        pgrLtcat: ''
      }],
      comments: '',
      salesPerson: currentUser?.id || '',
      statusFechado: false,
      lifes: 0,
      cnpj: '',
      vendedor: currentUser?.id || '',
      contatoTelefone: '',
      contatoEmail: '',
      contatoWhatsapp: '',
      contatoPresencial: '',
    });
  };

 const setEditingData = (sale: Sale) => {
  console.log('Editando venda:', sale);
  
  let products = [];
  
  if (sale.products && Array.isArray(sale.products) && sale.products.length > 0) {
    // Se já tem produtos no formato array
    products = sale.products.map(p => ({
      id: p.id || Date.now().toString(),
      productType: p.productType || '',
      periodicidade: p.periodicidade || 'anual',
      valor: p.valor || '',
      stage: p.stage || 'apresentada proposta',
      pgrLtcat: p.pgrLtcat || ''  // Carrega o valor do PGR/LTCAT
    }));
    console.log('Produtos carregados do sale.products:', products);
  } else {
    // Compatibilidade com dados antigos (formato único)
    products = [{
      id: Date.now().toString(),
      productType: sale.productType || '',
      periodicidade: sale.periodicidade || 'anual',
      valor: sale.valor || '',
      stage: sale.stage === "fechado" ? "finalizado" : sale.stage,
      pgrLtcat: ''  // Dados antigos não têm PGR/LTCAT
    }];
    console.log('Produtos criados do formato antigo:', products);
  }

  setFormData({
    date: sale.date,
    company: sale.companyName,
    type: sale.type,
    contactName: sale.contactName,
    contactMethod: sale.contactMethod,
    products: products,
    comments: sale.comments,
    salesPerson: sale.salesPerson,
    statusFechado: sale.statusFechado,
    lifes: sale.lifes,
    cnpj: sale.cnpj || '',
    vendedor: sale.vendedor,
    contatoTelefone: sale.contatoTelefone || '',
    contatoEmail: sale.contatoEmail || '',
    contatoWhatsapp: sale.contatoWhatsapp || '',
    contatoPresencial: sale.contatoPresencial || '',
  });
};

  return {
    formData,
    submitting,
    handleFormChange,
    handleProspectionSelect,
    handleSubmit,
    resetForm,
    setEditingData,
    addProduct,
    removeProduct,
    updateProduct
  };
};