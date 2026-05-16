export default defineAppConfig({
  ui: {
    primary: 'amber',
    gray: 'stone',
    button: {
      default: {
        color: 'primary',
        variant: 'solid'
      },
      font: 'font-semibold',
      rounded: 'rounded-xl',
      transition: 'transition-all duration-300'
    },
    card: {
      background: 'bg-white dark:bg-stone-900',
      ring: 'ring-1 ring-stone-200 dark:ring-stone-800',
      rounded: 'rounded-2xl',
      shadow: 'shadow-sm hover:shadow-md transition-shadow duration-300'
    },
    input: {
      rounded: 'rounded-xl',
      color: {
        white: {
          outline: 'shadow-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-white ring-1 ring-inset ring-stone-300 dark:ring-stone-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
        }
      }
    },
    modal: {
      rounded: 'rounded-2xl',
      overlay: {
        background: 'bg-stone-900/50 backdrop-blur-sm'
      }
    },
    slideover: {
      overlay: {
        background: 'bg-stone-900/50 backdrop-blur-sm'
      }
    }
  }
})
