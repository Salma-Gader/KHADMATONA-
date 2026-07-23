"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { modal } from "@/lib/modal";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  MailIcon,
  PhoneCallIcon,
  TrashIcon,
  WhatsAppIcon,
} from "@/components/ui/action-icons";
import { LeadStatusBadge } from "@/components/leads/status-badge";
import { ApiError } from "@/lib/api";
import { deleteLead, listLeads } from "@/lib/leads";
import type { Lead, LeadType } from "@/types/lead";
import type { Pagination as PaginationData } from "@/types/property";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// Moroccan numbers are often typed in local format (e.g. "06 12 34 56 78")
// rather than E.164 - wa.me needs the full international digits with no
// leading zero, so a local trunk "0" is swapped for the "212" country code.
function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `212${digits.slice(1)}` : digits;
}

export function LeadsList({
  type,
  title,
  subtitle,
}: {
  type: LeadType;
  title: string;
  subtitle: string;
}) {
  const t = useTranslations("DashboardLeads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<number | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);

      try {
        const result = await listLeads({ type, page, search });
        if (cancelled) return;
        setLeads(result.leads);
        setPagination(result.pagination);
      } catch (caught) {
        if (cancelled) return;
        modal.error(caught instanceof ApiError ? caught.message : t("genericError"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `t` is stable per locale render
  }, [type, page, search]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleDelete(lead: Lead) {
    modal.confirm({
      message: t("confirmDelete", { name: lead.name }),
      confirmLabel: t("delete"),
      cancelLabel: t("cancel"),
      onConfirm: async () => {
        setDeletingId(lead.id);
        try {
          await deleteLead(lead.id);
          setLeads((current) => current.filter((l) => l.id !== lead.id));
          modal.success(t("deleteSuccess"));
        } catch (caught) {
          modal.error(caught instanceof ApiError ? caught.message : t("deleteError"));
        } finally {
          setDeletingId(null);
        }
      },
    });
  }

  async function handleCopyEmail(lead: Lead) {
    await navigator.clipboard.writeText(lead.email);
    setCopiedEmailId(lead.id);
    setTimeout(() => setCopiedEmailId((current) => (current === lead.id ? null : current)), 1500);
  }

  async function handleCopyPhone(lead: Lead) {
    if (!lead.phone) return;
    await navigator.clipboard.writeText(lead.phone);
    setCopiedPhoneId(lead.id);
    setTimeout(() => setCopiedPhoneId((current) => (current === lead.id ? null : current)), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full max-w-sm items-center gap-2"
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-text focus-visible:border-gold-primary"
        />
      </form>

      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : leads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center sm:p-12">
          <h3 className="font-display text-xl font-semibold text-text">{t("noResultsTitle")}</h3>
          <p className="mt-2 text-sm text-text-muted">
            {search ? t("noResultsWithSearch") : t("noResultsEmpty")}
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableHeaderCell>{t("name")}</TableHeaderCell>
              <TableHeaderCell>{t("email")}</TableHeaderCell>
              <TableHeaderCell>{t("phone")}</TableHeaderCell>
              <TableHeaderCell>{t("status")}</TableHeaderCell>
              <TableHeaderCell>{t("submittedOn")}</TableHeaderCell>
              <TableHeaderCell className="text-end">{t("actions")}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="max-w-[200px] truncate font-semibold">
                    {lead.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <MailIcon />
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(lead)}
                        title={copiedEmailId === lead.id ? t("emailCopied") : t("copyEmail")}
                        aria-label={copiedEmailId === lead.id ? t("emailCopied") : t("copyEmail")}
                        className="rounded-md p-1.5 hover:bg-surface-muted hover:text-gold-primary"
                      >
                        {copiedEmailId === lead.id ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.phone ? (
                      <div className="flex items-center gap-1">
                        <a
                          href={`https://wa.me/${toWhatsAppDigits(lead.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t("openWhatsapp")}
                          aria-label={t("openWhatsapp")}
                          className="rounded-md p-1.5 text-text-muted hover:bg-[#25D366]/15 hover:text-[#25D366]"
                        >
                          <WhatsAppIcon />
                        </a>
                        {/* Mobile: tapping straight into the dialer is more
                            useful than copying a number you can't paste
                            anywhere as easily as on desktop. */}
                        <a
                          href={`tel:${lead.phone}`}
                          title={t("callPhone")}
                          aria-label={t("callPhone")}
                          className="rounded-md p-1.5 text-text-muted hover:bg-gold-primary/15 hover:text-gold-primary sm:hidden"
                        >
                          <PhoneCallIcon />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(lead)}
                          title={copiedPhoneId === lead.id ? t("phoneCopied") : t("copyPhone")}
                          aria-label={copiedPhoneId === lead.id ? t("phoneCopied") : t("copyPhone")}
                          className="hidden rounded-md p-1.5 text-text-muted hover:bg-surface-muted hover:text-gold-primary sm:block"
                        >
                          {copiedPhoneId === lead.id ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-text-muted">{t("noPhone")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>{dateFormatter.format(new Date(lead.created_at))}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        title={t("view")}
                        aria-label={t("view")}
                        className="rounded-md p-2 text-text-muted hover:bg-surface-muted hover:text-gold-primary"
                      >
                        <EyeIcon />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead)}
                        disabled={deletingId === lead.id}
                        title={deletingId === lead.id ? t("deleting") : t("delete")}
                        aria-label={deletingId === lead.id ? t("deleting") : t("delete")}
                        className="rounded-md p-2 text-text-muted hover:bg-error/10 hover:text-error disabled:opacity-50"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
