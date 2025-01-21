import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/types';

// This would come from your API
const orders: Order[] = [
  {
    id: 1,
    userId: 1,
    items: [],
    total: 299.99,
    status: 'processing',
    createdAt: '2024-03-20T10:00:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
    },
    paymentMethod: 'credit_card',
    trackingNumber: 'TRK123456789',
  },
  // Add more mock orders as needed
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tracking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[order.status]}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.trackingNumber || 'Not available'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}