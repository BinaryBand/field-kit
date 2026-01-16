<template>
  <div class="catalog">
    <div class="controls">
      <input
        v-model="query"
        class="search"
        type="search"
        placeholder="Search components…"
        aria-label="Search components"
      />
      <div class="meta">{{ filtered.length }} components</div>
    </div>

    <div v-for="group in grouped" :key="group.key" class="group">
      <h2 :id="group.key" class="group-title">{{ group.title }}</h2>

      <details
        v-for="component in group.components"
        :key="component.id"
        class="component"
        :open="query.length > 0"
        :id="`component-${component.id}`"
      >
        <summary class="summary">
          <span class="name">{{ component.name }}</span>
          <span class="desc">{{ component.description }}</span>
        </summary>

        <div class="body">
          <div v-if="getDemoHtml(component)" class="section">
            <h3 class="section-title">Demo</h3>
            <FormDemo>
              <div class="demo" v-html="getDemoHtml(component)" />
            </FormDemo>
          </div>

          <div class="section">
            <h3 class="section-title">Basic Usage</h3>
            <pre class="code"><code>{{ component.basicUsage }}</code></pre>
          </div>

          <div v-if="component.attributes?.length" class="section">
            <h3 class="section-title">Attributes</h3>
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="attr in component.attributes" :key="attr.name">
                    <td><code>{{ attr.name }}</code></td>
                    <td><code>{{ attr.type }}</code></td>
                    <td><code>{{ attr.default }}</code></td>
                    <td>{{ attr.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="component.events?.length" class="section">
            <h3 class="section-title">Events</h3>
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>When triggered</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="evt in component.events" :key="evt.event">
                    <td><code>{{ evt.event }}</code></td>
                    <td>{{ evt.trigger }}</td>
                    <td>{{ evt.data }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="section muted">
            <div>
              Selector: <code>{{ component.selector }}</code>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FormDemo from '../../../vue/FormDemo.vue';
import { getAllComponents, type ComponentData } from '../../utils/components';

const query = ref('');

const all = computed(() => {
  const components = getAllComponents();
  return [...components].sort((a, b) => a.name.localeCompare(b.name));
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return all.value;

  return all.value.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.selector.toLowerCase().includes(q)
    );
  });
});

type Group = {
  key: string;
  title: string;
  components: ComponentData[];
};

const grouped = computed<Group[]>(() => {
  const inputs = filtered.value.filter((c) => c.category === 'inputs');
  const views = filtered.value.filter((c) => c.category === 'views');

  const groups: Group[] = [];
  if (views.length) groups.push({ key: 'views', title: 'View Components', components: views });
  if (inputs.length) groups.push({ key: 'inputs', title: 'Input Components', components: inputs });
  return groups;
});

function getDemoHtml(component: ComponentData): string {
  return component.demo?.html || '';
}
</script>

<style scoped>
.catalog {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.search {
  flex: 1;
  min-width: 240px;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.meta {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-title {
  margin: 0;
}

.component {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.summary {
  cursor: pointer;
  padding: 0.75rem 0.9rem;
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.name {
  font-weight: 600;
}

.desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.body {
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  margin: 0 0 0.35rem 0;
  font-size: 1rem;
}

.demo {
  padding: 0.5rem 0;
}

.code {
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--vp-code-block-bg);
  overflow: auto;
}

.table-wrap {
  overflow: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.table th,
.table td {
  border-top: 1px solid var(--vp-c-divider);
  padding: 0.5rem 0.6rem;
  text-align: left;
  vertical-align: top;
}

.table thead th {
  border-top: none;
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.muted {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}
</style>
