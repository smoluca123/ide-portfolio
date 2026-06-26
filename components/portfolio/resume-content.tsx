'use client';

import { Download, FileText, ExternalLink } from 'lucide-react';
import { useTheme } from './theme-context';
import { withAlpha } from './themes';
import { portfolio } from '@/lib/portfolio';
import { trackResumeDownload } from '@/lib/analytics';

export function ResumeContent() {
  const { theme } = useTheme();
  const fileName = `${portfolio.identity.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

  const handleDownload = async () => {
    trackResumeDownload();

    const resumeUrl =
      process.env.NEXT_PUBLIC_RESUME_URL ||
      'https://link.storjshare.io/raw/jxoc24dxazgxozfvkuivm3ordt2a/profile/lig%2Flucaupload/Nguyen-Phi-Phu-TopCV.vn-270626.11757.pdf';

    try {
      // Fetch the file as a blob to bypass cross-origin download restrictions
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL after download is triggered
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab if fetch fails
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <div
      className="flex h-full flex-col items-center justify-center overflow-y-auto p-8"
      style={{ backgroundColor: theme.background }}
    >
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: withAlpha(theme.accent, '20'),
            border: `2px solid ${withAlpha(theme.accent, '40')}`,
          }}
        >
          <FileText className="h-12 w-12" style={{ color: theme.accent }} />
        </div>

        {/* Title */}
        <h1
          className="mb-3 font-serif text-3xl font-bold md:text-4xl"
          style={{ color: theme.foreground }}
        >
          Resume / CV
        </h1>

        {/* Description */}
        <p
          className="mb-8 font-mono text-sm leading-relaxed md:text-base"
          style={{ color: theme.muted }}
        >
          Download my detailed resume to learn more about my professional
          background, technical skills, and accomplishments.
        </p>

        {/* Mock Preview Card */}
        <div
          className="mb-8 overflow-hidden rounded-lg border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div
            className="border-b px-6 py-4"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded"
                  style={{
                    backgroundColor: withAlpha(theme.red, '20'),
                  }}
                >
                  <FileText className="h-5 w-5" style={{ color: theme.red }} />
                </div>
                <div className="text-left">
                  <p
                    className="font-mono text-sm font-semibold"
                    style={{ color: theme.foreground }}
                  >
                    {fileName}
                  </p>
                  <p
                    className="font-mono text-xs"
                    style={{ color: theme.subtle }}
                  >
                    PDF Document • Updated recently
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mock preview area */}
          <div
            className="flex items-center justify-center px-6 py-12"
            style={{ backgroundColor: withAlpha(theme.muted, '10') }}
          >
            <div className="text-center">
              <ExternalLink
                className="mx-auto mb-3 h-8 w-8"
                style={{ color: theme.subtle }}
              />
              <p className="font-mono text-xs" style={{ color: theme.subtle }}>
                PDF Preview
              </p>
              <p
                className="mt-1 font-mono text-[10px]"
                style={{ color: theme.subtle }}
              >
                Click download button below
              </p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="group inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-mono text-sm font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: theme.accent,
            borderColor: theme.accent,
            color: theme.accentForeground,
          }}
        >
          <Download className="h-4 w-4" />
          Download Resume (PDF)
        </button>

        {/* Meta info */}
        <div className="mt-8 space-y-2">
          <div
            className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              backgroundColor: withAlpha(theme.green, '10'),
              borderColor: withAlpha(theme.green, '30'),
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: theme.green }}
            />
            <span className="font-mono text-xs" style={{ color: theme.green }}>
              Available for opportunities
            </span>
          </div>
          <p className="font-mono text-[10px]" style={{ color: theme.subtle }}>
            For any inquiries, reach me via the contact tab
          </p>
        </div>
      </div>
    </div>
  );
}
