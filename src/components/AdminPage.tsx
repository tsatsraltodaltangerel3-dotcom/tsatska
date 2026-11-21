import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { SERVICES } from '../data/portfolioData';
import { ADMIN_EMAIL, db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../context/FirebaseContext';

type AdminTab = 'dashboard' | 'orders' | 'services' | 'contact';

interface ServiceOrderDoc {
  id: string;
  userId?: string;
  name: string;
  contact: string;
  serviceName?: string;
  message?: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt?: Timestamp | null;
}

interface FirestoreServiceDoc {
  id: string;
  ownerId: string;
  index: string;
  category: string;
  name: string;
  description: string;
  phone: string;
  highlights: string[];
  createdAt?: Timestamp | null;
}

interface GuestbookDoc {
  id: string;
  authorName: string;
  location?: string;
  message: string;
  createdAt?: Timestamp | null;
}

interface AdminPageProps {
  onExitAdmin: () => void;
}

const STATUS_LABELS: Record<ServiceOrderDoc['status'], string> = {
  new: 'Шинэ',
  contacted: 'Холбогдсон',
  completed: 'Дууссан',
};

const TAB_LABELS: Record<AdminTab, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  services: 'Services',
  contact: 'Contact',
};

function formatDateTime(ts?: Timestamp | null): string {
  if (!ts) return 'Саяхан';
  try {
    return ts.toDate().toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Саяхан';
  }
}

