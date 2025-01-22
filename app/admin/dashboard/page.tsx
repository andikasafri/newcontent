'use client';

import { withAuth } from '@/lib/hoc/withAuth';
import { Card } from '@/components/ui/card';
import { BarChart, DollarSign, Package, Users, TrendingUp, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAdminStats } from '@/lib/admin/api';
import { AdminStats } from '@/lib/admin/types';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesForecastChart } from '@/components/admin/analytics/sales-forecast';
import { CustomerSegments } from '@/components/admin/analytics/customer-segments';
import { InventoryManagement } from '@/components/admin/inventory/inventory-management';

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${stats.revenue.total.toFixed(2)}`}
            change={`${stats.revenue.growth > 0 ? '+' : ''}${stats.revenue.growth}%`}
            trend={stats.revenue.growth >= 0 ? 'up' : 'down'}
            icon={DollarSign}
          />
          <StatsCard
            title="Total Orders"
            value={stats.orders.total}
            change={`${stats.orders.growth > 0 ? '+' : ''}${stats.orders.growth}%`}
            trend={stats.orders.growth >= 0 ? 'up' : 'down'}
            icon={ShoppingBag}
          />
          <StatsCard
            title="Total Customers"
            value={stats.customers.total}
            change={`${stats.customers.growth > 0 ? '+' : ''}${stats.customers.growth}%`}
            trend={stats.customers.growth >= 0 ? 'up' : 'down'}
            icon={Users}
          />
          <StatsCard
            title="Inventory Status"
            value={`${stats.inventory.total - stats.inventory.outOfStock}/${stats.inventory.total}`}
            change={`${stats.inventory.lowStock} low stock`}
            trend={stats.inventory.lowStock > 10 ? 'down' : 'up'}
            icon={Package}
          />
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Revenue Breakdown</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenue.breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesForecastChart />
          <CustomerSegments />
        </div>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6">
        <InventoryManagement />
      </TabsContent>
    </div>
  );
}

function StatsCard({ title, value, change, trend, icon: Icon }) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-[400px]" />
      </Card>
    </div>
  );
}

export default withAuth(AdminDashboard, { requireAdmin: true });