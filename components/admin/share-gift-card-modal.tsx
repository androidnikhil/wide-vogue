'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Share2, Download } from 'lucide-react';
import { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { APP_NAME } from '@/lib/constants';

interface ShareGiftCardModalProps {
  giftCard: {
    code: string;
    balance: string | number;
    initialValue: string | number;
  };
}

export default function ShareGiftCardModal({ giftCard }: ShareGiftCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
      
      const link = document.createElement('a');
      link.download = `MadhavShringaar-GiftCard-${giftCard.code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className="flex gap-2">
          <Share2 className='w-4 h-4' /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md bg-surface'>
        <DialogHeader>
          <DialogTitle>Share Gift Card</DialogTitle>
          <DialogDescription>
            Download this beautiful gift card image and send it to your customer via WhatsApp or Email.
          </DialogDescription>
        </DialogHeader>
        
        <div className='flex items-center justify-center py-4 overflow-hidden'>
          {/* The Actual Shareable Card - We give it a fixed width and high contrast for image generation */}
          <div 
            ref={cardRef} 
            className='relative w-[400px] h-[220px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 border border-[#825500]/20'
            style={{
                background: 'linear-gradient(135deg, #fdf9f0 0%, #e6e2d9 100%)',
                color: '#00190f'
            }}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#825500] opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#003020] opacity-10 blur-3xl"></div>

            {/* Header: Logo and Value */}
            <div className='relative z-10 flex justify-between items-start'>
              <div>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ" alt={APP_NAME} className="h-10 w-auto object-contain drop-shadow-sm" />
                <p className='text-xs mt-1 text-[#414944]'>info@madhavshringaar.com</p>
              </div>
              <div className='text-right'>
                <p className='text-xs font-semibold text-[#825500] uppercase tracking-wider mb-1'>Gift Card</p>
                <p className='text-3xl font-bold text-[#00190f]'>{formatCurrency(giftCard.initialValue)}</p>
              </div>
            </div>

            {/* Footer: Code and Website */}
            <div className='relative z-10 flex justify-between items-end mt-6'>
              <div>
                <p className='text-[10px] text-[#825500] uppercase tracking-widest mb-1'>Redeem Code</p>
                <div className='bg-[#00190f]/5 px-3 py-1.5 rounded-lg border border-[#00190f]/10 backdrop-blur-sm'>
                  <p className='font-mono font-bold text-lg tracking-wider text-[#00190f]'>{giftCard.code}</p>
                </div>
              </div>
              <div className='text-right'>
                 <p className='text-[10px] text-[#414944]'>Redeem at</p>
                 <p className='text-xs font-semibold text-[#00190f]'>madhavshringaar.com</p>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleDownload} disabled={isDownloading} className='w-full' size="lg">
          {isDownloading ? 'Generating Image...' : <><Download className='w-4 h-4 mr-2'/> Download Image</>}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
