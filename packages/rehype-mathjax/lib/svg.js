import {SVG as Svg} from '@mathjax/src/js/output/svg.js'
import {createPlugin} from './create-plugin.js'
import {createRenderer} from './create-renderer.js'

/**
 * Render elements with a `language-math` (or `math-display`, `math-inline`)
 * class with MathJax using SVG.
 *
 * @param [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
const rehypeMathJaxSvg = createPlugin(function (options) {
  // MathJax types do not allow `null`.
  return createRenderer(
    options,
    new Svg({
      // See mathjax/MathJax#3522
      dynamicPrefix: '@mathjax/mathjax-newcm-font/js/svg/dynamic',
      ...options.svg
    })
  )
})

export default rehypeMathJaxSvg
