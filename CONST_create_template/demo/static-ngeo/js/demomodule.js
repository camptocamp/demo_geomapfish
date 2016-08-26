/**
 * @fileoverview This file provides the "demo" namespace, which is the
 * application's main namespace. And it defines the application's Angular
 * module.
 */
goog.provide('demo');

/** @suppress {extraRequire} */
goog.require('gmf');


/**
 * @type {!angular.Module}
 */
demo.module = angular.module('demo', [gmf.module.name]);

/**
 * The components template based URL, used as it by the template cache.
 * @type {string}
 */
demo.componentsBaseTemplateUrl = 'demo_components';

/**
 * The template based URL, used to overwrite template from ngeo, used as it by the template cache.
 * @type {string}
 */
demo.partialsBaseTemplateUrl = 'demo_partials';

/**
 * The default template based URL, used as it by the template cache.
 * @type {string}
 */
demo.baseTemplateUrl = 'demo_js';
