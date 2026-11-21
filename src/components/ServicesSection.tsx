import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ArrowUpRight, Check, Clock, Phone, Trash2 } from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/portfolioData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../context/FirebaseContext';

interface ServicesSectionProps {
  onOrderService: (serviceName: string) => void;
}

interface ServiceOrderRecord {
  id: string;
  userId?: string;
  name: string;
  contact: string;
  serviceName?: string;
  message?: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt?: Timestamp | null;
}

const STATUS_LABELS: Record<ServiceOrderRecord['status'], string> = {
  new: 'Шинэ',
  contacted: 'Холбогдсон',
  completed: 'Дууссан',
};

function formatOrderDate(ts?: Timestamp | null): string {
  if (!ts) return 'Саяхан';
  try {
    return ts.toDate().toLocaleDateString('mn-MN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Саяхан';
  }
}

const ServiceCard: React.FC<{
  service: ServiceItem;
  onOrder: (serviceName: string) => void;
}> = ({ service, onOrder }) => {
  const telHref = `tel:${service.phone.replace(/[^+\d]/g, '')}`;

  return (
    <div className="bg-white border border-slate-200 hover:border-[#DC2626] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-200">
      <div className="p-6 sm:p-8">
        {/* Unboxed Metadata Line */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#DC2626] mb-3 tabular-nums">
          <span className="font-mono-code font-semibold">{service.index}</span>
          <span aria-hidden="true">·</span>
          <span>{service.category}</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#070102] mb-3">
          {service.name}
        </h3>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Unboxed Highlights Row */}
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          {service.highlights.join(' · ')}
        </p>
      </div>

      {/* Hairline Footer with Phone & Order Action */}
      <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-4">
        <a
          href={telHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#070102] hover:text-[#DC2626] transition-colors tabular-nums whitespace-nowrap"
        >
          <Phone className="w-4 h-4 text-[#DC2626] shrink-0" aria-hidden="true" />
          <span>{service.phone}</span>
        </a>

        <button
          type="button"
          onClick={() => onOrder(service.name)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#070102] hover:bg-[#DC2626] text-white text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
        >
          <span>Захиалах</span>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOrderService }) => {
  const { user, authReady, isAdmin } = useFirebase();
  const [firestoreServices, setFirestoreServices] = useState<ServiceItem[]>([]);
  const [orders, setOrders] = useState<ServiceOrderRecord[]>([]);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady) return;

    const servicesQ = query(collection(db, 'services'), limit(50));

    if (!user) {
      getDocs(servicesQ)
        .then((snap) => {
          const items = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<ServiceItem, 'id'>),
          }));
          items.sort((a, b) => a.index.localeCompare(b.index));
          setFirestoreServices(items);
        })
        .catch(() => {
          // Keep static SERVICES fallback if offline
        });
      return;
    }

    const unsubServices = onSnapshot(
      servicesQ,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ServiceItem, 'id'>),
        }));
        items.sort((a, b) => a.index.localeCompare(b.index));
        setFirestoreServices(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'services');
      }
    );

    return () => unsubServices();
  }, [authReady, user]);

  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setOrders([]);
      return;
    }

    const ordersQuery = isAdmin
      ? query(collection(db, 'serviceOrders'), orderBy('createdAt', 'desc'), limit(30))
      : query(collection(db, 'serviceOrders'), where('userId', '==', user.uid), limit(20));

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ServiceOrderRecord, 'id'>),
        }));
        if (!isAdmin) {
          items.sort(
            (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
          );
        }
        setOrders(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'serviceOrders');
      }
    );

    return () => unsubscribe();
  }, [authReady, user, isAdmin]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    nextStatus: 'contacted' | 'completed'
  ) => {
    if (!isAdmin) return;
    setOrderError(null);
    try {
      await updateDoc(doc(db, 'serviceOrders', orderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `serviceOrders/${orderId}`);
      } catch {
        setOrderError('Захиалгын төлөв шинэчлэхэд алдаа гарлаа.');
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!isAdmin) return;
    setOrderError(null);
    try {
      await deleteDoc(doc(db, 'serviceOrders', orderId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `serviceOrders/${orderId}`);
      } catch {
        setOrderError('Захиалга устгахад алдаа гарлаа.');
      }
    }
  };

  const showOrdersPanel = Boolean(user && user.emailVerified && (isAdmin || orders.length > 0));
  const displayedServices = firestoreServices.length > 0 ? firestoreServices : SERVICES;

  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-[#F4F7FA] text-[#070102] border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-12 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#DC2626] mb-2">
              Үйлчилгээ ба зөвлөгөө
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#070102] [text-wrap:balance]">
              МИНИЙ <span className="text-[#DC2626]">ҮЙЛЧИЛГЭЭ</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
            FC Mobile тоглоомын хөгжүүлэлт болон хөл бөмбөгийн талаарх дэлгэрэнгүй мэдээлэл, зөвлөгөөг доорх үйлчилгээнүүдээс шууд захиалаарай.
          </p>
        </div>

        {/* Services Grid rendered via map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOrder={onOrderService}
            />
          ))}
        </div>

        {/* Real-time Firestore Orders Panel for Admin or Signed-in User */}
        {showOrdersPanel && (
          <div className="mt-12 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#DC2626] mb-1">
                  Firestore бодит цагийн бүртгэл
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#070102]">
                  {isAdmin ? 'ИРСЭН ЗАХИАЛГУУД' : 'МИНИЙ ИЛГЭЭСЭН ЗАХИАЛГУУД'}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                Нийт {orders.length} захиалга
              </span>
            </div>

            {orderError && (
              <div
                role="alert"
                className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
              >
                {orderError}
              </div>
            )}

            {orders.length === 0 ? (
              <p className="text-sm text-slate-500">
                Одоогоор бүртгэгдсэн захиалга байхгүй байна.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="text-sm font-bold text-[#070102]">{order.name}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#DC2626]">{order.contact}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{formatOrderDate(order.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            order.status === 'completed'
                              ? 'text-emerald-700'
                              : order.status === 'contacted'
                              ? 'text-[#DC2626]'
                              : 'text-amber-700'
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-700">
                        {order.serviceName || 'Ерөнхий холбоо барих'}
                      </p>

                      {order.message && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {order.message}
                        </p>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2 shrink-0">
                        {order.status === 'new' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, 'contacted')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#DC2626] text-xs font-semibold text-[#070102] hover:text-white transition-colors cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Холбогдсон</span>
                          </button>
                        )}
                        {order.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#070102] hover:bg-emerald-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Дуусгах</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          aria-label="Захиалга устгах"
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
