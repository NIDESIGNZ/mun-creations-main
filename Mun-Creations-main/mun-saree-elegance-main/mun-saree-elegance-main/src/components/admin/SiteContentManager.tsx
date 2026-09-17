import React, { useState, useEffect } from "react";
import {
  useSiteContent,
  useUpdateAdminContent,
  resetAdminContent,
  SiteContent,
  HomepageContent,
  AboutContent,
  CategoriesContent,
  ShippingContent,
  ReturnsContent,
  ContactContent,
  FAQItem,
  PrivacyContent,
  TermsContent,
  FooterContent,
  SEOContent,
} from "../../lib/content-client";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Home,
  Info,
  Tag,
  Truck,
  RotateCcw as ReturnsIcon,
  MessageSquare,
  HelpCircle,
  Shield,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

export function SiteContentManager() {
  const { content, isLoading, refetch } = useSiteContent();
  const updateMutation = useUpdateAdminContent();

  const [activeSection, setActiveSection] = useState<keyof SiteContent>("homepage");
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  const showStatus = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleSaveSection = async (sectionKey: keyof SiteContent) => {
    try {
      const dataToSave = localContent[sectionKey];
      await updateMutation.mutateAsync({
        section: sectionKey,
        data: dataToSave,
      });
      showStatus(`Section "${String(sectionKey).toUpperCase()}" updated successfully!`);
      refetch();
    } catch (err: any) {
      showStatus(err.message || "Failed to save section changes.", "error");
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Are you sure you want to reset all site content and SEO metadata to default specifications? Custom edits will be overwritten.")) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await resetAdminContent();
      if (res.success && res.content) {
        setLocalContent(res.content);
        showStatus("All site content successfully reset to default specifications!");
        refetch();
      } else {
        showStatus(res.error || "Failed to reset content.", "error");
      }
    } catch (err: any) {
      showStatus(err.message || "Network error while resetting content.", "error");
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading && !localContent) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading CMS content...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--gold)]">
              Dynamic Website CMS & SEO Engine
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mt-1">
            Site Content & Metadata Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit live storefront copywriting, category descriptions, SEO keywords, policy clauses, and WhatsApp support links in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            disabled={isResetting}
            className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            title="Revert all sections to default specifications"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={() => handleSaveSection(activeSection)}
            disabled={updateMutation.isPending}
            className="px-4 py-2 rounded bg-[var(--gold)] hover:bg-white text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{updateMutation.isPending ? "Saving..." : `Save ${activeSection.toUpperCase()}`}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded border text-xs font-medium flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
              : "bg-red-950/40 border-red-800/60 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main editor tabs and form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1 text-xs">
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            Content Sections
          </div>

          {[
            { id: "homepage", label: "Homepage & Hero", icon: Home },
            { id: "about", label: "About Us & Story", icon: Info },
            { id: "categories", label: "Categories (7 Collections)", icon: Tag },
            { id: "shipping", label: "Shipping & Delivery", icon: Truck },
            { id: "returns", label: "Returns & WhatsApp", icon: ReturnsIcon },
            { id: "contact", label: "Contact Us & Support", icon: MessageSquare },
            { id: "faqs", label: "Frequently Asked Questions", icon: HelpCircle },
            { id: "privacy", label: "Privacy Policy", icon: Shield },
            { id: "terms", label: "Terms & Conditions", icon: FileText },
            { id: "footer", label: "Footer & Branding", icon: FileText },
            { id: "seo", label: "Global SEO Keywords", icon: Search },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as keyof SiteContent)}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--gold)] text-slate-950 font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Workspace */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded p-6">
          {/* HOMEPAGE SECTION */}
          {activeSection === "homepage" && localContent.homepage && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Homepage Content & SEO</h3>
                <p className="text-slate-400 mt-0.5">Edit hero typography, brand introduction, and call-to-actions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">SEO Meta Title</label>
                  <input
                    type="text"
                    value={localContent.homepage.seoTitle || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: { ...localContent.homepage, seoTitle: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={localContent.homepage.metaDescription || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: { ...localContent.homepage, metaDescription: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-slate-800 font-bold text-slate-200">
                  Hero Section
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Hero Main Title</label>
                  <input
                    type="text"
                    value={localContent.homepage.hero?.title || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          hero: { ...localContent.homepage.hero, title: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={localContent.homepage.hero?.subtitle || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          hero: { ...localContent.homepage.hero, subtitle: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Hero Secondary Description</label>
                  <textarea
                    rows={2}
                    value={localContent.homepage.hero?.description || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          hero: { ...localContent.homepage.hero, description: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Primary CTA Label</label>
                  <input
                    type="text"
                    value={localContent.homepage.hero?.ctaText || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          hero: { ...localContent.homepage.hero, ctaText: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Secondary CTA Label</label>
                  <input
                    type="text"
                    value={localContent.homepage.hero?.cta2Text || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          hero: { ...localContent.homepage.hero, cta2Text: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-slate-800 font-bold text-slate-200">
                  Short Brand Introduction
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Intro Title</label>
                  <input
                    type="text"
                    value={localContent.homepage.brandIntro?.title || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandIntro: { ...localContent.homepage.brandIntro, title: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Paragraph 1</label>
                  <textarea
                    rows={2}
                    value={localContent.homepage.brandIntro?.p1 || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandIntro: { ...localContent.homepage.brandIntro, p1: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Paragraph 2</label>
                  <textarea
                    rows={2}
                    value={localContent.homepage.brandIntro?.p2 || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandIntro: { ...localContent.homepage.brandIntro, p2: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Paragraph 3</label>
                  <textarea
                    rows={2}
                    value={localContent.homepage.brandIntro?.p3 || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandIntro: { ...localContent.homepage.brandIntro, p3: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-slate-800 font-bold text-slate-200">
                  Brand Story Section
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Eyebrow</label>
                  <input
                    type="text"
                    value={localContent.homepage.brandStory?.eyebrow || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandStory: { ...localContent.homepage.brandStory, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Story Title</label>
                  <input
                    type="text"
                    value={localContent.homepage.brandStory?.title || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandStory: { ...localContent.homepage.brandStory, title: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold block mb-1 text-slate-300">Story Narrative</label>
                  <textarea
                    rows={3}
                    value={localContent.homepage.brandStory?.body || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        homepage: {
                          ...localContent.homepage,
                          brandStory: { ...localContent.homepage.brandStory, body: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeSection === "about" && localContent.about && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">About Us Page Content</h3>
                <p className="text-slate-400 mt-0.5">Heritage narrative, brand philosophy, and our promise.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">SEO Meta Title</label>
                  <input
                    type="text"
                    value={localContent.about.seoTitle || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        about: { ...localContent.about, seoTitle: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={localContent.about.metaDescription || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        about: { ...localContent.about, metaDescription: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Eyebrow</label>
                    <input
                      type="text"
                      value={localContent.about.eyebrow || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          about: { ...localContent.about, eyebrow: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Header Title</label>
                    <input
                      type="text"
                      value={localContent.about.title || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          about: { ...localContent.about, title: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Introduction Paragraph 1</label>
                  <textarea
                    rows={2}
                    value={localContent.about.introP1 || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        about: { ...localContent.about, introP1: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Introduction Paragraph 2</label>
                  <textarea
                    rows={2}
                    value={localContent.about.introP2 || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        about: { ...localContent.about, introP2: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Introduction Paragraph 3</label>
                  <textarea
                    rows={2}
                    value={localContent.about.introP3 || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        about: { ...localContent.about, introP3: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="font-bold text-slate-200 mb-2">Our Promise</div>
                  <textarea
                    rows={2}
                    value={localContent.about.promise?.description || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        about: {
                          ...localContent.about,
                          promise: { ...localContent.about.promise, description: e.target.value },
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES SECTION */}
          {activeSection === "categories" && localContent.categories && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Category Pages & Descriptions</h3>
                <p className="text-slate-400 mt-0.5">Specifications 3 to 9: Sarees, Banarasi, Tussar, Kanjivaram, Designer, Handloom, and Festive/Wedding.</p>
              </div>

              {Object.entries(localContent.categories).map(([slug, item]) => (
                <div key={slug} className="p-4 bg-slate-950 border border-slate-800 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase font-bold text-[var(--gold)] text-xs">
                      {slug.toUpperCase()} ({item.title})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-400">SEO Title</label>
                      <input
                        type="text"
                        value={item.seoTitle || ""}
                        onChange={(e) => {
                          const updated = { ...localContent.categories };
                          updated[slug] = { ...updated[slug], seoTitle: e.target.value };
                          setLocalContent({ ...localContent, categories: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-slate-400">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={item.subtitle || ""}
                        onChange={(e) => {
                          const updated = { ...localContent.categories };
                          updated[slug] = { ...updated[slug], subtitle: e.target.value };
                          setLocalContent({ ...localContent, categories: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-semibold block mb-1 text-slate-400">Meta Description</label>
                      <input
                        type="text"
                        value={item.metaDescription || ""}
                        onChange={(e) => {
                          const updated = { ...localContent.categories };
                          updated[slug] = { ...updated[slug], metaDescription: e.target.value };
                          setLocalContent({ ...localContent, categories: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-semibold block mb-1 text-slate-400">Category Narrative & Description</label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => {
                          const updated = { ...localContent.categories };
                          updated[slug] = { ...updated[slug], description: e.target.value };
                          setLocalContent({ ...localContent, categories: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SHIPPING SECTION */}
          {activeSection === "shipping" && localContent.shipping && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Shipping & Delivery Policy</h3>
                <p className="text-slate-400 mt-0.5">Order processing, international dispatch rules, and customer support.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">SEO Title</label>
                  <input
                    type="text"
                    value={localContent.shipping.seoTitle || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        shipping: { ...localContent.shipping, seoTitle: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">SEO Meta Description</label>
                  <input
                    type="text"
                    value={localContent.shipping.metaDescription || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        shipping: { ...localContent.shipping, metaDescription: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Page Title</label>
                    <input
                      type="text"
                      value={localContent.shipping.title || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          shipping: { ...localContent.shipping, title: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Subtitle</label>
                    <input
                      type="text"
                      value={localContent.shipping.subtitle || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          shipping: { ...localContent.shipping, subtitle: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Introduction</label>
                  <textarea
                    rows={2}
                    value={localContent.shipping.intro || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        shipping: { ...localContent.shipping, intro: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Order Processing Details</label>
                  <textarea
                    rows={2}
                    value={localContent.shipping.orderProcessingBody || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        shipping: { ...localContent.shipping, orderProcessingBody: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">International Shipping Terms</label>
                  <textarea
                    rows={2}
                    value={localContent.shipping.internationalShippingBody || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        shipping: { ...localContent.shipping, internationalShippingBody: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Support WhatsApp Number</label>
                    <input
                      type="text"
                      value={localContent.shipping.whatsappNumber || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          shipping: { ...localContent.shipping, whatsappNumber: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Support WhatsApp URL</label>
                    <input
                      type="text"
                      value={localContent.shipping.whatsappUrl || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          shipping: { ...localContent.shipping, whatsappUrl: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RETURNS SECTION */}
          {activeSection === "returns" && localContent.returns && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Returns & Customer Service</h3>
                <p className="text-slate-400 mt-0.5">WhatsApp-direct return assistance and instructions.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">SEO Title</label>
                  <input
                    type="text"
                    value={localContent.returns.seoTitle || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        returns: { ...localContent.returns, seoTitle: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Instructions & Policy Body</label>
                  <textarea
                    rows={3}
                    value={localContent.returns.body || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        returns: { ...localContent.returns, body: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Returns WhatsApp Number</label>
                    <input
                      type="text"
                      value={localContent.returns.whatsappNumber || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          returns: { ...localContent.returns, whatsappNumber: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Button CTA Text</label>
                    <input
                      type="text"
                      value={localContent.returns.buttonText || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          returns: { ...localContent.returns, buttonText: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Returns WhatsApp Direct URL</label>
                  <input
                    type="text"
                    value={localContent.returns.whatsappUrl || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        returns: { ...localContent.returns, whatsappUrl: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Important Customer Note</label>
                  <input
                    type="text"
                    value={localContent.returns.note || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        returns: { ...localContent.returns, note: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTACT SECTION */}
          {activeSection === "contact" && localContent.contact && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Contact Us Page</h3>
                <p className="text-slate-400 mt-0.5">Product enquiry protocols, order assistance instructions, and WhatsApp contact details.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">SEO Title</label>
                  <input
                    type="text"
                    value={localContent.contact.seoTitle || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        contact: { ...localContent.contact, seoTitle: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Main Description</label>
                  <textarea
                    rows={2}
                    value={localContent.contact.body || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        contact: { ...localContent.contact, body: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      value={localContent.contact.whatsappNumber || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, whatsappNumber: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">WhatsApp Direct URL</label>
                    <input
                      type="text"
                      value={localContent.contact.whatsappUrl || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          contact: { ...localContent.contact, whatsappUrl: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Product Enquiries Instructions</label>
                  <textarea
                    rows={2}
                    value={localContent.contact.productEnquiriesBody || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        contact: { ...localContent.contact, productEnquiriesBody: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Order Assistance Instructions</label>
                  <textarea
                    rows={2}
                    value={localContent.contact.orderAssistanceBody || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        contact: { ...localContent.contact, orderAssistanceBody: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FAQS SECTION */}
          {activeSection === "faqs" && Array.isArray(localContent.faqs) && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Frequently Asked Questions (FAQ)</h3>
                  <p className="text-slate-400 mt-0.5">Manage customer questions, delivery details, and return instructions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: `faq_${Date.now()}`,
                      question: "New FAQ Question",
                      answer: "Answer to the new question.",
                    };
                    setLocalContent({
                      ...localContent,
                      faqs: [...localContent.faqs, newFaq],
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Plus className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {localContent.faqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 font-mono">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = localContent.faqs.filter((_, i) => i !== idx);
                          setLocalContent({ ...localContent, faqs: updated });
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-slate-400">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...localContent.faqs];
                          updated[idx] = { ...updated[idx], question: e.target.value };
                          setLocalContent({ ...localContent, faqs: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-slate-400">Answer</label>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...localContent.faqs];
                          updated[idx] = { ...updated[idx], answer: e.target.value };
                          setLocalContent({ ...localContent, faqs: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POLICIES (PRIVACY & TERMS) */}
          {(activeSection === "privacy" || activeSection === "terms") && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {activeSection === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                </h3>
                <p className="text-slate-400 mt-0.5">Legal compliance clauses and customer commitments.</p>
              </div>

              {activeSection === "privacy" && localContent.privacy && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">SEO Title</label>
                    <input
                      type="text"
                      value={localContent.privacy.seoTitle || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          privacy: { ...localContent.privacy, seoTitle: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Policy Introduction</label>
                    <textarea
                      rows={2}
                      value={localContent.privacy.intro || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          privacy: { ...localContent.privacy, intro: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Payment Processor Security Note</label>
                    <textarea
                      rows={2}
                      value={localContent.privacy.paymentNote || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          privacy: { ...localContent.privacy, paymentNote: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>
              )}

              {activeSection === "terms" && localContent.terms && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">SEO Title</label>
                    <input
                      type="text"
                      value={localContent.terms.seoTitle || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          terms: { ...localContent.terms, seoTitle: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-slate-300">
                      Terms Points (one per line)
                    </label>
                    <textarea
                      rows={8}
                      value={Array.isArray(localContent.terms.points) ? localContent.terms.points.join("\n") : ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          terms: {
                            ...localContent.terms,
                            points: e.target.value.split("\n").filter((p) => p.trim().length > 0),
                          },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FOOTER SECTION */}
          {activeSection === "footer" && localContent.footer && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Footer & Brand Identity</h3>
                <p className="text-slate-400 mt-0.5">Specification 17: Brand name, tagline, description, WhatsApp link, and copyright notice.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Brand Name</label>
                    <input
                      type="text"
                      value={localContent.footer.brandName || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          footer: { ...localContent.footer, brandName: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Brand Tagline</label>
                    <input
                      type="text"
                      value={localContent.footer.tagline || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          footer: { ...localContent.footer, tagline: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">Footer Description</label>
                  <textarea
                    rows={2}
                    value={localContent.footer.description || ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        footer: { ...localContent.footer, description: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Footer WhatsApp Phone</label>
                    <input
                      type="text"
                      value={localContent.footer.whatsappNumber || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          footer: { ...localContent.footer, whatsappNumber: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Footer WhatsApp URL</label>
                    <input
                      type="text"
                      value={localContent.footer.whatsappUrl || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          footer: { ...localContent.footer, whatsappUrl: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Copyright Line</label>
                    <input
                      type="text"
                      value={localContent.footer.copyright || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          footer: { ...localContent.footer, copyright: e.target.value },
                        })
                      }
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-300">Developer / Agency Credit</label>
                    <input
                      type="text"
                      value={localContent.footer.developerCredit || ""}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          footer: { ...localContent.footer, developerCredit: e.target.value },
                        })
                      }
                      placeholder="Designed and Developed By NIDESIGNZ"
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO SECTION */}
          {activeSection === "seo" && localContent.seo && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Global SEO Strategy Keywords</h3>
                <p className="text-slate-400 mt-0.5">Specification 18: Primary and secondary keywords for search engine discovery.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">
                    Primary SEO Keywords (comma separated)
                  </label>
                  <textarea
                    rows={4}
                    value={Array.isArray(localContent.seo.primaryKeywords) ? localContent.seo.primaryKeywords.join(", ") : ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        seo: {
                          ...localContent.seo,
                          primaryKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-slate-300">
                    Secondary SEO Keywords (comma separated)
                  </label>
                  <textarea
                    rows={4}
                    value={Array.isArray(localContent.seo.secondaryKeywords) ? localContent.seo.secondaryKeywords.join(", ") : ""}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        seo: {
                          ...localContent.seo,
                          secondaryKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-white focus:border-[var(--gold)] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
