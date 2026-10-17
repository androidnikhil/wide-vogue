'use client';

import { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  Copy, 
  Check, 
  ShieldCheck, 
  Search, 
  Loader2, 
  MessageCircle,
  AlertCircle,
  CreditCard,
  Lock,
  Download,
  HelpCircle,
  Sparkle
} from 'lucide-react';
import CopyButton from '@/components/shared/copy-button';
import { toast } from 'sonner';
import { 
  checkGiftCardBalance, 
  redeemGiftCardToAccount, 
  createRazorpayGiftCardOrder,
  verifyAndCreatePaidGiftVoucher
} from '@/lib/actions/giftcard.actions';

interface GiftCardHubProps {
  bhaktiPoints: number;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  isAdmin?: boolean;
}

// Dynamic script loader for Razorpay Checkout
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function GiftCardHub({ 
  bhaktiPoints, 
  userName, 
  userEmail = '', 
  userPhone = '',
  isAdmin = false 
}: GiftCardHubProps) {
  const [isPending, startTransition] = useTransition();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Check / Redeem Form State
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherPin, setVoucherPin] = useState('');
  const [verifiedCard, setVerifiedCard] = useState<{
    code: string;
    balance: number;
    initialValue: number;
    isFullyUsed: boolean;
    expiresAt: string | null;
  } | null>(null);

  // Send Gift Voucher State
  const [selectedAmount, setSelectedAmount] = useState(501);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [blessingMessage, setBlessingMessage] = useState('May Shri Laddu Gopal Ji shower eternal grace upon your sacred home altar.');
  const [isPaying, setIsPaying] = useState(false);
  const [createdVoucher, setCreatedVoucher] = useState<{
    code: string;
    amount: number;
    shareMessage: string;
    recipientName: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const pointsValueInRupees = (bhaktiPoints * 0.1).toFixed(0);

  // Handle Check Balance
  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      toast.error('Please enter a gift voucher code');
      return;
    }

    startTransition(async () => {
      const res = await checkGiftCardBalance(voucherCode);
      if (res.success && res.data) {
        setVerifiedCard(res.data);
        toast.success(res.message);
      } else {
        setVerifiedCard(null);
        toast.error(res.message || 'Invalid voucher code');
      }
    });
  };

  // Handle Claim to Bhakti Points
  const handleClaimBalance = () => {
    if (!verifiedCard?.code) return;

    startTransition(async () => {
      const res = await redeemGiftCardToAccount(verifiedCard.code);
      if (res.success) {
        toast.success(res.message);
        setVerifiedCard(null);
        setVoucherCode('');
        setVoucherPin('');
      } else {
        toast.error(res.message);
      }
    });
  };

  // Handle Purchase with Razorpay Payment (or direct bypass if Admin)
  const handleInitiatePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 100) {
      toast.error('Minimum gift voucher value is ₹100');
      return;
    }
    if (!recipientName.trim()) {
      toast.error('Please enter the recipient devotee name');
      return;
    }

    // ADMIN BYPASS: Admin generates complimentary voucher without payment
    if (isAdmin) {
      startTransition(async () => {
        const res = await verifyAndCreatePaidGiftVoucher({
          amount: effectiveAmount,
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim() || undefined,
          message: blessingMessage.trim() || undefined,
        });

        if (res.success && res.data) {
          setCreatedVoucher(res.data);
          toast.success(res.message);
        } else {
          toast.error(res.message || 'Failed to issue gift voucher');
        }
      });
      return;
    }

    // REGULAR USER: Mandatory payment via Razorpay
    setIsPaying(true);
    try {
      const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isLoaded) {
        toast.error('Razorpay payment gateway failed to load. Please check your internet connection.');
        setIsPaying(false);
        return;
      }

      // Create Razorpay Order on server
      const orderRes = await createRazorpayGiftCardOrder(effectiveAmount);
      if (!orderRes.success || !orderRes.data) {
        toast.error(orderRes.message || 'Unable to initialize payment order');
        setIsPaying(false);
        return;
      }

      const rzpOrderId = orderRes.data;

      // Launch Razorpay Modal
      const options = {
        key: orderRes.keyId,
        amount: effectiveAmount * 100,
        currency: 'INR',
        name: 'Madhav Shringaar',
        description: `Auspicious Gift Voucher for ${recipientName}`,
        image: '/images/logo.png',
        order_id: rzpOrderId,
        prefill: {
          name: userName !== 'Devotee' ? userName : recipientName,
          email: userEmail,
          contact: userPhone || recipientPhone,
        },
        theme: {
          color: '#003020',
        },
        handler: async function (response: any) {
          toast('Verifying payment and generating voucher...', { duration: 3000 });
          
          startTransition(async () => {
            const verifyRes = await verifyAndCreatePaidGiftVoucher({
              amount: effectiveAmount,
              recipientName: recipientName.trim(),
              recipientPhone: recipientPhone.trim() || undefined,
              message: blessingMessage.trim() || undefined,
              paymentData: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (verifyRes.success && verifyRes.data) {
              setCreatedVoucher(verifyRes.data);
              toast.success(verifyRes.message);
            } else {
              toast.error(verifyRes.message || 'Payment verification failed');
            }
            setIsPaying(false);
          });
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
            toast.info('Voucher purchase was cancelled.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        toast.error(resp.error?.description || 'Payment failed. Please try again.');
        setIsPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed to initialize');
      setIsPaying(false);
    }
  };

  // Download high-resolution PNG of the generated gift card (exact same as Admin)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `MadhavShringaar-GiftCard-${createdVoucher?.code || 'voucher'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Gift card image downloaded successfully!');
    } catch (err) {
      console.error('Failed to download image', err);
      toast.error('Failed to generate gift card image');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyShareText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Gift card code and devotional message copied!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#C88A20]" />
            Gift Cards & Bhakti Rewards Hub
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Check gift voucher balances, claim credits into your account, and purchase authenticated gift vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F0] text-[#003020] px-4 py-2 rounded-xl border border-[#E6C16A]/50 text-xs font-semibold self-start md:self-auto">
          <Sparkles className="w-4 h-4 text-[#C88A20]" />
          <span>Bhakti Seva Program</span>
        </div>
      </div>

      {/* Hero Points Card */}
      <div className="bg-gradient-to-r from-[#003020] via-[#0F6F74] to-[#003020] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#E6C16A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <span className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                Available Seva Balance
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl md:text-5xl font-bold text-[#F3D98F]">
                {bhaktiPoints}
              </span>
              <span className="text-lg text-white/80 font-medium">Bhakti Points</span>
            </div>
            <p className="text-xs md:text-sm text-white/80">
              Equivalent to <strong className="text-[#F3D98F]">₹{pointsValueInRupees} discount</strong> automatically applicable on your next sacred order.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 max-w-sm">
            <h4 className="text-xs font-bold text-[#F3D98F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              How Bhakti Rewards Work
            </h4>
            <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
              <li>Earn 1 Point for every ₹10 spent on poshak & jewelry</li>
              <li>Get 50 bonus Points upon posting verified deity photos</li>
              <li>Redeem gift card balances directly into your Bhakti Points</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Symmetrical Two-Column Grid: Identical Height Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* CARD 1: CHECK OR REDEEM GIFT CARD */}
        <Card className="rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden h-full flex flex-col justify-between bg-white">
          <div className="flex-1 flex flex-col">
            <CardHeader className="bg-[#FAF7F0]/60 border-b border-neutral-200/70 p-5">
              <CardTitle className="font-serif text-base font-bold text-[#003020] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0F6F74]" />
                Check or Redeem Gift Card
              </CardTitle>
              <CardDescription className="text-xs text-neutral-600">
                Enter your gift voucher code to inspect balance or claim it into your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5">
              <form onSubmit={handleCheckBalance} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Gift Voucher Code *
                  </label>
                  <Input
                    placeholder="e.g. GC-8F2K-9Q1Z"
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase());
                      setVerifiedCard(null);
                    }}
                    className="rounded-xl uppercase font-mono text-sm tracking-wider"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Voucher PIN (Optional)
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    maxLength={6}
                    value={voucherPin}
                    onChange={(e) => setVoucherPin(e.target.value)}
                    className="rounded-xl font-mono text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl h-10 shadow-xs"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying voucher code...
                    </span>
                  ) : (
                    'Check Voucher Balance'
                  )}
                </Button>
              </form>

              {/* Dynamic Section: Verified Result OR Guidelines (to maintain equal visual weight) */}
              {verifiedCard ? (
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Verified Gift Card
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-neutral-600">
                        {verifiedCard.code}
                      </span>
                      <CopyButton text={verifiedCard.code} title="Copy Gift Card Code" size="xs" />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-emerald-200">
                    <span className="text-xs text-emerald-800">Available Balance:</span>
                    <span className="font-serif font-bold text-xl text-emerald-900 font-mono">
                      ₹{verifiedCard.balance}
                    </span>
                  </div>

                  {verifiedCard.balance > 0 ? (
                    <div className="pt-2">
                      <Button
                        onClick={handleClaimBalance}
                        disabled={isPending}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs gap-1.5 h-9"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        Claim ₹{verifiedCard.balance} as Bhakti Points
                      </Button>
                      <p className="text-[11px] text-emerald-700 text-center mt-1.5">
                        Adds {Math.round(verifiedCard.balance * 10)} Bhakti Points to your account immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>This card balance has already been fully redeemed.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FAF7F0]/80 rounded-xl p-4 border border-[#E6C16A]/40 space-y-2.5">
                  <h4 className="text-xs font-bold text-[#003020] uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#C88A20]" />
                    How to Use Your Voucher
                  </h4>
                  <ul className="text-xs text-neutral-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C88A20] font-bold">1.</span>
                      <span>Enter the unique code found on your digital card or WhatsApp message.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C88A20] font-bold">2.</span>
                      <span>Click <strong>Check Voucher Balance</strong> to verify active funds.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C88A20] font-bold">3.</span>
                      <span>Claim balance into your account as Bhakti Points (1 Rupee = 10 Points) with zero expiration.</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </div>

          <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 text-xs text-neutral-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C88A20] flex-shrink-0" />
            <span>Instant conversion: 1 Rupee = 10 Bhakti Points for zero expiry checkout usage.</span>
          </div>
        </Card>

        {/* CARD 2: GENERATE GIFT CARD (PAY VIA RAZORPAY / ADMIN BYPASS) */}
        <Card className="rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden h-full flex flex-col justify-between bg-white">
          <div className="flex-1 flex flex-col">
            <CardHeader className="bg-[#FAF7F0]/60 border-b border-neutral-200/70 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-base font-bold text-[#003020] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C88A20]" />
                  {isAdmin ? 'Issue Gift Card (Admin Mode)' : 'Purchase Auspicious Gift Voucher'}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-600">
                  {isAdmin 
                    ? 'Admin Access: Issue complimentary gift cards directly without payment.' 
                    : 'Secure payment via Razorpay. Send divine shringaar bhent to loved ones.'}
                </CardDescription>
              </div>

              {isAdmin && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] shadow-2xs">
                  Admin Free Pass
                </span>
              )}
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
              {!createdVoucher ? (
                <form onSubmit={handleInitiatePurchase} className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    {/* Amount Preset Selectors */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-2">
                        Select Auspicious Shubh Bhent
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[501, 1100, 2100, 5100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amt);
                              setCustomAmount('');
                            }}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedAmount === amt && !customAmount
                                ? 'bg-[#003020] text-[#F3D98F] border-[#003020] font-bold shadow-xs'
                                : 'bg-white text-neutral-800 border-neutral-200 hover:border-[#E6C16A]'
                            }`}
                          >
                            <span className="text-xs block font-serif">₹{amt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <Input
                        type="number"
                        min={100}
                        placeholder="Or enter custom amount (Min ₹100)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="rounded-xl text-xs h-9"
                      />
                    </div>

                    {/* Recipient Devotee Name */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Recipient Devotee Name *
                      </label>
                      <Input
                        placeholder="e.g. Radhika / Krishna Bhakt"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="rounded-xl text-xs h-9"
                        required
                      />
                    </div>

                    {/* Devotional Blessing Message */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        Devotional Blessing Message (Optional)
                      </label>
                      <Textarea
                        rows={2}
                        placeholder="Custom blessing or wishes..."
                        value={blessingMessage}
                        onChange={(e) => setBlessingMessage(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Action Button: Pay via Razorpay OR Admin Free Pass */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isPending || isPaying}
                      className="w-full bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl h-10 shadow-xs flex items-center justify-center gap-2"
                    >
                      {isPending || isPaying ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> {isAdmin ? 'Issuing Card...' : 'Opening Razorpay Gateway...'}
                        </span>
                      ) : isAdmin ? (
                        <>
                          <Sparkle className="w-4 h-4 text-[#F3D98F]" />
                          <span>Generate Gift Card of ₹{effectiveAmount} (Admin Free Pass)</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-[#F3D98F]" />
                          <span>Pay ₹{effectiveAmount} via Razorpay & Generate Card</span>
                        </>
                      )}
                    </Button>
                    {!isAdmin && (
                      <p className="text-[11px] text-neutral-500 text-center mt-2 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3 text-[#C88A20]" />
                        <span>Card is issued only after 100% verified Razorpay bank payment.</span>
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                /* CREATED GIFT CARD DISPLAY (EXACT SAME AS ADMIN GIFT CARD) */
                <div className="space-y-4 animate-in fade-in flex-1 flex flex-col justify-between">
                  <div>
                    {/* The Visual Card Container (For Display & High-Res PNG Download) */}
                    <div className="flex justify-center py-1 overflow-hidden">
                      <div 
                        ref={cardRef} 
                        className="relative w-full max-w-[400px] h-[220px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 border border-[#b8860b]/30"
                        style={{
                          background: 'linear-gradient(135deg, #004d33 0%, #00190f 100%)',
                          color: '#ffffff',
                        }}
                      >
                        {/* Background Ambient Glows */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#b8860b] opacity-25 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#2a6d51] opacity-35 blur-2xl pointer-events-none" />
                        
                        {/* Header: Logo, Email and Value */}
                        <div className="relative z-10 flex justify-between items-start">
                          <div>
                            <img 
                              src="/images/logo.png" 
                              alt="Madhav Shringaar" 
                              className="h-14 w-auto object-contain drop-shadow-md bg-white/95 p-1 rounded-lg"
                            />
                            <p className="text-xs mt-1.5 text-[#e6e2d9]/80 font-medium">info@madhavshringaar.com</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#f5d061] uppercase tracking-widest mb-1 drop-shadow-sm">
                              Gift Card
                            </p>
                            <p className="text-3xl font-bold text-white drop-shadow-md">
                              ₹{createdVoucher.amount}
                            </p>
                            {createdVoucher.recipientName && (
                              <p className="text-[11px] text-white/80 mt-1 max-w-[150px] truncate">
                                For: {createdVoucher.recipientName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Footer: Redeem Code and Website */}
                        <div className="relative z-10 flex justify-between items-end mt-4">
                          <div>
                            <p className="text-[10px] text-[#f5d061]/90 uppercase tracking-widest mb-1.5">
                              Redeem Code
                            </p>
                            <div className="bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/20 backdrop-blur-md shadow-inner flex items-center gap-2">
                              <p className="font-mono font-bold text-lg tracking-wider text-white drop-shadow-sm select-all">
                                {createdVoucher.code}
                              </p>
                              <CopyButton text={createdVoucher.code} title="Copy Gift Card Code" variant="light" size="xs" />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-[#e6e2d9]/70">Redeem at</p>
                            <p className="text-sm font-semibold text-[#f5d061] tracking-wide">
                              madhavshringaar.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid: Download Image (like Admin), Copy Text, Share on WhatsApp */}
                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={handleDownloadImage}
                      disabled={isDownloading}
                      className="w-full bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl text-xs gap-2 h-9 shadow-xs"
                    >
                      {isDownloading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Image...
                        </span>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Gift Card Image (PNG)</span>
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => copyShareText(createdVoucher.shareMessage)}
                        variant="outline"
                        className="rounded-xl border-[#003020] text-[#003020] text-xs font-semibold gap-1.5 h-9"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy Details
                      </Button>

                      <Button
                        asChild
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-semibold gap-1.5 h-9 shadow-xs"
                      >
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(createdVoucher.shareMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Share WhatsApp
                        </a>
                      </Button>
                    </div>

                    <Button
                      onClick={() => setCreatedVoucher(null)}
                      variant="ghost"
                      className="w-full text-xs text-neutral-500 hover:text-neutral-800 h-8"
                    >
                      &larr; Create Another Gift Voucher
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </div>

          <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 text-xs text-neutral-500 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C88A20] flex-shrink-0" />
            <span>
              {isAdmin 
                ? 'Admin issuance: Gift card is recorded directly in the official seva database.' 
                : '100% Protected: Cards are created and activated only after verified bank payment.'}
            </span>
          </div>
        </Card>
      </div>

      {/* Trust & Security Footnote */}
      <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#E6C16A]/40 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C88A20] flex-shrink-0" />
          <p className="text-xs text-neutral-700">
            <strong>100% Non-Depreciating Balance:</strong> Madhav Shringaar gift cards have no dormancy deductions and transfer seamlessly across altar checkouts.
          </p>
        </div>
        <Button
          asChild
          variant="link"
          className="text-xs text-[#0F6F74] p-0 h-auto font-medium"
        >
          <Link href="/faq">
            Have questions about vouchers? View FAQs &rarr;
          </Link>
        </Button>
      </div>
    </div>
  );
}
