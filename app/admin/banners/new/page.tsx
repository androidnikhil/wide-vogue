import { Metadata } from 'next';
import BannerForm from './banner-form';

export const metadata: Metadata = {
  title: 'Add New Banner',
};

export default function NewBannerPage() {
  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <h2 className='text-2xl font-bold tracking-tight'>Add New Banner</h2>
      <BannerForm />
    </div>
  );
}
