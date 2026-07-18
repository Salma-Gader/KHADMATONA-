"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
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
import { PostStatusBadge } from "@/components/blog/post-status-badge";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ApiError } from "@/lib/api";
import { deletePost, listPosts } from "@/lib/blog";
import type { Pagination as PaginationData } from "@/types/property";
import type { Post } from "@/types/blog";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function BlogListPage() {
  const t = useTranslations("DashboardBlog");
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await listPosts({ page });
        if (cancelled) return;
        setPosts(result.posts);
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
  }, [page]);

  async function handleDelete(post: Post) {
    if (!confirm(t("confirmDelete", { title: post.title }))) return;

    setDeletingId(post.id);
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((p) => p.id !== post.id));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t("deleteError"));
    } finally {
      setDeletingId(null);
    }
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
        <Link href="/dashboard/blog/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">{t("addPost")}</Button>
        </Link>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center sm:p-12">
          <h3 className="font-display text-xl font-semibold text-text">
            {t("noResultsTitle")}
          </h3>
          <p className="mt-2 text-sm text-text-muted">{t("noResultsEmpty")}</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableHeaderCell>{t("titleColumn")}</TableHeaderCell>
              <TableHeaderCell>{t("status")}</TableHeaderCell>
              <TableHeaderCell>{t("publishedAt")}</TableHeaderCell>
              <TableHeaderCell className="text-end">{t("actions")}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-[280px] truncate font-semibold">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <PostStatusBadge status={post.status} />
                  </TableCell>
                  <TableCell>
                    {post.published_at ? dateFormatter.format(new Date(post.published_at)) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3 text-[0.82rem] font-semibold">
                      <Link
                        href={`/dashboard/blog/${post.slug}/edit`}
                        className="text-gold-primary hover:underline"
                      >
                        {t("edit")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        disabled={deletingId === post.id}
                        className="text-error hover:underline disabled:opacity-50"
                      >
                        {deletingId === post.id ? t("deleting") : t("delete")}
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
