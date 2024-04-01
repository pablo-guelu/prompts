// Vuetify
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi'

/**
 * Some Vuetify default colors are declared as variables so that they can be accessible from inside a component's <style>. 
 * This worked out of the box with Vuetify v2 but it doesn't with Vuetify v3.
 */
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})