import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/midiinlist',
    name: 'Midiinlist',
    component: () => import('../views/Midiinlist.vue')
  },
  {
    path: '/virtualports',
    name: 'Virtualports',
    component: () => import('../views/Virtualports.vue')
  },
  {
    path: '/presets',
    name: 'Presets',
    component: () => import('../views/Presets.vue')
  },  
  {
    path: '/usercontrols',
    name: 'Usercontrols',
    component: () => import('../views/Usercontrols.vue')
  },  
  {
    path: '/dropdownlists',
    name: 'dropdownlists',
    component: () => import('../views/Dropdownlists.vue')
  },  
  {
    path: '/easyconfig',
    name: 'easyconfig',
    component: () => import('../views/Easyconfig.vue')
  },  
  {
    path: '/monitor',
    name: 'monitor',
    component: () => import('../views/Monitor.vue')
  },    
  { path: '/preset/:id', component: () => import('../components/Presets/AddPresetComponent.vue') },

  { path: '/midiin/:id', component: () => import('../views/Midiin.vue') },
  { path: '/addChainFilter/:midiinid/:chainid', component: () => import('../views/AddChainFilter.vue') },

  
  { path: '/addFilter/AddConsoleLog/:midiinid/:chainid/:filterid', component: () => import('../views/filters/AddConsoleLog.vue') },
  { path: '/addFilter/AddFilterTransform/:midiinid/:chainid/:filterid', component: () => import('../views/filters/AddFilterTransform.vue') },
  { path: '/addFilter/AddMidiDestination/:midiinid/:chainid/:filterid', component: () => import('../views/filters/AddMidiDestination.vue') },
  { path: '/addFilter/AddNetworkDestination/:midiinid/:chainid/:filterid', component: () => import('../views/filters/AddNetworkDestination.vue') },
  { path: '/addFilter/AddSchedule/:midiinid/:chainid/:filterid', component: () => import('../views/filters/AddSchedule.vue') },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
