import { Card } from '@/components/ui/card';
import { BarChart, DollarSign, Package, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">$45,231.89</p>
              <p className="text-sm text-green-600">+20.1% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">2,345</p>
              <p className="text-sm text-green-600">+12.3% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">1,789</p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">3.24%</p>
              <p className="text-sm text-red-600">-1.2% from last month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}