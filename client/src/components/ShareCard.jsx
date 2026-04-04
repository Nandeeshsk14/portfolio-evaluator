import { useState } from 'react';

function ShareCard({ username, scores }) {
  const [copied, setCopied] = useState(false);

  const shareUrl   = `${window.location.origin}/report/${username}`;
  const shareText  = `Check out ${username}'s GitHub developer scorecard — overall score: ${scores?.overall}/100 🚀`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🔗 Share this Report</h2>

      {/* URL display + copy button */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{
          flex: 1,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 0.9rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}>
          {shareUrl}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCopy}
          style={{ fontSize: '0.85rem', minWidth: '100px', transition: 'background 0.2s' }}
        >
          {copied ? '✅ Copied!' : '📋 Copy link'}
        </button>
      </div>

      {/* Share on social */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Share on:</span>
        <button
          className="btn btn-outline"
          onClick={handleLinkedInShare}
          style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}
        >
          LinkedIn
        </button>
        <button
          className="btn btn-outline"
          onClick={handleTwitterShare}
          style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}
        >
          Twitter / X
        </button>
      </div>

      {/* Note about OG tags */}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
        💡 Share the link directly — anyone with the URL can view this report without logging in.
      </p>
    </div>
  );
}

export default ShareCard;
