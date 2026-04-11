import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { useSendViewModel } from "../viewModel/useSendViewModel";
import { searchRecipientsThunk } from "../state/sendThunks";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Avatar } from "@/shared/components/ui/Avatar";
import { PageShell } from "@/shared/components/layout/PageShell";
import { SkeletonCircle, SkeletonText } from "@/shared/components/ui/Skeleton";
import type { Recipient } from "../types/send.types";

function maskMobile(mobile: string): string {
  if (mobile.length < 4) return mobile;
  return `••••••${mobile.slice(-4)}`;
}

function groupByLetter(recipients: Recipient[]): Record<string, Recipient[]> {
  const groups: Record<string, Recipient[]> = {};
  for (const r of recipients) {
    const letter = r.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(r);
  }
  return groups;
}

export function SelectRecipientScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectRecipient, reset } = useSendViewModel();
  const { searchLoading, searchResults, searchError } = useSelector(
    (s: RootState) => s.send,
  );
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    void dispatch(searchRecipientsThunk(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  function handleSelect(recipient: Recipient) {
    selectRecipient(recipient);
    navigate("/send/amount");
  }

  const results = searchResults;
  const loading = searchLoading;
  const recentRecipients = results.slice(0, 4);
  const grouped = groupByLetter(results);
  const sortedLetters = Object.keys(grouped).sort();

  return (
    <PageShell topBarTitle="Send Money" showBack bottomNav>
      <div className="px-6 pt-6 pb-24 max-w-md mx-auto space-y-6">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all text-sm"
            placeholder="Search by name or mobile"
            aria-label="Search by name or mobile"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {searchError && (
          <p className="text-sm text-error text-center" role="alert">
            {searchError}
          </p>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <SkeletonCircle className="w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <SkeletonText className="w-32" />
                  <SkeletonText className="w-20 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-error-container/30 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-3xl">
                person_search
              </span>
            </div>
            <p className="text-on-surface font-bold mb-1">No contacts found</p>
            <p className="text-on-surface-variant text-sm">
              Try a different name or mobile number
            </p>
          </div>
        ) : (
          <>
            {/* Recent Recipients */}
            {!query && (
              <section>
                <p className="text-xs font-extrabold tracking-widest text-secondary uppercase opacity-70 mb-3">
                  Recent Recipients
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {recentRecipients.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelect(r)}
                      className="bg-surface-container-lowest rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98]"
                    >
                      <Avatar name={r.name} src={r.avatar} size="lg" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-on-surface truncate max-w-full">
                          {r.name}
                        </p>
                        <p className="text-[10px] text-outline">
                          {maskMobile(r.mobile)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* A-Z Contacts */}
            <section className="space-y-4">
              {sortedLetters.map((letter) => (
                <div key={letter}>
                  <p className="text-xs font-extrabold tracking-widest text-secondary uppercase opacity-70 mb-2">
                    {letter}
                  </p>
                  <div className="space-y-1">
                    {grouped[letter].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect(r)}
                        className="w-full flex items-center p-3 rounded-xl bg-surface-container-lowest/40 hover:bg-surface-container-lowest transition-colors"
                      >
                        <Avatar
                          name={r.name}
                          src={r.avatar}
                          size="md"
                          className="mr-4"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-on-surface">
                            {r.name}
                          </p>
                          <p className="text-xs text-outline">
                            {maskMobile(r.mobile)}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant">
                          chevron_right
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </PageShell>
  );
}
