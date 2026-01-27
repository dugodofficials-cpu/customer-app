import { Link } from '@mui/material';

export default function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+)/gi;
  const parts: Array<{ type: 'text' | 'link'; content: string; url?: string }> = [];
  let lastIndex = 0;

  const matches = Array.from(text.matchAll(urlRegex));

  for (const match of matches) {
    const matchIndex = match.index!;
    const matchedUrl = match[0];

    if (matchIndex > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, matchIndex) });
    }

    let url = matchedUrl;
    const displayUrl = url.replace(/[.,;:!?]+$/, '');
    url = displayUrl;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    parts.push({ type: 'link', content: displayUrl, url });

    const trailingPunct = matchedUrl.substring(displayUrl.length);
    if (trailingPunct) {
      parts.push({ type: 'text', content: trailingPunct });
    }

    lastIndex = matchIndex + matchedUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  if (
    parts.length === 0 ||
    (parts.length === 1 && parts[0].type === 'text' && parts[0].content === text)
  ) {
    return text;
  }

  return (
    <>
      {parts.map((part, index) =>
        part.type === 'link' ? (
          <Link
            key={index}
            href={part.url!}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#2AC318',
              textDecoration: 'underline',
              '&:hover': {
                color: '#1FA012',
              },
            }}
          >
            {part.content}
          </Link>
        ) : (
          <span key={index}>{part.content}</span>
        )
      )}
    </>
  );
}
