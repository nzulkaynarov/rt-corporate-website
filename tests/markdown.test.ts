import { describe, expect, it } from 'vitest';
import { renderBody } from '../src/utils/markdown';

describe('article body formatting (src/utils/markdown.ts)', () => {
  it('one image with a title becomes a figure with a caption', async () => {
    const html = await renderBody('![Склад](/images/uploads/a.jpg "Склад в Ташкенте")', 'ru');
    expect(html).toMatch(/<figure class="fig"><img loading="lazy" decoding="async" src="[^"]*\/images\/uploads\/a\.jpg" alt="Склад"><figcaption>Склад в Ташкенте<\/figcaption><\/figure>/);
  });

  it('several images in one paragraph become a grid', async () => {
    const html = await renderBody('![a](/images/uploads/a.jpg) ![b](/images/uploads/b.jpg)', 'ru');
    expect(html).toContain('<div class="fig-grid">');
    expect(html.match(/<figure class="fig">/g)).toHaveLength(2);
  });

  it('footnotes render with a localized hidden heading and back links', async () => {
    const html = await renderBody('Текст[^1].\n\n[^1]: Пояснение.', 'ru');
    expect(html).toContain('class="footnotes"');
    expect(html).toContain('class="visually-hidden"');
    expect(html).toContain('Пояснение.');
    expect(html).not.toContain('Back to reference');
  });

  it('quotes stay blockquotes', async () => {
    expect(await renderBody('> Цитата', 'ru')).toContain('<blockquote>');
  });
});
