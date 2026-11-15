import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, CheckCircle2, Send, X } from 'lucide-react';
import { SERVICES } from '../data/portfolioData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../context/FirebaseContext';

const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1571420110017663068/2LeTaTpIi6OYmpteAfvZLu6VDiwWUfN6Ct55AsRRzBtPTRfY7urgqZL6jCQ7NJ4xMzkb';

interface OrderModalProps {
  isOpen: boolean;
  initialService: string;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  initialService,
  onClose,
}) => {
  const { user } = useFirebase();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      setService(initialService);
      setStatus('idle');
    }
  }, [isOpen, initialService]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim().slice(0, 100);
    const trimmedContact = contact.trim().slice(0, 120);
    const trimmedService = service.trim().slice(0, 120);
    const trimmedMessage = message.trim().slice(0, 600);

    if (!trimmedName || !trimmedContact) return;

    setIsSubmitting(true);
    setStatus('idle');

    const content = [
      'Шинэ захиалга',
      `Нэр: ${trimmedName}`,
      `Холбоо барих: ${trimmedContact}`,
      `Үйлчилгээ: ${trimmedService || 'Сонгоогүй'}`,
      `Мессеж: ${trimmedMessage || '-'}`,
    ].join('\n');

    try {
      const firestorePayload: Record<string, unknown> = {
        name: trimmedName,
        contact: trimmedContact,
        status: 'new',
        createdAt: serverTimestamp(),
      };
      if (trimmedService) {
        firestorePayload.serviceName = trimmedService;
      }
      if (trimmedMessage) {
        firestorePayload.message = trimmedMessage;
      }
      if (user && user.emailVerified) {
        firestorePayload.userId = user.uid;
      }

      const saveToFirestore = addDoc(collection(db, 'serviceOrders'), firestorePayload).catch(
        (fsError) => {
          handleFirestoreError(fsError, OperationType.CREATE, 'serviceOrders');
        }
      );

      const sendToDiscord = fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          allowed_mentions: { parse: [] },
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Webhook error: ${res.status}`);
        }
      });

      await Promise.all([saveToFirestore, sendToDiscord]);

      setStatus('success');
      setName('');
      setContact('');
      setMessage('');
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-[#021327]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#051B36] border border-white/15 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-white/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#38BDF8] mb-1">
              Шууд холбогдох · Захиалга
            </p>
            <h2
              id="order-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white"
            >
              {initialService ? 'ҮЙЛЧИЛГЭЭ ЗАХИАЛАХ' : 'ХОЛБОО БАРИХ'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Цонх хаах"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Feedback */}
        {status === 'success' && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-100 flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Баярлалаа! Удахгүй холбогдоно.</span>
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-400/40 text-red-100 flex items-center gap-3 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
            <span>Алдаа гарлаа, дахин оролдоно уу.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="order-name"
              className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5"
            >
              Нэр <span className="text-[#38BDF8]">*</span>
            </label>
            <input
              id="order-name"
              name="name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Таны нэр"
              className="w-full px-4 py-2.5 rounded-lg bg-[#021327] border border-white/15 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label
              htmlFor="order-contact"
              className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5"
            >
              Утас эсвэл имэйл <span className="text-[#38BDF8]">*</span>
            </label>
            <input
              id="order-contact"
              name="contact"
              type="text"
              required
              maxLength={120}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Жишээ: 99112233 эсвэл name@email.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#021327] border border-white/15 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div>
            <label
              htmlFor="order-service"
              className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5"
            >
              Үйлчилгээ
            </label>
            <input
              id="order-service"
              name="service"
              type="text"
              list="portfolio-services-list"
              maxLength={120}
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Сонгосон үйлчилгээ (заавал биш)"
              className="w-full px-4 py-2.5 rounded-lg bg-[#021327] border border-white/15 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
            <datalist id="portfolio-services-list">
              {SERVICES.map((item) => (
                <option key={item.id} value={item.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label
              htmlFor="order-message"
              className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-1.5"
            >
              Нэмэлт мэдээлэл
            </label>
            <textarea
              id="order-message"
              name="message"
              rows={3}
              maxLength={600}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Танд хэрэгтэй мэдээлэл эсвэл хүсэлтээ бичнэ үү..."
              className="w-full px-4 py-2.5 rounded-lg bg-[#021327] border border-white/15 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#38BDF8] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Болих
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#38BDF8] hover:bg-[#7DD3FC] disabled:opacity-60 disabled:cursor-not-allowed text-[#021327] text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>{isSubmitting ? 'Илгээж байна...' : 'Илгээх'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
