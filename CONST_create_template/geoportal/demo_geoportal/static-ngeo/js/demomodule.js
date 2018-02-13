/**
 * @fileoverview This file provides the "demo" namespace, which is the
 * application's main namespace. And it defines the application's Angular
 * module.
 */
goog.provide('demo');


/**
 * @type {!angular.Module}
 */
demo.module = angular.module('demo', []);

/**
 * The components template based URL, used as is by the template cache.
 * @type {string}
 * @export
 */
demo.componentsBaseTemplateUrl = 'demo_components';

/**
 * The template based URL, used to overwrite template from ngeo, used as is by the template cache.
 * @type {string}
 * @export
 */
demo.partialsBaseTemplateUrl = 'demo_partials';

/**
 * The default template based URL, used as is by the template cache.
 * @type {string}
 * @export
 */
demo.baseTemplateUrl = 'demo_js';
