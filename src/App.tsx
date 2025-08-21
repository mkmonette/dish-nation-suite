import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VendorProvider } from "./contexts/VendorContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import { TenantProvider } from "./contexts/TenantContext";
import Index from "./pages/Index";
import VendorAuth from "./pages/VendorAuth";
import VendorDashboard from "./pages/VendorDashboard";
import CustomerAuth from "./pages/CustomerAuth";
import Storefront from "./pages/Storefront";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TenantProvider>
        <VendorProvider>
          <CustomerProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/vendor/auth" element={<VendorAuth />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/store/:vendorSlug" element={<Storefront />} />
                <Route path="/store/:vendorSlug/auth" element={<CustomerAuth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CustomerProvider>
        </VendorProvider>
      </TenantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
