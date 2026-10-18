<script setup>
import { ref, computed, onMounted } from 'vue';

const ACTOR = 'arkmuntasser.com';
const COLLECTION = 'id.sifa.profile.position';
const PROFILE_URL = 'https://sifa.id/p/arkmuntasser.com';
const SHOWN = 5;

const records = ref([]);
const error = ref(null);
const loading = ref(true);

// Sifa dates are "YYYY-MM"; treat them as the first of the month in UTC
function parseMonth(value) {
  if (!value) return null;
  const [year, month = '1'] = value.split('-');
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1));
}

function monthsBetween(start, end) {
  return (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
}

function formatDuration(months) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && `${years} yr`, rest && `${rest} mo`].filter(Boolean).join(' ') || '< 1 mo';
}

// "Director, Web Development" → ["Director,", "Web Development"]
function splitTitle(title) {
  const i = title.indexOf(', ');
  return i === -1 ? [title] : [title.slice(0, i + 1), title.slice(i + 2)];
}

const sorted = computed(() =>
  [...records.value].sort((a, b) => b.start - a.start)
);

const positions = computed(() => {
  const now = new Date();
  return sorted.value.slice(0, SHOWN).map((p) => {
    const end = p.end ?? now;
    const months = Math.max(monthsBetween(p.start, end), 1);
    const startLabel = p.start.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    return {
      ...p,
      current: !p.end,
      months,
      lines: splitTitle(p.title),
      boundary: p.end ? String(p.end.getUTCFullYear()) : 'Now',
      span: p.end
        ? `${p.start.getUTCFullYear()} — ${p.end.getUTCFullYear()} · ${formatDuration(months)}`
        : `Since ${startLabel} · ${formatDuration(months)}`,
    };
  });
});

const hasCurrent = computed(() => positions.value.some((p) => p.current));
const firstYear = computed(() => positions.value.at(-1)?.start.getUTCFullYear());

// One company across every shown role is said once, up top
const sharedCompany = computed(() => {
  const companies = new Set(positions.value.map((p) => p.company));
  return companies.size === 1 ? [...companies][0] : null;
});

const earlier = computed(() => {
  const rest = sorted.value.slice(SHOWN);
  if (!rest.length) return null;
  const from = Math.min(...rest.map((p) => p.start.getUTCFullYear()));
  const to = Math.max(...rest.map((p) => (p.end ?? p.start).getUTCFullYear()));
  return { count: rest.length, from, to };
});

