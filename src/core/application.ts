import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

import './components/login-component'

const styles = css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `

@customElement('demius-application')
export class DemiusApplication extends LitElement {
    static styles = styles

    render() {
        return html`
        <demius-login></demius-login>
        `
    }
}
