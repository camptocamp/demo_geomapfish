/**
 * @fileoverview This file provides the "app" namespace, which is the
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
 * The default template based URL, used as it by the template cache.
 * @type {string}
 */
demo.baseTemplateUrl = 'demo';
