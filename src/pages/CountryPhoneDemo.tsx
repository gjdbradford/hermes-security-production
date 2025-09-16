import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CountryPhoneInput, { type CountryPhoneValue } from '@/components/CountryPhoneInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CountryPhoneDemo() {
  const [value, setValue] = useState<CountryPhoneValue>({
    country: null,
    nationalNumber: '',
    e164: '',
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <Header />

      <div className='container mx-auto px-4 pt-24 pb-16'>
        <Card className='max-w-2xl mx-auto'>
          <CardHeader>
            <CardTitle>Country Phone Input Demo</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Mobile Number</label>
              <CountryPhoneInput value={value} onChange={setValue} placeholder='0761234567' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm text-muted-foreground'>Selected Country</label>
                <Input readOnly value={value.country ? value.country.name : ''} />
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>Prefix</label>
                <Input readOnly value={value.country ? value.country.phonePrefix : ''} />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm text-muted-foreground'>National Number</label>
                <Input readOnly value={value.nationalNumber} />
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>E.164 Output</label>
                <Input readOnly value={value.e164} placeholder='+27769004082' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
