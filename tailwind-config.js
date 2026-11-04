/* Tailwind theme (fonts + palette). Must load right after the Tailwind CDN script. */
  tailwind.config = {
    theme: {

      extend: {
        fontFamily: {
          serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
          sans: ['Jost', 'system-ui', 'sans-serif']
        },
        colors: {
          cream: '#FBF5EE',
          blush: '#F4DDD8',
          rosewood: '#8A4B58',
          plum: '#4A2F3A'
        }
      }
    }
  };
