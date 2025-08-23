import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VendorProvider } from "./contexts/VendorContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import { TenantProvider } from "./contexts/TenantContext";
import { AdminProvider } from "./contexts/AdminContext";
import Index from "./pages/Index";
import VendorAuth from "./pages/VendorAuth";
import VendorDashboard from "./pages/VendorDashboard";
import CustomerAuth from "./pages/CustomerAuth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Storefront from "./pages/Storefront";
import NotFound from "./pages/NotFound";
import CustomerOrders from "./pages/CustomerOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TenantProvider>
        <VendorProvider>
          <CustomerProvider>
            <AdminProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/vendor/auth" element={<VendorAuth />} />
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="/admin/auth" element={<AdminAuth />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/store/:vendorSlug" element={<Storefront />} />
                  <Route path="/store/:vendorSlug/auth" element={<CustomerAuth />} />
                  <Route path="/store/:vendorSlug/orders" element={<CustomerOrders />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdminProvider>
          </CustomerProvider>
        </VendorProvider>
      </TenantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
