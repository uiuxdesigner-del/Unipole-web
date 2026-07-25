"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PARAM = "site";

/** Set when `open()` pushes a new history entry, so `close()` knows whether `back()` is safe. */
let openedViaPush = false;

/**
 * Navigates to `?site=<id>`. Only uses `useRouter`/`usePathname` (not `useSearchParams`), so
 * it needs no Suspense boundary — safe to call from every inventory card.
 */
export function useOpenUnipoleModal() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (id: string) => {
      openedViaPush = true;
      router.push(`${pathname}?${PARAM}=${encodeURIComponent(id)}`, { scroll: false });
    },
    [router, pathname]
  );
}

/**
 * Reads the active `?site=` id and exposes a safe `close()`. Uses `useSearchParams`, so the
 * component calling this must be rendered inside a `<Suspense>` boundary (see
 * `UnipoleDetailModalController`) to avoid opting the whole page out of static rendering.
 */
export function useUnipoleModalState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeId = searchParams.get(PARAM);

  const close = useCallback(() => {
    if (openedViaPush) {
      openedViaPush = false;
      router.back();
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  return { activeId, close };
}