export const AdminPage: React.FC<AdminPageProps> = ({ onExitAdmin }) => {
  const { user, authReady, isAdmin, authError, signInWithGoogle, logOut } = useFirebase();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [allOrders, setAllOrders] = useState<ServiceOrderDoc[]>([]);
  const [firestoreServices, setFirestoreServices] = useState<FirestoreServiceDoc[]>([]);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookDoc[]>([]);
  const [cheersCount, setCheersCount] = useState<number>(0);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | ServiceOrderDoc['status']>('all');
  const [contactSubTab, setContactSubTab] = useState<'inquiries' | 'guestbook'>('inquiries');
  const [contactSearch, setContactSearch] = useState('');

  // Service Form State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [svcIndex, setSvcIndex] = useState('03');
  const [svcCategory, setSvcCategory] = useState('');
  const [svcName, setSvcName] = useState('');
  const [svcPhone, setSvcPhone] = useState('');
  const [svcDescription, setSvcDescription] = useState('');
  const [svcHighlights, setSvcHighlights] = useState('');
  const [savingService, setSavingService] = useState(false);
  const [seedingServices, setSeedingServices] = useState(false);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

    const ordersQ = query(
      collection(db, 'serviceOrders'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const servicesQ = query(collection(db, 'services'), limit(50));
    const guestbookQ = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const cheersQ = query(collection(db, 'cheers'), limit(200));

    const unsubOrders = onSnapshot(
      ordersQ,
      (snap) => {
        setAllOrders(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ServiceOrderDoc, 'id'>) }))
        );
        setLoadingData(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'serviceOrders');
      }
    );

    const unsubServices = onSnapshot(
      servicesQ,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FirestoreServiceDoc, 'id'>),
        }));
        items.sort((a, b) => a.index.localeCompare(b.index));
        setFirestoreServices(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'services');
      }
    );

    const unsubGuestbook = onSnapshot(
      guestbookQ,
      (snap) => {
        setGuestbookMessages(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GuestbookDoc, 'id'>) }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'guestbook');
      }
    );

    const unsubCheers = onSnapshot(
      cheersQ,
      (snap) => {
        setCheersCount(snap.size);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'cheers');
      }
    );

    return () => {
      unsubOrders();
      unsubServices();
      unsubGuestbook();
      unsubCheers();
    };
  }, [authReady, user, isAdmin]);

  const serviceOrders = useMemo(
    () => allOrders.filter((o) => Boolean(o.serviceName && o.serviceName.trim())),
    [allOrders]
  );

  const contactInquiries = useMemo(
    () => allOrders.filter((o) => !o.serviceName || !o.serviceName.trim()),
    [allOrders]
  );

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return serviceOrders.filter((order) => {
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;
      if (!q) return true;
      return (
        order.name.toLowerCase().includes(q) ||
        order.contact.toLowerCase().includes(q) ||
        (order.serviceName || '').toLowerCase().includes(q) ||
        (order.message || '').toLowerCase().includes(q)
      );
    });
  }, [serviceOrders, orderSearch, orderStatusFilter]);

  const filteredInquiries = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    return contactInquiries.filter((item) => {
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.contact.toLowerCase().includes(q) ||
        (item.message || '').toLowerCase().includes(q)
      );
    });
  }, [contactInquiries, contactSearch]);

  const statusCounts = useMemo(() => {
    return allOrders.reduce(
      (acc, cur) => {
        acc[cur.status] += 1;
        return acc;
      },
      { new: 0, contacted: 0, completed: 0 }
    );
  }, [allOrders]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    nextStatus: 'contacted' | 'completed'
  ) => {
    setActionError(null);
    try {
      await updateDoc(doc(db, 'serviceOrders', orderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `serviceOrders/${orderId}`);
      } catch {
        setActionError('Төлөв шинэчлэх үед алдаа гарлаа.');
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setActionError(null);
    try {
      await deleteDoc(doc(db, 'serviceOrders', orderId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `serviceOrders/${orderId}`);
      } catch {
        setActionError('Захиалга устгах үед алдаа гарлаа.');
      }
    }
  };

  const handleDeleteGuestbook = async (id: string) => {
    setActionError(null);
    try {
      await deleteDoc(doc(db, 'guestbook', id));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `guestbook/${id}`);
      } catch {
        setActionError('Зочны дэвтрийн сэтгэгдэл устгахад алдаа гарлаа.');
      }
    }
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    const nextNum = String(firestoreServices.length + 1).padStart(2, '0');
    setSvcIndex(nextNum);
    setSvcCategory('');
    setSvcName('');
    setSvcPhone('');
    setSvcDescription('');
    setSvcHighlights('');
    setShowServiceForm(false);
  };

  const handleEditService = (svc: FirestoreServiceDoc) => {
    setEditingServiceId(svc.id);
    setSvcIndex(svc.index);
    setSvcCategory(svc.category);
    setSvcName(svc.name);
    setSvcPhone(svc.phone);
    setSvcDescription(svc.description);
    setSvcHighlights(svc.highlights.join(', '));
    setShowServiceForm(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin || savingService) return;
    setActionError(null);

    const index = svcIndex.trim().slice(0, 10) || '01';
    const category = svcCategory.trim().slice(0, 60);
    const name = svcName.trim().slice(0, 100);
    const phone = svcPhone.trim().slice(0, 40);
    const description = svcDescription.trim().slice(0, 500);
    const parsedHighlights = svcHighlights
      .split(',')
      .map((s) => s.trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 6);
    const highlights = parsedHighlights.length > 0 ? parsedHighlights : [category || 'Үйлчилгээ'];

    if (!category || !name || !phone || !description) return;

    setSavingService(true);
    try {
      if (editingServiceId) {
        await updateDoc(doc(db, 'services', editingServiceId), {
          index,
          category,
          name,
          phone,
          description,
          highlights,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'services'), {
          ownerId: user.uid,
          index,
          category,
          name,
          phone,
          description,
          highlights,
          createdAt: serverTimestamp(),
        });
      }
      resetServiceForm();
    } catch (error) {
      try {
        handleFirestoreError(
          error,
          editingServiceId ? OperationType.UPDATE : OperationType.CREATE,
          editingServiceId ? `services/${editingServiceId}` : 'services'
        );
      } catch {
        setActionError('Үйлчилгээ хадгалах үед алдаа гарлаа.');
      }
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!isAdmin) return;
    setActionError(null);
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `services/${serviceId}`);
      } catch {
        setActionError('Үйлчилгээ устгах үед алдаа гарлаа.');
      }
    }
  };

  const handleSeedDefaultServices = async () => {
    if (!user || !isAdmin || seedingServices) return;
    setActionError(null);
    setSeedingServices(true);
    try {
      await Promise.all(
        SERVICES.map((item) =>
          addDoc(collection(db, 'services'), {
            ownerId: user.uid,
            index: item.index,
            category: item.category.slice(0, 60),
            name: item.name.slice(0, 100),
            phone: item.phone.slice(0, 40),
            description: item.description.slice(0, 500),
            highlights: item.highlights.slice(0, 6).map((h) => h.slice(0, 60)),
            createdAt: serverTimestamp(),
          })
        )
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'services');
      } catch {
        setActionError('Үндсэн үйлчилгээнүүдийг хадгалахад алдаа гарлаа.');
      }
    } finally {
      setSeedingServices(false);
    }
  };

  // Gate 1: Auth loading
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#070102] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="font-display text-2xl uppercase tracking-wide text-white">
            Firebase баталгаажуулалт шалгаж байна...
          </p>
          <p className="text-sm text-[#94A3B8]">Түр хүлээнэ үү.</p>
        </div>
      </div>
    );
  }

  // Gate 2: Admin Login
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070102] text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#140407] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444]">
              Firebase Auth · Admin Portal
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              АДМИН НЭВТРЭЛТ
            </h1>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              Dashboard, Захиалга (Orders), Үйлчилгээ (Services) болон Холбоо барих (Contact) өгөгдлийг Firestore-оос удирдахын тулд админ Google бүртгэлээрээ нэвтэрнэ үү.
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-950/60 border border-red-400/40 text-xs sm:text-sm text-red-100 flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>Google-ээр нэвтрэх</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Сайтад буцах</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gate 3: Signed in, but not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070102] text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#140407] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-amber-300">
            <ShieldAlert className="w-6 h-6 shrink-0" aria-hidden="true" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Хандах эрхгүй байна
            </h1>
          </div>

          <p className="text-sm text-[#CBD5E1] leading-relaxed">
            Та одоогоор <span className="font-semibold text-white">{user.email}</span> хаягаар нэвтэрсэн байна. Админ хэсэгт зөвхөн баталгаажсан админ ({ADMIN_EMAIL}) нэвтрэх боломжтой.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={logOut}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Бүртгэлээс гарах</span>
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Сайтад буцах</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Workspace
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      count: serviceOrders.length,
    },
    {
      id: 'services',
      label: 'Services',
      icon: <Wrench className="w-4 h-4" />,
      count: firestoreServices.length || SERVICES.length,
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail className="w-4 h-4" />,
      count: contactInquiries.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070102] text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-[#140407] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between shrink-0">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                aria-hidden="true"
                className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#7F1D1D] via-[#DC2626] to-[#FCA5A5] shrink-0"
              />
              <span className="font-display text-xl font-bold uppercase tracking-wide truncate">
                ADMIN
              </span>
            </div>
            <button
              type="button"
              onClick={onExitAdmin}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Сайт</span>
            </button>
          </div>

          <nav aria-label="Admin цэс" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#DC2626] text-white'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && (
                    <span
                      className={`font-mono-code text-xs tabular-nums ${
                        active ? 'text-white/90' : 'text-[#94A3B8]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Account Footer */}
        <div className="hidden lg:block p-5 border-t border-white/10 space-y-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user.displayName || 'Админ'}
            </p>
            <p className="text-xs text-[#94A3B8] truncate">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitAdmin}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Сайт</span>
            </button>
            <button
              type="button"
              onClick={logOut}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Гарах</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#070102] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold min-w-0">
            <span className="text-[#94A3B8]">Admin</span>
            <span className="text-[#64748B]" aria-hidden="true">/</span>
            <span className="text-white truncate">{TAB_LABELS[activeTab]}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'services' && (
              <button
                type="button"
                onClick={() => {
                  resetServiceForm();
                  setShowServiceForm(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Шинэ үйлчилгээ</span>
              </button>
            )}
            <button
              type="button"
              onClick={onExitAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Сайтад буцах</span>
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {actionError && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-950/60 border border-red-400/40 text-sm text-red-100 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                <span>{actionError}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionError(null)}
                aria-label="Алдаа хаах"
                className="text-red-200 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-1">
                  Firestore бодит цагийн нэгтгэл
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                  ЕРӨНХИЙ ХЯНАЛТЫН САМБАР
                </h1>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="bg-[#140407] border border-white/10 rounded-xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Нийт захиалга
                  </p>
                  <p className="font-display text-4xl font-bold text-white tabular-nums">
                    {serviceOrders.length}
                  </p>
                  <p className="text-xs text-[#EF4444] mt-2">
                    Үйлчилгээний захиалга (Orders)
                  </p>
                </div>

                <div className="bg-[#140407] border border-white/10 rounded-xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Холбоо барих хүсэлт
                  </p>
                  <p className="font-display text-4xl font-bold text-white tabular-nums">
                    {contactInquiries.length}
                  </p>
                  <p className="text-xs text-[#CBD5E1] mt-2">
                    Contact формын зурвас
                  </p>
                </div>

                <div className="bg-[#140407] border border-white/10 rounded-xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Үйлчилгээний тоо
                  </p>
                  <p className="font-display text-4xl font-bold text-white tabular-nums">
                    {firestoreServices.length || SERVICES.length}
                  </p>
                  <p className="text-xs text-[#CBD5E1] mt-2">
                    {firestoreServices.length > 0 ? 'Firestore каталог' : 'Үндсэн каталог'}
                  </p>
                </div>

                <div className="bg-[#140407] border border-white/10 rounded-xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Дэмжигчид ба сэтгэгдэл
                  </p>
                  <p className="font-display text-4xl font-bold text-white tabular-nums">
                    {cheersCount + guestbookMessages.length}
                  </p>
                  <p className="text-xs text-[#CBD5E1] mt-2 tabular-nums">
                    {cheersCount} дэмжлэг · {guestbookMessages.length} сэтгэгдэл
                  </p>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-[#140407] border border-white/10 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                    Захиалга болон хүсэлтийн төлөв
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Нийт {allOrders.length} бүртгэлийн боловсруулалтын явц
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold tabular-nums">
                  <span className="text-amber-300">Шинэ: {statusCounts.new}</span>
                  <span className="text-[#EF4444]">Холбогдсон: {statusCounts.contacted}</span>
                  <span className="text-emerald-400">Дууссан: {statusCounts.completed}</span>
                </div>
              </div>

              {/* Recent Orders & Contact Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Service Orders */}
                <div className="bg-[#140407] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
                    <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                      Сүүлийн захиалгууд
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#EF4444] hover:underline cursor-pointer"
                    >
                      Бүгдийг харах
                    </button>
                  </div>

                  {loadingData ? (
                    <p className="text-sm text-[#94A3B8]">Ачааллаж байна...</p>
                  ) : serviceOrders.length === 0 ? (
                    <p className="text-sm text-[#94A3B8]">
                      Одоогоор үйлчилгээний захиалга ирээгүй байна.
                    </p>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {serviceOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {order.name} · <span className="text-[#EF4444]">{order.contact}</span>
                            </p>
                            <p className="text-xs text-[#94A3B8] truncate">
                              {order.serviceName} · {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-[#CBD5E1] shrink-0">
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Contact Inquiries */}
                <div className="bg-[#140407] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
                    <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                      Холбоо барих хүсэлтүүд
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="text-xs font-semibold text-[#EF4444] hover:underline cursor-pointer"
                    >
                      Бүгдийг харах
                    </button>
                  </div>

                  {loadingData ? (
                    <p className="text-sm text-[#94A3B8]">Ачааллаж байна...</p>
                  ) : contactInquiries.length === 0 ? (
                    <p className="text-sm text-[#94A3B8]">
                      Одоогоор Contact хүсэлт ирээгүй байна.
                    </p>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {contactInquiries.slice(0, 5).map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {item.name} · <span className="text-[#EF4444]">{item.contact}</span>
                            </p>
                            <p className="text-xs text-[#94A3B8] truncate">
                              {item.message || 'Мессежгүй'} · {formatDateTime(item.createdAt)}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-[#CBD5E1] shrink-0">
                            {STATUS_LABELS[item.status]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-1">
                    Firestore · serviceOrders
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                    ҮЙЛЧИЛГЭЭНИЙ ЗАХИАЛГУУД
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Нэр, утас, үйлчилгээ..."
                      className="pl-9 pr-4 py-2 rounded-lg bg-[#140407] border border-white/15 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>

                  <div className="inline-flex items-center gap-1 p-1 bg-[#140407] border border-white/10 rounded-lg">
                    {(['all', 'new', 'contacted', 'completed'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          orderStatusFilter === st
                            ? 'bg-[#DC2626] text-white'
                            : 'text-[#CBD5E1] hover:text-white'
                        }`}
                      >
                        {st === 'all' ? 'Бүгд' : STATUS_LABELS[st]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#140407] border border-white/10 rounded-xl overflow-hidden">
                {loadingData ? (
                  <div className="p-8 text-sm text-[#94A3B8]">Захиалгуудыг ачааллаж байна...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#94A3B8]">
                    Тохирох захиалга олдсонгүй.
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                            <span className="text-sm font-bold text-white">{order.name}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#EF4444]">{order.contact}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{formatDateTime(order.createdAt)}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={`font-semibold ${
                                order.status === 'completed'
                                  ? 'text-emerald-400'
                                  : order.status === 'contacted'
                                  ? 'text-[#EF4444]'
                                  : 'text-amber-300'
                              }`}
                            >
                              {STATUS_LABELS[order.status]}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-white">
                            {order.serviceName}
                          </p>

                          {order.message && (
                            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                              {order.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {order.status === 'new' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'contacted')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-[#DC2626] text-xs font-semibold text-white transition-colors cursor-pointer"
                            >
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Холбогдсон</span>
                            </button>
                          )}
                          {order.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#DC2626] hover:bg-emerald-600 text-xs font-semibold text-white transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Дуусгах</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            aria-label="Захиалга устгах"
                            className="p-2 rounded-full text-[#94A3B8] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-1">
                    Firestore · services каталог
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                    ҮЙЛЧИЛГЭЭНИЙ УДИРДЛАГА
                  </h1>
                </div>

                {firestoreServices.length === 0 && (
                  <button
                    type="button"
                    disabled={seedingServices}
                    onClick={handleSeedDefaultServices}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#DC2626] text-white hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {seedingServices
                        ? 'Хадгалж байна...'
                        : 'Үндсэн 2 үйлчилгээг Firestore-д хадгалах'}
                    </span>
                  </button>
                )}
              </div>

              {/* Create / Edit Service Form */}
              {showServiceForm && (
                <form
                  onSubmit={handleSaveService}
                  className="bg-[#140407] border border-[#EF4444]/40 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                      {editingServiceId ? 'Үйлчилгээ засах' : 'Шинэ үйлчилгээ нэмэх'}
                    </h2>
                    <button
                      type="button"
                      onClick={resetServiceForm}
                      aria-label="Форм хаах"
                      className="text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                        Дугаар (Index)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={svcIndex}
                        onChange={(e) => setSvcIndex(e.target.value)}
                        placeholder="01"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-white/15 text-sm text-white focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                        Ангилал
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={60}
                        value={svcCategory}
                        onChange={(e) => setSvcCategory(e.target.value)}
                        placeholder="Тоглоом хөгжүүлэлт"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-white/15 text-sm text-white focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                        Холбогдох утас
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={40}
                        value={svcPhone}
                        onChange={(e) => setSvcPhone(e.target.value)}
                        placeholder="+976 9911-2233"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-white/15 text-sm text-white focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                      Үйлчилгээний нэр
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={svcName}
                      onChange={(e) => setSvcName(e.target.value)}
                      placeholder="FC Mobile тоглоом хөгжүүлэх"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-white/15 text-sm text-white focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                      Тайлбар
                    </label>
                    <textarea
                      required
                      rows={3}
                      maxLength={500}
                      value={svcDescription}
                      onChange={(e) => setSvcDescription(e.target.value)}
                      placeholder="Үйлчилгээний дэлгэрэнгүй тайлбар..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-white/15 text-sm text-white focus:outline-none focus:border-[#EF4444] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                      Онцлох зүйлс (таслалаар тусгаарлана)
                    </label>
                    <input
                      type="text"
                      value={svcHighlights}
                      onChange={(e) => setSvcHighlights(e.target.value)}
                      placeholder="Багийн OVR өсгөх, Тактик тохиргоо, Зөвлөгөө"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-white/15 text-sm text-white focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetServiceForm}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
                    >
                      Болих
                    </button>
                    <button
                      type="submit"
                      disabled={savingService}
                      className="px-5 py-2 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                    >
                      {savingService ? 'Хадгалж байна...' : 'Хадгалах'}
                    </button>
                  </div>
                </form>
              )}

              {/* Services List */}
              {firestoreServices.length === 0 ? (
                <div className="bg-[#140407] border border-white/10 rounded-xl p-6 space-y-4">
                  <p className="text-sm text-[#CBD5E1]">
                    Одоогоор Firestore `services` цуглуулга хоосон байгаа тул сайт дээр кодонд хадгалсан үндсэн 2 үйлчилгээ харагдаж байна. Дээрх товчоор Firestore руу хуулж засах боломжтой.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES.map((svc) => (
                      <div key={svc.id} className="p-4 rounded-lg bg-[#070102] border border-white/10">
                        <p className="text-xs font-mono-code text-[#EF4444] mb-1">
                          {svc.index} · {svc.category}
                        </p>
                        <h3 className="font-display text-xl font-bold uppercase text-white mb-1">
                          {svc.name}
                        </h3>
                        <p className="text-xs text-[#94A3B8] mb-2">{svc.phone}</p>
                        <p className="text-xs text-[#CBD5E1]">{svc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {firestoreServices.map((svc) => (
                    <div
                      key={svc.id}
                      className="bg-[#140407] border border-white/10 rounded-xl p-6 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs font-mono-code text-[#EF4444] tabular-nums">
                            {svc.index} · {svc.category}
                          </span>
                          <span className="text-xs font-semibold text-[#CBD5E1] tabular-nums">
                            {svc.phone}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl font-bold uppercase text-white mb-2">
                          {svc.name}
                        </h3>
                        <p className="text-sm text-[#CBD5E1] leading-relaxed mb-3">
                          {svc.description}
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                          {svc.highlights.join(' · ')}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditService(svc)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#DC2626] text-xs font-semibold text-white transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Засах</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(svc.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-xs font-semibold text-white hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Устгах</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-1">
                    Firestore · Холбоо барих ба Зочны дэвтэр
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                    ХОЛБОО БАРИХ ХҮСЭЛТҮҮД
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1 p-1 bg-[#140407] border border-white/10 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setContactSubTab('inquiries')}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        contactSubTab === 'inquiries'
                          ? 'bg-[#DC2626] text-white'
                          : 'text-[#CBD5E1] hover:text-white'
                      }`}
                    >
                      Contact форм ({contactInquiries.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactSubTab('guestbook')}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        contactSubTab === 'guestbook'
                          ? 'bg-[#DC2626] text-white'
                          : 'text-[#CBD5E1] hover:text-white'
                      }`}
                    >
                      Зочны дэвтэр ({guestbookMessages.length})
                    </button>
                  </div>

                  {contactSubTab === 'inquiries' && (
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                      <input
                        type="text"
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        placeholder="Нэр, утас, имэйл хайх..."
                        className="pl-9 pr-4 py-2 rounded-lg bg-[#140407] border border-white/15 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {contactSubTab === 'inquiries' ? (
                <div className="bg-[#140407] border border-white/10 rounded-xl overflow-hidden">
                  {loadingData ? (
                    <div className="p-8 text-sm text-[#94A3B8]">Ачааллаж байна...</div>
                  ) : filteredInquiries.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[#94A3B8]">
                      Contact формоор илгээсэн хүсэлт олдсонгүй.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {filteredInquiries.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                              <span className="text-sm font-bold text-white">{item.name}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-[#EF4444]">{item.contact}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{formatDateTime(item.createdAt)}</span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={`font-semibold ${
                                  item.status === 'completed'
                                    ? 'text-emerald-400'
                                    : item.status === 'contacted'
                                    ? 'text-[#EF4444]'
                                    : 'text-amber-300'
                                }`}
                              >
                                {STATUS_LABELS[item.status]}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                              {item.message || 'Нэмэлт мессеж бичээгүй байна.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.status === 'new' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(item.id, 'contacted')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-[#DC2626] text-xs font-semibold text-white transition-colors cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Холбогдсон</span>
                              </button>
                            )}
                            {item.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(item.id, 'completed')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#DC2626] hover:bg-emerald-600 text-xs font-semibold text-white transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Дуусгах</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(item.id)}
                              aria-label="Хүсэлт устгах"
                              className="p-2 rounded-full text-[#94A3B8] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#140407] border border-white/10 rounded-xl overflow-hidden">
                  {guestbookMessages.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[#94A3B8]">
                      Зочны дэвтэрт сэтгэгдэл алга байна.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {guestbookMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-5 sm:p-6 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                              <span className="text-sm font-bold text-white">{msg.authorName}</span>
                              {msg.location && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-[#EF4444]">{msg.location}</span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{formatDateTime(msg.createdAt)}</span>
                            </div>
                            <p className="text-sm text-[#E2E8F0] leading-relaxed">{msg.message}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteGuestbook(msg.id)}
                            aria-label="Сэтгэгдэл устгах"
                            className="p-2 rounded-full text-[#94A3B8] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
