import {Controller} from 'gmf/drawing/drawFeatureComponent';

/**
 * Initialize interactions by setting them inactive and decorating them
 */
Controller.prototype.initializeInteractions_ = function () {
  console.log('Quick test to test AngularJs overriding -> It works.');
  this.interactions_.forEach((interaction) => {
    interaction.setActive(false);
    ngeoMiscDecorateInteraction(interaction);
  });
};
