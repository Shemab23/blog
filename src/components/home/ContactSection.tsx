"use client";

import { BlogEntry } from "@/data/BlogRegistry";
import { HOME_PAGE_DATA } from "@/data/HomeData";
import React, { useMemo, useState } from "react";

type ContactSectionProps = {
  blogs: BlogEntry[];
};

export const ContactSection = ({ blogs }: ContactSectionProps) => {
  const { contactSection } = HOME_PAGE_DATA;

  const [mode, setMode] = useState<"recommend" | "correction">("recommend");
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>(
    blogs[0]?.slug ?? "",
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [topicSuggestion, setTopicSuggestion] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Find the currently selected blog & its chapters
  const selectedBlog = useMemo(
    () => blogs.find((b) => b.slug === selectedBlogSlug),
    [blogs, selectedBlogSlug],
  );

  const chapters = selectedBlog?.tableOfContents ?? [];

  const selectedChapter = useMemo(
    () => chapters.find((c) => c.id === selectedChapterId),
    [chapters, selectedChapterId],
  );

  // Build formatted subject and body for WhatsApp & Email
  const { subject, formattedBody } = useMemo(() => {
    if (mode === "recommend") {
      const subj = `Topic Recommendation: ${topicSuggestion || "New Technical Note"}`;
      const body = [
        "Hi! I'd like to recommend a topic for your notes:",
        "",
        `• Topic / Concept: ${topicSuggestion || "(Not specified)"}`,
        `• Details / Context: ${message || "(No extra details provided)"}`,
      ].join("\n");

      return { subject: subj, formattedBody: body };
    }

    const blogTitle = selectedBlog?.name ?? "General";
    const chapterTitle = selectedChapter?.title ?? "General / Whole Blog";
    const subj = `Correction Flagged: ${blogTitle} (${chapterTitle})`;
    const body = [
      "Hi! I spotted something to review in your notes:",
      "",
      `• Blog: ${blogTitle}`,
      `• Chapter / Topic: ${chapterTitle}`,
      `• What might be wrong: ${message || "(No details provided)"}`,
    ].join("\n");

    return { subject: subj, formattedBody: body };
  }, [mode, topicSuggestion, message, selectedBlog, selectedChapter]);

  // Encoded external URLs
  const whatsappUrl = `https://wa.me{contactSection.whatsappNumber}?text=${encodeURIComponent(
    formattedBody,
  )}`;

  const mailtoUrl = `mailto:${contactSection.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(formattedBody)}`;

  const isFormEmpty =
    mode === "recommend"
      ? !topicSuggestion.trim() && !message.trim()
      : !message.trim();

  return (
    <section
      id="contact"
      className="rounded-xl border border-border bg-card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      {/* Left Column: Heading, Context & Direct Contact Info */}
      <div className="lg:col-span-5 space-y-4">
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
            {contactSection.eyebrow}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {contactSection.heading}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {contactSection.description}
          </p>
        </div>

        <div className="pt-2 space-y-2 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">WhatsApp:</span>
            <a
              href={`https://wa.me{contactSection.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline underline-offset-4"
            >
              {contactSection.whatsappDisplay}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">Email:</span>
            <a
              href={`mailto:${contactSection.email}`}
              className="hover:text-primary underline underline-offset-4"
            >
              {contactSection.email}
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Selector & Message Builder */}
      <div className="lg:col-span-7 rounded-lg border border-border bg-background p-4 sm:p-5 space-y-4">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-muted/60">
          <button
            type="button"
            onClick={() => setMode("recommend")}
            className={`py-2 px-3 rounded-md text-xs font-mono transition-colors ${
              mode === "recommend"
                ? "bg-card text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recommend a Topic
          </button>
          <button
            type="button"
            onClick={() => setMode("correction")}
            className={`py-2 px-3 rounded-md text-xs font-mono transition-colors ${
              mode === "correction"
                ? "bg-card text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Point Out an Error
          </button>
        </div>

        {/* Conditional Fields Based on Mode */}
        {mode === "recommend" ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Topic or Concept to Cover
              </label>
              <input
                type="text"
                value={topicSuggestion}
                onChange={(e) => setTopicSuggestion(e.target.value)}
                placeholder="e.g. Python AsyncIO internals, Docker networking..."
                className="w-full h-10 px-3 rounded-md border border-border bg-card text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Specific Questions or Focus Areas (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me what part you'd find most helpful..."
                className="w-full p-3 rounded-md border border-border bg-card text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Blog Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Select Blog
                </label>
                <select
                  value={selectedBlogSlug}
                  onChange={(e) => {
                    setSelectedBlogSlug(e.target.value);
                    setSelectedChapterId(""); // Reset chapter when blog changes
                  }}
                  className="w-full h-10 px-3 rounded-md border border-border bg-card text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {blogs.map((blog) => (
                    <option key={blog.slug} value={blog.slug}>
                      {blog.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter / Topic Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Select Chapter
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-border bg-card text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">General / Entire Blog</option>
                  {chapters.map((chapter, idx) => (
                    <option key={chapter.id} value={chapter.id}>
                      {idx + 1}. {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                What did I get wrong?
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the typo, outdated syntax, or logic bug..."
                className="w-full p-3 rounded-md border border-border bg-card text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </div>
        )}

        {/* Action Buttons: Send via WhatsApp or Email */}
        <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={isFormEmpty}
            onClick={(e) => {
              if (isFormEmpty) e.preventDefault();
            }}
            className={`flex-1 py-2.5 px-4 rounded-md text-xs font-mono font-medium text-center transition-opacity ${
              isFormEmpty
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            Send via WhatsApp →
          </a>

          <a
            href={mailtoUrl}
            aria-disabled={isFormEmpty}
            onClick={(e) => {
              if (isFormEmpty) e.preventDefault();
            }}
            className={`flex-1 py-2.5 px-4 rounded-md border border-border text-xs font-mono font-medium text-center transition-colors ${
              isFormEmpty
                ? "bg-muted/40 text-muted-foreground cursor-not-allowed"
                : "bg-card text-foreground hover:bg-muted/60"
            }`}
          >
            Send via Email →
          </a>
        </div>
      </div>
    </section>
  );
};
