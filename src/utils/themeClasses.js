export const getThemeClasses = () => {
  return {
    bg: {
      primary: 'bg-white high-contrast:bg-black',
      secondary: 'bg-gray-50 high-contrast:bg-black',
      card: 'bg-white high-contrast:bg-gradient-to-br high-contrast:from-black high-contrast:via-purple-950/50 high-contrast:to-black',
      hover: 'hover:bg-gray-100 high-contrast:hover:bg-purple-500/10',
      active: 'bg-gray-100 high-contrast:bg-purple-600',
      gradient: 'bg-gradient-to-r from-gray-900 to-gray-800 high-contrast:from-purple-600 high-contrast:to-purple-900',
    },
    text: {
      primary: 'text-gray-900 high-contrast:text-white',
      secondary: 'text-gray-600 high-contrast:text-purple-200',
      muted: 'text-gray-500 high-contrast:text-purple-300',
      accent: 'text-gray-900 high-contrast:text-purple-400',
    },
    border: {
      default: 'border-gray-200 high-contrast:border-purple-500/20',
      hover: 'hover:border-gray-300 high-contrast:hover:border-purple-500/40',
    },
    button: {
      primary: 'bg-gray-900 text-white hover:bg-gray-800 high-contrast:bg-purple-600 high-contrast:hover:bg-purple-700 high-contrast:shadow-lg high-contrast:shadow-purple-500/30',
      secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 high-contrast:bg-white/5 high-contrast:text-purple-200 high-contrast:border-purple-500/20 high-contrast:hover:bg-white/10',
      ghost: 'text-gray-700 hover:bg-gray-100 high-contrast:text-purple-200 high-contrast:hover:bg-purple-500/10',
    },
    input: {
      default: 'bg-white border-gray-300 text-gray-900 high-contrast:bg-black/40 high-contrast:border-purple-500/30 high-contrast:text-white',
      focus: 'focus:border-gray-900 focus:ring-gray-900 high-contrast:focus:border-purple-500 high-contrast:focus:ring-purple-500',
    },
    shadow: {
      default: 'shadow-sm high-contrast:shadow-none',
      card: 'shadow-md high-contrast:shadow-2xl high-contrast:shadow-purple-500/20',
    },
  };
};
