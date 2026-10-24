'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  X,
  Sparkles,
  HelpCircle,
  Building,
  RefreshCcw,
  BadgeAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  saveUserCard, 
  deleteUserCard, 
  saveUserUpi, 
  deleteUserUpi 
} from '@/lib/actions/user.actions';

interface SavedCard {
  id: string;
  cardholderName: string;
  last4: string;
  maskedNumber: string;
  expiry: string;
  cardType: string;
  createdAt?: string;
}

interface ManagePaymentsProps {
  savedCards: SavedCard[];
  savedUpiIds: string[];
}

export default function ManagePaymentsClient({
  savedCards = [],
  savedUpiIds = [],
}: ManagePaymentsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [isUpiFormOpen, setIsUpiFormOpen] = useState(false);

  // Card input fields
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI input
  const [upiId, setUpiId] = useState('');

  // Detect card network brand for display
  const detectedBrand = /^4/.test(cardNumber.replace(/\s+/g, ''))
    ? 'Visa'
    : /^5[1-5]/.test(cardNumber.replace(/\s+/g, ''))
    ? 'MasterCard'
    : /^3[47]/.test(cardNumber.replace(/\s+/g, ''))
    ? 'Amex'
    : 'RuPay';

  const formatCardInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const parts = digits.match(/.{1,4}/g);
    return parts ? parts.join(' ') : digits;
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholderName.trim()) {
      toast.error('Please enter the name on the card');
      return;
    }
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 15) {
      toast.error('Please enter a valid 15 or 16 digit card number');
      return;
    }
    if (!expiryMonth || !expiryYear) {
      toast.error('Please enter complete expiry MM/YY');
      return;
    }
    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV (3 or 4 digits)');
      return;
    }

    startTransition(async () => {
      const res = await saveUserCard({
        cardholderName,
        cardNumber: cleanNumber,
        expiryMonth,
        expiryYear,
      });

      if (res.success) {
        toast.success(res.message);
        setCardholderName('');
        setCardNumber('');
        setExpiryMonth('');
        setExpiryYear('');
        setCvv('');
        setIsCardFormOpen(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (!confirm('Are you sure you want to remove this saved card?')) return;
    startTransition(async () => {
      const res = await deleteUserCard(cardId);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      return;
    }

    startTransition(async () => {
      const res = await saveUserUpi(upiId);
      if (res.success) {
        toast.success(res.message);
        setUpiId('');
        setIsUpiFormOpen(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteUpi = (upi: string) => {
    if (!confirm(`Are you sure you want to unlink ${upi}?`)) return;
    startTransition(async () => {
      const res = await deleteUserUpi(upi);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#0F6F74]" />
            Saved Payment Methods
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Manage your saved debit/credit cards and UPI IDs for fast, secure checkouts.
          </p>
        </div>
      </div>

      {/* SECTION 1: SAVED CARDS (CREDIT / DEBIT) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#003020] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C88A20]" />
            Saved Credit & Debit Cards
          </h2>

          {!isCardFormOpen && (
            <Button
              onClick={() => setIsCardFormOpen(true)}
              className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-semibold gap-1.5 rounded-xl h-9"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Card
            </Button>
          )}
        </div>

        {/* Add Card Form Modal / Card */}
        {isCardFormOpen && (
          <Card className="border-2 border-[#E6C16A]/60 shadow-md rounded-2xl overflow-hidden bg-[#FAF7F0]/40">
            <CardHeader className="bg-white border-b border-neutral-200/80 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-base font-bold text-[#003020]">
                  Add New Credit / Debit Card
                </CardTitle>
                <CardDescription className="text-xs text-neutral-600">
                  Secured as per RBI Tokenization Guidelines. Your full CVV & raw card number are never stored.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCardFormOpen(false)}
                className="rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSaveCard} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                      Name on Card *
                    </label>
                    <Input
                      placeholder="e.g. Radhika Sharma"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="bg-white rounded-xl text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5 flex items-center justify-between">
                      <span>Card Number (16 Digits) *</span>
                      <span className="text-[11px] font-bold text-[#0F6F74]">{detectedBrand}</span>
                    </label>
                    <Input
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                      maxLength={19}
                      className="bg-white rounded-xl text-sm font-mono tracking-wider"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                      Month (MM) *
                    </label>
                    <Input
                      placeholder="MM"
                      maxLength={2}
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, ''))}
                      className="bg-white rounded-xl text-sm text-center"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                      Year (YYYY) *
                    </label>
                    <Input
                      placeholder="YYYY"
                      maxLength={4}
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, ''))}
                      className="bg-white rounded-xl text-sm text-center"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                      CVV *
                    </label>
                    <Input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="bg-white rounded-xl text-sm text-center"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCardFormOpen(false)}
                    className="rounded-xl border-neutral-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl min-w-[140px]"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" /> Tokenizing...
                      </span>
                    ) : (
                      'Save Card Securely'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Saved Cards List */}
        {savedCards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center space-y-2">
            <CreditCard className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="font-semibold text-sm text-[#003020]">No Saved Cards Yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Save your Visa, MasterCard, or RuPay card for swift, seamless checkouts on every sacred order.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-[#003020] to-[#0A4B3A] text-white rounded-2xl p-5 shadow-sm relative flex flex-col justify-between min-h-[160px] overflow-hidden group"
              >
                {/* Decorative background circle */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#E6C16A]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm tracking-wider text-[#F3D98F]">
                      {card.cardType.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/80 font-medium">
                      Tokenized
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(card.id)}
                    disabled={isPending}
                    className="text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg h-7 w-7"
                    title="Remove card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="relative z-10 my-3">
                  <div className="font-mono text-lg md:text-xl font-bold tracking-widest text-[#F3D98F]">
                    {card.maskedNumber}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/80 relative z-10 pt-1 border-t border-white/15">
                  <div>
                    <span className="text-[10px] uppercase text-white/50 block">Cardholder</span>
                    <span className="font-medium truncate max-w-[150px] inline-block">{card.cardholderName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-white/50 block">Expires</span>
                    <span className="font-medium font-mono">{card.expiry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: SAVED UPI IDS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#003020] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C88A20]" />
            Saved UPI IDs (Google Pay / PhonePe / Paytm)
          </h2>

          {!isUpiFormOpen && (
            <Button
              onClick={() => setIsUpiFormOpen(true)}
              className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-semibold gap-1.5 rounded-xl h-9"
            >
              <Plus className="w-3.5 h-3.5" />
              Link New UPI ID
            </Button>
          )}
        </div>

        {/* Add UPI Form */}
        {isUpiFormOpen && (
          <Card className="border border-neutral-200/80 shadow-xs rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-[#FAF7F0]/60 border-b border-neutral-200/70 p-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-base font-bold text-[#003020]">
                  Link UPI ID / VPA
                </CardTitle>
                <CardDescription className="text-xs text-neutral-600">
                  Enter your UPI ID (e.g. mobile@upi, name@okhdfcbank, user@paytm).
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUpiFormOpen(false)}
                className="rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-5">
              <form onSubmit={handleSaveUpi} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="e.g. 9876543210@paytm or radha@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="rounded-xl text-sm flex-1 font-mono"
                  required
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl whitespace-nowrap"
                >
                  {isPending ? 'Verifying...' : 'Link UPI ID'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* UPI List */}
        {savedUpiIds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center space-y-2">
            <Smartphone className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="font-semibold text-sm text-[#003020]">No UPI IDs Linked Yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Link your preferred UPI address for zero-surcharge, instant 1-tap approvals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedUpiIds.map((upi, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex items-center justify-between gap-3 shadow-xs hover:border-[#E6C16A] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-[#FAF7F0] text-[#0F6F74] flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    UPI
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#003020] font-mono truncate">
                      {upi}
                    </p>
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified VPA
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteUpi(upi)}
                  disabled={isPending}
                  className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 w-8"
                  title="Remove UPI"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