onMounted(async () => {
  try {
    const url = `https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${ACTOR}&collection=${COLLECTION}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    records.value = data.records.map(({ value }) => ({
      title: value.title,
      company: value.company,
      start: parseMonth(value.startedAt),
      end: parseMonth(value.endedAt),
    }));
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="work-positions" aria-labelledby="work-positions-label">
    <h2 id="work-positions-label" class="work-positions__label">Career</h2>
    <p v-if="loading" class="work-positions__status">Loading positions…</p>
    <p v-else-if="error" class="work-positions__status">Failed to load positions: {{ error }}</p>
    <template v-else>
      <p v-if="sharedCompany" class="work-positions__company">All at <b>{{ sharedCompany }}</b></p>

      <ol class="ruler" :class="{ 'ruler--current': hasCurrent }">
        <li
          v-for="p in positions"
          :key="`${p.company}-${p.start.toISOString()}`"
          class="ruler__seg"
          :class="{ 'ruler__seg--current': p.current }"
          :style="{ '--months': p.months }"
        >
          <span class="ruler__year" aria-hidden="true">
            <span :class="{ 'ruler__chip': p.current }">{{ p.boundary }}</span>
          </span>
          <span class="ruler__bar" aria-hidden="true"></span>
          <span class="ruler__label">
            <span class="ruler__title">
              <template v-for="(line, i) in p.lines" :key="line"
                ><span class="ruler__title-line">{{ line }}</span
                >{{ i < p.lines.length - 1 ? ' ' : '' }}</template
              >
            </span>
            <span class="ruler__span">{{ p.span }}</span>
            <span v-if="!sharedCompany" class="ruler__company">{{ p.company }}</span>
          </span>
        </li>
      </ol>
      <p v-if="firstYear" class="ruler__end" aria-hidden="true"><span>{{ firstYear }}</span></p>

      <p v-if="earlier" class="work-positions__earlier">
        + {{ earlier.count }} earlier {{ earlier.count === 1 ? 'role' : 'roles' }}, {{ earlier.from }}–{{ earlier.to }}
      </p>
    </template>

    <a :href="PROFILE_URL" class="work-positions__cta" target="_blank" rel="noopener noreferrer">
      Full career on Sifa <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
    </a>
  </section>
</template>

<style>
@layer theme.components {
  @scope (.work-positions) {
    :scope {
      --ink: oklch(from var(--brand-color) 20% 0.03 h);
      --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
      --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
      --month: 0.2rem;
      --year-col: 2.5rem;

      color: var(--ink);
    }

    .work-positions__label {
      margin: 0 0 0.25rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }

    .work-positions__status,
    .work-positions__company {
      margin: 0 0 0.875rem;
      font-size: var(--text-size-8);
      color: var(--ink-muted);

      & b {
        color: var(--ink);
        font-weight: 700;
      }
    }

    /* The ruler: each role's height is proportional to its length */
    .ruler {
      margin: 0;
      padding: 0;
      list-style: none;

      &.ruler--current {
        padding-block-start: 2.25rem;
      }
    }

    .ruler__seg {
      display: grid;
      grid-template-columns: var(--year-col) 6px 1fr;
      gap: 0 0.625rem;
      height: calc(var(--months) * var(--month));
      min-height: 2.75rem;
    }

    .ruler__year {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.625rem;
      font-weight: 700;
      line-height: 1;
      text-align: end;
      text-transform: uppercase;
      font-variant-numeric: tabular-nums;
      translate: 0 -0.25rem;
    }

    .ruler__bar {
      margin-block-end: 2px;
      background: oklch(from var(--ink) l c h / 0.75);
    }

    .ruler__seg:nth-child(odd) .ruler__bar {
      background: oklch(from var(--ink) l c h / 0.4);
    }

    .ruler__label {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding-block-start: 0.125rem;
    }

    .ruler__title {
      font-size: var(--text-size-8);
      font-weight: 600;
      line-height: 1.3;
    }

    .ruler__title-line {
      display: block;
    }

    .ruler__span,
    .ruler__company {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.625rem;
      color: var(--ink-muted);
      font-variant-numeric: tabular-nums;
    }

    /* Current role: solid pink bar that runs on past "now", a NOW chip, a bigger title.
       Doubled class so it outranks the :nth-child(odd) bar tint above. */
    .ruler__seg.ruler__seg--current {
      .ruler__year {
        translate: 0 -0.375rem;
      }

      .ruler__bar {
        position: relative;
        background: var(--brand-color);

        &::before {
          content: "";
          position: absolute;
          inset-inline: 0;
          inset-block-end: 100%;
          height: 2.25rem;
          background: repeating-linear-gradient(
            180deg,
            var(--brand-color) 0 4px,
            transparent 4px 7px
          );
          mask-image: linear-gradient(to top, #000, transparent);
        }
      }

      .ruler__title {
        font-size: 1.125rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.15;
      }

      .ruler__span {
        color: var(--brand-ink);
        font-weight: 700;
      }
    }

    .ruler__chip {
      display: inline-block;
      padding: 0.1875rem 0.3125rem;
      background: oklch(from var(--brand-color) 95% calc(c / 3) h);
      color: var(--brand-ink);
    }

    .ruler__end {
      display: grid;
      grid-template-columns: var(--year-col) 1fr;
      margin: 0;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.625rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;

      & span {
        text-align: end;
        translate: 0 -0.25rem;
      }
    }

    .work-positions__earlier {
      margin: 0.5rem 0 0;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.6875rem;
      color: var(--ink-muted);
    }

    .work-positions__cta {
      display: inline-block;
      margin-block-start: 1rem;
      background: none;
      color: var(--brand-ink);
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      text-decoration: underline 1px transparent;
      text-underline-offset: 0.2em;
      transition: text-decoration-color 0.15s;

      &:hover {
        text-decoration-color: currentColor;
      }

      &:focus-visible {
        outline: 2px solid var(--brand-ink);
        outline-offset: 2px;
      }

      &::after {
        display: none;
      }
    }
  }
}
</style>
