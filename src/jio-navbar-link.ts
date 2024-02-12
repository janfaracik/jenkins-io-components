import {LitElement, html, nothing, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('jio-navbar-link')
export class NavbarLink extends LitElement {
  static override styles = css`
.nav-link {
  color: rgba(255, 255, 255, 0.55);
  display: block;
  //padding: 0.5em 0;
  //padding-left: 0.5rem;
  //padding-right: 0.5rem;
  text-decoration: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}
.dropdown-item {
    color: rgba(0, 0, 0);
    text-decoration: none;
    transition: 0.2s ease;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.7rem;
    padding: 0.5rem 0.8rem;
    font-size: 0.8125rem;
    font-weight: 500;
    //min-height: 34px;
    min-height: 0;
    border-radius: 0.66rem;
    box-sizing: border-box;
    line-height: 1.6;
}

.dropdown-item:focus,
.dropdown-item:hover {
    background-color: rgba(0, 0, 50, 0.05);
}

//.active {
//	color: #fff;
//	text-decoration: none;
//	background-color: #0070EB;
//}


.dropdown-item.active,
.dropdown-item:active {
  background-color: rgba(0, 0, 50, 0.1);
}

  `;

  @property()
  href = "";

  /**
   * Eg plugins.jenkins.io
   */
  @property()
  property = 'https://www.jenkins.io';

  @property()
  // FIXME - rename this later?
  // eslint-disable-next-line lit/no-native-attributes
  class = "";

  @property()
  locationPathname = location.pathname;

  override render() {
    const {isActive, href} = relOrAbsoluteLink(this.href, this.property, this.locationPathname);
    return html`<a class=${`nav-link ${this.class} ${isActive ? "active" : ""}`} title=${this.title ? this.title : nothing} href=${href}>
        <slot></slot>
      </a>`;
  }
}

export const cleanPathname = (pathname: string) => {
  return pathname.split('/').filter(Boolean).join('/');
};

export const relOrAbsoluteLink = (href: string, property: string, locationPathname = location.pathname) => {
  const parsedMenuItem = new URL(href, 'https://www.jenkins.io');
  const parsedPropertyUrl = new URL(property);
  let isActive = false;

  if (parsedPropertyUrl.host === parsedMenuItem.host) {
    // if its one of my properties, then its a relative link
    href = parsedMenuItem.toString().substring(parsedMenuItem.toString().split('/').slice(0, 3).join('/').length);
    if (locationPathname && cleanPathname(locationPathname) === cleanPathname(parsedMenuItem.pathname)) {
      isActive = true;
    }
  } else if (parsedPropertyUrl.host !== parsedMenuItem.host) {
    // if its a different property, then full url
    href = parsedMenuItem.toString();
  } else {
    throw new Error(href);
  }
  return {isActive, href};
};

declare global {
  interface HTMLElementTagNameMap {
    'jio-navbar-link': NavbarLink;
  }
}



