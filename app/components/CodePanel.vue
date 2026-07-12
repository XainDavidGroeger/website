<script setup lang="ts">
/**
 * Code-Panel mit Mini-Syntax-Highlighter für kontrollierte Demo-Snippets
 * (PHP + TypeScript). Bewusst regex-basiert statt Shiki/Prism · die Snippets
 * sind handverlesen, dafür bleibt das Bundle klein.
 */
const props = defineProps<{
  title: string
  lang: 'php' | 'ts' | 'vue'
  code: string
}>()

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const KEYWORDS: Record<'php' | 'ts' | 'vue', string> = {
  php: 'final|abstract|class|interface|enum|extends|implements|public|private|protected|readonly|static|function|return|if|else|match|throw|new|use|namespace|declare|strict_types|null|true|false|self|this',
  ts: 'import|export|type|interface|const|let|function|async|await|return|if|else|try|catch|throw|new|null|true|false|readonly|extends|keyof|typeof|as|from',
  vue: 'import|export|type|const|let|function|async|await|return|if|else|setup|lang|template|script',
}

const highlighted = computed(() => {
  const escaped = escapeHtml(props.code)
  const keywords = KEYWORDS[props.lang]
  // eine Alternation, ein Durchlauf → keine verschachtelten Ersetzungen
  const pattern = new RegExp(
    [
      '(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
      '(?<str>&#39;[^&]*?&#39;|\'[^\'\\n]*\'|"[^"\\n]*")',
      `(?<kw>\\b(?:${keywords})\\b)`,
      '(?<phpvar>\\$\\w+)',
      '(?<cls>\\b[A-Z][A-Za-z0-9_]*\\b)',
      '(?<num>\\b\\d[\\d_.]*\\b)',
    ].join('|'),
    'g',
  )
  return escaped.replace(pattern, (...args) => {
    const groups = args.at(-1) as Record<string, string | undefined>
    if (groups.comment) return `<span class="c-comment">${groups.comment}</span>`
    if (groups.str) return `<span class="c-str">${groups.str}</span>`
    if (groups.kw) return `<span class="c-kw">${groups.kw}</span>`
    if (groups.phpvar) return `<span class="c-var">${groups.phpvar}</span>`
    if (groups.cls) return `<span class="c-cls">${groups.cls}</span>`
    if (groups.num) return `<span class="c-num">${groups.num}</span>`
    return args[0] as string
  })
})
</script>

<template>
  <div class="code-panel">
    <div class="bar">
      <span class="dots"><i /><i /><i /></span>
      <span class="title">{{ title }}</span>
      <span class="lang">{{ lang }}</span>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html · Quelle sind eigene, statische Snippets -->
    <pre><code v-html="highlighted" /></pre>
  </div>
</template>

<style scoped>
.code-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-deep);
  overflow: hidden;
}
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
}
.dots {
  display: flex;
  gap: 5px;
}
.dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--line);
}
.bar .title {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}
.bar .lang {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--amber);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 2px 8px;
}
pre {
  margin: 0;
  padding: 18px 20px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.85;
  color: var(--muted);
}
:deep(.c-kw) {
  color: var(--mint);
}
:deep(.c-str) {
  color: var(--amber);
}
:deep(.c-comment) {
  color: var(--faint);
  font-style: italic;
}
:deep(.c-cls) {
  color: var(--text);
}
:deep(.c-var) {
  color: #9fb4dd;
}
:deep(.c-num) {
  color: var(--amber);
}
</style>
