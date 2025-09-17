import { vendorStorage } from '@/lib/storage';

export const migrateVendorTemplates = () => {
  const vendors = vendorStorage.getAll();
  
  vendors.forEach(vendor => {
    if (vendor.storefront?.template !== 'basic') {
      console.log(`Migrating vendor ${vendor.slug} from ${vendor.storefront?.template} to basic`);
      
      // Update template to basic
      vendorStorage.update(vendor.id, {
        storefront: {
          ...vendor.storefront,
          template: 'basic'
        }
      });
    }
  });
  
  console.log('Template migration completed');
};