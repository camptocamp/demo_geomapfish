/**
 * @fileoverview Application entry point.
 *
 * This file defines the "app_main" Closure namespace, which is be used as the
 * Closure entry point (see "closure_entry_point" in the "build.json" file).
 *
 * This file includes `goog.require`'s for all the components/directives used
 * by the HTML page.
 */
goog.provide('demo_main');

/** @suppress {extraRequire} */
goog.require('demo.MainController');
/** @suppress {extraRequire} */
goog.require('gmf.mapDirective');
