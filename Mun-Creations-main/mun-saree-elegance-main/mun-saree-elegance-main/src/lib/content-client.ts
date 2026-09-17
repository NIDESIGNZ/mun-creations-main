import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  SiteContent,
  HomepageContent,
  AboutContent,
  CategoriesContent,
  CategoryPageItem,
  ShippingContent,
  ReturnsContent,
  ContactContent,
  FAQItem,
  PrivacyContent,
  TermsContent,
  FooterContent,
  SEOContent,
} from "./content-defaults";
import { DEFAULT_SITE_CONTENT } from "./content-defaults";

export type {
  SiteContent,
  HomepageContent,
  AboutContent,
  CategoriesContent,
  CategoryPageItem,
  ShippingContent,
  ReturnsContent,
  ContactContent,
  FAQItem,
  PrivacyContent,
  TermsContent,
  FooterContent,
  SEOContent,
};

export { DEFAULT_SITE_CONTENT };

const CONTENT_QUERY_KEY = ["site_content"];

async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch("/api/content");
    if (!res.ok) {
      throw new Error(`Failed to fetch content: ${res.statusText}`);
    }
    const data = await res.json();
    if (data && data.content) {
      return data.content;
    }
    return DEFAULT_SITE_CONTENT;
  } catch (err) {
    console.warn("[content-client] Network error fetching site content, using defaults:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

/**
 * Hook to retrieve full site content with instant fallback to specifications
 */
export function useSiteContent() {
  const query = useQuery<SiteContent>({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchSiteContent,
    initialData: DEFAULT_SITE_CONTENT,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    content: query.data || DEFAULT_SITE_CONTENT,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook to retrieve a specific section of site content
 */
export function useSectionContent<K extends keyof SiteContent>(section: K): {
  data: SiteContent[K];
  isLoading: boolean;
  refetch: () => void;
} {
  const { content, isLoading, refetch } = useSiteContent();
  return {
    data: content[section] || DEFAULT_SITE_CONTENT[section],
    isLoading,
    refetch,
  };
}

/**
 * Admin API: Save updated section content
 */
export async function updateAdminContent<K extends keyof SiteContent>(
  section: K,
  data: Partial<SiteContent[K]>,
  token?: string | null
): Promise<{ success: boolean; data?: SiteContent[K]; error?: string }> {
  const effectiveToken =
    token || (typeof window !== "undefined" ? localStorage.getItem("mun_admin_token") : null);

  const res = await fetch(`/api/admin/content/${String(section)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: effectiveToken ? `Bearer ${effectiveToken}` : "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errData.error || `HTTP ${res.status}: Failed to save content`,
    };
  }

  const resData = await res.json();
  return {
    success: true,
    data: resData.data,
  };
}

/**
 * Admin API: Reset site content to specification defaults
 */
export async function resetAdminContent(
  token?: string | null
): Promise<{ success: boolean; content?: SiteContent; error?: string }> {
  const effectiveToken =
    token || (typeof window !== "undefined" ? localStorage.getItem("mun_admin_token") : null);

  const res = await fetch("/api/admin/content/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: effectiveToken ? `Bearer ${effectiveToken}` : "",
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errData.error || `HTTP ${res.status}: Failed to reset content`,
    };
  }

  const resData = await res.json();
  return {
    success: true,
    content: resData.content,
  };
}

/**
 * Mutation hook for updating content in the admin portal
 */
export function useUpdateAdminContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      section,
      data,
    }: {
      section: keyof SiteContent;
      data: any;
    }) => {
      const result = await updateAdminContent(section, data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update content");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}
