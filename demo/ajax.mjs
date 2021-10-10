import L7Fetch from '../dist/index.esm.js'
import {list, ajaxConfigs, methods} from './config.mjs'

const ajax = new L7Fetch(list, ajaxConfigs, methods)

export default ajax