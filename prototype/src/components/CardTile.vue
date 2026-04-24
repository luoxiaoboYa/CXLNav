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
  border: 1px solid #d7d2c6;
  border-radius: 18px;
  background: #ffffff;
}

.card-tile.featured {
  min-height: 156px;
  background: linear-gradient(135deg, rgba(27, 106, 82, 0.12), #ffffff 70%);
}

.card-tile.warm {
  background: linear-gradient(135deg, rgba(201, 106, 58, 0.12), #ffffff 70%);
}

.card-tile.cool {
  background: linear-gradient(135deg, rgba(76, 112, 154, 0.12), #ffffff 70%);
}

h3 {
  margin: 0 0 8px;
  font-size: 1rem;
}

p {
  margin: 0;
  color: #61685f;
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
  background: #edf3ef;
  color: #1b6a52;
  font-size: 0.75rem;
}
</style>
