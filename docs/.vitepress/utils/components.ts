import componentsData from '../data/components.json';

export interface ComponentAttribute {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentEvent {
  event: string;
  trigger: string;
  data: string;
}

export interface KeyboardShortcut {
  key: string;
  action: string;
}

export interface CSSClass {
  class: string;
  description: string;
}

export interface ComponentDemo {
  query?: string;
  html?: string;
  component?: string;
  single?: string;
  multiple?: string;
  grouped?: string;
}

export interface ComponentData {
  id: string;
  name: string;
  category: 'inputs' | 'views';
  description: string;
  element: string;
  htmlType?: string;
  selector: string;
  demo?: ComponentDemo;
  basicUsage: string;
  cssClasses?: CSSClass[];
  attributes: ComponentAttribute[];
  optionAttributes?: ComponentAttribute[];
  events: ComponentEvent[];
  notes?: string;
}

export interface ComponentsDataStructure {
  components: ComponentData[];
}

/**
 * Get all components
 */
export function getAllComponents(): ComponentData[] {
  return componentsData.components as unknown as ComponentData[];
}

/**
 * Get component by ID
 */
export function getComponentById(id: string): ComponentData | undefined {
  return getAllComponents().find((c) => c.id === id);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: 'inputs' | 'views'): ComponentData[] {
  return getAllComponents().filter((c) => c.category === category);
}

/**
 * Get input components
 */
export function getInputComponents(): ComponentData[] {
  return getComponentsByCategory('inputs');
}

/**
 * Get view components
 */
export function getViewComponents(): ComponentData[] {
  return getComponentsByCategory('views');
}

/**
 * Search components by name or description
 */
export function searchComponents(query: string): ComponentData[] {
  const lowerQuery = query.toLowerCase();
  return getAllComponents().filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) || c.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get component attributes as formatted table data
 */
export function getAttributesTableData(component: ComponentData) {
  return component.attributes.map((attr) => ({
    attribute: attr.name,
    type: attr.type,
    default: attr.default,
    description: attr.description,
  }));
}

/**
 * Get component events as formatted table data
 */
export function getEventsTableData(component: ComponentData) {
  return component.events.map((evt) => ({
    event: evt.event,
    trigger: evt.trigger,
    data: evt.data,
  }));
}

export default {
  getAllComponents,
  getComponentById,
  getComponentsByCategory,
  getInputComponents,
  getViewComponents,
  searchComponents,
  getAttributesTableData,
  getEventsTableData,
};
