/**
 * @import {Element, Text} from 'hast'
 * @import {LiteDocument} from '@mathjax/src/js/adaptors/lite/Document.js'
 * @import {LiteElement} from '@mathjax/src/js/adaptors/lite/Element.js'
 * @import {LiteText} from '@mathjax/src/js/adaptors/lite/Text.js'
 * @import {MathDocument} from '@mathjax/src/js/core/MathDocument.js'
 * @import {OutputJax} from '@mathjax/src/js/core/OutputJax.js'
 * @import {HTMLHandler as HtmlHandler} from '@mathjax/src/js/handlers/html/HTMLHandler.js'
 * @import {Options, Renderer} from './create-plugin.js'
 */

import {h} from 'hastscript'
import {liteAdaptor as liteAdapter} from '@mathjax/src/js/adaptors/liteAdaptor.js'
import {RegisterHTMLHandler as registerHtmlHandler} from '@mathjax/src/js/handlers/html.js'
import {TeX as Tex} from '@mathjax/src/js/input/tex.js'
import {mathjax} from '@mathjax/src/js/mathjax.js'
import {packages} from './mathjax-packages.js'

/**
 * Create a renderer.
 *
 * @param {Options} options
 *   Configuration.
 * @param {OutputJax<LiteElement, LiteText, LiteDocument>} output
 *   Output jax.
 * @returns {Renderer}
 *   Rendeder.
 */
export function createRenderer(options, output) {
  const input = new Tex({packages, ...options.tex})
  /** @type {MathDocument<LiteElement, LiteText, LiteDocument>} */
  let document
  /** @type {HtmlHandler<LiteElement | LiteText, LiteText, LiteDocument>} */
  let handler

  return {
    register() {
      const adapter = liteAdapter()
      handler = registerHtmlHandler(adapter)
      document = mathjax.document('', {InputJax: input, OutputJax: output})
    },
    render(value, options) {
      // Cast as this practically results in an element instead of an `MmlNode`.
      const liteElement = /** @type {LiteElement} */ (
        document.convert(value, options)
      )
      return [fromLiteElement(liteElement)]
    },
    styleSheet() {
      const node = fromLiteElement(output.styleSheet(document))
      // Do not render the `id` that mathjax suggests.
      node.properties.id = undefined
      return node
    },
    unregister() {
      mathjax.handlers.unregister(handler)
    }
  }
}

/**
 * @param {LiteElement} liteElement
 * @returns {Element}
 */
function fromLiteElement(liteElement) {
  /** @type {Array<Element | Text>} */
  const children = []

  for (const node of liteElement.children) {
    children.push(
      'value' in node
        ? {type: 'text', value: node.value}
        : fromLiteElement(node)
    )
  }

  return h(liteElement.kind, liteElement.attributes, children)
}
