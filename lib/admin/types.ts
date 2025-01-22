export interface AdminStats {
  revenue: {
    total: number;
    growth: number;
    breakdown: {
      period: string;
      amount: number;
    }[];
  };
  orders: {
    total: number;
    growth: number;
    breakdown: {
      status: string;
      count: number;
    }[];
  };
  customers: {
    total: number;
    growth: number;
    active: number;
    new: number;
  };
  inventory: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface InventoryStats {
  products: {
    id: number;
    name: string;
    stock: number;
    reorderPoint: number;
    lastRestocked: string;
  }[];
  summary: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    averageTurnover: number;
  };
}

export interface SalesForecast {
  period: string;
  predictedRevenue: number;
  predictedOrders: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  characteristics: {
    key: string;
    value: string;
  }[];
}

export interface ProductBatchUpdate {
  id: number;
  changes: Partial<Product>;
}

export interface OrderBatchUpdate {
  id: number;
  changes: Partial<Order>;
}

export interface ImportResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: {
    row: number;
    message: string;
  }[];
}

export interface ProductExportFilters {
  category?: string;
  minStock?: number;
  maxStock?: number;
  dateFrom?: string;
  dateTo?: string;
}