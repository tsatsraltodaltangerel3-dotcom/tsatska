import React, { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Check, Heart, LogIn, LogOut, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../context/FirebaseContext';

interface GuestbookEntry {
  id: string;
  authorId: string;
  authorName: string;
  location?: string;
  message: string;
  createdAt?: Timestamp | null;
}

interface CheerEntry {
  id: string;
  userId: string;
  supporterName: string;
}

interface TrainingLogEntry {
  id: string;
  ownerId: string;
  title: string;
  focusArea: string;
  durationMinutes: number;
  status: 'planned' | 'completed';
  createdAt?: Timestamp | null;
}

function formatDate(ts?: Timestamp | null): string {
  if (!ts) return 'Саяхан';
  try {
    return ts.toDate().toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Саяхан';
  }
}

export const CommunitySection: React.FC = () => {
  const { user, authReady, isAdmin, authError, signInWithGoogle, logOut } = useFirebase();

  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [cheers, setCheers] = useState<CheerEntry[]>([]);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Guestbook form state
  const [locationInput, setLocationInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [submittingMessage, setSubmittingMessage] = useState(false);

  // Cheer toggle state
  const [togglingCheer, setTogglingCheer] = useState(false);

  // Admin training log form state
  const [logTitle, setLogTitle] = useState('');
  const [logFocus, setLogFocus] = useState('');
  const [logDuration, setLogDuration] = useState('60');
  const [submittingLog, setSubmittingLog] = useState(false);

  const fetchPublicSnapshot = useCallback(async () => {
    setLoading(true);
    try {
      const gbQuery = query(
        collection(db, 'guestbook'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const cheersQuery = query(collection(db, 'cheers'), limit(100));
      const logsQuery = query(
        collection(db, 'trainingLogs'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const [gbSnap, cheersSnap, logsSnap] = await Promise.all([
        getDocs(gbQuery),
        getDocs(cheersQuery),
        getDocs(logsQuery),
      ]);

      setMessages(
        gbSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GuestbookEntry, 'id'>) }))
      );
      setCheers(
        cheersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CheerEntry, 'id'>) }))
      );
      setTrainingLogs(
        logsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TrainingLogEntry, 'id'>) }))
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.LIST, 'guestbook');
      } catch {
        setActionError('Мэдээлэл ачаалахад алдаа гарлаа.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;

    // Attach real-time onSnapshot listeners when authenticated, otherwise load public snapshot once
    if (!user) {
      fetchPublicSnapshot();
      return;
    }

    const gbQuery = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const cheersQuery = query(collection(db, 'cheers'), limit(100));
    const logsQuery = query(
      collection(db, 'trainingLogs'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubGb = onSnapshot(
      gbQuery,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GuestbookEntry, 'id'>) }))
        );
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'guestbook');
      }
    );

    const unsubCheers = onSnapshot(
      cheersQuery,
      (snapshot) => {
        setCheers(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CheerEntry, 'id'>) }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'cheers');
      }
    );

    const unsubLogs = onSnapshot(
      logsQuery,
      (snapshot) => {
        setTrainingLogs(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<TrainingLogEntry, 'id'>),
          }))
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'trainingLogs');
      }
    );

    return () => {
      unsubGb();
      unsubCheers();
      unsubLogs();
    };
  }, [authReady, user, fetchPublicSnapshot]);

  const hasCheered = Boolean(user && cheers.some((c) => c.id === user.uid));

  const handleToggleCheer = async () => {
    setActionError(null);
    if (!user) {
      await signInWithGoogle();
      return;
    }
    if (!user.emailVerified) {
      setActionError('Имэйл баталгаажсан Google бүртгэл шаардлагатай.');
      return;
    }

    setTogglingCheer(true);
    const cheerPath = `cheers/${user.uid}`;
    try {
      if (hasCheered) {
        await deleteDoc(doc(db, 'cheers', user.uid));
      } else {
        const displayName = (user.displayName || 'Дэмжигч').trim().slice(0, 80) || 'Дэмжигч';
        await setDoc(doc(db, 'cheers', user.uid), {
          userId: user.uid,
          supporterName: displayName,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, cheerPath);
      } catch {
        setActionError('Дэмжлэг хадгалах үед алдаа гарлаа.');
      }
    } finally {
      setTogglingCheer(false);
    }
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!user) {
      await signInWithGoogle();
      return;
    }

    const cleanMessage = messageInput.trim().slice(0, 400);
    const cleanLocation = locationInput.trim().slice(0, 80);
    if (!cleanMessage) return;

    setSubmittingMessage(true);
    try {
      const authorName = (user.displayName || 'Зочин').trim().slice(0, 80) || 'Зочин';
      const payload: Record<string, unknown> = {
        authorId: user.uid,
        authorName,
        message: cleanMessage,
        createdAt: serverTimestamp(),
      };
      if (cleanLocation) {
        payload.location = cleanLocation;
      }

      await addDoc(collection(db, 'guestbook'), payload);
      setMessageInput('');
      setLocationInput('');
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'guestbook');
      } catch {
        setActionError('Сэтгэгдэл илгээх үед алдаа гарлаа.');
      }
    } finally {
      setSubmittingMessage(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    setActionError(null);
    try {
      await deleteDoc(doc(db, 'guestbook', id));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `guestbook/${id}`);
      } catch {
        setActionError('Устгах эрх хүрэлцэхгүй байна.');
      }
    }
  };

  const handleCreateTrainingLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    setActionError(null);

    const title = logTitle.trim().slice(0, 120);
    const focusArea = logFocus.trim().slice(0, 80);
    const durationMinutes = Math.min(600, Math.max(5, Number(logDuration) || 60));
    if (!title || !focusArea) return;

    setSubmittingLog(true);
    try {
      await addDoc(collection(db, 'trainingLogs'), {
        ownerId: user.uid,
        title,
        focusArea,
        durationMinutes,
        status: 'planned',
        createdAt: serverTimestamp(),
      });
      setLogTitle('');
      setLogFocus('');
      setLogDuration('60');
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'trainingLogs');
      } catch {
        setActionError('Бэлтгэлийн тэмдэглэл нэмэхэд алдаа гарлаа.');
      }
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleCompleteTrainingLog = async (id: string) => {
    if (!user || !isAdmin) return;
    setActionError(null);
    try {
      await updateDoc(doc(db, 'trainingLogs', id), {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `trainingLogs/${id}`);
      } catch {
        setActionError('Төлөв шинэчлэхэд алдаа гарлаа.');
      }
    }
  };

  return (
    <section id="community" className="py-20 lg:py-28 bg-[#070102] bg-[radial-gradient(ellipse_at_top_left,_rgba(127,29,29,0.25)_0%,_rgba(7,1,2,1)_70%)] text-white border-t border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-12 border-b border-red-500/20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EF4444] mb-2">
              Firebase Cloud Firestore · Бодит цагийн холболт
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white [text-wrap:balance]">
              ДЭМЖИГЧИД БА <span className="text-[#EF4444]">БЭЛТГЭЛ</span>
            </h2>
          </div>

          {/* Google Auth Control */}
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-[#140407] border border-red-500/25 rounded-full pl-4 pr-2 py-1.5">
                <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[180px]">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={logOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#DC2626] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Гарах</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Google-ээр нэвтрэх</span>
              </button>
            )}
          </div>
        </div>

        {(authError || actionError) && (
          <div
            role="alert"
            className="mb-8 px-5 py-3.5 rounded-lg bg-red-950/60 border border-red-400/40 text-sm text-red-100"
          >
            {authError || actionError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Supporter Cheer Counter & Live Training Logs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Cheer Counter Card */}
            <div className="bg-[#140407] border border-red-500/20 rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#EF4444] mb-1">
                    Шууд дэмжлэг
                  </p>
                  <div className="font-display text-4xl sm:text-5xl font-bold text-white tabular-nums">
                    {cheers.length}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={togglingCheer}
                  onClick={handleToggleCheer}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    hasCheered
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-white/10 hover:bg-[#DC2626] text-white border border-red-500/25'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasCheered ? 'fill-current' : ''}`} />
                  <span>{hasCheered ? 'Дэмжсэн' : 'Дэмжих'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                Google бүртгэлээрээ нэг удаа дэмжих дарж Цацралт-Одын хөл бөмбөгийн замналд урам өгөөрэй.
              </p>
            </div>

            {/* Training Logs Card */}
            <div className="bg-[#140407] border border-red-500/20 rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  БЭЛТГЭЛИЙН <span className="text-[#EF4444]">ТЭМДЭГЛЭЛ</span>
                </h3>
                <span className="font-mono-code text-xs text-[#94A3B8] tabular-nums">
                  {trainingLogs.length} бичлэг
                </span>
              </div>

              {isAdmin && (
                <form onSubmit={handleCreateTrainingLog} className="mb-6 pb-6 border-b border-red-500/15 space-y-3">
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={logTitle}
                    onChange={(e) => setLogTitle(e.target.value)}
                    placeholder="Бэлтгэлийн нэр (ж.нь: Хурд ба пассын дасгал)"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#070102] border border-red-500/20 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#EF4444]"
                  />
                  <div className="grid grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={logFocus}
                      onChange={(e) => setLogFocus(e.target.value)}
                      placeholder="Чиглэл (Техник)"
                      className="col-span-2 px-3.5 py-2.5 rounded-lg bg-[#070102] border border-red-500/20 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#EF4444]"
                    />
                    <input
                      type="number"
                      min={5}
                      max={600}
                      required
                      value={logDuration}
                      onChange={(e) => setLogDuration(e.target.value)}
                      placeholder="Минут"
                      className="px-3 py-2.5 rounded-lg bg-[#070102] border border-red-500/20 text-sm text-white tabular-nums focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingLog}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{submittingLog ? 'Хадгалж байна...' : 'Бэлтгэл нэмэх'}</span>
                  </button>
                </form>
              )}

              {loading ? (
                <p className="text-sm text-[#94A3B8]">Бэлтгэлийн мэдээлэл ачааллаж байна...</p>
              ) : trainingLogs.length === 0 ? (
                <p className="text-sm text-[#94A3B8]">
                  Одоогоор нэмэгдсэн бэлтгэлийн тэмдэглэл байхгүй байна.
                </p>
              ) : (
                <div className="divide-y divide-red-500/15">
                  {trainingLogs.map((log) => (
                    <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{log.title}</p>
                        <p className="text-xs text-[#94A3B8] tabular-nums">
                          {log.focusArea} · {log.durationMinutes} мин ·{' '}
                          <span className={log.status === 'completed' ? 'text-[#EF4444]' : 'text-[#CBD5E1]'}>
                            {log.status === 'completed' ? 'Дууссан' : 'Төлөвлөсөн'}
                          </span>
                        </p>
                      </div>
                      {isAdmin && log.status === 'planned' && (
                        <button
                          type="button"
                          onClick={() => handleCompleteTrainingLog(log.id)}
                          aria-label="Бэлтгэлийг дууссан болгох"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#DC2626] text-xs font-semibold text-white transition-colors cursor-pointer shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Дуусгах</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Real-Time Supporter Guestbook */}
          <div className="lg:col-span-7 bg-[#140407] border border-red-500/20 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-red-500/15">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#EF4444]" aria-hidden="true" />
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                  ЗОЧНЫ ДЭВТЭР
                </h3>
              </div>
              <span className="text-xs font-medium text-[#94A3B8] tabular-nums">
                {messages.length} сэтгэгдэл
              </span>
            </div>

            {/* Composer */}
            <form onSubmit={handlePostMessage} className="mb-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  maxLength={80}
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Хот эсвэл клуб (заавал биш)"
                  className="px-4 py-2.5 rounded-lg bg-[#070102] border border-red-500/20 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#EF4444]"
                />
                <input
                  type="text"
                  required
                  maxLength={400}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    user
                      ? 'Урам зоригийн сэтгэгдлээ бичнэ үү...'
                      : 'Сэтгэгдэл бичихийн тулд Google-ээр нэвтэрнэ үү...'
                  }
                  className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-[#070102] border border-red-500/20 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-[#94A3B8]">
                  {user
                    ? `${user.displayName || 'Зочин'} нэрээр нийтлэгдэнэ`
                    : 'Нийтлэхийн тулд Google баталгаажуулалт хийнэ'}
                </span>
                {user ? (
                  <button
                    type="submit"
                    disabled={submittingMessage}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>
                      {submittingMessage ? 'Илгээж байна...' : 'Сэтгэгдэл үлдээх'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Google-ээр нэвтрэх</span>
                  </button>
                )}
              </div>
            </form>

            {/* Messages Feed */}
            {loading ? (
              <p className="text-sm text-[#94A3B8]">Сэтгэгдлүүдийг ачааллаж байна...</p>
            ) : messages.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-red-500/25 rounded-lg">
                <p className="text-sm text-[#CBD5E1]">
                  Анхны дэмжлэгийн сэтгэгдлийг үлдээнэ үү.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-red-500/15">
                {messages.map((item) => {
                  const canDelete = Boolean(
                    user && (isAdmin || user.uid === item.authorId)
                  );
                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                          <span className="font-bold text-white text-sm">
                            {item.authorName}
                          </span>
                          {item.location && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#EF4444]">{item.location}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{formatDate(item.createdAt)}</span>
                        </div>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(item.id)}
                            aria-label="Сэтгэгдэл устгах"
                            className="p-1.5 text-[#94A3B8] hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
