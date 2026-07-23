"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { modal } from "@/lib/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { PencilIcon, TrashIcon } from "@/components/ui/action-icons";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { deleteUser, listUsers } from "@/lib/users";
import type { User } from "@/types/api";
import type { Pagination as PaginationData } from "@/types/property";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function UsersListPage() {
  const t = useTranslations("DashboardUsers");
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);

      try {
        const result = await listUsers(page);
        if (cancelled) return;
        setUsers(result.users);
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
  }, [page]);

  function handleDelete(user: User) {
    modal.confirm({
      message: t("confirmDelete", { name: user.name }),
      confirmLabel: t("delete"),
      cancelLabel: t("cancel"),
      onConfirm: async () => {
        setDeletingId(user.id);
        try {
          await deleteUser(user.id);
          setUsers((current) => current.filter((u) => u.id !== user.id));
          modal.success(t("deleteSuccess"));
        } catch (caught) {
          modal.error(caught instanceof ApiError ? caught.message : t("deleteError"));
        } finally {
          setDeletingId(null);
        }
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-text-muted">{t("subtitle")}</p>
        </div>
        <Link href="/dashboard/users/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">{t("createUser")}</Button>
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center sm:p-12">
          <h3 className="font-display text-xl font-semibold text-text">{t("noResultsTitle")}</h3>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableHeaderCell>{t("name")}</TableHeaderCell>
              <TableHeaderCell>{t("email")}</TableHeaderCell>
              <TableHeaderCell>{t("role")}</TableHeaderCell>
              <TableHeaderCell>{t("createdOn")}</TableHeaderCell>
              <TableHeaderCell className="text-end">{t("actions")}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="max-w-[200px] truncate font-semibold">
                    {user.name}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">
                    <bdi dir="ltr">{user.email}</bdi>
                  </TableCell>
                  <TableCell>
                    {user.roles && user.roles.length > 0 ? (
                      <Badge tone="gold">{user.roles[0]}</Badge>
                    ) : (
                      <span className="text-text-muted">{t("noRole")}</span>
                    )}
                  </TableCell>
                  <TableCell>{dateFormatter.format(new Date(user.created_at))}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/dashboard/users/${user.id}/edit`}
                        title={t("edit")}
                        aria-label={t("edit")}
                        className="rounded-md p-2 text-text-muted hover:bg-surface-muted hover:text-gold-primary"
                      >
                        <PencilIcon />
                      </Link>
                      {currentUser?.id !== user.id && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                          title={deletingId === user.id ? t("deleting") : t("delete")}
                          aria-label={deletingId === user.id ? t("deleting") : t("delete")}
                          className="rounded-md p-2 text-text-muted hover:bg-error/10 hover:text-error disabled:opacity-50"
                        >
                          <TrashIcon />
                        </button>
                      )}
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
