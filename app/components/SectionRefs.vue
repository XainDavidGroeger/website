<script setup lang="ts">
const { t } = useI18n()

const reviews = [
  { key: 'patrick', img: '/img/refs/patrick-kuhlmann.webp' },
  { key: 'ekkehard', img: '/img/refs/ekkehard_guembel.webp' },
  { key: 'frederik', img: '/img/refs/frederik_frey.webp' },
  { key: 'felix', img: '/img/refs/felix_hahmann.webp' },
]
</script>

<template>
  <section id="refs" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* refs */</span> {{ t('refs.eyebrow') }}</p>
        <h2>{{ t('refs.title') }}</h2>
        <p class="lede">{{ t('refs.lede') }}</p>
      </div>

      <div class="reviews">
        <article v-for="review in reviews" :key="review.key" v-reveal class="review">
          <header>
            <img :src="review.img" :alt="t(`refs.reviews.${review.key}.name`)" width="44" height="44" loading="lazy">
            <div class="who">
              <h3>{{ t(`refs.reviews.${review.key}.name`) }}</h3>
              <p>{{ t(`refs.reviews.${review.key}.role`) }}</p>
            </div>
            <span class="badge">{{ t('refs.approved') }}</span>
          </header>
          <blockquote>{{ t(`refs.reviews.${review.key}.text`) }}</blockquote>
        </article>
      </div>
      <p class="swipe-hint" aria-hidden="true">{{ t('refs.swipeHint') }}</p>
    </div>
  </section>
</template>

<style scoped>
.reviews {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.swipe-hint {
  display: none;
}

/* Mobil: Stimmen als Swipe-Karussell */
@media (max-width: 720px) {
  .reviews {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin-inline: -18px;
    padding: 4px 18px 10px;
    scrollbar-width: none;
  }
  .reviews::-webkit-scrollbar {
    display: none;
  }
  .reviews > * {
    flex: 0 0 86%;
    scroll-snap-align: center;
  }
  .swipe-hint {
    display: block;
    margin-top: 10px;
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--faint);
    text-align: center;
  }
}

.review {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.review img {
  border-radius: 50%;
  border: 1px solid var(--line);
}
.review .who {
  flex: 1;
  min-width: 0;
}
.review h3 {
  font-size: 15px;
  font-weight: 600;
}
.review .who p {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
  margin-top: 2px;
}

.badge {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--mint);
  border: 1px solid color-mix(in srgb, var(--mint) 45%, var(--line));
  border-radius: 999px;
  padding: 4px 11px;
  white-space: nowrap;
}

.review blockquote {
  margin: 0;
  color: var(--muted);
  font-size: 14.5px;
  line-height: 1.7;
  border-left: 2px solid var(--line);
  padding-left: 16px;
}
</style>
