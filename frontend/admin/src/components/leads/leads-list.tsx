"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
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
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await listLeads({ type, page, search });
        if (cancelled) return;
        setLeads(result.leads);
        setPagination(result.pagination);
      } catch (caught) {
        if (cancelled) return;
        setError(caught instanceof ApiError ? caught.message : t("genericError"));
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

  async function handleDelete(lead: Lead) {
    if (!confirm(t("confirmDelete", { name: lead.name }))) return;

    setDeletingId(lead.id);
    try {
      await deleteLead(lead.id);
      setLeads((current) => current.filter((l) => l.id !== lead.id));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t("deleteError"));
    } finally {
      setDeletingId(null);
    }
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

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
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
                  <TableCell className="max-w-[220px] truncate">
                    <bdi dir="ltr">{lead.email}</bdi>
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>{dateFormatter.format(new Date(lead.created_at))}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3 text-[0.82rem] font-semibold">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-gold-primary hover:underline"
                      >
                        {t("view")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead)}
                        disabled={deletingId === lead.id}
                        className="text-error hover:underline disabled:opacity-50"
                      >
                        {deletingId === lead.id ? t("deleting") : t("delete")}
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
