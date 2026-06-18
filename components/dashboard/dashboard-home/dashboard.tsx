import { BillingHealth } from "@/components/dashboard/dashboard-home/billing-health";
import { ChannelSalesChart } from "@/components/dashboard/dashboard-home/channel-sales-chart";
import { DashboardActivity } from "@/components/dashboard/dashboard-home/dashboard-activity";
import { DashboardInvoices } from "@/components/dashboard/dashboard-home/dashboard-invoices";
import { NetRevenueChart } from "@/components/dashboard/dashboard-home/net-revenue-chart";
import { DashboardStats } from "@/components/dashboard/dashboard-home/stats";

export function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <NetRevenueChart />
      <ChannelSalesChart />
      <DashboardInvoices />
      <BillingHealth />
      <DashboardActivity />
    </div>
  );
}
