// Manual migration script - run this once to update vendor template data
import { vendorStorage } from '@/lib/storage';

// Get all vendors
const vendors = vendorStorage.getAll();

console.log('Found vendors:', vendors.length);

vendors.forEach(vendor => {
  if (vendor.storefront?.template !== 'basic') {
    console.log(`Updating vendor ${vendor.slug} from template "${vendor.storefront?.template}" to "basic"`);
    
    // Update vendor with basic template
    const updated = vendorStorage.update(vendor.id, {
      storefront: {
        ...vendor.storefront,
        template: 'basic'
      }
    });
    
    if (updated) {
      console.log(`✅ Successfully updated ${vendor.slug}`);
    } else {
      console.log(`❌ Failed to update ${vendor.slug}`);
    }
  } else {
    console.log(`✅ Vendor ${vendor.slug} already uses basic template`);
  }
});

console.log('Migration completed!');