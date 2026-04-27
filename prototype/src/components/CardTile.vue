<template>
  <article :class="['card-tile', tone, { featured }]">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <ul v-if="tags.length" class="tags">
      <li v-for="tag in tags" :key="tag">{{ tag }}</li>
    </ul>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    tags?: string[]
    featured?: boolean
    tone?: 'default' | 'warm' | 'cool'
  }>(),
  {
    tags: () => [],
    featured: false,
    tone: 'default'
  }
)
</script>

<style scoped>
.card-tile {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background:
    radial-gradient(circle at 18% 0%, rgba(139, 233, 253, 0.1), transparent 28%),
    var(--control-background);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.card-tile.featured {
  min-height: 156px;
  background:
    radial-gradient(circle at 16% 10%, rgba(139, 233, 253, 0.22), transparent 28%),
    var(--panel-strong-background);
  box-shadow: var(--shadow-glow);
}

.card-tile.warm {
  background:
    radial-gradient(circle at 12% 12%, rgba(109, 93, 252, 0.24), transparent 30%),
    var(--control-background);
}

.card-tile.cool {
  background:
    radial-gradient(circle at 12% 12%, rgba(139, 233, 253, 0.2), transparent 30%),
    var(--control-background);
}

h3 {
  margin: 0 0 8px;
  font-size: 1rem;
  color: var(--color-text);
}

p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.12);
  color: var(--color-accent);
  font-size: 0.75rem;
}
</style>
