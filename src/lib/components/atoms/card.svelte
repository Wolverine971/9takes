<script lang="ts">
export let style = '';
export let className = '';
</script>

<section class=" {className}" {style}>
    <slot />
</section>

<style lang="scss">
    .neumo-card {
        border-radius: var(--base-border-radius);
        background: var(--color);
        backdrop-filter: blur(1.5rem);
        border: 1px solid transparent;
        padding: 0.5rem 0;
        transition: border-color 0.3s ease;

        &:hover {
            border-color: var(--color-theme-purple-light);
        }
    }
</style>