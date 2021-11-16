// Test to override a lit component and a rxjs "store".
import './customization/user.ts';
import './customization/authService.ts';
import './customization/authFormElement.ts';
import './customization/panelElement.ts';
// Small test to override an AngularJS component.
import './customization/angularDrawPanel.ts';

/**
 * CUSTOM custom function to override style in the Shadow DOM scope.
 * Here we target the gmf-auth-form of the demo-auth-panel (a Shadow DOM
 * in another shadow DOM).
 */
export const customCssFn = ()=> {
  const style = document.createElement( 'style' )
  style.innerHTML = 'strong { color: darkblue; }'
  const demoAuthPanel = document.querySelector('demo-auth-panel').shadowRoot;
  demoAuthPanel.querySelector('gmf-auth-form').shadowRoot.appendChild(style);
}
