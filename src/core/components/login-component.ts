import { html, css, LitElement } from 'lit'
import { customElement } from "lit/decorators.js"

import './login-form'

const APPLICATION = import.meta.env.VITE_APPLICATION
const COPYRIGHT = import.meta.env.VITE_COPYRIGHT

const styles = css`
    :host {
        height: 100%;
        flex-grow: 1;
        display: flex;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background-size: cover;
        background-image: url("./assets/illustration.png");
    }
    .login {
        display: flex;
        flex-flow: column;
        flex: 0 0 25rem;
        max-width: 25rem;
    }
    aside, footer {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 20%;
        text-align: center;
        background-color: #e4ebf0aa;
    }
    footer {
        height: 12%;
    }
    main {
        height: 50%;
        flex-grow: 1;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        padding: 2em;
        box-sizing: border-box;
        background-color: #fdf8f6e9;
        border-top: #d0d8e2 solid thin;
        border-bottom: #d0d8e2 solid thin;
    }
    .welcome {
        margin-bottom: 1em;
    }
    .welcome h2 {
        color: #505050;
        margin: 0 !important;
    }
    .welcome h4 {
        color: rgb(30, 60, 130);
        margin: 0.3em 0 !important;
    }
`

@customElement("demius-login")
export class LoginComponent extends LitElement {
    static styles = styles

    render() {
        return html`
        <div class="login">
            <aside>${APPLICATION}</aside>
            <main>
                <div class="welcome">
                    <h2>VĂ SALUT</h2>
                    <h4>INTRARE LA APLICAȚIE</h4>
                </div>
                <demius-login-form></demius-login-form>
            </main>
            <aside>${COPYRIGHT}</aside>
        </div>
        `
    }
}